import { Router } from "express";
import validate from "../../common/middleware/validate.middleware.js";
import WaitlistDto from "./waitlist.dto.js";
import { joinWaitlist } from "./waitlist.controller.js";

const waitlistRoute = Router();

waitlistRoute.post("/", validate(WaitlistDto), joinWaitlist);

export default waitlistRoute;
