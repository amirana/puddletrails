import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class DayActivitiesParamsDto extends BaseDto {
    static schema = Joi.object({
        tripId: Joi.string().hex().length(24).required(),
        dayId: Joi.string().hex().length(24).required(),
    });
}

export default DayActivitiesParamsDto;
