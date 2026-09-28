import Trip from "./trip.model.js";
import TripMember from "./tripmember.model.js";
import tripInvitation from "./tripinvitation.model.js";
import User from "../auth/auth.model.js";
import crypto from "crypto";
import ApiError from "../../common/utils/api-error.js";
import { sendInvitationEmail } from "../../common/config/email.js";

const createTrip = async (tripData, userId) => {
    const trip = await Trip.create({
        title: tripData.title,
        destination: tripData.destination,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        description: tripData.description,
        owner: userId,
    });

    await TripMember.create({
        trip: trip._id,
        user: userId,
        role: "owner",
    });

    return trip;
};

const getTrips = async (userId) => {
    const trips = await Trip.find({
        owner: userId,
    });

    return trips;
};

const getTrip = async (tripId, userId) => {
    const trip = await Trip.findOne({
        _id: tripId,
        owner: userId,
    });

    if (!trip) {
        throw ApiError.notFound("Trip not found");
    }

    return trip;
};

const updateTrip = async (tripId, userId, tripData) => {
    const updatedTrip = await Trip.findOneAndUpdate(
        {
            _id: tripId,
            owner: userId,
        },
        tripData,
        {
            new: true,
        },
    );

    if (updatedTrip === null) {
        throw ApiError.notFound("Trip not found");
    }

    return updatedTrip;
};

const deleteTrip = async (tripId, userId) => {
    const deletedTrip = await Trip.findByIdAndDelete({
        _id: tripId,
        owner: userId,
    });

    if (deletedTrip === null) {
        throw ApiError.notFound("Trip not found");
    }

    return deletedTrip;
};

const token = crypto.randomBytes(32).toString("hex");
const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const createInvitation = async (tripId, email, role, userId) => {
    const trip = await Trip.findOne({
        _id: tripId,
        owner: userId,
    });

    try {
        if (!trip) {
            throw ApiError.notFound("Trip not found");
        }

        const hashedToken = hashToken(token);

        const invitation = await tripInvitation.create({
            trip: tripId,
            email,
            role,
            token: hashedToken,
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });

        await sendInvitationEmail(email, token, trip.title, role);

        const invitationData = invitation.toObject();

        delete invitationData.token;

        return {
            invitation: invitationData,
            token,
        };
    } catch (error) {
        if (error.code === 11000) {
            throw ApiError.conflict(
                "An invitation has already been sent to this email.",
            );
        }

        throw error;
    }
};

const acceptInvitation = async (token, userId) => {
    const hashedToken = hashToken(token);
    const invitation = await tripInvitation.findOne({ token: hashedToken });
    const user = await User.findById(userId);
    const now = Date.now();

    if (!invitation) {
        throw ApiError.notFound("Trip invitation not found");
    }

    if (!user) {
        throw ApiError.notFound("User not found");
    }

    if (invitation.status !== "pending") {
        throw ApiError.badRequest("Invitation is no longer pending");
    }

    if (invitation.expiresAt < now) {
        throw ApiError.notFound("Trip invitation expired");
    }

    if (invitation.email !== user.email) {
        throw ApiError.unAuthorized("Unauthorized access");
    }

    const member = await TripMember.create({
        trip: invitation.trip,
        user: userId,
        role: invitation.role,
    });

    const updatedInvitation = await tripInvitation.findByIdAndUpdate(
        invitation._id,
        {
            status: "accepted",
        },
        {
            returnDocument: "after",
        },
    );

    return {
        member,
        invitation: updatedInvitation,
    };
};

const declineInvitation = async (token, userId) => {
    const hashedToken = hashToken(token);
    const invitation = await tripInvitation.findOne({ token: hashedToken });
    const user = await User.findById(userId);
    const now = Date.now();

    if (!invitation) {
        throw ApiError.notFound("Trip invitation not found");
    }

    if (!user) {
        throw ApiError.notFound("User not found");
    }

    if (invitation.status !== "pending") {
        throw ApiError.badRequest("Invitation is no longer pending");
    }

    if (invitation.expiresAt < now) {
        throw ApiError.notFound("Trip invitation expired");
    }

    if (invitation.email !== user.email) {
        throw ApiError.unAuthorized("Unauthorized access");
    }

    const updatedInvitation = await tripInvitation.findByIdAndUpdate(
        invitation._id,
        {
            status: "declined",
        },
        {
            returnDocument: "after",
        },
    );

    return {
        invitation: updatedInvitation,
    };
};

export {
    createTrip,
    getTrips,
    getTrip,
    updateTrip,
    deleteTrip,
    createInvitation,
    acceptInvitation,
    declineInvitation,
};
