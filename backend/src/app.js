import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./modules/auth/auth.routes.js";
import tripRoute from "./modules/trip/trip.routes.js";
import cors from "cors";
import ApiError from "./common/utils/api-error.js";
import waitlistRoute from "./modules/waitlist/waitlist.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.use("/api/trips", tripRoute);
app.use("/api/waitlist", waitlistRoute);

// Catch-all for undefined routes
app.all("{*path}", (req, res) => {
    throw ApiError.notFound(`Route ${req.originalUrl} not found`);
});

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        message: error.message || "Internal server error",
    });
});

export default app;
