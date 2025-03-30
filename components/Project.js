import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import MarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import { MdDeleteForever } from "react-icons/md";

export default function ProjectComponent({
  _id,
  title: existingTitle,
  slug: existingSlug,
  images: existingImages,
  description: existingDescription,
  client: existingclient,
  projectcategory: existingProjectCategory,
  tags: existingTags,
  livepreview: existinglivepreview,
  status: existingStatus,
}) {
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();

  const [title, setTitle] = useState(existingTitle || "");
  const [slug, setSlug] = useState(existingSlug || "");
  const [images, setImages] = useState(existingImages || []);
  const [description, setDescription] = useState(existingDescription || "");
  const [client, setclient] = useState(existingclient || "");
  const [projectcategory, setProjectCategory] = useState(
    existingProjectCategory || []
  );
  const [tags, setTags] = useState(existingTags || []);
  const [livepreview, setLivePreview] = useState(existinglivepreview || []);
  const [status, setStatus] = useState(existingStatus || "");
  const [isUploading, setIsUploading] = useState(false);

  async function createProject(ev) {
    ev.preventDefault();

    const projectData = {
      title,
      slug,
      images,
      description,
      client,
      projectcategory,
      tags,
      livepreview,
      status,
    };

    try {
      if (_id) {
        await axios.put("/api/projects", { ...projectData, _id });
        toast.success("Project Updated");
      } else {
        await axios.post("/api/projects", projectData);
        toast.success("Project Created");
      }
      setRedirect(true);
    } catch (error) {
      console.error(error);
      toast.error("Error creating/updating project.");
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
    router.push("/projects");
    return null;
  }

  return (
    <form className="addWebsiteform" onSubmit={createProject}>
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

      {/* Project Client */}
      <div className="w-100 flex flex-col flex-left mb-2">
        <label htmlFor="client">Client Name</label>
        <input
          type="text"
          id="client"
          placeholder="Enter client name"
          value={client}
          onChange={(ev) => setclient(ev.target.value)}
          required
        />
      </div>
      {/* Project livepreview */}
      <div className="w-100 flex flex-col flex-left mb-2">
        <label htmlFor="livepreview">Live Preview</label>
        <input
          type="text"
          id="livepreview"
          placeholder="Enter Live Preview URL"
          value={livepreview}
          onChange={(ev) => setLivePreview(ev.target.value)}
          required
        />
      </div>

      {/* Blog Category */}
      <div className="w-100 flex flex-col flex-left mb-2">
        <label htmlFor="category">
          Select Category (For multi-selection use Ctrl)
        </label>
        <select
          onChange={(e) =>
            setProjectCategory(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          value={projectcategory}
          name="category"
          id="category"
          multiple
          required
        >
          <option value="Website Development">Website Development</option>
          <option value="App Development">App Development</option>
          <option value="Design System">Design System</option>
          <option value="Website Migration">Website Migration</option>
          <option value="E-commerce Site">Ecommerce Site</option>
          <option value="Performance Evaluation">Performance Evaluation</option>
        </select>
      </div>

      {/* Blog Images */}
      <div className="w-100 flex flex-col flex-left mb-2">
        <label htmlFor="images">
          Images (First image will be used as a thumbnail)
        </label>
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

      {/* Markdown Description */}
      <div className="description w-100 flex flex-col flex-left mb-2">
        <label htmlFor="description">
          Project Content (For images: First upload, copy link, and paste in{" "}
          <code>[alt text](link)</code>)
        </label>
        <MarkdownEditor
          value={description}
          onChange={({ text }) => setDescription(text)}
          className="markdown-editor-container"
          style={{ height: "300px" }}
          renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
        />
      </div>

      {/* Tags */}
      <div className="w-100 flex flex-col flex-left mb-2">
        <label htmlFor="tags">Tags</label>
        <select
          onChange={(e) =>
            setTags(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          value={tags}
          name="tags"
          id="tags"
          multiple
          required
        >
          <option value="HTML">HTML</option>
          <option value="CSS">CSS</option>
          <option value="Javascript">Javascript</option>
          <option value="React Js">React JS</option>
          <option value="Next Js">Next Js</option>
          <option value="Database">Database</option>
        </select>
      </div>

      {/* Blog Status */}
      <div className="w-100 flex flex-col flex-left mb-4">
        <label htmlFor="status">Status</label>
        <select
          onChange={(ev) => setStatus(ev.target.value)}
          value={status}
          name="status"
          id="status"
          required
        >
          <option value="">Select Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        disabled={isUploading}
      >
        {_id ? "UPDATE PROJECT" : "CREATE PROJECT"}
      </button>
    </form>
  );
}
