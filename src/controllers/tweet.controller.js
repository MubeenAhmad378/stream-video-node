import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";

// ✅ Create a Tweet
export const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user?._id;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.create({
    owner: userId,
    content,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

// ✅ Get all Tweets
export const getAllTweets = asyncHandler(async (req, res) => {
  const tweets = await Tweet.find()
    .populate("owner", "username fullName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "All tweets fetched successfully"));
});

// ✅ Get Single Tweet
export const getTweetById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tweet = await Tweet.findById(id).populate("owner", "username fullName avatar");

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet fetched successfully"));
});

// ✅ Update Tweet
export const updateTweet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user?._id;

  const tweet = await Tweet.findById(id);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this tweet");
  }

  tweet.content = content || tweet.content;
  await tweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

// ✅ Delete Tweet
export const deleteTweet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;

  const tweet = await Tweet.findById(id);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this tweet");
  }

  await tweet.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet deleted successfully"));
});
