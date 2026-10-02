import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class ExpenseParamsDto extends BaseDto {
    static schema = Joi.object({
        tripId: Joi.string().hex().length(24).required(),
        expenseId: Joi.string().hex().length(24).required(),
    });
}

export default ExpenseParamsDto;
