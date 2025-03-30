const { Schema, models, model } = require("mongoose");

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    images: [{ type: String, required: true }],
    description: { type: String, required: true },
    blogcategory: [{ type: String, required: true }],
    tags: [{ type: String, required: true }],
    status: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export const Blog = models.Blog || model("Blog", BlogSchema, "blogs");
