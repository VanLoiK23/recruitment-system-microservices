import { useState, useContext } from "react";
import { Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "./components/context/auth.context";
import NavBar from "./components/header";
import Footer from "./components/footer";
import CircleLoading from "./components/animation/animate-loading";
import SideBar from "./components/recruiter/sidebar";

export default function App() {
  const { auth, isAppLoading } = useContext(AuthContext);
  const location = useLocation();

  const currentPath = location.pathname?.split("/")[1] || "";

  console.log(currentPath);

  if (isAppLoading) {
    return (
      <div className="flex items-center justify-center scale-110">
        <CircleLoading />
      </div>
    );
  }

  return (
    <div className="app">
      {auth.isAuthenticated &&
      auth?.user?.role !== "candidate" &&
      (currentPath.includes("recruiter") || currentPath.includes("admin")) ? (
        <div className="grid grid-cols-[260px_1fr] min-h-screen">
          <SideBar />
          <main className="page-content ">
            <Outlet context={{ auth }} />
          </main>
        </div>
      ) : (
        <div className="main-content">
          <NavBar />

          <main className="page-content">
            <Outlet context={{ auth }} />
          </main>

          <Footer />
        </div>
      )}
    </div>
  );
}
