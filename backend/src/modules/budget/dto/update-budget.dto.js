import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";
import { CURRENCIES } from "../budget.constants.js";

class UpdateBudgetDto extends BaseDto {
    static schema = Joi.object({
        totalBudget: Joi.number().min(0).precision(2).required(),
        currency: Joi.string().valid(...CURRENCIES).required(),
    });
}

export default UpdateBudgetDto;
