import multer from "multer";
import path from "path";

// Storage engine configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/issues/"); // Specify the folder to save images
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // Preserve file extension
    },
});

// File filter for validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only images (JPEG, JPG, PNG) are allowed"));
    }
};

// Multer middleware
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter,
});

export default upload;
