import cloudinary from "cloudinary";
import multiparty from "multiparty";
import { mongooseConnect } from "@/lib/mongoose";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handle(req, res) {
  await mongooseConnect();

  try {
    const form = new multiparty.Form();
    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const links = [];
    if (files.file) {
      for (const file of files.file) {
        const result = await cloudinary.v2.uploader.upload(file.path, {
          folder: "portfolio-admin",
          resource_type: "auto",
          public_id: `blog_${Date.now()}`,
        });
        links.push(result.secure_url);
      }
    }

    return res.json({ links });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Image upload failed" });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
