import { Subscription } from "../models/subscriptions.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

/**
 * Subscribe to a channel
 * POST /api/v1/subscriptions/subscribe
 * body: { channelId: "<channelObjectId>" }
 * authenticated route (req.user available)
 */
const subscribeToChannel = asyncHandler(async (req, res) => {
  const subscriberId = req.user._id;
  const { channelId } = req.body;

  if (!channelId) throw new ApiError(400, "channelId is required");

  // validate channel id
  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  // cannot subscribe to yourself
  if (subscriberId.toString() === channelId.toString()) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }

  // ensure channel exists
  const channel = await User.findById(channelId);
  if (!channel) throw new ApiError(404, "Channel not found");

  // check if already subscribed
  const exists = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId
  });
  if (exists) {
    return res.status(200).json(new ApiResponse(200, {}, "Already subscribed"));
  }

  // create subscription
  const subscription = await Subscription.create({
    subscriber: subscriberId,
    channel: channelId
  });

  return res.status(201).json(new ApiResponse(201, { subscription }, "Subscribed successfully"));
});

/**
 * Unsubscribe from a channel
 * POST /api/v1/subscriptions/unsubscribe
 * body: { channelId: "<channelObjectId>" }
 */
const unsubscribeFromChannel = asyncHandler(async (req, res) => {
  const subscriberId = req.user._id;
  const { channelId } = req.body;

  if (!channelId) throw new ApiError(400, "channelId is required");

  const deleted = await Subscription.findOneAndDelete({
    subscriber: subscriberId,
    channel: channelId
  });

  if (!deleted) {
    return res.status(200).json(new ApiResponse(200, {}, "Not subscribed"));
  }

  return res.status(200).json(new ApiResponse(200, {}, "Unsubscribed successfully"));
});

/**
 * Optional: get list of subscribers for a channel (paginated)
 * GET /api/v1/subscriptions/channel/:channelId/subscribers
 */
const getChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(channelId)) throw new ApiError(400, "Invalid channelId");

  const subscribers = await Subscription.find({ channel: channelId })
    .populate("subscriber", "fullName username avatar")
    .sort({ createdAt: -1 })
    .limit(100);

  return res.status(200).json(new ApiResponse(200, { subscribers }, "Subscribers fetched"));
});

export {
  subscribeToChannel,
  unsubscribeFromChannel,
  getChannelSubscribers
};
