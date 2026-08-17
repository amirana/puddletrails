import { Router } from "express";
import * as controller from "./auth.controller.js"
import BaseDto from "../../common/dto/base.dto.js";
import RegisterDto from "./dto/register.dto.js";

const router = Route();

router.post("/register", validate(RegisterDto), controller.register)

export default router;
