import { useCallback, useContext, useEffect, useRef, useState } from "react";
import SearchFilterBox from "../../components/homepage/searchFilterBox";
import HeroCard from "../../components/homepage/hero-card";
import JobCard from "../../components/homepage/job-card";
import JobDetailView from "../../components/homepage/job-detail-preview";
import axios from "../../utils/axios.customize";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { AuthContext } from "../../components/context/auth.context";
import ApplyJobModal from "../../components/apply/apply-popup";

const HomePage = () => {
  const { auth } = useContext(AuthContext);

  const [sortBy, setSortBy] = useState("");
  const [filters, setFilters] = useState({});
  const [jobs, setJobs] = useState([]);
  const [totalJob, setTotalJob] = useState(0);
  const [jobActive, setJobActive] = useState(0);

  const [totalPage, setTotalPage] = useState(0);
  const [startPage, setStarPage] = useState(0);
  const [numberPageDisplay, setNumberPageDisplay] = useState(3);

  const [pageSize, setPageSize] = useState(7);
  const [pageActive, setPageActive] = useState(1);

  const [loading, setLoading] = useState(false);

  const [showApplyPopup, setShowApplyPopup] = useState(false);

  const ref = useRef();
  const topListRef = useRef();

  const handleClosePanel = () => {
    if (ref.current) {
      ref.current.closePanel();
    }
  };

  const navigate = useNavigate();

  const statsData = [
    { id: 1, stats: "3,200+", label: "Job openings" },
    { id: 2, stats: "850+", label: "Verified Recruiters" },
    { id: 3, stats: "12,000+", label: "Registered Candidates" },
    { id: 4, stats: "96%", label: "Success Rate" },
  ];

  const redirectLogin = () => {
    navigate("/auth");
  };

  const onApply = () => {
    if (!auth.isAuthenticated) {
      toast.warn("Pls Login before apply this job !");
      redirectLogin();
      return;
    }
    setShowApplyPopup(true);
  };

  const updateOnApply = (data) => {
    setJobs((prevJobs) =>
      prevJobs.map((item) =>
        item.id === data ? { ...item, isApplied: true } : item
      )
    );
  };

  const handleToggleSaveJob = async (jobId) => {
    if (!auth.isAuthenticated) {
      toast.warn("Pls Login before save this job !");
      redirectLogin();
      return;
    }

    setJobs((prevJobs) =>
      prevJobs.map((item) =>
        item.id === jobId ? { ...item, isSaved: !item.isSaved } : item
      )
    );

    try {
      const data = await axios.post(`jobs/${jobId}/saveJob`);

      if (data) {
        console.log(data);
      }
    } catch (error) {
      setJobs((prevJobs) =>
        prevJobs.map((item) =>
          item.id === jobId ? { ...item, isSaved: !item.isSaved } : item
        )
      );
      toast.error("Save job failed!");
    }
  };

  useEffect(() => {
    const fetchFilteredJobs = async () => {
      setLoading(true);
      try {
        const data = await axios.post(
          `jobs/filter?sortBy=${sortBy}&page=${pageActive}&limit=${pageSize}`,
          filters
        );

        if (data) {
          setJobs(data.content || []);

          setTotalJob(data?.page.totalElements);

          const totalElems = data?.page.totalElements || 0;
          const computedTotalPages = Math.ceil(totalElems / pageSize) || 1;
          setTotalPage(computedTotalPages);

          setNumberPageDisplay(computedTotalPages > 3 ? 3 : computedTotalPages);

          setStarPage(pageActive > 1 ? pageActive - 1 : 1);
        }
      } catch (err) {
        toast.error(err.message);
        console.error(`Status code from Backend [${err.code}]:`, err.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
          topListRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 1000);
      }
    };

    fetchFilteredJobs();
  }, [filters, sortBy, pageActive, pageSize, auth]);

  return (
    <div className="min-h-screen w-full bg-white relative font-sans">
      <div className="absolute top-[170px] left-[-102px] w-[291px] h-[264px] rounded-full bg-[#00C3FF] opacity-50 blur-[159px] pointer-events-none z-0" />{" "}
      <div className="hidden md:block absolute top-[300px] right-[80px] w-[250px] h-[250px] rounded-full bg-[#00C3FF] opacity-50 blur-[159px] pointer-events-none z-0" />
      <div className="absolute bottom-[300px] right-[0px] w-[200px] h-[200px] rounded-full bg-[#00C3FF] opacity-50 blur-[159px] pointer-events-none z-1" />
      <div
        className={`w-full h-full z-40 absolute inset-0 transition-opacity duration-200
        ${
          showApplyPopup
            ? "bg-gray-500 opacity-40  block"
            : "bg-transparent hidden"
        }
        `}
        onClick={() => {
          setShowApplyPopup(false);
        }}
      ></div>
      {showApplyPopup && (
        <ApplyJobModal
          auth={auth}
          job={jobs[jobActive]}
          onClose={() => {
            setShowApplyPopup(false);
          }}
          updateApplySuccess={updateOnApply}
        />
      )}
      <div className="p-0 m-0 w-full flex flex-col items-center bg-linear-[to_bottom,#EEF0FC_0%,#F2F3FC_31%,white_100%]">
        <div className="md:text-3xl font-bold text-center my-4 font-[Inter] tracking-[-0.02em]">
          Find your dream job, connect <br />
          with real opportunities
        </div>
        <div className="text-[10px] md:text-xs font-bold text-gray-400 text-center mb-3 font-[Inter]">
          Thousands of jobs are waiting for you to apply.
        </div>
        <div
          onClick={handleClosePanel}
          className="w-full md:w-[93%] grid grid-cols-2 md:grid-cols-4 gap-6 mx-auto my-10"
        >
          {statsData.map((info) => (
            <HeroCard key={info.id} info={info} />
          ))}
        </div>
        <SearchFilterBox
          ref={ref}
          onSubmit={(finalFilters) => {
            setFilters(finalFilters);
            console.log(finalFilters);
          }}
        />
      </div>
      <div className="w-full p-0 m-0 flex flex-col justify-center items-center bg-white mx-auto my-7">
        <div className="w-[90%] md:w-[93%] py-3 px-5 border border-[#D0EBFF] rounded-2xl flex flex-row justify-between md:justify-start items-center gap-2 md:gap-8 font-sans text-left">
          <p className="font-bold text-xs font-ramsina opacity-75 shrink-0">
            Sort by
          </p>
          {/* Mobile */}
          <div className="relative block md:hidden flex-1 max-w-[220px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-9 pl-3 pr-8 bg-white border border-[#77B7FF] text-[#1677FF] text-xs rounded-[10px] outline-none appearance-none cursor-pointer font-medium"
            >
              <option value="maxSalary">Salary (High - Low)</option>
              <option value="desc-createdAt">Date posted (latest)</option>
              <option value="asc-createdAt">Date posted (oldest)</option>
            </select>
            <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-[#1677FF]">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {/* Large Screen */}
          <div className="hidden md:flex flex-row items-center gap-4">
            <button
              className={`py-1.5 px-5 text-xs font-sans rounded-[10px] shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer ${
                sortBy === "maxSalary"
                  ? "bg-[#1677FF] text-white font-bold border border-transparent"
                  : "bg-white text-[#1677FF] border border-[#77B7FF] hover:bg-[#1677ffab] hover:text-white"
              }`}
              onClick={() => setSortBy("maxSalary")}
            >
              Salary (High - Low)
            </button>
            <button
              className={`py-1.5 px-5 text-xs font-sans rounded-[10px] shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer ${
                sortBy === "desc-createdAt"
                  ? "bg-[#1677FF] text-white font-bold border border-transparent"
                  : "bg-white text-[#1677FF] border border-[#77B7FF] hover:bg-[#1677ffab] hover:text-white"
              }`}
              onClick={() => setSortBy("desc-createdAt")}
            >
              Date posted (latest)
            </button>
            <button
              className={`py-1.5 px-5 text-xs font-sans rounded-[10px] shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer ${
                sortBy === "asc-createdAt"
                  ? "bg-[#1677FF] text-white font-bold border border-transparent"
                  : "bg-white text-[#1677FF] border border-[#77B7FF] hover:bg-[#1677ffab] hover:text-white"
              }`}
              onClick={() => setSortBy("asc-createdAt")}
            >
              Date posted (oldest)
            </button>
          </div>
        </div>

        {jobs?.length !== 0 ? (
          <div
            className={`w-full md:w-[93%] p-3 grid grid-cols-1 md:grid-cols-3 items-start gap-8 transition-opacity duration-300 scroll-mt-20
          ${loading ? "opacity-20 pointer-events-none" : "opacity-100"}
          `}
            ref={topListRef}
          >
            <div className="col-span-1 w-full sm:w-[85%] sm:ml-15 md:w-auto md:ml-auto flex flex-col items-center gap-5">
              <div className="w-full bg-[#1677FF] text-white font-bold text-2xs p-3 rounded-xl">
                {totalJob || 0} results
              </div>
              {jobs.map((job, index) => (
                <JobCard
                  job={job}
                  key={job.id}
                  onClickDetail={() => {
                    navigate("/jobs/" + job.id);
                  }}
                  onClickJobActive={() => {
                    setJobActive(index);
                  }}
                  redirectLogin={redirectLogin}
                  saveJob={(jobId) => {
                    handleToggleSaveJob(jobId);
                  }}
                  isActive={index === jobActive}
                />
              ))}
              <div className="flex items-center justify-around gap-2">
                {pageActive > 1 && (
                  <div
                    className="px-2 py-1 text-sm cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setPageActive(pageActive - 1);
                    }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Previous
                  </div>
                )}
                {totalPage > 0 &&
                  (() => {
                    const endPage = Math.min(
                      startPage + numberPageDisplay - 1,
                      totalPage
                    );

                    const displayCount = Math.max(0, endPage - startPage + 1);

                    return Array.from({ length: displayCount }, (_, index) => {
                      const pageNum = startPage + index;
                      const isActive = pageNum === pageActive;

                      return (
                        <div
                          key={pageNum}
                          onClick={() => setPageActive(pageNum)}
                          className={`w-7 h-7 my-auto rounded-full flex items-center justify-center cursor-pointer text-xs font-medium transition-all ${
                            isActive && "bg-blue-600 text-white font-bold"
                          }`}
                        >
                          {pageNum}
                        </div>
                      );
                    });
                  })()}
                {pageActive + 1 <= totalPage && (
                  <div
                    onClick={() => {
                      setPageActive(pageActive + 1);
                    }}
                    className="px-2 py-1 text-sm cursor-pointer flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>
            <JobDetailView
              job={jobs[jobActive]}
              onClickDetail={() => {
                navigate("/jobs/" + jobs[jobActive].id);
              }}
              redirectLogin={redirectLogin}
              saveJob={(jobId) => {
                handleToggleSaveJob(jobId);
              }}
              onApply={onApply}
            />
          </div>
        ) : (
          <div className="w-full md:w-[93%] mx-auto my-8 p-12 bg-white border border-gray-150 rounded-xl shadow-[0_0_24px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center font-sans text-center select-none animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-[#5B5FC7]/10 flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
              <SearchX className="w-8 h-8 text-[#5B5FC7] stroke-[2]" />
            </div>

            <h3 className="text-base font-bold text-gray-800 mb-1">
              No matching jobs found
            </h3>

            <p className="text-xs font-normal text-gray-400 max-w-sm leading-relaxed mb-6">
              We couldn't find any positions matching your current search
              criteria. Try adjusting your filters or search keywords.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="py-2 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer active:scale-95"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
