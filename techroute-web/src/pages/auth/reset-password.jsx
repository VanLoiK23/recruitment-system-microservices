import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios.customize";
import { toast } from "react-toastify";
import BackButton from "../../components/button-back";
import CircleLoading from "../../components/animate-loading";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.warn("Password at least 6 character");
      return;
    }

    if (password !== confirm) {
      toast.warn("Password and Password confirmation do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await axios.post("/auth/reset-password", {
        token,
        password,
      });

      if (data.success) {
        toast.success("Change password successfully!");
        navigate("/login");
      } else {
        toast.warn("Change password failed!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Token is invalid or has expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-white p-6 font-sans">
      <div className="relative flex flex-col justify-center items-center gap-5 border p-17 md:px-28 scale-65 sm:scale-100 rounded-[11px] border-gray-200 shadow-[0_0_24px_rgba(0,0,0,0.06)]">
        <div className="absolute top-[15px] left-[15px]">
          <BackButton
            onBack={() => {
              navigate("/login");
            }}
          />
        </div>
        <div className="font-bold text-3xl text-[#00C3FF]">Reset Password</div>
        <div className=" text-gray-500 text-xm text-center">Type your new password</div>

        <form onSubmit={handleSubmit} className="w-[140%] flex flex-col gap-4 items-center justify-center">
          <input
            type="password"
            placeholder="Your new Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#D0EBFF] p-3.5 rounded-[10px] outline-none text-sm text-gray-800 placeholder-gray-400"
            required
          />

          <input
            type="password"
            placeholder="Confirm your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full bg-[#D0EBFF] p-3.5 rounded-[10px] outline-none text-sm text-gray-800 placeholder-gray-400"
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`flex gap-5 items-center justify-center w-[50%] text-white py-2 rounded-[10px] font-semibold text-base transition-colors mb-6 shadow-sm bg-[#00B2FF] hover:bg-[#0092d1]
                ${
                  !isLoading
                    ? "cursor-pointer "
                    : "cursor-not-allowed opacity-45"
                }`}
          >
            {isLoading ? (
              <>
                <CircleLoading />
                <span>In progress ...</span>
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

export default ResetPasswordPage;
