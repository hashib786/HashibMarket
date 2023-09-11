import Review from "../models/reviewModel";
import { checkingSameUser, createOne, deleteOne, updateOne } from "./handleFactory";

export const createReview = createOne(Review);
export const checkingSameReviewUser = checkingSameUser(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
