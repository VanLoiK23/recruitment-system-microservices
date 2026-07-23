import { MapPin, Heart } from "lucide-react";
import { useState } from "react";

const JobCard = ({ job, onClickDetail, onClickJobActive }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="w-full bg-white p-3 rounded-xl border border-[#2F00FF] hover:scale-102 hover:opacity-70 cursor-pointer hover:bg-[#5b5ec725] z-0">
      <div className="font-bold font-idiqlat mb-3" onClick={onClickDetail}>
        {job.title}
      </div>
      <div onClick={onClickJobActive}>
        <div className="text-gray-500 text-xs flex flex-row flex-wrap items-center gap-1.5 mb-3">
          <span>
            ${job.minSalary?.toLocaleString()} - $
            {job.maxSalary?.toLocaleString()} / month
          </span>

          <span className="w-1 h-1 rounded-full bg-gray-400" />

          <span>{job.jobLevel} Level</span>

          <span className="w-1 h-1 rounded-full bg-gray-400" />

          <span className="capitalize">{job?.workType || "Full-time"}</span>
        </div>
        <div className="font-[Inter] mb-3">{job.description}</div>
        <div className="flex flex-row items-center justify-between mb-3">
          <div className="flex flex-row items-center flex-wrap max-w-[70%] gap-2">
            {job.technologies.map((tech) => (
              <div className="p-2 rounded-2xl bg-[#FDF4FF] text-gray-500 text-xs">
                {tech}
              </div>
            ))}
          </div>
          <div className="flex flex-row items-center justify-center font-[Inter] shrink-0 whitespace-nowrap pt-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            &nbsp; {job.location}
          </div>
        </div>
        <div className="w-[90%] border mx-auto my-0 border-gray-400 mb-6"></div>
      </div>
      <div className="w-[90%] mx-auto my-0 flex flex-row items-center justify-between z-10">
        <div className="text-gray-500 text-xs">{job.createdAt}</div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="w-5 h-5 rounded-full bg-[#EFEFEF] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none select-none"
        >
          <Heart
            className={`w-3 h-3 transition-colors duration-200 ${
              isFavorite
                ? "text-[#5B5FC7] fill-[#5B5FC7]"
                : "text-gray-500 fill-transparent"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default JobCard;
