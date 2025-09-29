import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

export async function cloudinaryConnection() {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return cloudinary;
}

export async function uploadImage(buffer: Buffer) {
  const connection = await cloudinaryConnection();
  const res = await new Promise((resolve, reject) => {
    connection.uploader
      .upload_stream({}, (error, result) => {
        if (error) reject(error);
        resolve(result);
      })
      .end(buffer);
  });
  return res as UploadApiResponse;
}
