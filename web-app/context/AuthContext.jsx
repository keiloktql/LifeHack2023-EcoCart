import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    loading: true,
    event: null,
    userInfo: null
  });

  // On initial load, check if user info is loaded
  useEffect(() => {
    (async () => {
      let newUserInfo = null;
      try {
        setAuth((prevVal) => ({ ...prevVal, loading: true }));
        const res = await fetch("/api/userinfo", { credentials: "include" });
        const data = await res.json();
        const weirdNaming = "myinfo.name";
        if (data) {
          newUserInfo = {
            uniqueId: data.sub,
            name: data.userInfo[weirdNaming]
          };
        }
      } catch (error) {
        console.log(error);
      } finally {
        setAuth((prevVal) => ({
          ...prevVal,
          userInfo: newUserInfo,
          loading: false
        }));
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
