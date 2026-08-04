import { MapPin, Heart, Flame } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/context/auth.context";
import { redirect } from "react-router-dom";
import axios from "../../utils/axios.customize";
import { toast } from "react-toastify";

const JobCard = ({
  job,
  onClickDetail,
  onClickJobActive,
  saveJob,
  redirectLogin,
  isActive,
}) => {
  const [isFavorite, setIsFavorite] = useState(job.isSaved ?? false);
  const { auth } = useContext(AuthContext);

  // useEffect(() => {
  //   const checkJobSave = async () => {
  //     try {
  //       const data = await axios.get(`jobs/${job.id}/is-saved`);

  //       if (data) {
  //         setIsFavorite(data.isSaved);
  //       }
  //     } catch (err) {
  //       toast.error(err.message);
  //       console.error(`Status code from Backend [${err.code}]:`, err.message);
  //     }
  //   };

  //   if (job && auth.isAuthenticated) {
  //     checkJobSave();
  //   }
  // }, [job]);

  return (
    <div
      className={`relative w-full p-3.5 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-[1.02] z-0 ${
        job?.hotJob
          ? `border-red-600 shadow-sm shadow-red-100 ${
              isActive ? "bg-red-100/80" : "bg-red-50/50 hover:bg-red-100/60"
            }`
          : `border-[#2F00FF] ${
              isActive ? "bg-[#5b5ec725]" : "bg-white hover:bg-[#5b5ec725]"
            }`
      }`}
    >
      {job?.hotJob && (
        <div className="absolute -top-2.5 right-3 flex items-center gap-1 py-0.5 px-2.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-bold border border-red-200 uppercase tracking-wider shadow-md animate-pulse">
          <Flame className="w-3 h-3 fill-yellow-300 stroke-yellow-300" />
          <span>Hot Job</span>
        </div>
      )}
      <div className="font-bold font-idiqlat mb-3" onClick={onClickDetail}>
        {job.title}
      </div>
      <div onClick={onClickJobActive}>
        <div className="text-gray-500 text-xs flex flex-row flex-wrap items-center gap-1.5 mb-3">
          {auth.isAuthenticated ? (
            <span>
              ${job.minSalary?.toLocaleString()} - $
              {job.maxSalary?.toLocaleString()} / month
            </span>
          ) : (
            <button
              className="py-1 px-2 rounded-3xl cursor-pointer text-blue-600"
              onClick={redirectLogin}
            >
              Login to view Salary
            </button>
          )}

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
            saveJob(job.id);
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
