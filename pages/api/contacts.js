import { mongooseConnect } from "@/lib/mongoose";
import { Contact } from "@/models/contact";

export default async function handle(req, res) {
  await mongooseConnect();
  const { method } = req;

  try {
    if (method === "POST") {
      const {
        name,
        lname,
        email,
        company,
        phone,
        country,
        price,
        description,
        project,
      } = req.body;

      const contactDoc = await Contact.create({
        name,
        lname,
        email,
        company,
        phone,
        country,
        price,
        description,
        project,
      });

      return res.status(201).json(contactDoc);
    }

    if (method === "GET") {
      if (req.query.id) {
        const contact = await Contact.findById(req.query.id);
        return res.status(200).json(contact);
      } else {
        const contacts = await Contact.find().sort({ _id: -1 });
        return res.status(200).json(contacts);
      }
    }

    if (method === "PUT") {
      const {
        _id,
        name,
        lname,
        email,
        company,
        phone,
        country,
        price,
        description,
        project,
      } = req.body;

      const updatedcontact = await Contact.findByIdAndUpdate(
        _id,
        {
          name,
          lname,
          email,
          company,
          phone,
          country,
          price,
          description,
          project,
        },
        { new: true }
      );

      if (!updatedcontact)
        return res.status(404).json({ message: "contact not found" });

      return res.status(200).json(updatedcontact);
    }

    if (method === "DELETE") {
      if (req.query.id) {
        const deletedcontact = await Contact.findByIdAndDelete(req.query.id);
        if (!deletedcontact)
          return res.status(404).json({ message: "contact not found" });

        return res
          .status(200)
          .json({ success: true, message: "contact deleted" });
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
