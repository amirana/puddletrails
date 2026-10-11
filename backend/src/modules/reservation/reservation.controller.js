import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";
import * as reservationService from "./reservation.service.js";

const getReservations = async (req, res) => {
    const reservations = await reservationService.getReservations(req.params.tripId);
    ApiResponse.ok(res, "Reservations fetched successfully", reservations);
};

const createReservation = async (req, res) => {
    const reservation = await reservationService.createReservation(req.params.tripId, req.body);
    ApiResponse.created(res, "Reservation created successfully", reservation);
};

const updateReservation = async (req, res) => {
    const reservation = await reservationService.updateReservation(
        req.params.tripId,
        req.params.reservationId,
        req.body,
    );
    ApiResponse.ok(res, "Reservation updated successfully", reservation);
};

const deleteReservation = async (req, res) => {
    await reservationService.deleteReservation(req.params.tripId, req.params.reservationId);
    ApiResponse.ok(res, "Reservation deleted successfully");
};

const uploadReservationAttachment = async (req, res) => {
    if (!req.file) {
        throw ApiError.badRequest("Choose a file to upload");
    }
    const reservation = await reservationService.addAttachment(
        req.params.tripId,
        req.params.reservationId,
        req.file,
    );
    ApiResponse.created(res, "Reservation attachment uploaded successfully", reservation);
};

const deleteReservationAttachment = async (req, res) => {
    const reservation = await reservationService.deleteAttachment(
        req.params.tripId,
        req.params.reservationId,
        req.params.attachmentId,
    );
    ApiResponse.ok(res, "Reservation attachment deleted successfully", reservation);
};

export {
    getReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    uploadReservationAttachment,
    deleteReservationAttachment,
};
