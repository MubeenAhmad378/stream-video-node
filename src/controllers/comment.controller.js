import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";

// ✅ Create Comment
export const createComment = asyncHandler(async (req, res) => {
  const { content, videoId } = req.body;
  const userId = req.user?._id;

  if (!content || !videoId) {
    throw new ApiError(400, "Content and videoId are required");
  }

  // Check if video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

// ✅ Get Comments for a Video
export const getCommentsForVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const comments = await Comment.find({ video: videoId })
    .populate("owner", "username fullName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

// ✅ Update Comment
export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user?._id;


  const comment = await Comment.findById(id);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to edit this comment");
  }

  comment.content = content || comment.content;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

// ✅ Delete Comment
export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;

  const comment = await Comment.findById(id);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to delete this comment");
  }

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});
