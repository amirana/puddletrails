import ApiResponse from "../../common/utils/api-response.js";
import * as dayCommentService from "./day-comment.service.js";

const createComment = async (req, res) => {
    const comment = await dayCommentService.createComment(
        req.params.tripId,
        req.params.dayId,
        req.body,
        req.user.id,
    );
    ApiResponse.created(res, "Comment added successfully", comment);
};

const updateComment = async (req, res) => {
    const comment = await dayCommentService.updateComment(
        req.params.tripId,
        req.params.commentId,
        req.body.text,
        req.user.id,
    );
    ApiResponse.ok(res, "Comment updated successfully", comment);
};

const deleteComment = async (req, res) => {
    await dayCommentService.deleteComment(
        req.params.tripId,
        req.params.commentId,
        req.user.id,
        req.membership.role,
    );
    ApiResponse.ok(res, "Comment deleted successfully");
};

export { createComment, updateComment, deleteComment };
