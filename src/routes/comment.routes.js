import express from "express";
import {
  createComment,
  getCommentsForVideo,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/", verifyJwt, createComment);
router.get("/:videoId", getCommentsForVideo);
router.put("/:id", verifyJwt, updateComment);
router.delete("/:id", verifyJwt, deleteComment);

export default router;
