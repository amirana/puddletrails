import ApiError from "../../common/utils/api-error.js";
import fs from "node:fs/promises";
import Reservation from "./reservation.model.js";
import TripDay from "../itinerary/trip-day.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../../common/utils/cloudinary.js";

const MAX_ATTACHMENTS = 5;

const removeTemporaryFile = (filePath) => fs.unlink(filePath).catch(() => {});

const hasValidFileSignature = async (file) => {
    const handle = await fs.open(file.path, "r");
    const header = Buffer.alloc(12);
    let bytesRead = 0;
    try {
        while (bytesRead < header.length) {
            const result = await handle.read(header, bytesRead, header.length - bytesRead, bytesRead);
            if (!result.bytesRead) break;
            bytesRead += result.bytesRead;
        }
    } finally {
        await handle.close();
    }

    const isPdf = bytesRead >= 5 && header.subarray(0, 5).toString() === "%PDF-";
    const isJpeg = bytesRead >= 3 && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
    const isPng = bytesRead >= 8 && header.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const isGif = bytesRead >= 6 && ["GIF87a", "GIF89a"].includes(header.subarray(0, 6).toString());
    const isWebp = bytesRead >= 12 && header.subarray(0, 4).toString() === "RIFF" && header.subarray(8, 12).toString() === "WEBP";
    return isPdf || isJpeg || isPng || isGif || isWebp;
};

const removeCloudinaryAssets = async (attachments) => {
    for (const attachment of attachments) {
        try {
            await deleteFromCloudinary(attachment.publicId, attachment.resourceType);
        } catch {
            throw new ApiError(502, "Could not remove a reservation attachment from storage. Please retry.");
        }
    }
};

const utcDay = (value) => {
    const date = new Date(value);
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

const ensureNotPast = (value) => {
    if (utcDay(value) < utcDay(new Date())) {
        throw ApiError.badRequest("Reservation date cannot be before today");
    }
};

const validateTripDay = async (tripId, tripDayId) => {
    if (!tripDayId) return null;
    const tripDay = await TripDay.findOne({ _id: tripDayId, trip: tripId }).select("_id");
    if (!tripDay) throw ApiError.badRequest("The selected itinerary day does not belong to this trip");
    return tripDay._id;
};

const getReservations = (tripId) =>
    Reservation.find({ trip: tripId }).sort({ date: 1, time: 1, createdAt: 1 });

const createReservation = async (tripId, data) => {
    ensureNotPast(data.date);
    const tripDayId = await validateTripDay(tripId, data.tripDayId);
    const fields = { ...data };
    delete fields.tripDayId;
    return Reservation.create({ ...fields, trip: tripId, tripDayId });
};

const updateReservation = async (tripId, reservationId, data) => {
    const existing = await Reservation.findOne({ _id: reservationId, trip: tripId }).select("date");
    if (!existing) throw ApiError.notFound("Reservation not found");
    if (utcDay(data.date) !== utcDay(existing.date)) ensureNotPast(data.date);
    const tripDayId = await validateTripDay(tripId, data.tripDayId);
    const fields = { ...data };
    delete fields.tripDayId;
    const reservation = await Reservation.findOneAndUpdate(
        { _id: reservationId, trip: tripId },
        { $set: { ...fields, tripDayId } },
        { returnDocument: "after", runValidators: true },
    );
    if (!reservation) throw ApiError.notFound("Reservation not found");
    return reservation;
};

const deleteReservation = async (tripId, reservationId) => {
    const reservation = await Reservation.findOne({ _id: reservationId, trip: tripId });
    if (!reservation) throw ApiError.notFound("Reservation not found");
    await removeCloudinaryAssets(reservation.attachments);
    await reservation.deleteOne();
};

const addAttachment = async (tripId, reservationId, file) => {
    const reservation = await Reservation.findOne({ _id: reservationId, trip: tripId });
    if (!reservation) {
        await removeTemporaryFile(file.path);
        throw ApiError.notFound("Reservation not found");
    }
    if (reservation.attachments.length >= MAX_ATTACHMENTS) {
        await removeTemporaryFile(file.path);
        throw ApiError.badRequest(`A reservation can have up to ${MAX_ATTACHMENTS} attachments`);
    }
    let validSignature = false;
    try {
        validSignature = await hasValidFileSignature(file);
    } catch {
        await removeTemporaryFile(file.path);
        throw ApiError.badRequest("Could not read the uploaded file");
    }
    if (!validSignature) {
        await removeTemporaryFile(file.path);
        throw ApiError.badRequest("The file contents do not match a supported image or PDF type");
    }

    let asset;
    try {
        asset = await uploadOnCloudinary(file.path);
    } catch {
        throw new ApiError(502, "Attachment upload failed. Please try again.");
    }

    reservation.attachments.push({
        url: asset.secure_url,
        publicId: asset.public_id,
        resourceType: asset.resource_type,
        originalName: file.originalname,
        format: asset.format || "",
        bytes: asset.bytes,
    });

    try {
        await reservation.save();
    } catch (error) {
        await deleteFromCloudinary(asset.public_id, asset.resource_type).catch(() => {});
        throw error;
    }
    return reservation;
};

const deleteAttachment = async (tripId, reservationId, attachmentId) => {
    const reservation = await Reservation.findOne({ _id: reservationId, trip: tripId });
    if (!reservation) throw ApiError.notFound("Reservation not found");
    const attachment = reservation.attachments.id(attachmentId);
    if (!attachment) throw ApiError.notFound("Attachment not found");

    await removeCloudinaryAssets([attachment]);
    attachment.deleteOne();
    await reservation.save();
    return reservation;
};

const detachReservationsFromDays = (tripId, dayIds) =>
    Reservation.updateMany({ trip: tripId, tripDayId: { $in: dayIds } }, { $set: { tripDayId: null } });

const deleteReservationsForTrip = async (tripId) => {
    const reservations = await Reservation.find({ trip: tripId });
    await removeCloudinaryAssets(reservations.flatMap((reservation) => reservation.attachments));
    return Reservation.deleteMany({ trip: tripId });
};

export {
    getReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    addAttachment,
    deleteAttachment,
    detachReservationsFromDays,
    deleteReservationsForTrip,
};
