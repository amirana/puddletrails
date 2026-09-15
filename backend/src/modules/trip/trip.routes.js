import { Router } from "express";
import * as tripController from "./trip.controller.js";
import CreateTripDto from "./dto/create-trip.dto.js";
import { authenticate } from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";

const tripRoute = Router();

tripRoute.post(
    "/",
    authenticate,
    validate(CreateTripDto),
    tripController.createTrip,
);

tripRoute.get("/", authenticate, tripController.getTrips);
tripRoute.get("/:tripId", authenticate, tripController.getTrip);

export default tripRoute;
