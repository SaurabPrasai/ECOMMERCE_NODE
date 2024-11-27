const cloudinary = require("cloudinary").v2;
const fs=require("fs")




const uploadOnCloudinary = async (localFilePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  try {
    
    if (!localFilePath) {
      throw Error("localPath not found!");
    }
    //upload a file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    return response.secure_url;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath);
    return error;
  }
};

module.exports = uploadOnCloudinary;
