import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Shop";

export default async function handle(req, res) {
  await mongooseConnect();
  const { method } = req;

  try {
    if (method === "POST") {
      const { title, slug, images, description, tags, afilink, price, status } =
        req.body;

      const productDoc = await Product.create({
        title,
        slug,
        images,
        description,
        tags,
        afilink,
        price,
        status,
      });

      return res.status(201).json(productDoc);
    }

    if (method === "GET") {
      if (req.query.id) {
        const product = await Product.findById(req.query.id);
        return res.status(200).json(product);
      } else {
        const products = await Product.find().sort({ _id: -1 });
        return res.status(200).json(products);
      }
    }

    if (method === "PUT") {
      const {
        _id,
        title,
        slug,
        images,
        description,
        tags,
        afilink,
        price,
        status,
      } = req.body;

      const updatedproduct = await Product.findByIdAndUpdate(
        _id,
        { title, slug, images, description, tags, afilink, price, status },
        { new: true }
      );

      if (!updatedproduct)
        return res.status(404).json({ message: "product not found" });

      return res.status(200).json(updatedproduct);
    }

    if (method === "DELETE") {
      if (req.query.id) {
        const deletedproduct = await Product.findByIdAndDelete(req.query.id);
        if (!deletedproduct)
          return res.status(404).json({ message: "product not found" });

        return res
          .status(200)
          .json({ success: true, message: "product deleted" });
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
