import Link from "next/link";
import { IoHome } from "react-icons/io5";
import { BsPostcard } from "react-icons/bs";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { MdOutlineWorkOutline } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { GrGallery } from "react-icons/gr";
import { BiSolidContact } from "react-icons/bi";
import { IoSettingsSharp } from "react-icons/io5";
import { SessionProvider, signOut } from "next-auth/react";

export default function Aside({ asideOpen, handleAsideOpen }) {
  const router = useRouter();
  const [clicked, setclicked] = useState(false);
  const [activelink, setactivelink] = useState("/");

  function handleClick() {
    setclicked(!clicked);
  }

  function handleLinkClick(link) {
    setactivelink((prevActive) => (prevActive === link ? null : link));
  }

  useEffect(() => {
    setactivelink(router.pathname);
  }, [router.pathname]);

  return (
    <SessionProvider>
      <>
        <aside className={asideOpen ? "asideleft active" : "asideleft"}>
          <ul>
            <Link href="/">
              <li className={activelink === "/" ? "navactive" : ""}>
                <IoHome />
                <span>Dashboard</span>
              </li>
            </Link>

            <li
              className={
                activelink === "/blogs"
                  ? "navactive flex-col flex-left"
                  : "flex-col flex-left"
              }
              onClick={() => handleLinkClick("/blogs")}
            >
              <div className="flex gap-1">
                <BsPostcard />
                <span>Blog</span>
              </div>

              {activelink === "/blogs" && (
                <ul>
                  <Link href="/blogs">
                    <li>All Blogs</li>
                  </Link>
                  <Link href="/blogs/draft">
                    <li>Draft Blogs</li>
                  </Link>
                  <Link href="/blogs/addblog">
                    <li>Add Blogs</li>
                  </Link>
                </ul>
              )}
            </li>

            <li
              className={
                activelink === "/projects"
                  ? "navactive flex-col flex-left"
                  : "flex-col flex-left"
              }
              onClick={() => handleLinkClick("/projects")}
            >
              <div className="flex gap-1">
                <MdOutlineWorkOutline />
                <span>Projects</span>
              </div>

              {activelink === "/projects" && (
                <ul>
                  <Link href="/projects">
                    <li>All Projects</li>
                  </Link>
                  <Link href="/projects/draftprojects">
                    <li>Draft Projects</li>
                  </Link>
                  <Link href="/projects/addproject">
                    <li>Add Projects</li>
                  </Link>
                </ul>
              )}
            </li>
            <li
              className={
                activelink === "/shops"
                  ? "navactive flex-col flex-left"
                  : "flex-col flex-left"
              }
              onClick={() => handleLinkClick("/shops")}
            >
              <div className="flex gap-1">
                <FiShoppingCart />
                <span>Shops</span>
              </div>

              {activelink === "/shops" && (
                <ul>
                  <Link href="/shops">
                    <li>All Products</li>
                  </Link>
                  <Link href="/shops/draftshop">
                    <li>Draft Products</li>
                  </Link>
                  <Link href="/shops/addproduct">
                    <li>Add Products</li>
                  </Link>
                </ul>
              )}
            </li>
            <li
              className={
                activelink === "/gallery"
                  ? "navactive flex-col flex-left"
                  : "flex-col flex-left"
              }
              onClick={() => handleLinkClick("/gallery")}
            >
              <div className="flex gap-1">
                <GrGallery />
                <span>Gallery</span>
              </div>

              {activelink === "/gallery" && (
                <ul>
                  <Link href="/gallery">
                    <li>All Photos</li>
                  </Link>
                  <Link href="/gallery/addphoto">
                    <li>Add Photo</li>
                  </Link>
                </ul>
              )}
            </li>
            <Link href="/contacts">
              <li
                className={activelink === "/contacts" ? "navactive" : ""}
                onClick={() => {
                  handleLinkClick("contacts");
                }}
              >
                <BiSolidContact />
                <span>Contacts</span>
              </li>
            </Link>
            <Link href="/settings">
              <li
                className={activelink === "/settings" ? "navactive" : ""}
                onClick={() => {
                  handleLinkClick("settings");
                }}
              >
                <IoSettingsSharp />
                <span>Settings</span>
              </li>
            </Link>
          </ul>
          <button
            className="logoutbtn"
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          >
            {" "}
            Logout
          </button>
        </aside>
      </>
    </SessionProvider>
  );
}
