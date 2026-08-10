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

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useContext(AuthContext);

  const menuItems = [
    {
      title: "Overview",
      icon: <LayoutDashboard size={20} />,
      path: "/recruiter/dashboard",
    },
    {
      title: "Recruitment Posting Management",
      icon: <Briefcase size={20} />,
      path: "/job-posting",
    },
    {
      title: "Hồ sơ ứng viên",
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
    <div className="w-[260px]  bg-[#484CA8] font-sans flex flex-col shadow-2xl col-span-1 overflow-hidden">
      <div className="flex flex-col items-center pt-8 px-4">
        <button
          type="button"
          onClick={() => navigate("/recruiter/profile")}
          className="w-16 h-16 rounded-full bg-white/15 text-white text-2xl font-bold flex items-center justify-center 
          hover:bg-white/25 transition-all focus:outline-none border border-white/30 cursor-pointer"
        >
          {auth?.user?.fullName
            ? auth.user.fullName.charAt(0).toUpperCase()
            : "U"}
        </button>

        <div className="flex flex-col items-center mt-3">
          <div className="text-white font-bold text-lg">
            {auth?.user?.fullName || "Username"}
          </div>

          <span className="text-xs text-white/90 bg-white/15 px-3 py-1 rounded-full mt-1 font-medium border border-white/20">
            Recruiter account
          </span>
        </div>
      </div>

      <hr className="w-4/5 mx-auto border-white/20 my-6" />

      <div className="flex-1 flex flex-col gap-2 px-4 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = location.pathname.includes(item.path);

          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer
                ${
                  isActive
                    ? `bg-gray-200 text-[#484CA8] shadow-lg font-semibold`
                    : `text-white/80 hover:bg-white/15 hover:text-white`
                }
              `}
            >
              {item.icon}
              <span className="text-left leading-tight">{item.title}</span>
            </button>
          );
        })}
      </div>

      <div className="px-4 mt-auto pt-4 pb-6 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full bg-red-400 flex items-center gap-4 px-4 py-3 rounded-xl text-white/80 hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <LogOut size={20} />

          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
