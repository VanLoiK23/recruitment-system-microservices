import CloseButton from "../../components/button/button-close";

const InfoRegisterSuccessfully = ({clickLogin,onClose}) => {
  return (
    <div onClick={onClose} className="fixed inset-0 flex justify-center items-center bg-transparent font-sans z-50 animate-in fade-in duration-200">
      <div className="relative w-full max-w-[500px] mx-auto bg-white flex flex-col items-center gap-5 p-4 md:p-6 rounded-[11px] border-gray-200 border shadow-[0_0_24px_rgba(0,0,0,0.06)] font-sans">
        <div className="absolute top-[15px] right-[5px]">
          <CloseButton onClose={onClose} />
        </div>
        <svg
          className="w-20 h-18 transition-transform duration-200 hover:scale-110 select-none"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://w3.org"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="#00C3FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="48 8"
          />

          <path
            d="M8 12L11 15L16 9"
            stroke="#22C55E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="text-xl text-[#00B2FF] font-semibold text-center">
          Your account has been successfully created.
        </div>
        <ul className="ml-4 text-sm list-disc pl-6 space-y-3.5 text-gray-650 text-left font-sans font-normal leading-relaxed">
          <li className="marker:text-[#00B2FF] transition-all duration-200 hover:translate-x-1 cursor-default">
            You're now ready to search and apply for your next opportunity.
          </li>

          <li className="marker:text-[#00B2FF] transition-all duration-200 hover:translate-x-1 cursor-default">
            Set up your profile to get matched with the best jobs.
          </li>

          <li className="marker:text-[#00B2FF] transition-all duration-200 hover:translate-x-1 cursor-default">
            Don’t forget to upload your resume and portfolio!
          </li>
        </ul>
        <button onClick={clickLogin} className="bg-[#00B2FF] rounded-xl px-25 py-3 font-bold cursor-pointer opacity-85 text-white hover:scale-101 hover:opacity-100">
          Login Now
        </button>
      </div>
    </div>
  );
};

export default InfoRegisterSuccessfully;
