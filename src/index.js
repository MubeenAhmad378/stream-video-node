
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";  // ✅ Use existing app

// Load environment variables
dotenv.config({
    path : './env'
});


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`Server running at this port ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
  console.log('Mongo DB connection failed error', err);
  
})

