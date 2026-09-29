import { Router } from "express";
import * as tripController from "./trip.controller.js";
import CreateTripDto from "./dto/create-trip.dto.js";
import { authenticate } from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import UpdateTripDto from "./dto/update-trip.dto.js";
import {
    loadMembership,
    requireRole,
} from "../../common/middleware/trip-permission.middleware.js";

const tripRoute = Router();

tripRoute.post(
    "/",
    authenticate,
    validate(CreateTripDto),
    tripController.createTrip,
);

tripRoute.get("/", authenticate, tripController.getTrips);
tripRoute.get(
    "/:tripId",
    authenticate,
    loadMembership,
    requireRole("owner", "editor", "viewer"),
    tripController.getTrip,
);

tripRoute.patch(
    "/:tripId",
    authenticate,
    loadMembership,
    requireRole("owner", "editor"),
    validate(UpdateTripDto),
    tripController.updateTrip,
);

tripRoute.delete(
    "/:tripId",
    authenticate,
    loadMembership,
    requireRole("owner"),
    tripController.deleteTrip,
);

tripRoute.post(
    "/:tripId/invitations",
    authenticate,
    loadMembership,
    requireRole("owner"),
    tripController.tripInvitation,
);

tripRoute.post(
    "/invitations/:token/accept",
    authenticate,
    tripController.acceptInvitation,
);

tripRoute.post(
    "/invitations/:token/decline",
    authenticate,
    tripController.declineInvitation,
);

export default tripRoute;
