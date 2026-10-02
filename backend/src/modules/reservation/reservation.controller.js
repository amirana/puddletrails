import ApiResponse from "../../common/utils/api-response.js";
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

export { getReservations, createReservation, updateReservation, deleteReservation };
