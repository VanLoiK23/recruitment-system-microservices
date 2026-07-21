import { useState,useContext } from "react";
import { Outlet, useLocation, Navigate,useNavigate } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import pageTitle from "./components/Page_Title";
import { AuthContext } from "./components/context/auth.context"; 
import NavBar from "./components/header";
import Footer from "./components/footer";
import CircleLoading from "./components/animate-loading";

export default function App() {
  const { auth, setAuth, isAppLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname?.split("/")[2] || "/student/dashboard";

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    setAuth({
        isAuthenticated: false,
        user: { email: "", role: ""}
    });
    navigate("/auth"); 
  };

  if (isAppLoading) {
    return <div className="flex items-center justify-center scale-110"><CircleLoading/> </div>;
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

        <Footer />
      </div>
    </div>
  );
}