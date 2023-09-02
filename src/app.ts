import express from "express";

import userRouter from "./routes/userRoutes";
import { errorController } from "./controller/errorController";

const app = express();

// Middlewares
app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/users", userRouter);

// Handle Globel Error Handling
app.use(errorController);

export default app;
