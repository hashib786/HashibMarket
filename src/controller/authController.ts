import _ from "../custom/RequestUser";

import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";

import User, { IUser } from "../models/userModel";
import { catchAsync } from "../utils/catchAsync";
import Email from "../utils/EmailClass";
import { AppError } from "../utils/AppError";

const createJWTToken = (id: Types.ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    // algorithm : "ES256",
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendJWTToken = (user: IUser, res: Response, status: number = 201) => {
  const token = createJWTToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + parseInt(process.env.JWT_EXPIRES_IN!) * (24 * 60 * 60 * 1000)),
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

export const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError("Please Provide email and password.", 403));

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.isCorrectPassword(password, user.password)))
    return next(new AppError("Please Provide write Email or Password", 403));

  sendJWTToken(user, res, 200);
});

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) return next(new AppError("Please Provide Email", 401));

    const user = await User.findOne({ email });
    if (!user) return next(new AppError("User is Not Found", 404));

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    try {
      const resetUrl = `${req.protocol}://${req.get(
        "host",
      )}/api/v1/users/resetpassword/${resetToken}`;

      await new Email(user).sendResetPassMail(resetUrl);

      res.status(200).json({
        status: "success",
        message: "Token send on your Mail",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save();

      return next(new AppError("When Sending Email getting Error", 500));
    }
  },
);

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  });

  if (!user) return next(new AppError("Token is Expired or Invalid", 400));

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  sendJWTToken(user, res, 200);
});

export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.cookie("jwt", "", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: true,
  });

  res.status(201).json({
    status: "success",
  });
});

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer "))
    token = req.headers.authorization.split(" ")[1];
  else if (req.cookies.jwt) token = req.cookies.jwt;

  if (!token) return next(new AppError("You are not logged in Please login to get access", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  const currentUser = await User.findById(decoded.id);
  if (!currentUser || !decoded.iat)
    return next(new AppError("Sending token user is not in out HashibMarket", 401));

  const isPasswordChanged = currentUser.isPasswordChanged(decoded.iat);
  if (isPasswordChanged)
    return next(new AppError("User Recently changed Password | Please log in", 401));

  req.user = currentUser;

  next();
});

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, password, passwordConfirm } = req.body;
    if (!currentPassword || !password || !passwordConfirm)
      return next(new AppError("Please provide currentPassword, password, passwordConfirm", 403));

    const user = await User.findById(req.user._id).select("+password");
    if (!user || !(await user.isCorrectPassword(currentPassword, user.password)))
      return next(new AppError("Please Provide write current password", 403));

    user.password = currentPassword;
    user.passwordConfirm = passwordConfirm;

    await user.save({ validateBeforeSave: true });

    sendJWTToken(user, res, 200);
  },
);

export const restrictTo = (...roles: string[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    roles.includes(req.user.role)
      ? next()
      : next(new AppError("You don't have permission to perform this action", 403));
  });
