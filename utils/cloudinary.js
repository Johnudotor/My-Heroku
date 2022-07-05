const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "jaymart-computers",
  api_key: "773291616281335",
  api_secret: "4lXrU3rxPFqGPyjkpKHDrJSPSzg",
});

module.exports = cloudinary;
