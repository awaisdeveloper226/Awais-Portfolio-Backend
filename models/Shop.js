const { Schema, models, model } = require("mongoose");

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    images: [{ type: String, required: true }],
    description: { type: String, required: true },
    tags: [{ type: String, required: true }],
    afilink: { type: String, required: true },
    price: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export const Product =
  models.Product || model("Product", ProductSchema, "Products");
