import express from "express";
import { createTweet, getAllTweets, getTweetById, updateTweet, deleteTweet } from "../controllers/tweet.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJwt, createTweet);        
router.get("/", getAllTweets);                   
router.get("/:id", getTweetById);                
router.put("/:id", verifyJwt, updateTweet);      
router.delete("/:id", verifyJwt, deleteTweet);   

export default router;
