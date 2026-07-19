import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoRegisterSuccessfully from "./info-register-success";
import { toast } from "react-toastify";
import axios from "../../utils/axios.customize";
import CircleLoading from "../../components/animate-loading";
import BackButton from "../../components/button-back";

const ConfirmEmailPage = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(new Array(6).fill(""));

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "",
  });

  const inputRefs = useRef([]);

  const [showPopup, setShowPopUp] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const [isResend, setResend] = useState(false);

  useEffect(() => {
    const rawData = sessionStorage.getItem("userInfo");

    if (rawData) {
      try {
        const parseObject = JSON.parse(rawData);

        setUserInfo(parseObject);
      } catch (error) {
        navigate("/register", { replace: true });
        console.error("Lỗi giải mã JSON từ sessionStorage:", err);
      }
    } else {
      // navigate("/register", { replace: true });
    }
  }, []);

  const handleChange = (element, index) => {
    const value = element.value;

    if (isNaN(value)) return false;

    let newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);

    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      !otp[index] &&
      index > 0 &&
      (e.key === "Backspace" || e.key === "Delete")
    ) {
      inputRefs.current[index - 1].focus();
    }

    if (otp[index] && index == 5 && e.key === "Enter") {
      onSubmit();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e, index) => {
    if (index != 0) {
      return;
    }

    const pastedData = e.clipboardData.getData("text");

    const cleanNumbers = pastedData.replace(/[^0-9]/g, "");

    if (cleanNumbers > 0) {
      let newOtp = [...otp];

      for (let i = 0; i < 6; i++) {
        if (cleanNumbers[i]) {
          newOtp[i] = cleanNumbers[i];
        }
      }

      setOtp(newOtp);

      const focusIndex = Math.min(cleanNumbers.length - 1, 5);

      inputRefs.current[focusIndex].focus();

      e.preventDefault();
    }
  };

  const handleReSend = async () => {
    setLoading(true);
    setResend(true);
    try {
      const data = await axios.post("auth/send-otp-check-email", userInfo);

      if (data.isSuccess) {
        toast.success("Please check your email to get the 6-digit OTP code!");
      }
    } catch (err) {
      toast.error(err.message);
      console.error(`Status code from Backend [${err.code}]:`, err.message);
    } finally {
      setLoading(false);
      setResend(false);
    }
  };

  const onSubmit = async () => {
    // alert(`You OTP is ${otp.join("")}`);
    // setShowPopUp(true);

    if (otp.includes("") || otp.join("").length < 6) {
      toast.warn("Please enter the full 6-digit OTP code before submitting!");
      return;
    }

    setLoading(true);
    try {
      const verifyData = await axios.post("auth/verify-otp", {
        email: userInfo.email,
        otp: otp.join(""), // Ghép mảng 6 ô vuông thành chuỗi "123456"
      });

      if (verifyData.success) {
        const data = await axios.post("auth/register", userInfo);

        if (data) {
          toast.success("Sign up successfully!");

          sessionStorage.removeItem("userInfo");
          setShowPopUp(true);
        }
      } else {
        toast.warn("The OTP code is invalid or has expired");
      }
    } catch (err) {
      toast.error(err.message);
      console.error(`Status code from Backend [${err.code}]:`, err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center w-full bg-white p-6 font-sans">
      <div
        className={`w-full h-full z-40 absolute inset-0 transition-opacity duration-200
        ${showPopup ? "bg-gray-500 opacity-40  block" : "bg-transparent hidden"}
        `}
        // onClick={() => {
        //   setShowPopUp(false);
        // }}
      ></div>
      {showPopup && (
        <InfoRegisterSuccessfully
          clickLogin={() => {
            navigate("/login");
          }}
          onClose={() => {
            setShowPopUp(false);
            navigate("/login");
          }}
        />
      )}
      <div className="relative flex flex-col justify-center items-center gap-6 border p-20 md:p-28 scale-65 sm:scale-100 rounded-[11px] border-gray-200 shadow-[0_0_24px_rgba(0,0,0,0.06)] z-0">
        <div className="absolute top-[15px] left-[15px]">
          <BackButton
            onBack={() => {
              navigate(-1);
            }}
          />
        </div>
        <div className="font-bold text-3xl text-[#00C3FF]">
          Verify your identity
        </div>
        <div className="text-xm text-center">
          Please enter the 6-digit code sent to your email
        </div>
        <div className="flex items-center justify-center gap-1 md:gap-5 cursor-pointer">
          {otp.map((data, index) => (
            <input
              type="text"
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              onChange={(e) => {
                handleChange(e.target, index);
              }}
              onKeyDown={(e) => {
                handleKeyDown(e, index);
              }}
              onPaste={(e) => {
                handlePaste(e, index);
              }}
              name="otp"
              maxLength={1}
              value={data}
              className={`w-14 h-14 bg-[#D0EBFF] text-[#5B5FC7] text-center text-xl font-bold rounded-xl border outline-none transition-all duration-200 shadow-xs
                                ${
                                  otp[index] || index === 0
                                    ? "border-[#00C3FF]"
                                    : "border-transparent"
                                }
                                focus:border-[#00C3FF] focus:bg-white focus:scale-105`}
            />
          ))}
        </div>
        <div className="text-xs flex gap-1 items-center">
          Didn’t Receive Code
          <span
            onClick={() => handleReSend()}
            disabled={isLoading}
            className={`flex gap-2 items-center ml-1 text-[9px] decoration-1 underline
              ${
                isLoading
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-[#00B2FF] cursor-pointer"
              }
              `}
          >
            {isLoading && isResend ? (
              <>
                <CircleLoading />
                <span>Sending OTP...</span>
              </>
            ) : (
              <span>Resend Code</span>
            )}
          </span>
        </div>
        <button
          onClick={() => onSubmit()}
          disabled={isLoading}
          className={`flex gap-5 items-center px-25 py-3 cursor-pointer bg-[#00B2FF] font-bold text-xm rounded-2xl text-white transition-all duration-200 
          ${
            isLoading
              ? "opacity-70 cursor-not-allowed"
              : "hover:scale-[1.01] hover:opacity-100 active:scale-95 cursor-pointer"
          }`}
        >
          {isLoading && !isResend ? (
            <>
              <CircleLoading />
              <span>Verify OTP...</span>
            </>
          ) : (
            <span>Next</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
