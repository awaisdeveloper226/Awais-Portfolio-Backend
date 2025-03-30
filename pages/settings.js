import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineAccountCircle } from "react-icons/md";
import { signOut } from "next-auth/react";
import Head from "next/head";

export default function Setting() {
  return (
    <>
    <Head>
      <title>
        Settings
      </title>
    </Head>
      <div className="settingpage">
        <div className="titledashboard flex flex-sb">
          <div>
            <h2>
              Admin <span>Setting</span>
            </h2>
            <h3>Admin Panel</h3>
          </div>
          <div className="breadcrumb">
            <IoSettingsOutline />
            <span>/</span>
            <span>Setting</span>
          </div>
        </div>

        <div className="profilesettings">
          <div className="leftprofile_details flex">
            <img src="/img/coder.png" alt="" />
            <div className="w-100 margin-left">
              <div className="flex flex-sb flex-left mt-2">
                <h2>My Profile:</h2>
                <h3>
                  Muhammad Awais <br />
                  Web Developer
                </h3>
              </div>
              <div className="flex flex-sb mt-2">
                <h3>Phone</h3>
                <input type="text" defaultValue={"+92-123456789"} />
              </div>
              <div className="mt-2">
                <input type="email" defaultValue={"youremail@gmail.com"} />
              </div>
              <div className="flex flex-center w-100 mt-2">
                <button>Save</button>
              </div>
            </div>
          </div>
          <div className="rightlogoutsec">
            <div className="topaccoutnbox">
              <h2 className="flex flex-sb">
                My Account <MdOutlineAccountCircle />
              </h2>
              <hr />
              <div className="flex flex-sb mt-1">
                <h3>
                  Active Account <br /> <span>Email</span>
                </h3>
                <button
                  onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
