import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";
import { EXPENSE_CATEGORIES, TRANSPORT_TYPES } from "../budget.constants.js";

const transportType = Joi.string().valid(...TRANSPORT_TYPES);

class UpdateExpenseDto extends BaseDto {
    static schema = Joi.object({
        amount: Joi.number().min(0.01).precision(2),
        description: Joi.string().trim().min(1).max(200),
        category: Joi.string().valid(...EXPENSE_CATEGORIES),
        transportType: transportType.allow(""),
        date: Joi.date(),
    }).min(1);
}

export default UpdateExpenseDto;
