import { v2 as cloudinary } from "cloudinary";
import { envVar } from "./EnvVar";

cloudinary.config({
  cloud_name: envVar.CLOUDINARY.CLOUDINARY_NAME,
  api_key: envVar.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVar.CLOUDINARY.CLOUDINARY_SECRET,
});

export default cloudinary;
