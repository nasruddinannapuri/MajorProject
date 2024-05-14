const cloudinary = require("cloudinary").v2;
const { Store } = require("express-session");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// to pass configuration details
// because to connect the backend with the cloudinary and we
// have to pass the configuration details
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// to define storage - we need to define the location of files
// from where it need to store 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowerdFormats: ['png','jpeg','jpg'],
    },
  });

  // exports only two things - cloudinary , storage and used in listing.js
  module.exports = {
    cloudinary,
    storage,

  }