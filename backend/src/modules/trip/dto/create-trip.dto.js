import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class CreateTripDto extends BaseDto {
    static schema = Joi.object({
        title: Joi.string().trim().min(2).max(60).required(),
        destination: Joi.string().trim().min(2).max(60).required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().min(Joi.ref("startDate")).required(),
        description: Joi.string().trim().empty("").default(null),
    });
}

export default CreateTripDto;
