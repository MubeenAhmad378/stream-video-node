import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadONCloudinary } from "../utils/cloudinary.js";

// Create video with Cloudinary upload
export const createVideo = asyncHandler(async (req, res) => {
    const { title, description, duration } = req.body;

    if (!req.files?.videoFile || !req.files?.thumbnail) {
        throw new ApiError(400, "Video file and thumbnail are required");
    }

    // Upload files to Cloudinary
    const videoFilePath = req.files.videoFile[0].path;
    const thumbnailPath = req.files.thumbnail[0].path;

    const videoUpload = await uploadONCloudinary(videoFilePath);
    const thumbnailUpload = await uploadONCloudinary(thumbnailPath);

    if (!videoUpload || !thumbnailUpload) {
        throw new ApiError(500, "Error uploading to Cloudinary");
    }

    // Save video data in DB
    const video = await Video.create({
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload.url,
        title,
        description,
        duration,
        owner: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, video, "Video uploaded successfully")
    );
});

// Get all videos
export const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const options = { page: parseInt(page), limit: parseInt(limit), sort: { createdAt: -1 } };

    const videos = await Video.aggregatePaginate(Video.aggregate([{ $match: {} }]), options);

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
});

// Get single video by ID
export const getVideoById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner", "fullName username avatar");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.views += 1;
    await video.save();

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    );
});

// Update video (only thumbnail, title, description)
export const updateVideo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, isPublished } = req.body;

    const video = await Video.findById(id);
    if (!video) throw new ApiError(404, "Video not found");

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to update this video");
    }

    if (req.file) {
        const thumbnailUpload = await uploadONCloudinary(req.file.path);
        if (thumbnailUpload) video.thumbnail = thumbnailUpload.url;
    }

    video.title = title || video.title;
    video.description = description || video.description;
    if (typeof isPublished !== "undefined") {
        video.isPublished = isPublished;
    }

    await video.save();
    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    );
});

// Delete video
export const deleteVideo = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const video = await Video.findById(id);
    if (!video) throw new ApiError(404, "Video not found");

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to delete this video");
    }

    await video.deleteOne();
    return res.status(200).json(
        new ApiResponse(200, null, "Video deleted successfully")
    );
});
