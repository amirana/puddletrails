import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class DayCommentDto extends BaseDto {
    static schema = Joi.object({
        text: Joi.string().trim().min(1).max(1000).required(),
        parentCommentId: Joi.string().hex().length(24).allow(null, ""),
    });
}

export default DayCommentDto;
