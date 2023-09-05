import express from "express";

import userRouter from "./routes/userRoutes";
import { errorController } from "./controller/errorController";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Logging console who is requested our app
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/api/v1/users", userRouter);

// Handle Globel Error Handling
app.use(errorController);

export default app;
