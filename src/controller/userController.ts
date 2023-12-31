import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import User from "../models/userModel";
import { bufferUpload } from "./userControllerForImage";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handleFactory";

function filterObj(body: any, ...fields: string[]) {
  return Object.keys(body).reduce((acc: any, curr: string) => {
    fields.includes(curr) ? (acc[curr] = body[curr]) : "";
    return acc;
  }, {});
}

export const updateMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError("This route is not for update password ", 401));

  const filterBody = filterObj(req.body, "name", "email", "address");
  if (req.file) filterBody["profileImage"] = (await bufferUpload(req.file.buffer))?.secure_url;

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: { updatedUser },
  });
});

export const deleteMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  res.status(204).json({ status: "success", data: null });
});

export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const currentUser = await User.findById(req.user._id);
  res.status(200).json({ status: "success", data: { user: currentUser } });
});

export const getAllUser = getAll(User);
export const createUser = createOne(User);
export const getUser = getOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
