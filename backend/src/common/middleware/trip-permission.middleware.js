import TripMember from "../../modules/trip/tripmember.model.js";
import ApiError from "../utils/api-error.js";

const loadMembership = async (req, res, next) => {
    try {
        console.log("TRIP ID:", req.params.tripId);
        console.log("USER ID:", req.user.id);

        const membership = await TripMember.findOne({
            trip: req.params.tripId,
            user: req.user.id,
        });
        console.log("MEMBERSHIP:", membership);

        if (!membership) {
            throw ApiError.forbidden("You do not have access to this trip");
        }

        req.membership = membership;

        next();
    } catch (error) {
        next(error);
    }
};

const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.membership) {
            return next(ApiError.forbidden("Trip membership not found"));
        }

        if (!allowedRoles.includes(req.membership.role)) {
            return next(
                ApiError.forbidden(
                    "You do not have permission to perform this action",
                ),
            );
        }

        next();
    };
};

export { loadMembership, requireRole };
