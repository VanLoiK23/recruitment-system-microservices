import React, { useState } from "react";
import { MapPin, Clock, Heart } from "lucide-react";

function JobDetailCard({ job, isDetail }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="flex flex-col justify-center w-full bg-white p-4 rounded-xl border border-[#2F00FF]/30">
      <div className="font-bold text-xl text-gray-900 mb-2">
        {job?.title || "Senior Java Backend Engineer"}
      </div>
      <div className="text-gray-500 text-xs flex flex-row items-center gap-1.5 mb-3">
        <span>
          ${job?.minSalary?.toLocaleString()} - $
          {job?.maxSalary?.toLocaleString()} / month
        </span>
        <span className="w-1 h-1 rounded-full bg-gray-400" />
        <span>{job?.jobLevel || "Senior"} Level</span>
        <span className="w-1 h-1 rounded-full bg-gray-400" />
        <span>Full-time</span>
      </div>
      <div className="flex flex-row items-center justify-between text-xs text-gray-600 mb-4">
        <div className="flex flex-row items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span>{job?.location || "Ha Noi City"}</span>
        </div>
        <div className="flex flex-row items-center gap-1 text-gray-400 bg-gray-50 py-1 px-2.5 rounded-[7px] border border-gray-100">
          <Clock className="w-3.5 h-3.5 text-gray-500 stroke-2" />
          <span>Application deadline: {job?.createdAt || "25-07-2026"}</span>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-2 pt-1">
        <div className="flex flex-row flex-wrap max-w-[70%] items-center gap-2">
          {(job?.technologies || ["Java", "Spring Boot"]).map((tech, index) => (
            <div
              key={index}
              className={`py-1 px-3 rounded-full text-xs font-medium border
                ${
                  isDetail
                    ? "text-gray-500 bg-gray-100 border-transparent"
                    : "text-purple-600 bg-[#FDF4FF] border-purple-50"
                }
                `}
            >
              {tech}
            </div>
          ))}
        </div>

        <div className="flex flex-row items-center gap-2 shrink-0 whitespace-nowrap pt-1">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-8 h-8 rounded-full bg-[#EFEFEF] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${
                isFavorite
                  ? "text-[#5B5FC7] fill-[#5B5FC7]"
                  : "text-gray-500 fill-transparent"
              }`}
            />
          </button>
          <button className="h-9 px-6 rounded-xl bg-[#1677FF] text-white text-xs font-bold transition-all duration-200 hover:scale-105 hover:bg-[#1631ff] active:scale-95 cursor-pointer uppercase tracking-wider">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobDetailCard;
