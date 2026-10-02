import Trip from "./trip.model.js";
import TripMember from "./tripmember.model.js";
import tripInvitation from "./tripinvitation.model.js";
import User from "../auth/auth.model.js";
import crypto from "crypto";
import ApiError from "../../common/utils/api-error.js";
import { sendInvitationEmail } from "../../common/config/email.js";
import { deleteExpensesForTrip } from "../budget/budget.service.js";
import {
    assertDateChangeKeepsActivities,
    deleteTripDays,
    syncTripDays,
} from "../itinerary/itinerary.service.js";

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

    await syncTripDays(trip);

    return trip;
};

const getTrips = async (userId) => {
    const memberships = await TripMember.find({
        user: userId,
    });

    const tripIds = memberships.map((member) => member.trip);

    const trips = await Trip.find({
        $or: [{ owner: userId }, { _id: { $in: tripIds } }],
    });

    return trips.map((trip) => {
        const membership = memberships.find(
            (member) => member.trip.toString() === trip._id.toString(),
        );

        return {
            ...trip.toObject(),
            role: membership?.role,
        };
    });
};

const getTrip = async (tripId, userId) => {
    const trip = await Trip.findOne({
        _id: tripId,
    });

    if (!trip) {
        throw ApiError.notFound("Trip not found");
    }

    const member = await TripMember.findOne({
        trip: tripId,
        user: userId,
    });

    if (trip.owner.toString() !== userId.toString() && !member) {
        throw ApiError.unAuthorized("You do not have access to this trip");
    }

    const members = await TripMember.find({ trip: tripId })
        .populate("user", "firstName lastName email avatar")
        .sort({ createdAt: 1 });

    return {
        ...trip.toObject(),
        role: trip.owner.toString() === userId.toString() ? "owner" : member.role,
        members,
    };
};

const updateTrip = async (tripId, tripData) => {
    const trip = await Trip.findById(tripId);
    if (!trip) throw ApiError.notFound("Trip not found");
    const { confirmCommentDeletion, ...tripUpdates } = tripData;

    await assertDateChangeKeepsActivities(
        trip,
        tripData.startDate ?? trip.startDate,
        tripData.endDate ?? trip.endDate,
        confirmCommentDeletion,
    );

    const updatedTrip = await Trip.findOneAndUpdate(
        {
            _id: tripId,
        },
        tripUpdates,
        {
            returnDocument: "after",
            runValidators: true,
        },
    );

    if (updatedTrip === null) {
        throw ApiError.notFound("Trip not found");
    }

    await syncTripDays(updatedTrip);

    return updatedTrip;
};

const updateTripMember = async (tripId, memberId, role) => {
    if (!["editor", "viewer"].includes(role)) {
        throw ApiError.badRequest("Member role must be editor or viewer");
    }

    const member = await TripMember.findOne({ _id: memberId, trip: tripId });
    if (!member) throw ApiError.notFound("Trip member not found");
    if (member.role === "owner") {
        throw ApiError.forbidden("The trip owner role cannot be changed");
    }

    member.role = role;
    await member.save();
    return member.populate("user", "firstName lastName email avatar");
};

const removeTripMember = async (tripId, memberId) => {
    const member = await TripMember.findOne({ _id: memberId, trip: tripId });
    if (!member) throw ApiError.notFound("Trip member not found");
    if (member.role === "owner") {
        throw ApiError.forbidden("The trip owner cannot be removed");
    }

    await member.deleteOne();
    return member;
};

const leaveTrip = async (tripId, userId) => {
    const member = await TripMember.findOne({ trip: tripId, user: userId });
    if (!member) throw ApiError.notFound("Trip membership not found");
    if (member.role === "owner") {
        throw ApiError.forbidden("The trip owner cannot leave their trip");
    }

    await member.deleteOne();
    return member;
};

const deleteTrip = async (tripId) => {
    const deletedTrip = await Trip.findByIdAndDelete(tripId);

    if (!deletedTrip) {
        throw ApiError.notFound("Trip not found");
    }

    await deleteTripDays(tripId);
    await deleteExpensesForTrip(tripId);

    return deletedTrip;
};

const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const createInvitation = async (tripId, email, role, userId) => {
    const token = crypto.randomBytes(32).toString("hex");
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

const getInvitation = async (token, userId) => {
    const hashedToken = hashToken(token);

    const invitation = await tripInvitation.findOne({
        token: hashedToken,
    });

    const user = await User.findById(userId);

    if (!invitation) {
        throw ApiError.notFound("Trip invitation not found");
    }

    if (!user) {
        throw ApiError.notFound("User not found");
    }

    if (invitation.email !== user.email) {
        throw ApiError.unAuthorized("Unauthorized access");
    }

    return {
        status: invitation.status,
        trip: invitation.trip,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
    };
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

    if (invitation.status === "accepted") {
        throw ApiError.badRequest("Invitation has already been accepted");
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

    if (invitation.status === "declined") {
        throw ApiError.badRequest("Invitation has already been declined");
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
    updateTripMember,
    removeTripMember,
    leaveTrip,
    deleteTrip,
    createInvitation,
    getInvitation,
    acceptInvitation,
    declineInvitation,
};
