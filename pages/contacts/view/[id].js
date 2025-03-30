import { useRouter } from "next/router";
import useFetchData from "@/hooks/useFetchData";
import Head from "next/head";
import Dataloading from "@/components/Dataloading";
import {
  FaArrowLeft,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaDollarSign,
  FaFileAlt,
  FaProjectDiagram,
} from "react-icons/fa";

export default function ContactView() {
  const router = useRouter();
  const { id } = router.query;

  const { alldata: contact, loading } = useFetchData(`/api/contacts?id=${id}`);

  return (
    <>
    <Head>
      <title>
        View Contact
      </title>
    </Head>
    <div className="contact-container">
      <div className="contact-card">
        {/* Back Button */}
        <button onClick={() => router.back()} className="back-button">
          <FaArrowLeft className="icon" /> Go Back
        </button>

        {/* Loading State */}
        {loading ? (
          <Dataloading />
        ) : contact ? (
          <div className="contact-content">
            {/* Contact Name */}
            <h2 className="contact-name">
              {contact.name} {contact.lname}
            </h2>
            <p className="contact-subtitle">Contact Details</p>

            {/* Contact Info */}
            <div className="contact-info">
              <div className="info-item">
                <FaEnvelope className="icon email" />
                <span>{contact.email || "N/A"}</span>
              </div>

              <div className="info-item">
                <FaPhone className="icon phone" />
                <span>{contact.phone || "N/A"}</span>
              </div>

              {contact.company && (
                <div className="info-item">
                  <FaBuilding className="icon company" />
                  <span>{contact.company}</span>
                </div>
              )}

              {contact.country && (
                <div className="info-item">
                  <FaGlobe className="icon country" />
                  <span>{contact.country}</span>
                </div>
              )}

              {contact.price && (
                <div className="info-item">
                  <FaDollarSign className="icon price" />
                  <span>{contact.price}</span>
                </div>
              )}

              {contact.description && (
                <div className="info-item">
                  <FaFileAlt className="icon description" />
                  <span style={{ wordBreak: "break-word" }}>
                    {contact.description}
                  </span>
                </div>
              )}

              <div className="info-item">
                <FaProjectDiagram className="icon project" />
                <span>
                  {contact.project && contact.project.length > 0
                    ? contact.project.join(", ")
                    : "No Project"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="no-contact">No contact found.</p>
        )}
      </div>
    </div>
        </>
  );
}
