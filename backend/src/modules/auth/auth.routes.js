import { Router } from "express";
import * as controller from "./auth.controller.js";
import BaseDto from "../../common/dto/base.dto.js";
import RegisterDto from "./dto/register.dto.js";
import { authenticate } from "./auth.middleware.js";
import LoginDto from "./dto/login.dto.js";

const router = Route();

router.post("/register", validate(RegisterDto), controller.register);
router.post("/login", validate(LoginDto), controller.login);
router.post("/logout", authenticate, controller.logout);
router.get("/profile", authenticate, controller.profile);

export default router;
