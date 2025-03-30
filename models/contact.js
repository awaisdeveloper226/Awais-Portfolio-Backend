const { Schema, models, model } = require("mongoose");

const ContactSchema = new Schema(
  {
    name: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String },
    phone: { type: String },
    country: { type: String },
    price: { type: String, required: true },
    description: { type: String, required: true },
    project: [{ type: String }],
  },
  { timestamps: true }
);

export const Contact =
  models.Contact || model("Contact", ContactSchema, "Contacts");
