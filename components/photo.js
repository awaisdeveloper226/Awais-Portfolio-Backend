import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import { MdDeleteForever } from "react-icons/md";

export default function PhotoComponent({
  _id,
  title: existingTitle,
  slug: existingSlug,
  images: existingImages,
}) {
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();
  const [title, setTitle] = useState(existingTitle || "");
  const [slug, setSlug] = useState(existingSlug || "");
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);

  async function createphoto(ev) {
    ev.preventDefault();

    const photoData = {
      title,
      slug,
      images,
    };

    try {
      if (_id) {
        await axios.put("/api/photos", { ...photoData, _id });
        toast.success("photo Updated");
      } else {
        await axios.post("/api/photos", photoData);
        toast.success("photo Created");
      }
      setRedirect(true);
    } catch (error) {
      console.error(error);
      toast.error("Error creating/updating photo.");
    }
  }

  async function uploadImages(ev) {
    const files = ev.target.files;
    if (files?.length > 0) {
      setIsUploading(true);

      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const response = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          return response.data.links;
        });

        const uploadedLinks = (await Promise.all(uploadPromises)).flat();
        setImages((prev) => [...prev, ...uploadedLinks]);
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Image upload failed");
      } finally {
        setIsUploading(false);
      }
    }
  }

  function updateImagesOrder(newImagesOrder) {
    setImages(newImagesOrder);
  }

  function handleDeleteImage(index) {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    toast.success("Image deleted successfully");
  }

  const handleSlugChange = (ev) => {
    const newSlug = ev.target.value.replace(/\s+/g, "-").toLowerCase();
    setSlug(newSlug);
  };

  if (redirect) {
    router.push("/gallery");
    return null;
  }

  return (
    <form className="addWebsiteform" onSubmit={createphoto}>
      {/* Blog Title */}
      <div className="w-100 flex flex-col flex-left mb-2">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          placeholder="Enter your title"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          required
        />
      </div>
      <div className="w-100 flex flex-col flex-left mb-2">
        <label htmlFor="slug">Slug (SEO-friendly URL)</label>
        <input
          type="text"
          id="slug"
          placeholder="Enter your slug"
          value={slug}
          onChange={handleSlugChange}
          required
        />
      </div>

      {/* Images */}
      <div className="w-100 flex flex-col flex-left mb-2">
        <label htmlFor="images">Images</label>
        <input
          type="file"
          id="fileInput"
          className="mt-1"
          accept="image/*"
          multiple
          onChange={uploadImages}
          disabled={isUploading}
        />
        {isUploading && <Spinner />}

        {images?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <ReactSortable
              list={images}
              setList={updateImagesOrder}
              animation={200}
              className="flex flex-wrap gap-2"
            >
              {images.map((link, index) => (
                <div key={link + index} className="relative group">
                  <img
                    src={link}
                    alt={`Upload ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-lg shadow-sm border"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="absolute -top-2 -right-2 text-red-600 bg-white rounded-full p-0.5 shadow-sm hover:text-red-800"
                  >
                    <MdDeleteForever size={24} />
                  </button>
                </div>
              ))}
            </ReactSortable>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        disabled={isUploading}
      >
        {_id ? "UPDATE PHOTO" : "CREATE PHOTO"}
      </button>
    </form>
  );
}
