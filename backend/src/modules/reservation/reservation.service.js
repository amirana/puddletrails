import ApiError from "../../common/utils/api-error.js";
import Reservation from "./reservation.model.js";
import TripDay from "../itinerary/trip-day.model.js";

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
    const reservation = await Reservation.findOneAndDelete({ _id: reservationId, trip: tripId });
    if (!reservation) throw ApiError.notFound("Reservation not found");
};

const detachReservationsFromDays = (tripId, dayIds) =>
    Reservation.updateMany({ trip: tripId, tripDayId: { $in: dayIds } }, { $set: { tripDayId: null } });

const deleteReservationsForTrip = (tripId) => Reservation.deleteMany({ trip: tripId });

export { getReservations, createReservation, updateReservation, deleteReservation, detachReservationsFromDays, deleteReservationsForTrip };
