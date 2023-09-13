import { Document } from "mongoose";
import { Types } from "mongoose";
import { Model } from "mongoose";
import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import ApiFeature from "../utils/ApiFeature";
import { AppError } from "../utils/AppError";
import { PopulateOptions } from "mongoose";

interface IBaseDocument extends Document {
  _id: Types.ObjectId;
}

type BaseModel<T> = Model<T, {}, {}, {}, Document<unknown, {}, T> & T & IBaseDocument, any>;

export const setFilterOnlySameUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role === "admin") return next();
  req.body.filter = { user: req.user._id };
  next();
};

export const setUserInBody = (req: Request, res: Response, next: NextFunction) => {
  req.body.user = req.user._id;
  next();
};

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

export const getOne = <T>(Model: BaseModel<T>, populateOption?: PopulateOptions) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populateOption) query.populate(populateOption);

    const data = await query;
    res.status(200).json({
      status: "success",
      data: { data },
    });
  });

export const updateOne = <T>(Model: BaseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id, sellerId } = req.params;
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

export const deleteMany = <T>(Model: BaseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filter = req.body.filter;
    await Model.deleteMany(filter);

    res.status(200).json({
      status: "success",
      data: null,
    });
  });

export const checkingSameUser = <T>(Model: BaseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role === "admin") return next();

    const { id } = req.params;
    const model = (await Model.findById(id)) as any;
    if (!model) return next(new AppError("Not finding model given id: ", 401));

    if (model.user.toString() !== req.user.id)
      return next(new AppError("You are not created this model: ", 401));

    next();
  });
