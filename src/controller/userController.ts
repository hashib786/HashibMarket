import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { getApp, initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  uploadBytes,
} from "firebase/storage";
import { AppError } from "../utils/AppError";
import { firebaseConfig } from "../DB/Firebase";

//Initialize a firebase application
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

export const uploadImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.file);
    if (!req.file) return next(new AppError("Upload failed", 401));
    try {
      const dateTime = giveCurrentDateTime();

      const storageRef = ref(
        storage,
        `images/${req.file.originalname + "       " + dateTime}`
      );
      console.log({ storageRef });

      // Create file metadata including the content type
      const metadata = {
        contentType: req.file.mimetype,
      };

      // Upload the file in the bucket storage
      const snapshot = await uploadBytes(storageRef, req.file.buffer, metadata);
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

      // Grab the public url
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("File successfully uploaded.");
      return res.send({
        message: "file uploaded to firebase storage",
        name: req.file.originalname,
        type: req.file.mimetype,
        downloadURL: downloadURL,
      });
    } catch (error) {
      console.log(error);
      return next(new AppError("Error uploading file", 500));
    }
  }
);
