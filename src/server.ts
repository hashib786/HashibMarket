import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectMongo from "./DB/connectMongoose";

// Connect MongoDB
connectMongo();

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
