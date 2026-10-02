import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class DayCommentParamsDto extends BaseDto {
    static schema = Joi.object({
        tripId: Joi.string().hex().length(24).required(),
        commentId: Joi.string().hex().length(24).required(),
    });
}

export default DayCommentParamsDto;
