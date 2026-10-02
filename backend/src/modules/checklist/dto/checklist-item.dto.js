import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class ChecklistItemDto extends BaseDto {
    static schema = Joi.object({
        text: Joi.string().trim().min(1).max(200),
        completed: Joi.boolean(),
    }).or("text", "completed");
}

export default ChecklistItemDto;
