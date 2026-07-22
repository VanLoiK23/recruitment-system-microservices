import React from "react";

const ExperiencePanel = ({ selectedExperience, onChange }) => {
  const experienceLevels = [
    "Intern",
    "Fresher",
    "Junior",
    "Middle",
    "Senior",
    "Assistant Team Leader",
    "Leader",
    "Deputy Manager",
    "Manager",
    "Deputy Director",
    "Director",
    "All Levels"
  ];

  return (
    <div className="absolute top-full left-30 mt-2 min-w-[220px] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-4 z-50 flex flex-col gap-3.5 max-h-[350px] overflow-y-auto">
      {experienceLevels.map((level, index) => (
        <label 
          key={index} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="radio"
            name="experienceGroup"
            className="w-4 h-4 text-blue-600 border-gray-400 focus:ring-blue-500 cursor-pointer"
            checked={selectedExperience === level}
            onChange={() => onChange(level)}
          />
          <span className="text-[#333333] font-semibold text-[15px] select-none group-hover:text-blue-600 transition-colors">
            {level}
          </span>
        </label>
      ))}
    </div>
  );
};

export default ExperiencePanel;