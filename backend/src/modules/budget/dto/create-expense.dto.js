import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";
import { EXPENSE_CATEGORIES, TRANSPORT_TYPES } from "../budget.constants.js";

const transportType = Joi.string().valid(...TRANSPORT_TYPES);

class CreateExpenseDto extends BaseDto {
    static schema = Joi.object({
        amount: Joi.number().min(0.01).precision(2).required(),
        description: Joi.string().trim().min(1).max(200).required(),
        category: Joi.string().valid(...EXPENSE_CATEGORIES).required(),
        transportType: transportType.when("category", {
            is: "transport",
            then: transportType.required(),
            otherwise: Joi.forbidden(),
        }),
        date: Joi.date().required(),
    });
}

export default CreateExpenseDto;
