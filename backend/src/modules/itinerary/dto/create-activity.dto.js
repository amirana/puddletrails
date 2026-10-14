import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

const time = Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
    .allow("");

class CreateActivityDto extends BaseDto {
    static schema = Joi.object({
        title: Joi.string().trim().min(1).max(120).required(),
        description: Joi.string().trim().max(1000).allow("").default(""),
        location: Joi.string().trim().max(160).allow("").default(""),
        startTime: time.required(),
        endTime: time.required(),
    });
}

export default CreateActivityDto;
