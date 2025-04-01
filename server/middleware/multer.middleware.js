
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.join(__dirname, "../public/temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, tempDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// Memory storage configuration (for Vercel/serverless environments)
const storage = multer.memoryStorage(); // Stores files in memory as Buffers


const fileFilter = (req, file, cb) => {
  const fileTypes = /jpe?g|png|gif|webp/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed!'), false);
  }
};

// Create the base multer configuration
const multerConfig = {
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
};

// Export specific middleware instances
export const uploadSingle = multer(multerConfig).single('profileImage');

// Error handling middleware
export const handleUploadErrors = (err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ 
          success: false,
          message: 'Only single image upload allowed' 
        });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          success: false,
          message: 'File size exceeds 10MB limit' 
        });
      }
    }
    return res.status(400).json({ 
      success: false,
      message: err.message || 'File upload failed' 
    });
  }
  next();
};