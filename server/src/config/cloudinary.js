// server/src/config/cloudinary.js

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

/**
 * Cloudinary configuration
 * Used for storing user avatars and other media
 */
const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // Check if Cloudinary is configured
  if (!cloudName || !apiKey || !apiSecret) {
    console.warn("⚠️ Cloudinary not configured. Avatar upload will not work.");
    return null;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  console.log("✅ Cloudinary configured successfully");
  return cloudinary;
};

const cloudinaryInstance = configureCloudinary();

export default cloudinaryInstance;