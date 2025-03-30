import Head from "next/head";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Dataloading from "@/components/Dataloading";
import { BsPostcard } from "react-icons/bs";
import ProjectComponent from "@/components/Project";

export default function Editproject() {
  const router = useRouter();
  const { id } = router.query;
  const projectId = id;

  const [project, setproject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchproject = async () => {
      try {
        if (!projectId) return;

        const res = await axios.get(`/api/projects?id=${projectId}`, {
          signal: abortController.signal,
        });

        if (res.data) {
          setproject(res.data);
        } else {
          throw new Error("project not found");
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

    fetchproject();

    return () => abortController.abort();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(`/api/projects`, {
        ...project,
        _id: projectId,
      });
      if (res.status === 200) {
        router.push("/projects");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update project");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setproject((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) return <Dataloading />;

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  if (!project)
    return <div className="p-4 text-gray-500">project not found</div>;

  return (
    <>
      <Head>
        <title>Edit project</title>
      </Head>

      <div className="blogpage">
        <div className="titledashboard flex flex-sb">
          <div
            className="
        "
          >
            <h2>
              Edit <span>{project?.title}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <BsPostcard /> <span>/</span> <span>Edit project</span>
          </div>
        </div>

        <div className="mt-3">
          {project && <ProjectComponent {...project} />}
        </div>
      </div>
    </>
  );
}
