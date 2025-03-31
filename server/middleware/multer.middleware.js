// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp");
//   },
//   filename: function (req, file, cb) {
//     // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.originalname );
//   },
// });
// console.log("from multer...............")
// const upload = multer({ storage: storage });

// export default upload;

// import multer from "multer";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// // Resolve __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Ensure the directory exists or create it
// const tempDir = path.join(__dirname, "../public/temp");
// if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir, { recursive: true }); // Creates the folder and parent folders if they don't exist
//   console.log("Created directory:", tempDir);
// } else {
//   console.log("Directory already exists:", tempDir);
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp");
//   },
//   filename: function (req, file, cb) {
//     // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.originalname);
//   },
// });

// console.log("Multer initialized...");
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB in bytes
//     files: 1,
//   },
//   fileFilter: function (req, file, cb) {
//     const fileTypes = /jpeg|jpg|png|gif|webp/;
//     const extname = fileTypes.test(
//       path.extname(file.originalname).toLowerCase()
//     );
//     const mimeType = fileTypes.test(file.mimetype);

//     if (extname && mimeType) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files (jpeg, jpg, png, gif) are allowed!"));
//     }
//   },
// });

// // Error handling middleware for Multer
// const handleUploadErrors = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     if (err.code === "LIMIT_UNEXPECTED_FILE") {
//       res.status(400);
//       throw new Error("Unexpected field in file upload");
//     }
//     if (err.code === "LIMIT_FILE_COUNT") {
//       res.status(400);
//       throw new Error("only 1 image allowed");
//     }
//   }
//   next(err);
// };

// export { upload, handleUploadErrors };


// // import multer from "multer";
// // import fs from "fs";
// // import path from "path";
// // import { fileURLToPath } from "url";

// // // Resolve __dirname in ES modules
// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // // Ensure the directory exists or create it
// // const tempDir = path.join(__dirname, "../public/temp");
// // if (!fs.existsSync(tempDir)) {
// //   fs.mkdirSync(tempDir, { recursive: true });
// //   console.log("Created directory:", tempDir);
// // } else {
// //   console.log("Directory already exists:", tempDir);
// // }

// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     cb(null, tempDir); // Use the absolute path
// //   },
// //   filename: function (req, file, cb) {
// //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// //     cb(null, uniqueSuffix + path.extname(file.originalname)); // Add unique filename
// //   },
// // });

// // const fileFilter = (req, file, cb) => {
// //   const fileTypes = /jpeg|jpg|png|gif|webp/;
// //   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
// //   const mimeType = fileTypes.test(file.mimetype);

// //   if (extname && mimeType) {
// //     cb(null, true);
// //   } else {
// //     cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"), false);
// //   }
// // };

// // // Create the upload middleware for single file
// // const upload = multer({
// //   storage: storage,
// //   limits: {
// //     fileSize: 10 * 1024 * 1024, // 10MB
// //   },
// //   fileFilter: fileFilter
// // }).single('profileImage'); // 'profileImage' must match the field name in your form

// // // Error handling middleware
// // const handleUploadErrors = (err, req, res, next) => {
// //   if (err) {
// //     if (err instanceof multer.MulterError) {
// //       if (err.code === "LIMIT_FILE_SIZE") {
// //         return res.status(400).json({ message: "File size too large (max 10MB)" });
// //       }
// //       if (err.code === "LIMIT_UNEXPECTED_FILE") {
// //         return res.status(400).json({ message: "Only single file upload allowed" });
// //       }
// //     }
// //     return res.status(400).json({ message: err.message });
// //   }
// //   next();
// // };

// // export { upload, handleUploadErrors };



// import multer from "multer";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// // Resolve __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Ensure upload directory exists
// const tempDir = path.join(__dirname, "../public/temp");
// if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, tempDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const fileTypes = /jpe?g|png|gif|webp/;
//   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = fileTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed!'), false);
//   }
// };

// // Create single file upload middleware
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB
//     files: 1 // Ensure only one file
//   },
//   fileFilter: fileFilter
// }).single('profileImage'); // Accepts only single file with field name 'profileImage'

// // Custom error handler
// const handleUploadErrors = (err, req, res, next) => {
//   if (err) {
//     if (err instanceof multer.MulterError) {
//       if (err.code === 'LIMIT_UNEXPECTED_FILE') {
//         return res.status(400).json({ 
//           success: false,
//           message: 'Only single image upload allowed' 
//         });
//       }
//       if (err.code === 'LIMIT_FILE_SIZE') {
//         return res.status(400).json({ 
//           success: false,
//           message: 'File size exceeds 10MB limit' 
//         });
//       }
//     }
//     return res.status(400).json({ 
//       success: false,
//       message: err.message || 'File upload failed' 
//     });
//   }
//   next();
// };

// export { upload, handleUploadErrors };


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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

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