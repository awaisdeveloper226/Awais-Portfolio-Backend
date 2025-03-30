import Head from "next/head";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Dataloading from "@/components/Dataloading";
import { BsPostcard } from "react-icons/bs";
import Blog from "@/components/Blog";

export default function EditBlog() {
  const router = useRouter();
  const { id } = router.query;
  const blogId = id;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchBlog = async () => {
      try {
        if (!blogId) return;

        const res = await axios.get(`/api/blogs?id=${blogId}`, {
          signal: abortController.signal,
        });

        if (res.data) {
          setBlog(res.data);
        } else {
          throw new Error("Blog not found");
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err.response?.data?.error || err.message);
          console.error("Fetch error:", err);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchBlog();

    return () => abortController.abort();
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(`/api/blogs`, { ...blog, _id: blogId });
      if (res.status === 200) {
        router.push("/blogs");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update blog");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setBlog((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) return <Dataloading />;

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  if (!blog) return <div className="p-4 text-gray-500">Blog not found</div>;

  return (
    <>
      <Head>
        <title>Edit Blog</title>
      </Head>

      <div className="blogpage">
        <div className="titledashboard flex flex-sb">
          <div
            className="
        "
          >
            <h2>
              Edit <span>{blog?.title}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <BsPostcard /> <span>/</span> <span>Edit Blog</span>
          </div>
        </div>

        <div className="mt-3">{blog && <Blog {...blog} />}</div>
      </div>
    </>
  );
}
