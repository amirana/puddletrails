import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class UpdateDayCommentDto extends BaseDto {
    static schema = Joi.object({
        text: Joi.string().trim().min(1).max(1000).required(),
    });
}

export default UpdateDayCommentDto;
