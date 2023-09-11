import Review from "../models/reviewModel";
import { createOne } from "./handleFactory";

export const createReview = createOne(Review);
