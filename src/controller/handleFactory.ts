import { Document } from "mongoose";
import { Types } from "mongoose";
import { Model } from "mongoose";
import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

interface IBaseDocument extends Document {
  _id: Types.ObjectId;
}

type BaseModel<T> = Model<T, {}, {}, {}, Document<unknown, {}, T> & T & IBaseDocument, any>;

export const getAll = <T>(Model: BaseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await Model.find();
    res.status(200).json({
      status: "success",
      result: data.length,
      data: { data },
    });
  });

export const createOne = <T>(Model: BaseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await Model.create(req.body);
    res.status(200).json({
      status: "success",
      data: { data },
    });
  });

export const getOne = <T>(Model: BaseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const data = await Model.findById(id);

    res.status(200).json({
      status: "success",
      data: { data },
    });
  });
