import { useState, useEffect } from "react";
import Head from "next/head";
import { Bar } from "react-chartjs-2";
import Loading from "@/components/Loading";
import { IoHome } from "react-icons/io5";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blogdata, setBlogData] = useState([]);
  const [projectdata, setProjectData] = useState([]);
  const [shopdata, setShopData] = useState([]);
  const [gallerydata, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login page if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    const fetchData = async () => {
      try {
        const blogresponse = await fetch("/api/blogs");
        if (!blogresponse.ok) throw new Error("Failed to fetch blogs");
        const blogdata = await blogresponse.json(); // Fixed: Use the correct variable name
        setBlogData(blogdata);

        const projectresponse = await fetch("/api/projects"); // Corrected: Use the appropriate API endpoint for projects
        if (!projectresponse.ok) throw new Error("Failed to fetch projects");
        const projectdata = await projectresponse.json(); // Fixed: Use the correct variable name
        setProjectData(projectdata); // Assuming you have state `setProjectData`

        const shopresponse = await fetch("/api/shops"); // Corrected: Use the appropriate API endpoint for shops
        if (!shopresponse.ok) throw new Error("Failed to fetch shops");
        const shopdata = await shopresponse.json(); // Fixed: Use the correct variable name
        setShopData(shopdata); // Assuming you have state `setShopData`

        const galleryresponse = await fetch("/api/photos"); // Corrected: Use the appropriate API endpoint for gallery
        if (!galleryresponse.ok) throw new Error("Failed to fetch photos");
        const gallerydata = await galleryresponse.json(); // Fixed: Use the correct variable name
        setGalleryData(gallerydata); // Assuming you have state `setGalleryData`
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchData();
    }
  }, [status, router]);

  if (loading) return <Loading />;
  if (!blogdata.length) return <p>No blogs available.</p>;

  const publishedBlogs = blogdata.filter(
    (blog) => blog.status === "published"
  ).length;
  const publishedProjects = projectdata.filter(
    (blog) => blog.status === "published"
  ).length;
  const publishedProducts = shopdata.filter(
    (blog) => blog.status === "published"
  ).length;
  const publishedPhotos = gallerydata.length;

  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = blogdata.reduce((acc, blog) => {
    if (blog.status !== "published") return acc;
    const year = new Date(blog.createdAt).getFullYear();
    const month = new Date(blog.createdAt).getMonth();
    if (!acc[year]) acc[year] = Array(12).fill(0);
    acc[year][month] += 1;
    return acc;
  }, {});

  const datasets = Object.keys(monthlyData).map((year) => ({
    label: `${year}`,
    data: monthlyData[year] || Array(12).fill(0),
    backgroundColor: `rgba(${Math.floor(Math.random() * 200)}, ${Math.floor(
      Math.random() * 200
    )}, ${Math.floor(Math.random() * 200)}, 0.7)`,
  }));

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Blogs Created Monthly Per Year" },
    },
    scales: { y: { beginAtZero: true } },
  };

  // Count blogs by category dynamically and limit to 4 categories
  const categoryCounts = blogdata.reduce((acc, blog) => {
    if (blog.blogcategory) {
      blog.blogcategory.forEach((category) => {
        acc[category] = (acc[category] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <>
      <Head>
        <title>Portfolio Backend</title>
        <meta name="description" content="Blog website backend" />
      </Head>

      <div className="dashboard">
        <div className="titledashboard flex flex-sb">
          <div>
            <h2>
              Admin <span>Dashboard</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <IoHome />
            <span>/</span>
            <span>Dashboard</span>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="topfourcards flex justify-evenly">
          <div className="four_card">
            <Link href="/blogs">
              <h2>Total Blogs</h2>
              <span>{publishedBlogs}</span>
            </Link>
          </div>
          <div className="four_card">
            <Link href="/projects">
              <h2>Total Projects</h2>
              <span>{publishedProjects}</span>
            </Link>
          </div>
          <div className="four_card">
            <Link href="/shops">
              <h2>Total Products</h2>
              <span>{publishedProducts}</span>
            </Link>
          </div>
          <div className="four_card">
            <Link href="/gallery">
              <h2>Gallery Photos</h2>
              <span>{publishedPhotos}</span>
            </Link>
          </div>
        </div>

        <div className="year_overview flex flex-sb">
          <div className="leftyearoverview">
            <div className="flex flex-sb">
              <h3>Year Overview</h3>
              <ul className="creative-dots">
                <li className="big-dot"></li>
                <li className="semi-big-dot"></li>
                <li className="medium-dot"></li>
                <li className="semi-medium-dot"></li>
                <li className="semi-small-dot"></li>
                <li className="small-dot"></li>
              </ul>
              <h3 className="text-right">
                {publishedBlogs} / 365 <br /> <span>Total Published</span>
              </h3>
            </div>
            <Bar options={options} data={{ labels, datasets }} />
          </div>

          <div className="right_salescont">
            <div>
              <h3>Blogs By Category</h3>
              <ul className="creative-dots">
                <li className="big-dot"></li>
                <li className="semi-big-dot"></li>
                <li className="medium-dot"></li>
                <li className="semi-medium-dot"></li>
                <li className="semi-small-dot"></li>
                <li className="small-dot"></li>
              </ul>
            </div>

            <div className="blogscategory flex flex-center">
              <table>
                <thead>
                  <tr>
                    <td>Category</td>
                    <td>Count</td>
                  </tr>
                </thead>
                <tbody>
                  {topCategories.map(([category, count]) => (
                    <tr key={category}>
                      <td>{category}</td>
                      <td>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
