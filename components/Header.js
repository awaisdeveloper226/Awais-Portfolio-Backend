import { RiBarChartHorizontalLine } from "react-icons/ri";
import { BiExitFullscreen } from "react-icons/bi";
import { GoScreenFull } from "react-icons/go";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react"; // Import useSession to check session status
import { SessionProvider } from "next-auth/react";

export default function Header({ handleAsideOpen }) {
  const [isFullScreen, setisFullScreen] = useState(false);
  const { status } = useSession(); // Get session status (loading, authenticated, or unauthenticated)

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setisFullScreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setisFullScreen(false);
      });
    }
  };

  // Don't render the header if the user is not authenticated
  if (status === "loading" || status === "unauthenticated") {
    return null; // You can show a loading screen or redirect to sign-in page here if necessary
  }

  return (
    <SessionProvider>
      <header className="header flex flex-sb">
        <div className="logo flex gap-2">
          <Link href="/">
            <h1>ADMIN</h1>
          </Link>
          <div className="headerham flex flex-center" onClick={handleAsideOpen}>
            <RiBarChartHorizontalLine />
          </div>
        </div>
        <div className="rightnav flex gap-2">
          <div onClick={toggleFullScreen}>
            {isFullScreen ? <BiExitFullscreen /> : <GoScreenFull />}
          </div>
          <div className="notification">
            <img src="/img/notification.png" alt="Notification" />
          </div>
          <div className="profilenav">
            <img src="/img/user.png" alt="user" />
          </div>
        </div>
      </header>
    </SessionProvider>
  );
}
