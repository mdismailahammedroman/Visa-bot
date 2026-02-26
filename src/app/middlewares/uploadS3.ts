/* eslint-disable @typescript-eslint/no-explicit-any */
import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import { Request } from "express";
import { envVar } from "../config/EnvVar";
import { s3 } from "../config/aws-s3.config";

// Single profile picture upload
export const uploadSingle = (fieldName: string) =>
  multer({
    storage: multerS3({
      s3: s3 as any, // TS workaround for v3
      bucket: envVar.AWS_S3.AWS_BUCKET_NAME,
   
      key: (req, file, cb) => {
        const fileName = `users/${Date.now()}-${file.originalname}`;
        cb(null, fileName);
      },
    }),
  }).single(fieldName);

// Multiple files or documents with filter
export const uploadToS3 = multer({
  storage: multerS3({
    s3: s3 as any,
    bucket: envVar.AWS_S3.AWS_BUCKET_NAME,
 
    key: (req, file, cb) => {
      const ext = file.originalname.split(".").pop();
      cb(null, `visa-docs/${file.fieldname}-${Date.now()}.${ext}`);
    },
  }),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
  },
});

