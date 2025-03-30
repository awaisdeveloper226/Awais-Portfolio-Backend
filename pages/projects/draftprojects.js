import Dataloading from "@/components/Dataloading";
import useFetchData from "@/hooks/useFetchData";
import { SiBloglovin } from "react-icons/si";
import { useState } from "react";
import { useRouter } from "next/router"; // Import useRouter for navigation
import Head from "next/head";

export default function Draft() {
  const [currentpage, setcurrentpage] = useState(1);
  const [perpage] = useState(7);
  const [searchquery, setsearchquery] = useState("");
  const router = useRouter(); // Initialize useRouter
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this draft permanently?")
    ) {
      setDeletingId(id);
      try {
        const response = await fetch(`/api/projects?id=${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete draft");

        window.location.reload(); // Refresh to update the list
      } catch (error) {
        console.error("Delete error:", error);
        alert(error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const { alldata, loading } = useFetchData("/api/projects");

  const paginate = (pageNumber) => {
    setcurrentpage(pageNumber);
  };

  // Filter projects based on search query
  const filteredprojects = Array.isArray(alldata)
    ? searchquery.trim() === ""
      ? alldata
      : alldata.filter((project) =>
          project.title.toLowerCase().includes(searchquery.toLowerCase())
        )
    : [];

  // Calculate pagination
  const indexoffirstproject = (currentpage - 1) * perpage;
  const indexoflastproject = currentpage * perpage;
  const currentprojects = filteredprojects.slice(
    indexoffirstproject,
    indexoflastproject
  );

  // Filter only draft projects
  const draftprojects = currentprojects.filter(
    (project) => project.status === "draft"
  );

  const pagenumbers = [];
  for (let i = 1; i <= Math.ceil(filteredprojects.length / perpage); i++) {
    pagenumbers.push(i);
  }

  const handleEdit = (id) => {
    router.push(`/projects/edit/${id}`); // Navigate to the edit page for the selected draft
  };

  return (
    <>
    <Head>
      <title>Draft Projects</title>
    </Head>
      <div className="blogpage">
        <div className="titledashboard flex flex-sb">
          <div>
            <h2>
              All Draft <span>Projects</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <SiBloglovin />
            <span>/</span>
            <span>projects</span>
          </div>
        </div>

        <div className="blogstable">
          {/* Search Bar */}
          <div className="flex gap-2 mb-1">
            <h2>Search projects</h2>
            <input
              type="text"
              placeholder="Search by title"
              value={searchquery}
              onChange={(e) => setsearchquery(e.target.value)}
            />
          </div>

          {/* project Table */}
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
              ) : draftprojects.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No draft project found
                  </td>
                </tr>
              ) : (
                draftprojects.map((project, index) => (
                  <tr key={project._id}>
                    <td>{indexoffirstproject + index + 1}</td>
                    <td>
                      <img
                        src={project.images?.[0] || "/placeholder.jpg"}
                        alt={project.title || "project Image"}
                        className="w-20 h-12 object-cover rounded"
                      />
                    </td>
                    <td>{project.title}</td>
                    <td>
                      <button
                        className="editbtn"
                        onClick={() => handleEdit(project._id)}
                        disabled={deletingId}
                      >
                        Edit
                      </button>
                      <button
                        className="deletebtn"
                        onClick={() => handleDelete(project._id)}
                        disabled={deletingId === project._id}
                      >
                        {deletingId === project._id ? "Deleting..." : "Delete"}
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
