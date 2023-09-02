import express from "express";

import userRouter from "./routes/userRoutes";

const app = express();

// Middlewares
app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/users", userRouter);

export default app;
