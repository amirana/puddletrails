import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class UpdateChecklistDto extends BaseDto {
    static schema = Joi.object({
        type: Joi.string().valid("packing", "to-do", "custom").required(),
        title: Joi.string().trim().min(1).max(80).required(),
    });
}

export default UpdateChecklistDto;
