import Dataloading from "@/components/Dataloading";
import useFetchData from "@/hooks/useFetchData";
import { SiBloglovin } from "react-icons/si";
import { useState } from "react";
import { useRouter } from "next/router";
import {FaEye} from "react-icons/fa";
import Head from "next/head";

export default function Contacts() {
  const [currentpage, setcurrentpage] = useState(1);
  const [perpage] = useState(7);
  const [searchquery, setsearchquery] = useState("");
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);

  const { alldata, loading } = useFetchData("/api/contacts");

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact permanently?")) {
      setDeletingId(id);
      try {
        const response = await fetch(`/api/contacts?id=${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete contact");
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

  const filteredcontacts = Array.isArray(alldata)
    ? searchquery.trim() === ""
      ? alldata
      : alldata.filter((contact) =>
          contact.name.toLowerCase().includes(searchquery.toLowerCase())
        )
    : [];

  const indexoffirstcontact = (currentpage - 1) * perpage;
  const indexoflastcontact = currentpage * perpage;
  const currentcontacts = filteredcontacts.slice(indexoffirstcontact, indexoflastcontact);

  const pagenumbers = [];
  for (let i = 1; i <= Math.ceil(filteredcontacts.length / perpage); i++) {
    pagenumbers.push(i);
  }

  // ✅ Updated View Function - Redirects to `/contacts/view/[id]`
  const handleview = (id) => {
    router.push(`/contacts/view/${id}`);
  };

  return (
    <>
    <Head>
      <title>
        Contacts
      </title>
    </Head>
    <div className="blogpage">
      <div className="titledashboard flex flex-sb">
        <div>
          <h2>
            All Published <span>contacts</span>
          </h2>
          <h3>ADMIN PANEL</h3>
        </div>
        <div className="breadcrumb">
          <SiBloglovin />
          <span>/</span>
          <span>contacts</span>
        </div>
      </div>

      <div className="blogstable">
        {/* Search Bar */}
        <div className="flex gap-2 mb-1">
          <h2>Search contacts</h2>
          <input
            type="text"
            placeholder="Search by name"
            value={searchquery}
            onChange={(e) => setsearchquery(e.target.value)}
          />
        </div>

        {/* Contact Table */}
        <table className="table table-styling">
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Project</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">
                  <Dataloading />
                </td>
              </tr>
            ) : currentcontacts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No published contacts found
                </td>
              </tr>
            ) : (
              currentcontacts.map((contact, index) => (
                <tr key={contact._id}>
                  <td>{indexoffirstcontact + index + 1}</td>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                  <td>{typeof contact.project[0] === "string" ? contact.project[0] : "No project"}</td>
                  <td>
                    <button
                      className="viewbtn"
                      onClick={() => handleview(contact._id)}
                      disabled={deletingId}
                    >
                      View <FaEye />
                    </button>
                    <button
                      className="deletebtn"
                      onClick={() => handleDelete(contact._id)}
                      disabled={deletingId === contact._id}
                    >
                      {deletingId === contact._id ? "Deleting..." : "Delete"}
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
