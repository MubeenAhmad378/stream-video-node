import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
import { errorHandler } from "./middlewares/error.middleware.js";

app.use(cors({
    origin :process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// router import
import userRouter from './routes/user.routes.js';
import subscriptionRoutes from "./routes/subscription.routes.js";
import videoRoutes from "./routes/video.routes.js";
import tweetRoutes from "./routes/tweet.routes.js"
import commentRoutes from "./routes/comment.routes.js";




app.use('/api/v1/users' , userRouter)
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/videos", videoRoutes); 
app.use("/api/v1/tweets", tweetRoutes)
app.use("/api/v1/comments", commentRoutes);
app.use(errorHandler);



export { app }