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
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              isActive
                ? "text-[#8A2BE2] font-semibold"
                : "text-gray-500 hover:text-gray-800 transition-colors"
            }
          >
            Blog & News
          </NavLink>
          <NavLink
            to="/create-cv"
            className={({ isActive }) =>
              isActive
                ? "text-[#8A2BE2] font-semibold"
                : "text-gray-500 hover:text-gray-800 transition-colors"
            }
          >
            CV Builder
          </NavLink>
          {auth.isAuthenticated && (
            <NavLink
              to="/my-applications"
              className={({ isActive }) =>
                isActive
                  ? "text-[#8A2BE2] font-semibold"
                  : "text-gray-500 hover:text-gray-800 transition-colors"
              }
            >
              My Applications
            </NavLink>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              if (!auth?.isAuthenticated) {
                navigate("/auth");
              } else {
                setIsOpen(!isOpen);
              }
            }}
            className="cursor-pointer w-9 h-9 rounded-full bg-[#007AFF] flex items-center justify-center text-white hover:opacity-90 transition-opacity focus:outline-none"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>

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
                  navigate("/profile#profile");
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/saved-jobs");
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Saved Jobs
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
        <button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className="w-9 h-9 rounded-full bg-[#007AFF] flex items-center justify-center text-white hover:opacity-90 transition-opacity focus:outline-none"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>

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
                    navigate("/my-applications");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  My Applications
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/profile#profile");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  My Profile
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
