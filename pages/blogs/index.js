import Dataloading from "@/components/Dataloading";
import useFetchData from "@/hooks/useFetchData";
import { SiBloglovin } from "react-icons/si";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Blogs() {
  const [currentpage, setcurrentpage] = useState(1);
  const [perpage] = useState(7);
  const [searchquery, setsearchquery] = useState("");
  const router = useRouter();
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { alldata, loading } = useFetchData("/api/blogs");
  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this blog permanently?")
    ) {
      setDeletingId(id);
      try {
        const response = await fetch(`/api/blogs?id=${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete blog");

        window.location.reload(); // Refresh to update the list
      } catch (error) {
        console.error("Delete error:", error);
        alert(error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const paginate = (pageNumber) => {
    setcurrentpage(pageNumber);
  };

  const filteredblogs = Array.isArray(alldata)
    ? searchquery.trim() === ""
      ? alldata
      : alldata.filter((blog) =>
          blog.title.toLowerCase().includes(searchquery.toLowerCase())
        )
    : [];

  const indexoffirstblog = (currentpage - 1) * perpage;
  const indexoflastblog = currentpage * perpage;
  const currentblogs = filteredblogs.slice(indexoffirstblog, indexoflastblog);

  const publishedblogs = currentblogs.filter(
    (blog) => blog.status === "published"
  );

  const pagenumbers = [];
  for (let i = 1; i <= Math.ceil(filteredblogs.length / perpage); i++) {
    pagenumbers.push(i);
  }

  const handleEdit = (id) => {
    setEditing(id);
    router.push(`/blogs/edit/${id}`);
  };

  return (
    <>
      <Head>
        <title>Blogs</title>
      </Head>

      <div className="blogpage">
        <div className="titledashboard flex flex-sb">
          <div>
            <h2>
              All Published <span>Blogs</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <SiBloglovin />
            <span>/</span>
            <span>Blogs</span>
          </div>
        </div>

        <div className="blogstable">
          {/* Search Bar */}
          <div className="flex gap-2 mb-1">
            <h2>Search Blogs</h2>
            <input
              type="text"
              placeholder="Search by title"
              value={searchquery}
              onChange={(e) => setsearchquery(e.target.value)}
            />
          </div>

          {/* Blog Table */}
          <table className="table table-styling">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Edit/Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    <Dataloading />
                  </td>
                </tr>
              ) : publishedblogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No published blog found
                  </td>
                </tr>
              ) : (
                publishedblogs.map((blog, index) => (
                  <tr key={blog._id}>
                    <td>{indexoffirstblog + index + 1}</td>
                    <td>
                      <img
                        src={blog.images?.[0] || "/placeholder.jpg"}
                        alt={blog.title || "Blog Image"}
                        className="w-20 h-12 object-cover rounded"
                      />
                    </td>
                    <td>{blog.title}</td>
                    <td>
                      <button
                        className={`editbtn ${
                          editing === blog._id ? "editing" : ""
                        }`}
                        onClick={() => handleEdit(blog._id)}
                        disabled={editing || deletingId}
                      >
                        {editing === blog._id ? "Editing..." : "Edit"}
                      </button>
                      <button
                        className="deletebtn"
                        onClick={() => handleDelete(blog._id)}
                        disabled={deletingId === blog._id}
                      >
                        {deletingId === blog._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            {pagenumbers.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={currentpage === number ? "active" : ""}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
