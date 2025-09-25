import { ApiError } from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
    // Agar ye custom ApiError hai to use karo warna default set karo
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || "Something went wrong";
    const errors = err.errors || [];

    return res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

export { errorHandler };
