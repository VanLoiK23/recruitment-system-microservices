import React, { useContext, useEffect, useState } from "react";
import { MapPin, Clock, Heart } from "lucide-react";
import { AuthContext } from "../context/auth.context";
import axios from "../../utils/axios.customize";
import { toast } from "react-toastify";
function JobDetailCard({
  job,
  isDetail,
  onClickDetail,
  redirectLogin,
  saveJob,
  onApply,
  apply,
}) {
  const { auth } = useContext(AuthContext);
  const isFavorite = job.isSaved ?? false;
  const isApply = job.isApplied ?? false;

  // useEffect(() => {
  //   const checkedApply = async () => {
  //     try {
  //       const data = await axios.get(
  //         `applications/check-apply?jobId=${job.id}`
  //       );

  //       if (data) {
  //         setIsApply(data.isApply);
  //       }
  //     } catch (err) {
  //       toast.error(err.message);
  //       console.error(`Status code from Backend [${err.code}]:`, err.message);
  //     }
  //   };

  //   if (job && auth.isAuthenticated) {
  //     checkedApply();
  //   }
  // }, [job, apply]);

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
    <div className="flex flex-col justify-center w-full bg-white p-4 rounded-xl border border-[#2F00FF]/30">
      <div
        onClick={onClickDetail}
        className="font-bold text-xl text-gray-900 mb-2 cursor-pointer"
      >
        {job?.title || "Senior Java Backend Engineer"}
      </div>
      <div className="text-gray-500 text-xs flex flex-row items-center gap-1.5 mb-3">
        {auth.isAuthenticated ? (
          <span>
            ${job?.minSalary?.toLocaleString()} - $
            {job?.maxSalary?.toLocaleString()} / month
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
        <span>{job?.jobLevel || "Senior"} Level</span>
        <span className="w-1 h-1 rounded-full bg-gray-400" />
        <span className="capitalize">{job?.workType || "Full-time"}</span>
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
        <div className="flex flex-row flex-wrap max-w-[70%] items-center gap-2 cursor-pointer">
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
            onClick={() => {
              saveJob(job.id);
            }}
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
          {isApply ? (
            <div className="text-sm text-[#5B5FC7] font-bold">
              You have applied for this job
            </div>
          ) : (
            <button
              onClick={onApply}
              className="h-9 px-6 rounded-xl bg-[#1677FF] text-white text-xs font-bold transition-all duration-200 hover:scale-105 hover:bg-[#1631ff] active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetailCard;
