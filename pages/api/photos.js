import { mongooseConnect } from "@/lib/mongoose";
import { Photo } from "@/models/Photo";

export default async function handle(req, res) {
  await mongooseConnect();
  const { method } = req;

  try {
    if (method === "POST") {
      const { title, slug, images } = req.body;

      const PhotoDoc = await Photo.create({
        title,
        slug,
        images,
      });

      return res.status(201).json(PhotoDoc);
    }

    if (method === "GET") {
      if (req.query.id) {
        const photo = await Photo.findById(req.query.id);
        return res.status(200).json(photo);
      } else {
        const photos = await Photo.find().sort({ _id: -1 });
        return res.status(200).json(photos);
      }
    }

    if (method === "PUT") {
      const { _id, title, slug, images } = req.body;

      const updatedPhoto = await Photo.findByIdAndUpdate(
        _id,
        {
          title,
          slug,
          images,
        },
        { new: true }
      );

      if (!updatedPhoto)
        return res.status(404).json({ message: "Photo not found" });

      return res.status(200).json(updatedPhoto);
    }

    if (method === "DELETE") {
      if (req.query.id) {
        const deletedPhoto = await Photo.findByIdAndDelete(req.query.id);
        if (!deletedPhoto)
          return res.status(404).json({ message: "Photo not found" });

        return res
          .status(200)
          .json({ success: true, message: "Photo deleted" });
      }
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error handling request:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
