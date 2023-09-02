import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    email,
    password,
    passwordConfirm,
    role,
    address,
    profileImage,
  } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
    address,
    profileImage,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
};
