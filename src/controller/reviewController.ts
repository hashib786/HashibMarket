import Review from "../models/reviewModel";
import { checkingSameUser, createOne, updateOne } from "./handleFactory";

export const createReview = createOne(Review);
export const checkingSameReviewUser = checkingSameUser(Review);
export const updateReview = updateOne(Review);
