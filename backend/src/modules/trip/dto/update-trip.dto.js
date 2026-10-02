import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class UpdateTripDto extends BaseDto {
    static schema = Joi.object({
        title: Joi.string().trim().min(2).max(60),
        destination: Joi.string().trim().min(2).max(60),
        startDate: Joi.date(),
        endDate: Joi.date().min(Joi.ref("startDate")),
        description: Joi.string().trim().empty("").default(null),
        confirmCommentDeletion: Joi.boolean().default(false),
    });
}

export default UpdateTripDto;
