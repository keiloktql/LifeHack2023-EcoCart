import React, { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const AuthGuard = ({ children }) => {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth) {
      if (auth.event === "SIGNED_OUT") {
        router.push("/");
        toast.success("Signed out!");
      } else if (!auth.loading && !auth.userInfo) {
        router.push("/login");
      }
    }
  }, [auth]);

  // show loading indicator while the auth provider is still loading
  if (auth?.loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24">
          <path
            className="opacity-30"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  // if auth loaded with a valid user, show protected page
  if (!auth?.loading && auth?.userInfo) {
    return <>{children}</>;
  }

  // otherwise don't return anything, will do a redirect from useEffect
  return null;
};

export default AuthGuard;
