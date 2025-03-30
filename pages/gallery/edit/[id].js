import Head from "next/head";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Dataloading from "@/components/Dataloading";
import { BsPostcard } from "react-icons/bs";
import PhotoComponent from "@/components/photo";

export default function Editphoto() {
  const router = useRouter();
  const { id } = router.query;
  const photoId = id;

  const [photo, setphoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchphoto = async () => {
      try {
        if (!photoId) return;

        const res = await axios.get(`/api/photos?id=${photoId}`, {
          signal: abortController.signal,
        });

        if (res.data) {
          setphoto(res.data);
        } else {
          throw new Error("photo not found");
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

    fetchphoto();

    return () => abortController.abort();
  }, [photoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(`/api/photos`, {
        ...photo,
        _id: photoId,
      });
      if (res.status === 200) {
        router.push("/gallery");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update photo");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setphoto((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) return <Dataloading />;

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  if (!photo) return <div className="p-4 text-gray-500">photo not found</div>;

  return (
    <>
      <Head>
        <title>Edit photo</title>
      </Head>

      <div className="blogpage">
        <div className="titledashboard flex flex-sb">
          <div
            className="
        "
          >
            <h2>
              Edit <span>{photo?.title}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <BsPostcard /> <span>/</span> <span>Edit photo</span>
          </div>
        </div>

        <div className="mt-3">{photo && <PhotoComponent {...photo} />}</div>
      </div>
    </>
  );
}
