import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

const useAuth = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return auth;
};

export default useAuth;
