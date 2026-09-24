import * as tripService from "../trip/trip.service.js";
import ApiResonse from "../../common/utils/api-response.js";

const createTrip = async (req, res) => {
    const trip = await tripService.createTrip(req.body, req.user.id);

    ApiResonse.created(res, "Trip created successfully", trip);
};

const getTrips = async (req, res) => {
    const trips = await tripService.getTrips(req.user.id);

    ApiResonse.ok(res, "Trips fetched successfully", trips);
};

const getTrip = async (req, res) => {
    const trip = await tripService.getTrip(req.params.tripId, req.user.id);

    ApiResonse.ok(res, "Trip fetched successfully", trip);
};

const updateTrip = async (req, res) => {
    const updatedTrip = await tripService.updateTrip(
        req.params.tripId,
        req.user.id,
        req.body,
    );

    ApiResonse.ok(res, "Trip updated successfully", updatedTrip);
};

const deleteTrip = async (req, res) => {
    const deletedTrip = await tripService.deleteTrip(
        req.params.tripId,
        req.user.id,
    );

    ApiResonse.ok(res, "Trip deleted successfully", deletedTrip);
};

const tripInvitation = async (req, res) => {
    const invitation = await tripService.createInvitation(
        req.params.tripId,
        req.body.email,
        req.body.role,
        req.user.id,
    );

    ApiResonse.ok(res, "Trip invitation sent", invitation);
};

const acceptInvitation = async (req, res) => {
    const result = await tripService.acceptInvitation(
        req.params.token,
        req.user.id,
    );

    ApiResonse.ok(res, "Trip invitation accepted", result);
};

const declineInvitation = async (req, res) => {
    const result = await tripService.declineInvitation(
        req.params.token,
        req.user.id,
    );

    ApiResonse.ok(res, "Trip invitation declined", result);
};

export {
    createTrip,
    getTrips,
    getTrip,
    updateTrip,
    deleteTrip,
    tripInvitation,
    acceptInvitation,
    declineInvitation,
};
