import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import {
  v2 as cloudinaryV2,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary"; // Import `UploadApiResponse`
import { Readable } from "stream";
import User from "../models/userModel";

export const bufferUpload = async (
  buffer: Buffer
): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    const uploadOption: UploadApiOptions = {
      transformation: {
        aspect_ratio: "1.0",
        gravity: "face",
        width: 150,
        crop: "fill",
      },
      folder: "users",
    };

    const writeStream = cloudinaryV2.uploader.upload_stream(
      uploadOption,
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      }
    );

    const readStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });
    readStream.pipe(writeStream);
  });
};

export const uploadImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if a file was uploaded successfully
    if (!req.file) return next(new AppError("No file uploaded.", 400));
    const result = await bufferUpload(req.file.buffer);
    console.log(result);
    res.status(200).send(`Successfully uploaded, url: ${result?.secure_url}`);
  }
);

export const uploadManyImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if a file was uploaded successfully
    if (!req.files || req.files.length === 0) {
      return next(new AppError("No files uploaded.", 400));
    }

    const files: Express.Multer.File[] = req.files as Express.Multer.File[];

    const uploadPromises = files.map(async (file: { buffer: Buffer }) => {
      const result = await bufferUpload(file.buffer);
      return result?.secure_url;
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      res.status(200).json({ uploadedUrls });
    } catch (error) {
      next(new AppError("Error uploading files.", 500));
    }
  }
);
