import axios from "../utils/axios.customize";
import { useState } from "react";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userInfo.email) {
      toast.warn("Email is required");
      return;
    }
    if (!userInfo.password) {
      toast.warn("Password is required");
      return;
    }

    try {
      const data = await axios.post("/auth/login", userInfo);

      if (data) {
        localStorage.setItem("access_token", data.accessToken);
        localStorage.setItem("refresh_token", data.refreshToken);
      }

      toast.success("Login successfully!");
    } catch (err) {
      toast.error(err.message);
      console.error(`Status code from Backend [${err.code}]:`, err.message);
    }
  };
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-white p-6 font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="hidden md:block rounded-xl md:shrink-0">
          <img
            className="w-full max-w-lg object-contain"
            src="../../public/imgs/login-register.jpg"
            alt="Image recruitment login"
          />
        </div>
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-bold text-[#00C3FF] text-center mb-8">
            Login
          </h1>
          <div className="block md:hidden rounded-xl md:shrink-0">
            <img
              className="w-85 h-35"
              src="../../public/imgs/login-register.jpg"
              alt="Image recruitment login"
            />
          </div>
          <form onSubmit={handleLogin} className="w-full flex flex-col">
            <div className="flex flex-col mb-4 text-left">
              <label
                htmlFor="email"
                className="text-xs font-bold text-gray-700 mb-1.5"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={(e) => {
                  setUserInfo({ ...userInfo, email: e.target.value });
                }}
                className="w-full bg-[#FFF0FA] p-3.5 rounded-[10px] outline-none text-sm text-gray-800 placeholder-gray-400"
              />
            </div>
            <div className="flex flex-col mb-4 text-left">
              <label
                htmlFor="password"
                className="text-xs font-bold text-gray-700 mb-1.5"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={(e) => {
                  setUserInfo({ ...userInfo, password: e.target.value });
                }}
                className="w-full bg-[#FFF0FA] p-3.5 rounded-[10px] outline-none text-sm text-gray-800 placeholder-gray-400"
              />
            </div>
            <div className="flex justify-between items-center text-xs mb-6">
              <div className="flex flex-row gap-2">
                <label className="flex items-center gap-2 text-gray-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="remember"
                    className="accent-[#00B2FF]"
                  />
                  Remember me
                </label>
              </div>
              <a href="" className="cursor-pointer text-[#FF0000] ">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-[#00B2FF] hover:bg-[#0092d1] text-white py-3.5 rounded-[10px] font-semibold text-base transition-colors mb-4 shadow-sm cursor-pointer"
            >
              Login
            </button>
            <div className="flex items-center my-2 mb-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 px-3 whitespace-nowrap">
                or continue with
              </span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <button className="w-full bg-white hover:bg-[#f5f5f5] text-black py-3.5 rounded-[10px] font-semibold text-base transition-colors mb-6 shadow-sm cursor-pointer">
              <div className="flex justify-center items-center gap-3">
                <img
                  src="../../public/imgs/google-icon.png"
                  className="w-3 h-3.5"
                  alt=""
                />
                Google
              </div>
            </button>
            <div className="w-full flex flex-col items-center text-xs">
              <p>
                Don’t have an account?&nbsp;
                <a href="" className="cursor-pointer text-[#00C3FF]">
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
