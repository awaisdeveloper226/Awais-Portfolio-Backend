import Head from "next/head";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Dataloading from "@/components/Dataloading";
import { BsPostcard } from "react-icons/bs";
import Product from "@/components/Shop";

export default function Editproduct() {
  const router = useRouter();
  const { id } = router.query;
  const productId = id;

  const [product, setproduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchproduct = async () => {
      try {
        if (!productId) return;

        const res = await axios.get(`/api/shops?id=${productId}`, {
          signal: abortController.signal,
        });

        if (res.data) {
          setproduct(res.data);
        } else {
          throw new Error("product not found");
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

    fetchproduct();

    return () => abortController.abort();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(`/api/shops`, { ...product, _id: productId });
      if (res.status === 200) {
        router.push("/shops");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update product");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setproduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) return <Dataloading />;

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  if (!product)
    return <div className="p-4 text-gray-500">product not found</div>;

  return (
    <>
      <Head>
        <title>Edit product</title>
      </Head>

      <div className="blogpage">
        <div className="titledashboard flex flex-sb">
          <div
            className="
        "
          >
            <h2>
              Edit <span>{product?.title}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <BsPostcard /> <span>/</span> <span>Edit product</span>
          </div>
        </div>

        <div className="mt-3">{product && <Product {...product} />}</div>
      </div>
    </>
  );
}
