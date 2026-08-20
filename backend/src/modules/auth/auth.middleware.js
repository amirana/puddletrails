import ApiError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils";
import User from "./auth.model.js";

const authenticate = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) throw ApiError.unAuthorized("Not authenticated");
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id);
    if (!user) throw ApiError.unAuthorized("User no longer exists");

    req.user = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    };
    next();
};

// const authorize = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             throw ApiError.forbidden("You don't have permission to perform this action")
//         }
        // next()
//     }
// }

export { authenticate };
