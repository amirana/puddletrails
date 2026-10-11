import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class ReservationParamsDto extends BaseDto {
    static schema = Joi.object({
        tripId: Joi.string().hex().length(24).required(),
        reservationId: Joi.string().hex().length(24).required(),
        attachmentId: Joi.string().hex().length(24),
    });
}

export default ReservationParamsDto;
