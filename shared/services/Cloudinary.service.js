import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadFile = async ({ folder, file }) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
    });

    const response = { 
      url: result.secure_url,
      public_id: result.public_id
    }

    return response;
  } catch(error) {
    throw new Error("Error al subir el archivo a Cloudinary")
  }
}

export default { uploadFile }
