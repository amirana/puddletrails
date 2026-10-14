import { Router } from "express";
import * as controller from "./auth.controller.js";
import RegisterDto from "./dto/register.dto.js";
import LoginDto from "./dto/login.dto.js";
import ForgotPasswordDto from "./dto/forgot-password.dto.js";
import ResetPasswordDto from "./dto/reset-password.dto.js";
import { authenticate } from "./auth.middleware.js";

import validate from "../../common/middleware/validate.middleware.js";
import UpdateProfileDto from "./dto/update-profile.dto.js";
import { uploadProfileAvatar } from "../../common/middleware/multer.middleware.js";

const router = Router();

router.post("/register", validate(RegisterDto), controller.register);
router.post(
    "/resend-verification",
    validate(ForgotPasswordDto),
    controller.resendVerificationEmail,
);
router.post("/login", validate(LoginDto), controller.login);
router.post("/logout", authenticate, controller.logout);
router.post("/refresh", controller.refreshToken);

router.post(
    "/forgot-password",
    validate(ForgotPasswordDto),
    controller.forgotPassword,
);
router.put(
    "/reset-password/:token",
    validate(ResetPasswordDto),
    controller.resetPassword,
);

router.get("/profile", authenticate, controller.profile);
router.patch("/profile", authenticate, validate(UpdateProfileDto), controller.updateProfile);
router.patch("/profile/avatar", authenticate, uploadProfileAvatar, controller.updateAvatar);
router.get("/verify-email/:token", controller.verifyEmail);

export default router;
