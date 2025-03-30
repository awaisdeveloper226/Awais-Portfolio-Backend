import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import ParentComponent from "@/components/ParentComponent";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const [AsideOpen, setAsideOpen] = useState(false);

  const AsideClickOpen = () => {
    setAsideOpen(!AsideOpen);
  };

  return (
    <SessionProvider session={pageProps.session}>
      <>
        <ParentComponent appOpen={AsideOpen} appAsideOpen={AsideClickOpen} />
        <main>
          <div className={AsideOpen ? "container" : "container active"}>
            <Component {...pageProps} />
          </div>
        </main>
      </>
    </SessionProvider>
  );
}
