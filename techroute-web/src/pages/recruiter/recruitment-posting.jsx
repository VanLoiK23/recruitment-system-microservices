import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import axios from "../../utils/axios.customize";
import CircleLoading from "../../components/animation/animate-loading";
import { toast } from "react-toastify";
import JobViewDetail from "../../components/recruiter/job-posting/job-view";
import JobUpsertModal from "../../components/recruiter/job-posting/job-upsert";
const RecruitmentPostingPage = () => {
  const [jobs, setJobs] = useState([]);
  const [jobActive, setJobActive] = useState({});

  const [previous, setPrevious] = useState(false);
  const [pageActive, setPageActive] = useState(1);
  const [limit, setLimit] = useState(6);
  const [next, setNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");

  const [showViewPopup, setShowViewPopUp] = useState(false);
  const [showUpsertPopup, setShowUpsertPopUp] = useState(false);
  const [showAddPopup, setShowAddPopUp] = useState(false);

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        setLoading(true);
        let url = `jobs/posted?&page=${pageActive}&limit=${limit}`;
        if (searchQuery) url += `&query=${encodeURIComponent(searchQuery)}`;

        const data = await axios.get(url);

        if (data) {
          setJobs(data?.jobSlice?.content);
          setPrevious(!data?.jobSlice?.first);
          setNext(!data?.jobSlice?.last);
          setTotalElements(data?.totalElement);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchJobPostings();
    }, 300);

    return () => clearTimeout(timer);
  }, [pageActive, searchQuery]);

  const onChangePage = (newPage) => {
    setPageActive(newPage);
  };

  const handleDelete = async (jobId) => {
    const check = window.confirm("Do you want delete this Job");

    if (!check) {
      return;
    }
    try {
      const data = await axios.delete(`jobs/${jobId}`);

      if (data.success) {
        toast.success("Job delete successfully");
      } else {
        toast.warn("Job delete failed");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const onChangeSearch = (e) => {
    const query = e.target.value;

    setSearchQuery(query);
  };

  const handleSave = async (formData) => {
    try {
      let data;

      if (showAddPopup) {
        data = await axios.post(`jobs`, formData);
      } else {
        data = await axios.put(`jobs/${formData.id}`, formData);
      }

      if (data) {
        toast.success("Upsert job successfully !");
      }
    } catch (err) {
      const errorData = err.message;

      if (typeof errorData === "object" && errorData !== null) {
        Object.values(errorData).forEach((message) => {
          toast.error(message);
        });
      } else {
        toast.error(err.message || "An error occurred!");
      }
    } finally {
      setShowUpsertPopUp(false);
      setShowAddPopUp(false);
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#EAF2FF] p-8 font-sans">
      {showViewPopup && (
        <JobViewDetail
          job={jobActive}
          onClose={() => setShowViewPopUp(false)}
        />
      )}
      {showUpsertPopup && (
        <JobUpsertModal
          job={jobActive}
          onClose={() => {
            setShowUpsertPopUp(false);
            setShowAddPopUp(false);
          }}
          onSave={handleSave}
          isAdd={showAddPopup}
        />
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Recruitment Posting Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Create and manage open job positions in the company
          </p>
        </div>
        <button
          onClick={() => {
            setJobActive({});
            setShowUpsertPopUp(true);
            setShowAddPopUp(true);
          }}
          className="flex items-center gap-2 cursor-pointer bg-[#5B5FC7] hover:bg-[#4a4ea3] text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-[#5B5FC7]/20"
        >
          <Plus size={20} />
          <span>Create Job Posting</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-gray-100 mb-6 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by job title..."
            onChange={onChangeSearch}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B5FC7]/20 focus:border-[#5B5FC7] transition-all text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
          <Filter size={18} />
          <span>Filter status</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Job Position
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Job Type
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Candidates
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date Posted
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ?? <CircleLoading />}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="relative mb-4 p-4 bg-slate-50 rounded-full border border-slate-100 shadow-inner group">
                        <img
                          src="https://i.ibb.co/pYQ0kz0/company-employees-use-web-search-find-ideas-doing-business-company-1150-43196.avif"
                          alt="Not-found"
                          className="w-40 h-40 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-1">
                        No Job Postings Yet
                      </h3>

                      <p className="text-sm text-slate-500 max-w-sm">
                        You haven't created any job postings yet. Create a new
                        posting to start attracting candidates.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-800">
                      {job.title}
                    </div>
                    <div className="text-sm max-w-[130px] truncate text-gray-500 mt-0.5">
                      {job.categories.join(", ")}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                      {job.workType}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#5B5FC7]/10 text-[#5B5FC7] font-bold text-sm">
                      {job?.applicantCount ? job.applicantCount : 0}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium
                        ${
                          job.status === "OPENING"
                            ? "bg-green-100 text-green-700"
                            : ""
                        }
                        ${
                          job.status === "Draft"
                            ? "bg-amber-100 text-amber-700"
                            : ""
                        }
                        ${
                          job.status === "Closed"
                            ? "bg-red-100 text-red-700"
                            : ""
                        }
                      `}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                    {job.createdAt}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-gray-400 hover:text-[#5B5FC7] hover:bg-[#5B5FC7]/10 rounded-lg transition-colors cursor-pointer"
                        title="View details"
                        onClick={() => {
                          setJobActive(job);
                          setShowViewPopUp(true);
                        }}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                        onClick={() => {
                          setJobActive(job);
                          setShowUpsertPopUp(true);
                          setShowAddPopUp(false);
                        }}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                        onClick={() => handleDelete(job.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {jobs.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing {pageActive} - {Math.ceil(totalElements / limit)} of
              &nbsp;
              {Math.ceil(totalElements / limit)} postings
            </span>
            <div className="flex gap-1">
              <button
                disabled={!previous}
                className={`px-3 py-1 border rounded
                ${
                  !previous
                    ? "bg-gray-200 text-gray-400 hover:bg-gray-50 border-gray-200 cursor-not-allowed"
                    : "bg-white text-[#5B5FC7] border-[#5B5FC7]/30 hover:bg-[#5B5FC7] hover:text-white cursor-pointer"
                }
                `}
                onClick={() => onChangePage(pageActive - 1)}
              >
                Previous
              </button>
              <button className="px-3 py-1 bg-[#5B5FC7] text-white rounded">
                {pageActive}
              </button>
              <button
                disabled={!next}
                className={`px-3 py-1 border rounded
                  ${
                    !next
                      ? "bg-gray-200 text-gray-400 hover:bg-gray-50 border-gray-200 cursor-not-allowed"
                      : "bg-white text-[#5B5FC7] border-[#5B5FC7]/30 hover:bg-[#5B5FC7] hover:text-white cursor-pointer"
                  }
                  `}
                onClick={() => onChangePage(pageActive + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruitmentPostingPage;
