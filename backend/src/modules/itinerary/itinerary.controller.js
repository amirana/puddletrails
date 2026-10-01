import * as itineraryService from "./itinerary.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const getTripDays = async (req, res) => {
    const days = await itineraryService.getTripDays(req.params.tripId);
    ApiResponse.ok(res, "Trip itinerary fetched successfully", days);
};

export { getTripDays };
