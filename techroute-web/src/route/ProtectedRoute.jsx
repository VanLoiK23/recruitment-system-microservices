import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import CircleLoading from "../components/animation/animate-loading";

const ProtectedRoute = () => {
  const { auth, isAppLoading } = useContext(AuthContext);

  if (isAppLoading) return <div className="flex items-center justify-center"><CircleLoading /></div>;

  if (!auth?.isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;