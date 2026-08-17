import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class RegisterDto extends BaseDto {
    static schema = Joi.object({
        firstName: Joi.string().trim().min(2).max(50).required(),
        lastName: Joi.string().trim().min(2).max(50).required(),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string()
            .min(8)
            .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
            .required()
            .messages({
                "string.pattern.base":
                    "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                "string.min": "Password must be at least 8 characters",
            }),
    });
}

export default RegisterDto;
