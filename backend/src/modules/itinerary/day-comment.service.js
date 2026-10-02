import ApiError from "../../common/utils/api-error.js";
import DayComment from "./day-comment.model.js";
import TripDay from "./trip-day.model.js";

const createComment = async (tripId, dayId, { text, parentCommentId }, userId) => {
    const day = await TripDay.findOne({ _id: dayId, trip: tripId }).select("_id");
    if (!day) throw ApiError.notFound("Trip day not found");

    let parentComment = null;
    if (parentCommentId) {
        parentComment = await DayComment.findOne({
            _id: parentCommentId,
            trip: tripId,
            tripDay: dayId,
            parentComment: null,
        }).select("_id");
        if (!parentComment) throw ApiError.badRequest("Replies must be attached to a top-level comment on this day");
    }

    const comment = await DayComment.create({
        trip: tripId,
        tripDay: dayId,
        createdBy: userId,
        parentComment: parentComment?._id || null,
        text,
    });
    return comment.populate("createdBy", "firstName lastName");
};

const updateComment = async (tripId, commentId, text, userId) => {
    const comment = await DayComment.findOne({ _id: commentId, trip: tripId });
    if (!comment) throw ApiError.notFound("Comment not found");
    if (comment.createdBy.toString() !== userId.toString()) {
        throw ApiError.forbidden("You can only edit your own comment");
    }
    comment.text = text;
    comment.editedAt = new Date();
    await comment.save();
    return comment.populate("createdBy", "firstName lastName");
};

const deleteComment = async (tripId, commentId, userId, role) => {
    const comment = await DayComment.findOne({ _id: commentId, trip: tripId });
    if (!comment) throw ApiError.notFound("Comment not found");
    if (comment.createdBy.toString() !== userId.toString() && role !== "owner") {
        throw ApiError.forbidden("You can only delete your own comment");
    }

    const commentIds = [comment._id];
    if (!comment.parentComment) {
        const replies = await DayComment.find({ parentComment: comment._id }).select("_id");
        commentIds.push(...replies.map((reply) => reply._id));
    }
    await DayComment.deleteMany({ _id: { $in: commentIds }, trip: tripId });
};

const deleteCommentsForDays = (tripId, dayIds) =>
    DayComment.deleteMany({ trip: tripId, tripDay: { $in: dayIds } });

export { createComment, updateComment, deleteComment, deleteCommentsForDays };
