import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//  Create Playlist
export const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user?._id;

  if (!name) {
    throw new ApiError(400, "Playlist name is required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

// Get all Playlists for logged-in user
export const getUserPlaylists = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const playlists = await Playlist.find({ owner: userId }).populate(
    "videos",
    "title thumbnail"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "User playlists fetched successfully"));
});


// Get a single Playlist by ID
export const getPlaylistById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const playlist = await Playlist.findById(id)
    .populate("videos", "title thumbnail duration")
    .populate("owner", "username fullName avatar");

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

// ✅ Add Video to Playlist
export const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;
  const userId = req.user?._id;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to modify this playlist");
  }

  // Avoid duplicate videos
  if (!playlist.videos.includes(videoId)) {
    playlist.videos.push(videoId);
    await playlist.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added to playlist"));
});

// ✅ Remove Video from Playlist
export const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;
  const userId = req.user?._id;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to modify this playlist");
  }

  playlist.videos = playlist.videos.filter(
    (vid) => vid.toString() !== videoId.toString()
  );
  await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed from playlist"));
});

// ✅ Delete Playlist
export const deletePlaylist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;

  const playlist = await Playlist.findById(id);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to delete this playlist");
  }

  await playlist.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Playlist deleted successfully"));
});
