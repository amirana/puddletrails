import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ensureConfigured = () => {
    const missing = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]
        .filter((key) => !process.env[key]);
    if (missing.length) throw new Error(`Missing Cloudinary configuration: ${missing.join(", ")}`);
};

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) throw new Error("A local file path is required");
    try {
        ensureConfigured();
        return await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "traverse/reservations",
        });
    } finally {
        await fs.unlink(localFilePath).catch(() => {});
    }
};

const deleteFromCloudinary = (publicId, resourceType) => {
    ensureConfigured();
    return cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        invalidate: true,
    });
};

export { uploadOnCloudinary, deleteFromCloudinary };
