import axios from "../../utils/axios.customize";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const [disable, setDisable] = useState(false);

  const [roleActive, setRoleActive] = useState("candidate");

  const navigate = useNavigate();

  //handle logic Login
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
      const data = await axios.post("auth/login", userInfo);

      if (data) {
        localStorage.setItem("access_token", data.accessToken);
      }

      toast.success("Login successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
      console.error(`Status code from Backend [${err.code}]:`, err.message);
    }
  };

  useEffect(() => {
    setUserInfo(sessionStorage.getItem("userInfo"));
  }, []);

  //handle logic Sign up
  const handleChangeEmail = async (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      setDisable(false);
      return;
    } else if (!emailRegex.test(email)) {
      setDisable(false);
      return;
    }
    try {
      const data = await axios.post("auth/check-duplicate-email", { email });

      if (data.isDuplicate) {
        toast.warn("Email has already exist. Try again !");
        setDisable(true);
      }
    } catch (err) {
      toast.error(err.message);
      console.error(`Status code from Backend [${err.code}]:`, err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!userInfo.email) {
      toast.warn("Email is required");
      return;
    }
    if (!userInfo.password) {
      toast.warn("Password is required");
      return;
    }

    if (userInfo.password.length < 6) {
      toast.warn("Length of Password must be greater than 5");
      return;
    }

    try {
      // const data = await axios.post("auth/confirm-email", userInfo);

      // if (data) {
      //   toast.success("Please check your email to get the 6-digit OTP code!");

      //   sessionStorage.setItem("userInfo", userInfo);

      //   navigate("/confirm-email");
      // }
      sessionStorage.setItem("userInfo", userInfo);

      navigate("/confirm-email");
    } catch (err) {
      toast.error(err.message);
      console.error(`Status code from Backend [${err.code}]:`, err.message);
    }
  };
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-white p-6 font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div
          className={`hidden md:block rounded-xl md:shrink-0
          ${true ? "md:hover:translate-x-100" : ""}
          `}
        >
          <img
            className="w-full max-w-lg object-contain"
            src="../../public/imgs/login-register.jpg"
            alt="Image recruitment login"
          />
        </div>

        {/* Login Form */}
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
                className="w-full bg-[#D0EBFF] p-3.5 rounded-[10px] outline-none text-sm text-gray-800 placeholder-gray-400"
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
                className="w-full bg-[#D0EBFF] p-3.5 rounded-[10px] outline-none text-sm text-gray-800 placeholder-gray-400"
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
              <a
                href="/forgot-password"
                className="cursor-pointer text-[#FF0000] "
              >
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
                <a href="register" className="cursor-pointer text-[#00C3FF]">
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Sign Up Form */}
        <div className="hidden w-full max-w-md mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-bold text-[#00C3FF] text-center mb-8">
            Signup
          </h1>
          <div className="block md:hidden rounded-xl md:shrink-0">
            <img
              className="w-85 h-35"
              src="../../public/imgs/login-register.jpg"
              alt="Image recruitment login"
            />
          </div>
          <form onSubmit={handleRegister} className="w-full flex flex-col">
            <div className="flex flex-row gap-10 justify-start text-gray-400 text-[13px] mb-6 mt-6 md:mt-auto relative w-fit font-sans select-none text-left">
              <div
                onClick={() => setRoleActive("candidate")}
                className={`text-center w-16 pb-3 hover:text-[#0048ff] transition-all duration-300 cursor-pointer ${
                  roleActive === "candidate" ? "font-bold text-[#00C3FF]" : ""
                }`}
              >
                Talent
              </div>

              <div
                onClick={() => setRoleActive("recruiter")}
                className={`text-center w-16 pb-3 hover:text-[#0048ff] transition-all duration-300 cursor-pointer ${
                  roleActive === "recruiter" ? "font-bold text-[#00C3FF]" : ""
                }`}
              >
                Employer
              </div>

              <div
                className={`absolute bottom-0 h-[3px] bg-[#00C3FF] rounded-full transition-all duration-300 ease-out-back ${
                  roleActive === "candidate"
                    ? "w-12 translate-x-2"
                    : "w-16 translate-x-[102px]"
                }`}
              />
            </div>
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
                onChange={(e) => {
                  setUserInfo({ ...userInfo, email: e.target.value });
                  handleChangeEmail(e.target.value);
                }}
                placeholder="Email Address"
                className="w-full bg-[#D0EBFF] p-3.5 rounded-[10px] outline-none text-sm text-gray-800 placeholder-gray-400"
              />
            </div>
            <div className="flex flex-col mb-6 text-left">
              <label
                htmlFor="password"
                className="text-xs font-bold text-gray-700 mb-1.5"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={(e) => {
                  setUserInfo({ ...userInfo, password: e.target.value });
                }}
                placeholder="Password"
                className="w-full bg-[#D0EBFF] p-3.5 rounded-[10px] outline-none text-sm text-gray-800 placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={disable}
              className={`w-full text-white py-3.5 rounded-[10px] font-semibold text-base transition-colors mb-6 shadow-sm bg-[#00B2FF] hover:bg-[#0092d1]
                ${
                  !disable ? "cursor-pointer " : "cursor-not-allowed opacity-45"
                }`}
            >
              Signup
            </button>
            <div className="flex items-center my-2 mb-6">
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
                Already have an account?&nbsp;
                <a href="/login" className="cursor-pointer text-[#00C3FF]">
                  Login
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
