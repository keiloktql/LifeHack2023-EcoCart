/* eslint-disable no-unused-vars */
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import "@/styles/globals.css";
import ErrorBoundary from "@/components/pages/ErrorBoundary";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { SUPABASE_CONFIG } from "@/config/constants";
import AuthProvider from "@/context/AuthContext";
import AuthGuard from "@/utility/auth/AuthGuard";
import { useRouter } from "next/router";
import { isProtectedRouteCheck } from "@/utility/auth/AuthUtils";

export default function App({ Component, pageProps }) {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({
      supabaseUrl: SUPABASE_CONFIG.url,
      supabaseKey: SUPABASE_CONFIG.anonKey
    })
  );

  const router = useRouter();
  const isProtectedRoute = isProtectedRouteCheck(router.pathname);

  return (
    <ErrorBoundary>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <AuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          {isProtectedRoute ? (
            <AuthGuard>
              <Component {...pageProps} />
            </AuthGuard>
          ) : (
            <Component {...pageProps} />
          )}
        </AuthProvider>
      </SessionContextProvider>
    </ErrorBoundary>
  );
}
