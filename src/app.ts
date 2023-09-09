import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRoutes";
import productRouter from "./routes/productRoutes";
import sellerRouter from "./routes/sellerRoutes";
import { errorController } from "./controller/errorController";

const app = express();

// Middlewares
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Logging console who is requested our app
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/seller", sellerRouter);

// Handle Globel Error Handling
app.use(errorController);

export default app;
