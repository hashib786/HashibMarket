import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";

import User, { IUser } from "../models/userModel";
import { catchAsync } from "../utils/catchAsync";
import Email from "../utils/EmailClass";

const createJWTToken = (id: Types.ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    // algorithm : "ES256",
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendJWTToken = (user: IUser, res: Response, status: number = 201) => {
  const token = createJWTToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRES_IN!) * (24 * 60 * 60 * 1000)
    ),
    httpOnly: true,
    secure: true,
  });

  user.password = "";

  res.status(status).json({
    status: "success",
    token,
    data: { user },
  });
};

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

    await new Email(newUser).sendWelcomeMail();
    sendJWTToken(newUser, res, 201);
  }
);
