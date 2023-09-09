import { Document } from "mongoose";
import { Types } from "mongoose";
import { Model } from "mongoose";
import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import ApiFeature from "../utils/ApiFeature";

interface IBaseDocument extends Document {
  _id: Types.ObjectId;
}

type BaseModel<T> = Model<T, {}, {}, {}, Document<unknown, {}, T> & T & IBaseDocument, any>;

export const getAll = <T>(Model: BaseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let filter = {};
    if (req.params.categories) filter = { categories: req.params.categories };
    if (req.body.filter) filter = { ...filter, ...req.body.filter };

    const feature = new ApiFeature(Model.find(filter), req.query)
      .filter()
      .sort()
      .fields()
      .pagination();

    const data = await feature.query;
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

export const updateOne = <T>(Model: BaseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id, sellerId } = req.params;
    console.log(id, req.body);
    const data = await Model.findByIdAndUpdate(id || sellerId, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: { data },
    });
  });

export const deleteOne = <T>(Model: BaseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id, sellerId } = req.params;
    await Model.findByIdAndDelete(id || sellerId);

    res.status(200).json({
      status: "success",
      data: null,
    });
  });
