const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "uploads", // Folder name in your Cloudinary account
      format: file.mimetype.split("/")[1], // Dynamically get file type (e.g., jpg, png)
      public_id: `${Date.now()}-${file.originalname}`, // Unique file name
      resource_type: "auto", // Automatically detect file type
    };
  },
});

// Configure multer with Cloudinary storage
const upload = multer({ storage });

module.exports = upload;
