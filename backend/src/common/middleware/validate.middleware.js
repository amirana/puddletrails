import ApiError from "../utils/api-error.js";

const validate = (Dtoclass, source = "body") => {
    return (req, res, next) => {
        const { errors, value } = Dtoclass.validate(req[source])

        if (errors) {
            throw ApiError.badRequest(errors.join("; "))
        }

        req[source] = value

        next()
    }
}

export default validate
