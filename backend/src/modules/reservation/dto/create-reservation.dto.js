import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";
import { RESERVATION_TYPES } from "../reservation.model.js";

class CreateReservationDto extends BaseDto {
    static schema = Joi.object({
        title: Joi.string().trim().min(1).max(120).required(),
        type: Joi.string().valid(...RESERVATION_TYPES).required(),
        date: Joi.date().iso().required(),
        time: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).allow("").default(""),
        confirmationNumber: Joi.string().trim().max(100).allow("").default(""),
        confirmed: Joi.boolean().default(false),
        notes: Joi.string().trim().max(2000).allow("").default(""),
        tripDayId: Joi.string().hex().length(24).allow(null, "").default(null),
    });
}

export default CreateReservationDto;
