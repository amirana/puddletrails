import User from "./auth.model.js"
import ApiError from "../../common/utils/api-error.js"

const register = async ({ firstName, lastName, email, password }) => {
    // user registration
    const existing = await User.findOne({email})

    if (existing) {
        throw ApiError.conflict("Email already exists")
    }
}

export { register }