import Dataloading from "@/components/Dataloading";
import useFetchData from "@/hooks/useFetchData";
import { SiBloglovin } from "react-icons/si";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function gallery1() {
  const [currentpage, setcurrentpage] = useState(1);
  const [perpage] = useState(7);
  const [searchquery, setsearchquery] = useState("");
  const router = useRouter();
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { alldata, loading } = useFetchData("/api/photos");
  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this photo permanently?")
    ) {
      setDeletingId(id);
      try {
        const response = await fetch(`/api/photos?id=${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete photo");

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

  const filteredphotos = Array.isArray(alldata)
    ? searchquery.trim() === ""
      ? alldata
      : alldata.filter((photo) =>
          photo.title.toLowerCase().includes(searchquery.toLowerCase())
        )
    : [];

  const indexoffirstphoto = (currentpage - 1) * perpage;
  const indexoflastphoto = currentpage * perpage;
  const currentphotos = filteredphotos.slice(
    indexoffirstphoto,
    indexoflastphoto
  );

  const publishedphotos = currentphotos;

  const pagenumbers = [];
  for (let i = 1; i <= Math.ceil(filteredphotos.length / perpage); i++) {
    pagenumbers.push(i);
  }

  const handleEdit = (id) => {
    setEditing(id);
    router.push(`/gallery/edit/${id}`);
  };

  return (
    <>
    <Head>
      <title>
        Photos
      </title>
    </Head>
      <div className="blogpage">
        <div className="titledashboard flex flex-sb">
          <div>
            <h2>
              All Published <span>Photos</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <SiBloglovin />
            <span>/</span>
            <span>Photos</span>
          </div>
        </div>

        <div className="blogstable">
          {/* Search Bar */}
          <div className="flex gap-2 mb-1">
            <h2>Search Photos</h2>
            <input
              type="text"
              placeholder="Search by title"
              value={searchquery}
              onChange={(e) => setsearchquery(e.target.value)}
            />
          </div>

          {/* photo Table */}
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
              ) : publishedphotos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No published Photos found
                  </td>
                </tr>
              ) : (
                publishedphotos.map((photo, index) => (
                  <tr key={photo._id}>
                    <td>{indexoffirstphoto + index + 1}</td>
                    <td>
                      <img
                        src={photo.images?.[0] || "/placeholder.jpg"}
                        alt={photo.title || "photo Image"}
                        className="w-20 h-12 object-cover rounded"
                      />
                    </td>
                    <td>{photo.title}</td>
                    <td>
                      <button
                        className={`editbtn ${
                          editing === photo._id ? "editing" : ""
                        }`}
                        onClick={() => handleEdit(photo._id)}
                        disabled={editing || deletingId}
                      >
                        {editing === photo._id ? "Editing..." : "Edit"}
                      </button>
                      <button
                        className="deletebtn"
                        onClick={() => handleDelete(photo._id)}
                        disabled={deletingId === photo._id}
                      >
                        {deletingId === photo._id ? "Deleting..." : "Delete"}
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
