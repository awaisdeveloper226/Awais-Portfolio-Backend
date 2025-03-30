const { Schema, models, model } = require("mongoose");

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    images: [{ type: String, required: true }],
    description: { type: String, required: true },
    client: { type: String, required: true },
    projectcategory: [{ type: String, required: true }],
    tags: [{ type: String, required: true }],
    livepreview: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export const Project =
  models.Project || model("Project", ProjectSchema, "Projects");
