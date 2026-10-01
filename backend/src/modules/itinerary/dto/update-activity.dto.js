import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class UpdateActivityDto extends BaseDto {
    static schema = Joi.object({
        title: Joi.string().trim().min(1).max(120),
        description: Joi.string().trim().max(1000).allow(""),
        location: Joi.string().trim().max(160).allow(""),
        startTime: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).allow(""),
        endTime: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).allow(""),
    }).min(1);
}

export default UpdateActivityDto;
