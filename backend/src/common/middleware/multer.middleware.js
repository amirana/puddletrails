import multer from "multer";
import crypto from "crypto";
import fs from "node:fs";
import path from "node:path";
import ApiError from "../utils/api-error.js";

const tempDirectory = path.resolve(process.cwd(), "public/tmp");
fs.mkdirSync(tempDirectory, { recursive: true });

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, tempDirectory);
    },
    filename: (_req, file, cb) => {
        crypto.randomBytes(16, (err, raw) => {
            if (err) return cb(err);
            const extension = path.extname(file.originalname).toLowerCase();
            cb(null, `${raw.toString("hex")}${extension}`);
        });
    },
});

const multerUpload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, cb) => {
        if (!allowedTypes.has(file.mimetype)) {
            return cb(ApiError.badRequest("Only PDF and image files are allowed"));
        }
        cb(null, true);
    },
});

const avatarUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, cb) => {
        if (!new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]).has(file.mimetype)) {
            return cb(ApiError.badRequest("Profile photo must be a JPEG, PNG, WebP, or GIF image"));
        }
        cb(null, true);
    },
});

const uploadReservationAttachment = (req, res, next) => {
    multerUpload.single("attachment")(req, res, (error) => {
        if (!error) return next();
        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                return next(ApiError.badRequest("Each attachment must be 10 MB or smaller"));
            }
            return next(ApiError.badRequest("Upload one attachment at a time"));
        }
        next(error);
    });
};

const uploadProfileAvatar = (req, res, next) => {
    avatarUpload.single("avatar")(req, res, (error) => {
        if (!error) return next();
        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                return next(ApiError.badRequest("Profile photo must be 5 MB or smaller"));
            }
            return next(ApiError.badRequest("Upload one profile photo at a time"));
        }
        next(error);
    });
};

export { uploadReservationAttachment, uploadProfileAvatar };
