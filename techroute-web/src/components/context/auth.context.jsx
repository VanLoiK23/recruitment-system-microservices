import { createContext, useState, useEffect } from "react";
import instance from "../../utils/axios.customize";

export const AuthContext = createContext({
  auth: {
    isAuthenticated: false,
    user: { email: "", role: "", fullName: "" },
  },
  setAuth: () => {},
  isAppLoading: true,
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: { email: "", role: "", fullName: "" },
  });
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const data = await instance.get("auth/account");
          if (data) {
            setAuth({
              isAuthenticated: true,
              user: data.user,
            });
          }
        } catch (error) {
            console.log(error);
            localStorage.removeItem("access_token");
        }
      }
      setIsAppLoading(false);
    };
    fetchAccount();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isAppLoading }}>
      {props.children}
    </AuthContext.Provider>
  );
};
