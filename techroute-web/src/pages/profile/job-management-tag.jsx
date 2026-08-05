import axios from "../../utils/axios.customize";
import React, { useEffect, useState } from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiActivity,
  FiEye,
  FiBookmark,
  FiCheckCircle,
  FiExternalLink,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const JobManagementTag = () => {
  const [activeSubTab, setActiveSubTab] = useState("applied");

  const navigate = useNavigate();

  const [jobData, setJobData] = useState({});

  const [previous, setPrevious] = useState(false);
  const [pageActive, setPageActive] = useState(1);
  const [limit, setLimit] = useState(5);
  const [next, setNext] = useState(false);

  const subTabs = [
    {
      id: "applied",
      label: "Applied Jobs",
      icon: <FiCheckCircle className="w-4 h-4" />,
    },
    {
      id: "saved",
      label: "Saved Jobs",
      icon: <FiBookmark className="w-4 h-4" />,
    },
    { id: "viewed", label: "Viewed Jobs", icon: <FiEye className="w-4 h-4" /> },
  ];

  const mockData = {
    applied: [
      {
        id: 1,
        title: "Java Developer",
        createdAt: "23-07-2026",
        status: "Reviewing",
      },
      {
        id: 2,
        title: "Senior ReactJS Engineer",
        createdAt: "15-07-2026",
        status: "Interview",
      },
      {
        id: 3,
        title: "Fullstack Developer (Java/React)",
        createdAt: "01-07-2026",
        status: "Rejected",
      },
    ],
    saved: [
      {
        id: 3,
        title: "Fullstack Developer (Java/React)",
        createdAt: "01-07-2026",
        status: "Rejected",
      },
    ],
    viewed: [
      {
        id: 6,
        title: "Java Backend Developer",
        createdAt: "02-08-2026",
        status: "Open",
      },
      {
        id: 7,
        title: "Senior .NET / C# Backend",
        createdAt: "10-07-2026",
        status: "Open",
      },
    ],
  };

  useEffect(() => {
    const fetchJob = async () => {
      const urlFetch = `jobs/${activeSubTab}`;
      
      try {
        const data = await axios.get(urlFetch);

        if (data) {
          console.log(data);
          setJobData({[activeSubTab]: data.content });
          setPrevious(!data?.first);
          setNext(!data?.last);
        }
      } catch (err) {
        toast.error(err.message);
        console.error(`Status code from Backend [${err.code}]:`, err.message);
      }
    };
    fetchJob();
  }, [activeSubTab, pageActive]);

  const deleteJobSaved = async (jobId) => {
    const check = window.confirm("Do you want unsave this Job");

    if (!check) {
      return;
    }

    try {
      const data = await axios.post(`jobs/${jobId}/saveJob`);

      if (data) {
        toast.success("Unsave job successfully");
        setJobData((prev) => ({
          ...prev,
          saved: prev.saved.filter(
            (job) => String(job.jobId) !== String(jobId)
          ),
        }));
      }
    } catch (err) {
      toast.error(err.message);
      console.error(`Status code from Backend [${err.code}]:`, err.message);
    }
  };

  const onChangePage = (page, isPrev) => {
    if (isPrev) {
      if (previous) {
        setPageActive(page);
      }
    } else {
      if (next) {
        setPageActive(page);
      }
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "Open":
      case "Reviewing":
      case "Applied":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            {status}
          </span>
        );
      case "Interview":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {status}
          </span>
        );
      case "Closed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            {status}
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-200 text-gray-600 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
            {status}
          </span>
        );
    }
  };

  const currentJobs = jobData[activeSubTab] || [];

  const getDateHeaderLabel = () => {
    if (activeSubTab === "applied") return "Date Applied";
    if (activeSubTab === "saved") return "Date Saved";
    return "Date Viewed";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Job Management</h2>
          <p className="text-xs text-gray-500 mt-1">
            Track and manage your applications, saved, and recently viewed jobs.
          </p>
        </div>

        <div className="flex bg-gray-50/80 p-1 rounded-lg border border-gray-100 w-fit">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeSubTab === tab.id
                  ? "bg-white text-[#5B5FC7] shadow-sm ring-1 ring-gray-200/50"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50/80 text-gray-600 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <th className="py-3 px-4 w-[40%]">
                <div className="flex items-center gap-1.5">
                  <FiBriefcase className="text-gray-400" /> Job Title
                </div>
              </th>
              <th className="py-3 px-4 w-[25%]">
                <div className="flex items-center gap-1.5">
                  <FiCalendar className="text-gray-400" />{" "}
                  {getDateHeaderLabel()}
                </div>
              </th>
              <th className="py-3 px-4 w-[20%]">
                <div className="flex items-center gap-1.5">
                  <FiActivity className="text-gray-400" /> Latest Status
                </div>
              </th>
              <th className="py-3 px-4 text-center w-[15%]">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm bg-white">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-indigo-50/30 transition-colors group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-50 text-[#5B5FC7] rounded-lg group-hover:bg-[#5B5FC7] group-hover:text-white transition-colors">
                        <FiBriefcase className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-gray-800 cursor-pointer hover:text-[#5B5FC7] hover:underline">
                        {job.title}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-gray-500 font-medium text-xs">
                    {job.createdAt}
                  </td>

                  <td className="py-4 px-4">{renderStatusBadge(job.status)}</td>

                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-2 text-gray-400 hover:text-[#5B5FC7] hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="View Job Details"
                        onClick={() => {
                          navigate("/jobs/" + job.jobId);
                        }}
                      >
                        <FiExternalLink className="w-4 h-4" />
                      </button>

                      {activeSubTab === "saved" && (
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove from Saved Jobs"
                          onClick={() => deleteJobSaved(job.jobId)}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-16 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-gray-50 rounded-full">
                      {activeSubTab === "applied" && (
                        <FiCheckCircle className="w-8 h-8 text-gray-300" />
                      )}
                      {activeSubTab === "saved" && (
                        <FiBookmark className="w-8 h-8 text-gray-300" />
                      )}
                      {activeSubTab === "viewed" && (
                        <FiEye className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <p className="text-sm font-medium mt-2">
                      You haven't {activeSubTab} any jobs yet.
                    </p>
                    <button
                      onClick={() => {
                        navigate("/");
                      }}
                      className="text-xs text-[#5B5FC7] font-semibold hover:underline cursor-pointer"
                    >
                      Explore Jobs Now
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {currentJobs?.length > 0 && (
        <div className="flex items-center gap-3 justify-end mt-3">
          <div
            className={`px-2 py-1 text-center text-sm border rounded-xl border-blue-300
            ${!previous ? "bg-gray-400 pointer-events-none" : "cursor-pointer"}
            `}
            onClick={() => onChangePage(pageActive - 1, true)}
          >
            Previous
          </div>
          <div
            className={`px-2 py-1 text-center text-sm border rounded-xl border-blue-300
            ${!next ? "bg-gray-400 pointer-events-none" : "cursor-pointer"}
            `}
            onClick={() => onChangePage(pageActive + 1, false)}
          >
            Next
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagementTag;
