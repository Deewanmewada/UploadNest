const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authe");
const upload = require("../config/fileUpload");
const fileModel = require("../models/files.models");

const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const path = require("path");

// Render the home page and display user files
router.get("/home", authMiddleware, async (req, res) => {
    try {
      const userFiles = await fileModel.find({ user: req.user.userId });
  
      console.log("Files fetched for user:", userFiles); // Log files to verify structure
  
      res.render("home", { files: userFiles }); // Pass files array to home.ejs
    } catch (error) {
      console.error("Error fetching user files:", error.message);
      res.status(500).send("Server error");
    }
  });
  

// Handle file upload
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Save file details to MongoDB
    const newFile = await fileModel.create({
      path: req.file.path, // URL returned from Cloudinary
      originalname: req.file.originalname,
      user: req.user.userId, // Authenticated user's ID
    });

    res.status(200).json({
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    console.error("Error uploading file:", error.message);
    res.status(500).json({
      message: "File upload failed",
      error: error.message,
    });
  }
});





// Route to handle file download 

router.get("/download/:id", authMiddleware, async (req, res) => {
    try {
      // Fetch file details from the database
      const file = await fileModel.findById(req.params.id);
  
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
  
      // Extract file details
      const fileUrl = file.path; // Cloudinary file URL
      const fileName = file.originalname || "downloaded-file";
  
      console.log("Downloading file from URL:", fileUrl);
  
      // Fetch file from Cloudinary
      const response = await axios({
        url: fileUrl,
        method: "GET",
        responseType: "stream", // Fetch as a binary stream
      });
  
      console.log("File fetched successfully from Cloudinary.");
  
      // Set headers for file download
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.setHeader("Content-Type", response.headers["content-type"]);
  
      // Stream the file to the client
      response.data.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error.message);
      res.status(500).json({ message: "Failed to download the file", error: error.message });
    }
  });
  
module.exports = router;
