import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "./context/auth.context";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../utils/axios.customize";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsOpen(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  const handleLogout = async () => {
    const check = window.confirm("Do you want to logout ?");

    if (!check) {
      return;
    }
    try {
      const data = await axios.post("auth/logout");

      if (data) {
        localStorage.removeItem("access_token");
        if (setAuth) {
          setAuth({ isAuthenticated: false, user: null });
        }
        setIsOpen(false);
        navigate("/");
        toast.success("Logout successfully!");
      }
    } catch (err) {
      toast.error(err.message);
      console.error(`Status code from Backend [${err.code}]:`, err.message);
    }
  };

  const navLinkStyle = ({ isActive }) =>
    isActive
      ? "text-[#5B5FC7] font-bold border-b-2 border-[#5B5FC7] pb-1 transition-all"
      : "text-gray-600 hover:text-[#5B5FC7] font-medium transition-colors pb-1";

  return (
    <nav className="w-full p-6 bg-white pb-4 px-auto md:px-14 border-b border-gray-100 font-sans flex items-center justify-between">
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="h-8 w-8 flex items-center justify-center text-white font-bold text-sm rounded-[11px] bg-[#5B5FC7]">
          T
        </div>
        <span className="text-[#5B5FC7] text-xl font-bold">Techroute</span>
      </div>

      <div className="hidden min-[650px]:flex items-center gap-7 md:gap-20">
        <div className="hidden min-[650px]:flex items-center gap-x-12 text-sm font-medium">
          <NavLink to="/" className={navLinkStyle}>
            All Jobs
          </NavLink>

          <NavLink to="/create-cv" className={navLinkStyle}>
            CV Builder
          </NavLink>

          <NavLink to="/blog" className={navLinkStyle}>
            Tech Blog
          </NavLink>
        </div>

        <div className="relative" ref={dropdownRef}>
          {auth?.isAuthenticated ? (
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-full bg-[#5B5FC7]/10 text-[#5B5FC7] font-bold flex items-center justify-center hover:bg-[#5B5FC7]/20 transition-all focus:outline-none border border-[#5B5FC7]/20 cursor-pointer"
            >
              {auth?.user?.fullName
                ? auth.user.fullName.charAt(0).toUpperCase()
                : "U"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#5B5FC7] hover:bg-[#4C50B6] rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Sign In
            </button>
          )}

          {isOpen && auth?.isAuthenticated && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {auth?.user?.email || "user@techroute.com"}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/candidate/profile#profile");
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/candidate/profile#job-management");
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Applied Job
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/candidate/profile#my-cv");
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                CV Upload
              </button>

              <div className="border-t border-gray-100 my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative min-[650px]:hidden" ref={dropdownRef}>
        {auth?.isAuthenticated ? (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 rounded-full bg-[#5B5FC7]/10 text-[#5B5FC7] font-bold flex items-center justify-center hover:bg-[#5B5FC7]/20 transition-all focus:outline-none border border-[#5B5FC7]/20 cursor-pointer"
          >
            {auth?.user?.fullName
              ? auth.user.fullName.charAt(0).toUpperCase()
              : "U"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/auth")}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#5B5FC7] hover:bg-[#4C50B6] rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            Sign In
          </button>
        )}

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
            {auth.isAuthenticated && (
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {auth?.user?.email || "user@techroute.com"}
                </p>
              </div>
            )}
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/blog");
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Blog & News
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/create-cv");
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              CV Builder
            </button>
            {auth.isAuthenticated && (
              <>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/candidate/profile#profile");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/candidate/profile#job-management");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Applied Job
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/candidate/profile#my-cv");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  CV Upload
                </button>
              </>
            )}

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={() => {
                if (auth.isAuthenticated) {
                  handleLogout();
                } else {
                  navigate("/auth");
                }
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              {auth.isAuthenticated ? "Sign Out" : "Sign In"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
