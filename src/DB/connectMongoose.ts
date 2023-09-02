import { connect } from "mongoose";

const URL = process.env.MONGO_URL!;

const connectMongo = () => {
  connect(URL)
    .then(() => console.log("MongoDB connect"))
    .catch((error) => console.log("MongoDB error when connecting 🔥🔥", error));
};

export default connectMongo;
