import { useState,useContext } from "react";
import { Outlet, useLocation, Navigate,useNavigate } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import pageTitle from "./components/Page_Title";
import { AuthContext } from "./components/context/auth.context"; 
import NavBar from "./components/header";

export default function App() {
  const { auth, setAuth, isAppLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname?.split("/")[2] || "/student/dashboard";

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setAuth({
        isAuthenticated: false,
        user: { email: "", role: ""}
    });
    navigate("/login"); 
  };

  if (isAppLoading) {
    return <div className="flex items-center justify-center">Đang tải dữ liệu hệ thống...</div>;
  }

  if (!auth.user || !auth.user.email) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app">
      {/* Sidebar: Truyền role và user từ Context xuống */}
      {/* <Sidebar 
        role={auth.user.role} 
        active={currentPath} 
        user={auth.user} 
        onLogout={handleLogout} 
      /> */}

      <div className="main-content">
        <NavBar />

        <main className="page-content">
          <Outlet context={{ auth }} />
        </main>
      </div>
    </div>
  );
}