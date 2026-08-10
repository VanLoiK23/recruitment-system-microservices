import React, { useState } from "react";

export default function EmailManagementTab() {
  const [preferences, setPreferences] = useState({
    latestJobs: true,
    expiringJobs: true,
    jobsBySkills: true,
    techEventsAndBlogs: true,
  });

  const handleCheckboxChange = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email Preferences Saved:", preferences);
  };

  const newsletterOptions = [
    { id: "latestJobs", label: "Update list of latest IT Jobs" },
    { id: "expiringJobs", label: "Update IT jobs that are about to expire" },
    { id: "jobsBySkills", label: "Update attractive jobs by skills" },
    { id: "techEventsAndBlogs", label: "Early bird new Tech-events and Tech-blogs" },
  ];

  return (
    <div className="w-full bg-[#5B5FC7]/[0.03] p-6 rounded-xl border border-[#5B5FC7]/15 shadow-sm">
      <div className="mb-4">
        <h2 className="text-[#5B5FC7] font-bold text-lg tracking-tight mb-1">
          Newsletters preferred to receive
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          A personalized email experience, ensuring you never miss critical news while keeping your inbox clutter-free
        </p>
      </div>

      <hr className="border-[#5B5FC7]/15 mb-5" />

      <form onSubmit={handleSubmit}>
        <div className="space-y-3.5 mb-6">
          {newsletterOptions.map((option) => (
            <label
              key={option.id}
              htmlFor={option.id}
              className="flex items-center gap-3 cursor-pointer select-none group w-fit"
            >
              <input
                type="checkbox"
                id={option.id}
                checked={preferences[option.id]}
                onChange={() => handleCheckboxChange(option.id)}
                className="w-4 h-4 text-[#5B5FC7] bg-white border-slate-300 rounded focus:ring-2 focus:ring-[#5B5FC7]/30 accent-[#5B5FC7] cursor-pointer transition-all"
              />
              <span className={`
                 text-sm font-medium group-hover:text-[#5B5FC7] transition-colors
                ${preferences[option.id]?"text-[#5B5FC7]":"text-slate-700"}
                `}>
                {option.label}
              </span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="cursor-pointer px-5 py-2.5 bg-[#5B5FC7] hover:bg-[#4C50B6] active:bg-[#3F429B] text-white font-medium text-sm rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5B5FC7]/40"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}