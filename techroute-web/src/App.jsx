import { useState, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "./components/context/auth.context";
import NavBar from "./components/header";
import Footer from "./components/footer";
import CircleLoading from "./components/animation/animate-loading";
import SideBar from "./components/recruiter/sidebar";

export default function App() {
  const { auth, isAppLoading } = useContext(AuthContext);
  const location = useLocation();

  const isCandidatePage = location.pathname.includes("/recruiter/candidates");

  const isRecruiterPage = location.pathname.startsWith("/recruiter");
  const isAdminPage = location.pathname.startsWith("/admin");

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
      (isRecruiterPage || isAdminPage) ? (
        <div
          className={`grid min-h-screen
        ${isCandidatePage ? "grid-cols-[80px_1fr]" : "grid-cols-[260px_1fr]"}
        `}
        >
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
