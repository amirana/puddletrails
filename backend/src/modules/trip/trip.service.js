import Trip from "./trip.model.js";
import TripMember from "./tripmember.model.js";
import ApiError from "../../common/utils/api-error.js";

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
        role: "owner"
    })

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

export { createTrip, getTrips, getTrip, updateTrip, deleteTrip };
