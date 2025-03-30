import PhotoComponent from "@/components/photo";
import { SiBloglovin } from "react-icons/si";
import Head from "next/head";

export default function AddPhoto1() {
  return (
    <>
    <Head>
      <title>
        Add Photo
      </title>
    </Head>
      <div className="addblogspage">
        <div className="titledashboard flex flex-sb">
          <div>
            <h2>
              Add <span>Photo</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <SiBloglovin />
            <span>/</span>
            <span>Add Photo</span>
          </div>
        </div>
        <div className="blogsadd">
          <PhotoComponent />
        </div>
      </div>
    </>
  );
}
