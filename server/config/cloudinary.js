const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔁 Generic function to get storage with custom folder
const getCloudinaryStorage = (subfolder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `e-aspirants/${subfolder}`,
      allowed_formats: ['jpg', 'jpeg', 'png'],
    },
  });

module.exports = { cloudinary, getCloudinaryStorage };
