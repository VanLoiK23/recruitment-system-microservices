import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import axios from "../../utils/axios.customize";
import { toast } from "react-toastify";
import getInitials from "../get-avatar-name";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useContext(AuthContext);

  const isMini = location.pathname.includes("/recruiter/candidates");

  const menuItems = [
    {
      title: "Overview",
      icon: <LayoutDashboard size={20} />,
      path: "/recruiter/dashboard",
    },
    {
      title: "Recruitment Posting Management",
      icon: <Briefcase size={20} />,
      path: "/recruiter/job-posting",
    },
    {
      title: "Candidate Profile",
      icon: <Users size={20} />,
      path: "/recruiter/candidates",
    },
    {
      title: "Blog Management",
      icon: <FileText size={20} />,
      path: "/recruiter/blogs",
    },
    {
      title: "Setting",
      icon: <Settings size={20} />,
      path: "/recruiter/settings",
    },
  ];

  const handleLogout = async () => {
    if (!auth.isAuthenticated) {
      toast.error("You aren't logged in !");
      return;
    }

    const check = window.confirm("Do you want to logout?");

    if (!check) {
      return;
    }

    try {
      const data = await axios.post("auth/logout");

      if (data) {
        localStorage.removeItem("access_token");

        if (setAuth) {
          setAuth({
            isAuthenticated: false,
            user: null,
          });
        }

        navigate("/");
        toast.success("Logout successfully!");
      }
    } catch (err) {
      toast.error(err.message);
      console.error(`Status code from Backend [${err.code}]:`, err.message);
    }
  };

  return (
    <div
      className={`bg-[#484CA8] font-sans flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ease-in-out shrink-0
        ${isMini ? "w-[80px]" : "w-[260px]"}
      `}
    >
      <div
        className={`flex flex-col items-center pt-8 ${
          isMini ? "px-2" : "px-4"
        }`}
      >
        <button
          type="button"
          onClick={() => navigate("/recruiter/profile")}
          title="Profile"
          className={`rounded-full bg-white/15 text-white font-bold flex items-center justify-center 
          hover:bg-white/25 transition-all focus:outline-none border border-white/30 cursor-pointer shrink-0
          ${isMini ? "w-11 h-11 text-xl" : "w-16 h-16 text-2xl"}
          `}
        >
          {getInitials(auth?.user?.fullName)}
        </button>

        {!isMini && (
          <div className="flex flex-col items-center mt-3 overflow-hidden whitespace-nowrap">
            <div className="text-white font-bold text-lg">
              {auth?.user?.fullName || "Username"}
            </div>
            <span className="text-xs text-white/90 bg-white/15 px-3 py-1 rounded-full mt-1 font-medium border border-white/20">
              Recruiter account
            </span>
          </div>
        )}
      </div>

      <hr
        className={`mx-auto border-white/20 ${
          isMini ? "w-1/2 my-5" : "w-4/5 my-6"
        }`}
      />

      <div
        className={`flex-1 flex flex-col gap-2 overflow-y-auto ${
          isMini ? "px-3" : "px-4"
        }`}
      >
        {menuItems.map((item, index) => {
          const isActive = location.pathname.includes(item.path);

          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              title={isMini ? item.title : ""}
              className={`w-full flex items-center rounded-xl transition-all duration-300 cursor-pointer overflow-hidden
                ${
                  isActive
                    ? `bg-gray-200 text-[#484CA8] shadow-lg font-semibold`
                    : `text-white/80 hover:bg-white/15 hover:text-white`
                }
                ${isMini ? "justify-center p-3" : "gap-4 px-4 py-3"}
              `}
            >
              <div className="shrink-0">{item.icon}</div>
              {!isMini && (
                <span className="text-left leading-tight whitespace-nowrap">
                  {item.title}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        className={`mt-auto pt-4 pb-6 border-t border-white/20 ${
          isMini ? "px-3" : "px-4"
        }`}
      >
        <button
          onClick={handleLogout}
          title={isMini ? "Logout" : ""}
          className={`w-full bg-red-400 flex items-center rounded-xl text-white/80 hover:bg-red-500 hover:text-white transition-all duration-300 overflow-hidden
            ${isMini ? "justify-center p-3" : "gap-4 px-4 py-3"}
          `}
        >
          <div className="shrink-0">
            <LogOut size={20} />
          </div>
          {!isMini && (
            <span className="font-medium whitespace-nowrap">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default SideBar;
