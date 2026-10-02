import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class CreateChecklistItemDto extends BaseDto {
    static schema = Joi.object({
        text: Joi.string().trim().min(1).max(200).required(),
    });
}

export default CreateChecklistItemDto;
