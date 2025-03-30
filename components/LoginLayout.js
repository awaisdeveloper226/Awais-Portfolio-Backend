import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [status]); // Only runs when `status` changes

  if (status === "loading") {
    return (
      <div className="full-h flex flex-center">
        <div className="loading-bar">Loading...</div>
      </div>
    );
  }

  return session ? <>{children}</> : null;
}
