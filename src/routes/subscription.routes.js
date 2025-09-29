import express from "express";
import { subscribeToChannel, unsubscribeFromChannel, getChannelSubscribers } from "../controllers/subscription.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/subscribe", verifyJwt, subscribeToChannel);
router.post("/unsubscribe", verifyJwt, unsubscribeFromChannel);
router.get("/channel/:channelId/subscribers", verifyJwt, getChannelSubscribers);

export default router;
