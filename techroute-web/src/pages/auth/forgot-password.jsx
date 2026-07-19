import axios from "../../utils/axios.customize";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircleLoading from "../../components/animate-loading";
import { toast } from "react-toastify";
import BackButton from "../../components/button-back";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if(!email){
      toast.warn("Email is required");
      return;
    }

    setLoading(true);
    try {
      const data = await axios.post("auth/forgot-password", { email });
      if (data.success) {
        toast.success("Send email success, Pls check for reset.");
        navigate("/auth");
      }else{
        toast.warn("Send email failed. Try again !")
      }
    } catch (err) {
      toast.error(err.message);
      console.error(`Status code from Backend [${err.code}]:`, err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-white p-6 font-sans">
      <div className="relative flex flex-col justify-center items-center gap-5 border p-12 md:p-24 scale-65 sm:scale-100 rounded-[11px] border-gray-200 shadow-[0_0_24px_rgba(0,0,0,0.06)]">
        <div className="absolute top-[15px] left-[15px]">
          <BackButton
            onBack={() => {
              navigate("/login");
            }}
          />
        </div>
        <h1 className="text-3xl font-bold text-[#00C3FF] text-center -mt-10">
          Forgot your password ?
        </h1>
        <span className="text-gray-500 text-xm">Type your email for reset</span>
        <form onSubmit={handleReset} className="w-full flex flex-col items-center justify-center gap-5">
          <input
            type="email"
            placeholder="Type your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#D0EBFF] p-3.5 rounded-[10px] outline-none text-sm text-gray-800 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`flex gap-5 justify-center items-center w-[50%] py-2 cursor-pointer bg-[#00B2FF] font-bold text-xm rounded-2xl text-white transition-all duration-200 
          ${
            isLoading
              ? "opacity-70 cursor-not-allowed"
              : "hover:scale-[1.01] hover:opacity-100 active:scale-95 cursor-pointer"
          }`}
          >
            {isLoading ? (
              <>
                <CircleLoading />
                <span>Sending Email...</span>
              </>
            ) : (
              <span>Submit</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
