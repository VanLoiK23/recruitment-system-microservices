const BackButton = ({ onBack }) => {
  return (
    <button
      className="flex items-center justify-center hover:scale-105 focus:outline-none"
      onClick={onBack}
    >
      <svg
        className="w-5 h-5 text-gray-650 transition-transform duration-200 hover:-translate-x-1 active:scale-95 cursor-pointer select-none"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://w3.org"
      >
        <path
          d="M19 12H5M5 12L12 19M5 12L12 5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default BackButton;
