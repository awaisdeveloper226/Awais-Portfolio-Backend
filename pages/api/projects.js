import { mongooseConnect } from "@/lib/mongoose";
import { Project } from "@/models/Project";

export default async function handle(req, res) {
  await mongooseConnect();
  const { method } = req;

  try {
    if (method === "POST") {
      const {
        title,
        slug,
        images,
        description,
        client,
        projectcategory,
        tags,
        livepreview,
        status,
      } = req.body;

      const projectDoc = await Project.create({
        title,
        slug,
        images,
        description,
        client,
        projectcategory,
        tags,
        livepreview,
        status,
      });

      return res.status(201).json(projectDoc);
    }

    if (method === "GET") {
      if (req.query.id) {
        const project = await Project.findById(req.query.id);
        return res.status(200).json(project);
      } else {
        const projects = await Project.find().sort({ _id: -1 });
        return res.status(200).json(projects);
      }
    }

    if (method === "PUT") {
      const {
        _id,
        title,
        slug,
        images,
        description,
        client,
        projectcategory,
        tags,
        livepreview,
        status,
      } = req.body;

      const updatedproject = await Project.findByIdAndUpdate(
        _id,
        {
          title,
          slug,
          images,
          description,
          client,
          projectcategory,
          tags,
          livepreview,
          status,
        },
        { new: true }
      );

      if (!updatedproject)
        return res.status(404).json({ message: "project not found" });

      return res.status(200).json(updatedproject);
    }

    if (method === "DELETE") {
      if (req.query.id) {
        const deletedproject = await Project.findByIdAndDelete(req.query.id);
        if (!deletedproject)
          return res.status(404).json({ message: "Project not found" });

        return res
          .status(200)
          .json({ success: true, message: "Project deleted" });
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
