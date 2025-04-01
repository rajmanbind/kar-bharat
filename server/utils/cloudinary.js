
import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloud_name: "drixhjpsy",
  // api_key: process.env.CLOUDINARY_API_KEY,
  api_key: '624177215973122',
  // api_secret: process.env.CLOUDINARY_API_SECRET,
  api_secret: 'aDKwU8x7HVVBUDTyPEFIiL6WlEo',
});

// const uplaodCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) {
//       console.error("No file path provided");
//       return null;
//     }
//     // Ensure the file exists before attempting to upload
//     if (!fs.existsSync(localFilePath)) {
//       console.error("File not found at path:", localFilePath);
//       return null;
//     }

//     // upload the file on cloudinary
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });
//     // File has been uploaded successfully, remove the local file
//     fs.unlinkSync(localFilePath);

//     // Log and return the Cloudinary response
//     console.log("File uploaded to Cloudinary: URL", response.secure_url);
//     return response;
//   } catch (error) {
//     console.error("Error uploading file to Cloudinary:", error.message);
//     fs.unlinkSync(localFilePath); //remove the locally saved temprory file as the upload operation got  failed
//   }
// };


 const uplaodCloudinary = (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "kaaryabharat/profiles",
        public_id: publicId,
        resource_type: "image"
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};
export default uplaodCloudinary;
