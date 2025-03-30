import { mongooseConnect } from "@/lib/mongoose";
import { Blog } from "@/models/Blog";

export default async function handle(req, res) {
  await mongooseConnect();
  const { method } = req;

  try {
    if (method === "POST") {
      const { title, slug, images, description, blogcategory, tags, status } =
        req.body;

      const blogDoc = await Blog.create({
        title,
        slug,
        images,
        description,
        blogcategory,
        tags,
        status,
      });

      return res.status(201).json(blogDoc);
    }

    if (method === "GET") {
      if (req.query.id) {
        const blog = await Blog.findById(req.query.id);
        return res.status(200).json(blog);
      } else {
        const blogs = await Blog.find().sort({ _id: -1 });
        return res.status(200).json(blogs);
      }
    }

    if (method === "PUT") {
      const {
        _id,
        title,
        slug,
        images,
        description,
        blogcategory,
        tags,
        status,
      } = req.body;

      const updatedBlog = await Blog.findByIdAndUpdate(
        _id,
        { title, slug, images, description, blogcategory, tags, status },
        { new: true }
      );

      if (!updatedBlog)
        return res.status(404).json({ message: "Blog not found" });

      return res.status(200).json(updatedBlog);
    }

    if (method === "DELETE") {
      if (req.query.id) {
        const deletedBlog = await Blog.findByIdAndDelete(req.query.id);
        if (!deletedBlog)
          return res.status(404).json({ message: "Blog not found" });

        return res.status(200).json({ success: true, message: "Blog deleted" });
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
