import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class ReorderActivitiesDto extends BaseDto {
    static schema = Joi.object({
        activities: Joi.array()
            .items(
                Joi.object({
                    activityId: Joi.string().hex().length(24).required(),
                    tripDayId: Joi.string().hex().length(24).required(),
                    order: Joi.number().integer().min(0).required(),
                }),
            )
            .min(1)
            .max(500)
            .required(),
    });
}

export default ReorderActivitiesDto;
