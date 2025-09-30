import express from "express";
import {
  likeVideo,
  unlikeVideo,
  likeComment,
  unlikeComment,
  likeTweet,
  unlikeTweet,
  getVideoLikes,
} from "../controllers/like.Controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = express.Router();

//  Video likes
router.post("/video/:videoId/like", verifyJwt, likeVideo);
router.delete("/video/:videoId/unlike", verifyJwt, unlikeVideo);
router.get("/video/:videoId/likes", verifyJwt, getVideoLikes);

//  Comment likes
router.post("/comment/:commentId/like", verifyJwt, likeComment);
router.delete("/comment/:commentId/unlike", verifyJwt, unlikeComment);

// Tweet likes
router.post("/tweet/:tweetId/like", verifyJwt, likeTweet);
router.delete("/tweet/:tweetId/unlike", verifyJwt, unlikeTweet);

export default router;
