import { SiBloglovin } from "react-icons/si";
import Blog from "@/components/Blog";
import Head from "next/head";
export default function addblog() {
  return (
    <>
    <Head>
      <title>Add Blog</title>
    </Head>
      <div className="addblogspage">
        <div className="titledashboard flex flex-sb">
          <div>
            <h2>
              Add <span>Blog</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <SiBloglovin />
            <span>/</span>
            <span>Add Blog</span>
          </div>
        </div>
        <div className="blogsadd">
          <Blog />
        </div>
      </div>
    </>
  );
}
