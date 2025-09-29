import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    createVideo, 
    getAllVideos, 
    getVideoById, 
    updateVideo, 
    deleteVideo 
} from "../controllers/video.controller.js";

const router = express.Router();

// Public routes
router.get("/", getAllVideos);
router.get("/:id", getVideoById);

// Private routes
router.post("/", verifyJwt, upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), createVideo);

router.put("/:id", verifyJwt, upload.single("thumbnail"), updateVideo);
router.delete("/:id", verifyJwt, deleteVideo);

export default router;
