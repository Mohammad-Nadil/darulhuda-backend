import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from "../constants.js";
import { ApiError } from "./ApiError.js";
import fs from "fs";
import path from "path";
// import streamifier from "streamifier";

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  if (!filePath) return null;

  try {
    if (!fs.existsSync(filePath)) {
      throw new ApiError(400, "File not found at path");
    }

    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
    });

    fs.unlinkSync(filePath);

    return response;
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    console.error("Cloudinary upload error:", error);
    throw new ApiError(500, "Cloudinary upload failed");
  }
};
const uploadPdfOnCloudinary = async (filePath) => {
  if (!filePath) return null;

  try {
    if (!fs.existsSync(filePath)) {
      throw new ApiError(400, "File not found at path");
    }

    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
    });

    fs.unlinkSync(filePath);

    return response;
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    console.error("Cloudinary upload error:", error);
    throw new ApiError(500, "Cloudinary upload failed");
  }
};

const deleteFromCloudinary = async (pic_id) => {
  if (!pic_id) return null; // skip if no id
  try {
    const response = await cloudinary.uploader.destroy(pic_id, { resource_type: "image" });
    if (response.result !== "ok" && response.result !== "not found") {
      console.error("Cloudinary deletion issue:", response);
    }
    return response;
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return null;
  }
};
const deletePdfFromCloudinary = async (pic_id) => {
  if (!pic_id) return null;
  try {
    const response = await cloudinary.uploader.destroy(pic_id, {
      resource_type: "raw",
      invalidate: true,
    });

     console.log("Cloudinary deletion response:", response);

    if (response.result !== "ok" && response.result !== "not found") {
      console.error("Cloudinary deletion issue:", response);
    }
    return response;
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary, uploadPdfOnCloudinary, deletePdfFromCloudinary };

// const uploadOnCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { resource_type: "image" },
//       (error, result) => {
//         if (error) {
//           reject(new ApiError(500, "Cloudinary upload failed"));
//         } else {
//           resolve(result);
//         }
//       }
//     );
//     streamifier.createReadStream(fileBuffer).pipe(stream);
//   });
// };
// const uploadPdfOnCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream({ resource_type: "raw" }, (error, result) => {
//       if (error) {
//         reject(new ApiError(500, "Cloudinary upload failed"));
//       } else {
//         resolve(result);
//       }
//     });
//     streamifier.createReadStream(fileBuffer).pipe(stream);
//   });
// };
