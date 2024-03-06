import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGINS, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
//routes declaration
app.use("/api/v1/users", userRouter);
export { app };
