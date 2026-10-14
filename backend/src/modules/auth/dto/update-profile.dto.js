import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class UpdateProfileDto extends BaseDto {
    static schema = Joi.object({
        city: Joi.string().trim().max(100).allow(""),
        country: Joi.string().trim().max(100).allow(""),
    }).min(1);
}

export default UpdateProfileDto;
