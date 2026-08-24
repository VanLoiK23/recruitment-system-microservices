import React, { useEffect, useState } from "react";
import getInitials from "../../components/get-avatar-name";
import { toast } from "react-toastify";
import axios from "axios";

const RecruiterProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "Huỳnh Văn Lợi",
    role: "Senior IT Recruiter",
    company: "TechCore Solutions",
    email: "loihv.23ite@vku.udn.vn",
    phone: "0905 123 456",
    location: "Da Nang, Vietnam",
    about:
      "Dedicated to sourcing and acquiring top-tier software engineering talents (Java Spring, React, Node.js) for high-tech product development. Passionate about enhancing candidate experience and optimizing recruitment pipelines through automation and AI-driven screening.",
    avatarColor: "#5D5CDE",
    stats: {
      totalJobs: 24,
      activeJobs: 4,
      totalCandidates: 856,
      hired: 42,
    },
  });

  const [activeJobs, setActiveJobs] = useState([
    {
      id: 1,
      title: "Backend Java Developer (Spring Boot)",
      location: "Da Nang (Hybrid)",
      candidates: 32,
      status: "Hiring",
    },
    {
      id: 2,
      title: "Frontend React Developer",
      location: "Da Nang (Onsite)",
      candidates: 21,
      status: "Hiring",
    },
    {
      id: 3,
      title: "Data Engineer",
      location: "Remote",
      candidates: 14,
      status: "Closing Soon",
    },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await axios.get("profile/recruiter");

        if (data) {
          setProfile(data);
        }
      } catch (err) {
        console.log(err.messages);
        toast.error(err.messages);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F6FC] text-[#1B1A2E] font-['Be_Vietnam_Pro',sans-serif] antialiased p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(44,42,130,0.06)] overflow-hidden mb-6">
          <div className="h-40 bg-gradient-to-r from-[#5D5CDE] via-[#D946EF] to-[#C026C8] relative">
            <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm px-4 py-2 rounded-lg font-['Sora'] text-xs font-semibold transition-colors">
              Change Cover
            </button>
          </div>

          <div className="px-8 pb-8 relative">
            <div className="flex justify-between items-end mb-4">
              <div className="relative -mt-16 flex items-end gap-5">
                <div
                  className="w-32 h-32 rounded-2xl flex items-center justify-center font-['Sora'] font-bold text-4xl text-white border-4 border-white shadow-lg shrink-0"
                  style={{ backgroundColor: profile.avatarColor }}
                >
                  {getInitials(profile.fullName)}
                </div>
                <div className="mb-2">
                  <h1 className="font-['Sora'] text-2xl font-bold text-[#1B1A2E]">
                    {profile.fullName}
                  </h1>
                  <div className="text-[14px] text-[#6B6980] mt-1 font-medium">
                    {profile.role} at{" "}
                    <span className="text-[#5D5CDE] font-semibold">
                      {profile.company}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-2 flex gap-3">
                <button className="font-['Sora'] text-[13px] font-bold text-[#38364F] bg-white border border-[#E7E5F3] px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                  Share Profile
                </button>
                <button className="font-['Sora'] text-[13px] font-bold text-white bg-gradient-to-br from-[#5D5CDE] to-[#4338CA] px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-sm">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(44,42,130,0.06)] border border-[#E7E5F3] p-6">
              <h3 className="font-['Sora'] text-[14px] font-bold uppercase tracking-wide text-[#A6A4B8] mb-4">
                Contact Information
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F5F4FF] flex items-center justify-center text-[#5D5CDE] shrink-0">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[11px] text-[#6B6980]">
                      Email Address
                    </div>
                    <div className="text-[13px] font-semibold text-[#1B1A2E] truncate">
                      {profile.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F5F4FF] flex items-center justify-center text-[#5D5CDE] shrink-0">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#6B6980]">
                      Phone Number
                    </div>
                    <div className="text-[13px] font-semibold text-[#1B1A2E]">
                      {profile.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F5F4FF] flex items-center justify-center text-[#5D5CDE] shrink-0">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#6B6980]">Location</div>
                    <div className="text-[13px] font-semibold text-[#1B1A2E]">
                      {profile.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(44,42,130,0.06)] border border-[#E7E5F3] p-6">
              <h3 className="font-['Sora'] text-[14px] font-bold uppercase tracking-wide text-[#A6A4B8] mb-4">
                Recruitment Performance
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F7F6FC] rounded-xl p-4 border border-[#E7E5F3]">
                  <div className="font-['Sora'] text-2xl font-bold text-[#5D5CDE]">
                    {profile.stats.totalCandidates}
                  </div>
                  <div className="text-[11.5px] text-[#6B6980] mt-1">
                    Total Candidates
                  </div>
                </div>
                <div className="bg-[#E4F7EF] rounded-xl p-4 border border-[#B3E8CD]">
                  <div className="font-['Sora'] text-2xl font-bold text-[#1C9A6C]">
                    {profile.stats.hired}
                  </div>
                  <div className="text-[11.5px] text-[#1C9A6C] font-medium mt-1">
                    Hired Candidates
                  </div>
                </div>
                <div className="bg-[#F7F6FC] rounded-xl p-4 border border-[#E7E5F3]">
                  <div className="font-['Sora'] text-2xl font-bold text-[#1B1A2E]">
                    {profile.stats.totalJobs}
                  </div>
                  <div className="text-[11.5px] text-[#6B6980] mt-1">
                    Total Campaigns
                  </div>
                </div>
                <div className="bg-[#FCF1DC] rounded-xl p-4 border border-[#F3DDA6]">
                  <div className="font-['Sora'] text-2xl font-bold text-[#C9820A]">
                    {profile.stats.activeJobs}
                  </div>
                  <div className="text-[11.5px] text-[#C9820A] font-medium mt-1">
                    Active Campaigns
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(44,42,130,0.06)] border border-[#E7E5F3] p-7">
              <h3 className="font-['Sora'] text-[16px] font-bold text-[#1B1A2E] mb-3">
                About Me
              </h3>
              <p className="text-[13.5px] text-[#38364F] leading-relaxed">
                {profile.about}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(44,42,130,0.06)] border border-[#E7E5F3] p-7">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-['Sora'] text-[16px] font-bold text-[#1B1A2E]">
                  Active Campaigns
                </h3>
                <button className="text-[12.5px] font-semibold text-[#5D5CDE] hover:text-[#4338CA]">
                  View All →
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {activeJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-[#E7E5F3] hover:bg-[#F5F4FF] hover:border-[#EBEAFD] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#EBEAFD] flex items-center justify-center text-[#5D5CDE]">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            width="20"
                            height="14"
                            x="2"
                            y="7"
                            rx="2"
                            ry="2"
                          />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-['Sora'] font-semibold text-[14px] text-[#1B1A2E] group-hover:text-[#5D5CDE] transition-colors">
                          {job.title}
                        </div>
                        <div className="text-[12px] text-[#6B6980] mt-0.5">
                          {job.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-['Sora'] font-bold text-[15px] text-[#1B1A2E]">
                          {job.candidates}
                        </div>
                        <div className="text-[11px] text-[#A6A4B8]">
                          Applicants
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#E4F7EF] text-[#1C9A6C]">
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;
