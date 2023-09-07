import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import User from "../models/userModel";
import { bufferUpload } from "./userControllerForImage";

function filterObj(body: any, ...fields: string[]) {
  return Object.keys(body).reduce((acc: any, curr: string) => {
    fields.includes(curr) ? (acc[curr] = body[curr]) : "";
    return acc;
  }, {});
}

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm)
      return next(new AppError("This route is not for update password ", 401));

    const filterBody = filterObj(req.body, "name", "email", "address");
    if (req.file)
      filterBody["profileImage"] = (
        await bufferUpload(req.file.buffer)
      )?.secure_url;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, filterBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: { updatedUser },
    });
  }
);
