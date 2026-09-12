import * as tripService from "../trip/trip.service.js";
import ApiResonse from "../../common/utils/api-response.js";

const createTrip = async (req, res) => {
    const trip = await tripService.createTrip(req.body, req.user.id);

    ApiResonse.created(res, "Trip created successfully", trip);
};

export { createTrip };
