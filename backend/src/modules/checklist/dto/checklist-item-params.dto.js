import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class ChecklistItemParamsDto extends BaseDto {
    static schema = Joi.object({
        tripId: Joi.string().hex().length(24).required(),
        checklistId: Joi.string().hex().length(24).required(),
        itemId: Joi.string().hex().length(24).required(),
    });
}

export default ChecklistItemParamsDto;
