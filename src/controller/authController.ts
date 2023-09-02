import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import { catchAsync } from "../utils/catchAsync";

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      address: req.body.address,
      profileImage: req.body.profileImage,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  }
);
