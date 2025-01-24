const cloudinary = require('cloudinary').v2;

// Ensure your environment variables are loaded correctly
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  console.error("Cloudinary environment variables are not set. Check your .env file.");
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Cloudinary Cloud Name
  api_key: process.env.CLOUD_API_KEY, // Cloudinary API Key
  api_secret: process.env.CLOUD_API_SECRET, // Cloudinary API Secret
});

module.exports = cloudinary;
