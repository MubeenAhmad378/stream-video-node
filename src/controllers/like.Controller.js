import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Like a video
export const likeVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  const existingLike = await Like.findOne({ video: videoId, likedBy: req.user._id });
  if (existingLike) throw new ApiError(400, "Already liked this video");

  const like = await Like.create({ video: videoId, likedBy: req.user._id });

  return res.status(201).json(new ApiResponse(201, like, "Video liked successfully"));
});

// ✅ Unlike a video
export const unlikeVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const like = await Like.findOneAndDelete({ video: videoId, likedBy: req.user._id });
  if (!like) throw new ApiError(400, "You haven't liked this video");

  return res.status(200).json(new ApiResponse(200, {}, "Video unliked successfully"));
});

// ✅ Like a comment
export const likeComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;


  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  const existingLike = await Like.findOne({ comment: commentId, likedBy: req.user._id });
  if (existingLike) throw new ApiError(400, "Already liked this comment");

  const like = await Like.create({ comment: commentId, likedBy: req.user._id });

  return res.status(201).json(new ApiResponse(201, like, "Comment liked successfully"));
});

// ✅ Unlike a comment
export const unlikeComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const like = await Like.findOneAndDelete({ comment: commentId, likedBy: req.user._id });
  if (!like) throw new ApiError(400, "You haven't liked this comment");

  return res.status(200).json(new ApiResponse(200, {}, "Comment unliked successfully"));
});

// ✅ Like a tweet
export const likeTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new ApiError(404, "Tweet not found");

  const existingLike = await Like.findOne({ tweet: tweetId, likedBy: req.user._id });
  if (existingLike) throw new ApiError(400, "Already liked this tweet");

  const like = await Like.create({ tweet: tweetId, likedBy: req.user._id });

  return res.status(201).json(new ApiResponse(201, like, "Tweet liked successfully"));
});

// ✅ Unlike a tweet
export const unlikeTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const like = await Like.findOneAndDelete({ tweet: tweetId, likedBy: req.user._id });
  if (!like) throw new ApiError(400, "You haven't liked this tweet");

  return res.status(200).json(new ApiResponse(200, {}, "Tweet unliked successfully"));
});

// ✅ Get all likes of a video
export const getVideoLikes = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const likes = await Like.find({ video: videoId }).populate("likedBy", "username fullName avatar");

  return res.status(200).json(new ApiResponse(200, likes, "Video likes fetched successfully"));
});
