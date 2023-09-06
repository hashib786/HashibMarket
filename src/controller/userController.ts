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
import config from "../DB/firbase.config";

//Initialize a firebase application
const app = initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

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
        `files/${req.file.originalname + "       " + dateTime}`
      );
      console.log({ storageRef });

      // Create file metadata including the content type
      const metadata = {
        contentType: "image/jpeg",
      };

      // Upload the file and metadata
      const uploadTask = uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
          });
        }
      );

      // Upload the file in the bucket storage
      // const snapshot = await uploadBytes(storageRef, req.file.buffer, metadata);
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

      // const snapshot = await uploadBytesResumable(
      //   storageRef,
      //   req.file.buffer,
      //   metadata
      // );

      // Listen for state changes, errors, and completion of the upload.
      // uploadTask.on(
      //   "state_changed",
      //   (snapshot) => {
      //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      //     const progress =
      //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //     console.log("Upload is " + progress + "% done");
      //     console.log(snapshot.state);
      //     switch (snapshot.state) {
      //       case "success":
      //         console.log("Upload is running");
      //         console.log("File successfully uploaded.");
      //         return res.send({
      //           message: "file uploaded to firebase storage",
      //         });
      //         break;
      //     }
      //   },
      //   (error) => {
      //     // A full list of error codes is available at
      //     // https://firebase.google.com/docs/storage/web/handle-errors
      //     switch (error.code) {
      //       case "storage/unauthorized":
      //         // User doesn't have permission to access the object
      //         break;
      //       case "storage/canceled":
      //         // User canceled the upload
      //         break;

      //       // ...

      //       case "storage/unknown":
      //         // Unknown error occurred, inspect error.serverResponse
      //         break;
      //     }
      //   },
      //   () => {
      //     // Upload completed successfully, now we can get the download URL
      //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      //       console.log("File available at", downloadURL);
      //     });
      //   }
      // );

      // Grab the public url
      // const downloadURL = await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.log(error);
      return next(new AppError("Error uploading file", 500));
    }
  }
);
