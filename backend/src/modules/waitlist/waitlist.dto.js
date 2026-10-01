import Joi from "joi";
import BaseDto from "../../common/dto/base.dto.js";

class WaitlistDto extends BaseDto {
    static schema = Joi.object({
        email: Joi.string().trim().email().lowercase().max(322).required(),
        source: Joi.string().trim().max(100).optional(),
    });
}

export default WaitlistDto;
