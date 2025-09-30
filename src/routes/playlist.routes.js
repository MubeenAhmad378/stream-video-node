import express from "express";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJwt, createPlaylist); // create new playlist
router.get("/", verifyJwt, getUserPlaylists); // get all user playlists
router.get("/:id", getPlaylistById); // get single playlist by id
router.post("/add-video", verifyJwt, addVideoToPlaylist); // add video to playlist
router.post("/remove-video", verifyJwt, removeVideoFromPlaylist); // remove video
router.delete("/:id", verifyJwt, deletePlaylist); // delete playlist

export default router;
