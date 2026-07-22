import React from "react";

const WorkTypePanel = ({ selectedType, onChange }) => {
  const workTypes = ["In Office", "Remote", "Hybrid", "Oversea"];

  return (
    <div className="absolute top-full left-70 mt-2 min-w-[180px] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-4 z-50 flex flex-col gap-3.5">
      {workTypes.map((type, index) => (
        <label
          key={index}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="radio"
            name="workTypeGroup" 
            className="w-4 h-4 text-blue-600 border-gray-400 focus:ring-blue-500 cursor-pointer"
            checked={selectedType === type}
            onChange={() => onChange(type)}
          />
          <span className="text-[#333333] font-semibold text-[15px] select-none group-hover:text-blue-600 transition-colors">
            {type}
          </span>
        </label>
      ))}
    </div>
  );
};

export default WorkTypePanel;
