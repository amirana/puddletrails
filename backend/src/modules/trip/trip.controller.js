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

export { createTrip, getTrips, getTrip };
