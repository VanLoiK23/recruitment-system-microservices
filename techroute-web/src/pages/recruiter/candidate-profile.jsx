import React, { useEffect, useState } from "react";
import getInitials from "../../components/get-avatar-name";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, HouseIcon } from "lucide-react";
import getStatusBadgeStyle from "../../components/badge-style";
import getJobStatusStyle from "../../components/job-status-style";
import axios from "../../utils/axios.customize";
import { PDFViewer } from "@react-pdf/renderer";
import CvTemplate from "../../pdf-templates/cv-template";
import getDynamicStatus from "../../components/get-dynamic-status-job";
import { Resizable } from "re-resizable";
const getScoreColor = (score) => {
  if (score === null) return "#A6A4B8";
  if (score >= 80) return "#1C9A6C";
  if (score >= 60) return "#C9820A";
  return "#D6455D";
};

const parseAiResult = (raw) => {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse aiAnalysisResult:", e);
    return null;
  }
};

const AVATAR_COLORS = [
  "#5D5CDE",
  "#D946EF",
  "#C026C8",
  "#4338CA",
  "#6E6BF0",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
];

const CandidatesManagement = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [previousJob, setPreviousJob] = useState(false);
  const [pageActiveJob, setPageActiveJob] = useState(1);
  const [limitJob, setLimitJob] = useState(6);
  const [nextJob, setNextJob] = useState(false);

  const [activeJobId, setActiveJobId] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [activeJob, setActiveJob] = useState({});

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("ALL");
  const [query, setQuery] = useState("");

  const [candidatesByJob, setCandidatesByJob] = useState([]);
  const [previousCandidate, setPreviousCandidate] = useState(false);
  const [pageActiveCandidate, setPageActiveCandidate] = useState(1);
  const [limitCandidate, setLimitCandidate] = useState(6);
  const [nextCandidate, setNextCandidate] = useState(false);

  const [totalCandidates, setTotalCandidates] = useState(0);
  const [numberHighScore, setNumberHighScore] = useState(0);
  const [numberNotScan, setNumberNotScan] = useState(0);

  const [profileInfo, setProfileInfo] = useState({});
  const [aiResult, setAIResult] = useState({});

  // for tier 2 AI scoring
  const [loadingInsights, setLoadingInsights] = useState(false);

  //resize modal watch AI score
  const [width, setWidth] = useState("min(980px, 92vw)");

  const [candidatesSelected, setCandidates] = useState([]);

  const [isSendBulkEmail, setSendBulkEmail] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(true);

  const [notificationRequest, setNotificationRequest] = useState({});

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoadingTemplate(true);
        const data = await axios.get(
          `notifications/templates?page=${page}&limit=4`
        );

        if (data) {
          setTemplates(data.content);
          setIsLastPage(data.last);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoadingTemplate(false);
      }
    };

    if (isSendBulkEmail) {
      fetchTemplates();
    }
  }, [page]);

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        setLoading(true);
        const data = await axios.get(
          `jobs/posted?&page=${pageActiveJob}&limit=${limitJob}`
        );

        if (data) {
          const dataJobs = data?.jobSlice?.content;
          setJobPostings(dataJobs);
          setPreviousJob(!data?.jobSlice?.first);
          setNextJob(!data?.jobSlice?.last);

          if (dataJobs.length > 0) {
            setActiveJobId(dataJobs[0].id);
          }
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostings();

    const timer = setTimeout(() => {
      fetchJobPostings();
    }, 300);

    return () => clearTimeout(timer);
  }, [pageActiveJob]);

  useEffect(() => {
    const fetchCandidatesByJob = async () => {
      if (!activeJobId) {
        return;
      }
      try {
        setLoading(true);
        let url = `applications/job/${activeJobId}?&page=${pageActiveCandidate}&limit=${limitCandidate}`;
        if (query) url += `&query=${query}`;
        if (status && status !== "ALL") url += `&status=${status}`;

        const data = await axios.get(url);

        if (data) {
          setCandidatesByJob(data?.applications?.content);
          setPreviousCandidate(!data?.applications?.first);
          setNextCandidate(!data?.applications?.last);
          setTotalCandidates(data?.totalCandidates);
          setNumberHighScore(data?.numberHighScore);
          setNumberNotScan(data?.numberNotScan);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchCandidatesByJob();
    }, 300);

    return () => clearTimeout(timer);
  }, [pageActiveCandidate, query, status, activeJobId]);

  useEffect(() => {
    if (activeJobId) {
      const existJobs = jobPostings.filter((job) => job.id === activeJobId);
      if (existJobs) {
        setActiveJob(existJobs[0]);
      }
    }
  }, [activeJobId]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!selectedCandidate) {
        return;
      }
      try {
        const data = await axios.get(
          "profile?email=" + selectedCandidate.candidateEmail
        );
        if (data) {
          setProfileInfo(data);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchProfile();
  }, [selectedCandidate]);

  useEffect(() => {
    const fetchAiInsights = async () => {
      if (!selectedCandidate?.id) return;

      console.log(selectedCandidate.aiAnalysisResult);
      const alreadyParsed = parseAiResult(selectedCandidate.aiAnalysisResult);
      setAIResult(alreadyParsed);
      console.log(alreadyParsed);
      if (alreadyParsed) return;

      try {
        setLoadingInsights(true);
        const data = await axios.get(
          `applications/${selectedCandidate.id}/ai-insights`
        );
        if (data) {
          setSelectedCandidate((prev) =>
            prev ? { ...prev, aiAnalysisResult: data.aiAnalysisResult } : prev
          );
          setAIResult(parseAiResult(data?.aiAnalysisResult));
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoadingInsights(false);
      }
    };

    fetchAiInsights();
  }, [selectedCandidate?.id]);

  const handleBulkEmail = async (selectedTemplate) => {
    try {
      const receivers = candidatesSelected.map((c) => ({
        name: c.candidateName,
        email: c.candidateEmail,
      }));

      const data = await axios.post(`notifications/sent`, {
        receivers: receivers,
        jobTitle: activeJob.title,
        templateKey: selectedTemplate.templateKey,
      });

      if (data.success) {
        toast.success("Bulk email is processing in the background!");
        setCandidates([]);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSendBulkEmail(false);
    }
  };

  const handleBulkReject = async () => {
    const check = window.confirm(
      "Do you want to REJECT ALL APPLICATION SELECTED"
    );

    if (!check) {
      return;
    }
    try {
      const ids = selectedCandidate.map((c) => c.id);
      const data = await axios.put(`applications/bulk/status`, {
        ids: ids,
        status: "REJECTED",
      });

      if (data.success) {
        toast.success("Successfully reject ALL applications");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const onChangePageJob = (newPage) => {
    setPageActiveJob(newPage);
  };

  const onChangePageCandidate = (newPage) => {
    setPageActiveCandidate(newPage);
  };

  const onChangeSearch = (e) => {
    const query = e.target.value;
    setQuery(query);
  };

  const closeDrawer = () => setSelectedCandidate(null);

  const getAvatarColor = (identifier = "") => {
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  };

  const getCvViewerUrl = (url) => {
    if (!url) return "";

    const cleanUrl = url.toLowerCase().split("?")[0];
    const isPdf = cleanUrl.endsWith(".pdf");

    if (isPdf) {
      return url;
    }

    return `https://docs.google.com/gview?url=${encodeURIComponent(
      url
    )}&embedded=true`;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F6FC] text-[#1B1A2E] font-['Be_Vietnam_Pro',sans-serif] antialiased">
      <aside className="w-[300px] min-w-[300px] bg-white border-r border-[#E7E5F3] flex flex-col p-5 overflow-y-auto">
        <div className="text-[11px] font-bold tracking-wider uppercase text-[#A6A4B8] px-1.5 pb-4 flex justify-between items-center mt-2">
          <span>Filter by Active Jobs</span>
        </div>

        <div className="h-full flex flex-col justify-between items-center">
          <div className="flex flex-col gap-2 w-full">
            {jobPostings.map((job) => {
              const isActive = job.id === activeJobId;

              const firstTech = job.technologies?.[0] || "";
              const firstCategory = job.categories?.[0] || "";

              const tagsDisplay = `${firstTech} · ${firstCategory}`;

              return (
                <div
                  key={job.id}
                  onClick={() => setActiveJobId(job.id)}
                  className={`border p-3.5 rounded-xl cursor-pointer transition-colors relative ${
                    isActive
                      ? "bg-[#F5F4FF] border-[#EBEAFD]"
                      : "border-transparent hover:bg-[#F5F4FF]"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-[-16px] top-2.5 bottom-2.5 w-1 rounded-r-md bg-gradient-to-b from-[#5D5CDE] to-[#D946EF]" />
                  )}
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-['Sora'] font-semibold text-[13.5px] text-[#1B1A2E] leading-snug truncate w-48">
                        {job.title}
                      </div>
                      <div className="text-[11.5px] text-[#6B6980] mt-1">
                        {tagsDisplay}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2.5">
                    <span
                      className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${getJobStatusStyle(
                        job.status
                      )}`}
                    >
                      {getDynamicStatus(job)}
                    </span>
                    <span className="text-[11.5px] text-[#6B6980]">
                      {job.applicantCount || 0} candidates
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {jobPostings.length > 0 && (
            <div className="flex gap-1">
              <button
                disabled={!previousJob}
                className={`px-3 py-1 border rounded
                ${
                  !previousJob
                    ? "bg-gray-200 text-gray-400 hover:bg-gray-50 border-gray-200 cursor-not-allowed"
                    : "bg-white text-[#5B5FC7] border-[#5B5FC7]/30 hover:bg-[#5B5FC7] hover:text-white cursor-pointer"
                }
                `}
                onClick={() => onChangePageJob(pageActiveJob - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-3 py-1 bg-[#5B5FC7] text-white rounded text-xs">
                {pageActiveJob}
              </button>
              <button
                disabled={!nextJob}
                className={`px-3 py-1 border rounded
                  ${
                    !nextJob
                      ? "bg-gray-200 text-gray-400 hover:bg-gray-50 border-gray-200 cursor-not-allowed"
                      : "bg-white text-[#5B5FC7] border-[#5B5FC7]/30 hover:bg-[#5B5FC7] hover:text-white cursor-pointer"
                  }
                  `}
                onClick={() => onChangePageJob(pageActiveJob + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="pt-6 px-8 bg-white border-b border-[#E7E5F3]">
          <div className="text-xs text-[#A6A4B8] mb-1.5 flex items-center gap-1.5">
            Candidates / {activeJob.title}
          </div>

          <div className="flex justify-between items-start gap-5">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-['Sora'] text-[21px] font-bold m-0 text-[#1B1A2E]">
                  {activeJob.title}
                </h1>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${getJobStatusStyle(
                    activeJob?.status
                  )}`}
                >
                  ● {activeJob?.status}
                </span>
                {activeJob?.hotJob && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-600">
                    🔥 HOT
                  </span>
                )}
              </div>
              <div className="text-[13px] text-[#6B6980] mt-1.5">
                {activeJob?.technologies?.join(", ")} · {activeJob?.location} (
                {activeJob?.workType}) · Posted on {activeJob?.createdAt}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="font-['Sora'] text-[13px] font-semibold rounded-lg px-4 py-2 cursor-pointer border-none bg-gradient-to-br from-[#5D5CDE] to-[#4338CA] text-white shadow-sm hover:opacity-90">
                + Invite Candidate
              </button>
            </div>
          </div>

          <div className="flex gap-6 my-4.5 mb-4">
            <div className="flex flex-col gap-0.5">
              <div className="font-['Sora'] text-[19px] font-bold text-[#1B1A2E]">
                {totalCandidates || 0}
              </div>
              <div className="text-[11.5px] text-[#6B6980]">
                Total Candidates
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="font-['Sora'] text-[19px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#5D5CDE] to-[#D946EF]">
                {numberHighScore || 0}
              </div>
              <div className="text-[11.5px] text-[#6B6980]">AI Score ≥ 85%</div>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="font-['Sora'] text-[19px] font-bold text-[#1B1A2E]">
                {numberNotScan || 0}
              </div>
              <div className="text-[11.5px] text-[#6B6980]">Analyzing</div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-[#E7E5F3]">
            <div className="flex gap-1">
              {[
                "ALL",
                "PENDING",
                "REVIEWING",
                "INTERVIEW",
                "REJECTED",
                "ACCEPTED",
              ].map((tab, idx) => (
                <div
                  key={idx}
                  className={`font-['Sora'] text-[12.5px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer ${
                    status === tab
                      ? "bg-[#1B1A2E] text-white"
                      : "text-[#6B6980] hover:bg-gray-50"
                  }`}
                  onClick={() => setStatus(tab)}
                >
                  {tab}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-[#F7F6FC] border border-[#E7E5F3] rounded-lg px-3 py-1.5 w-48">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A6A4B8"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="Search candidates..."
                  className="border-none bg-transparent outline-none text-[12.5px] w-full text-[#1B1A2E] placeholder-[#A6A4B8]"
                  onChange={onChangeSearch}
                />
              </div>
            </div>
          </div>
        </div>

        {candidatesSelected.length > 0 && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#1B1A2E] text-white px-5 py-3 rounded-2xl shadow-[0_20px_60px_rgba(27,26,46,0.3)] flex items-center gap-3 z-[60] transform transition-all duration-300 ease-out translate-y-0 opacity-100">
            <span className="text-[13px] font-['Sora'] font-medium border-r border-[#4A4968] pr-4 whitespace-nowrap">
              Candidate selected:{" "}
              <b className="text-[#8482F6] text-[15px] mx-1">
                {candidatesSelected.length}
              </b>{" "}
            </span>

            <button
              onClick={() => {
                setSendBulkEmail(true);
              }}
              className="flex items-center gap-2 bg-[#5D5CDE] hover:bg-[#4948ba] px-4 py-2 rounded-xl text-[13px] font-['Sora'] font-semibold transition-colors whitespace-nowrap"
            >
              ✉️ Send Email
            </button>

            <button
              onClick={handleBulkReject}
              className="flex items-center gap-2 bg-[#FF4C4C]/15 hover:bg-[#FF4C4C]/25 text-[#FF4C4C] px-4 py-2 rounded-xl text-[13px] font-['Sora'] font-semibold transition-colors whitespace-nowrap"
            >
              🗑️ Reject All
            </button>

            <button
              onClick={() => setCandidates([])}
              className="text-[#A6A4B8] hover:text-white px-3 py-2 text-[13px] font-['Sora'] font-medium transition-colors whitespace-nowrap ml-1"
            >
              Cancel
            </button>
          </div>
        )}

        {isSendBulkEmail && (
          <BulkEmailModal
            templates={templates}
            loading={loadingTemplate}
            page={page}
            isLastPage={isLastPage}
            onPageChange={(newPage) => setPage(newPage)}
            onClose={() => setSendBulkEmail(false)}
            onConfirm={(selectedTemplate) => {
              console.log("Send via template:", selectedTemplate);
              handleBulkEmail(selectedTemplate);
            }}
          />
        )}

        <div className="flex-1 overflow-y-auto p-0 px-8 pb-8 mt-2">
          <table className="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(44,42,130,0.06)]">
            <thead>
              <tr>
                <th className="text-left font-['Sora'] text-[11px] font-bold tracking-wide uppercase text-[#A6A4B8] p-3.5 bg-[#F7F6FC] border-b border-[#E7E5F3]">
                  Select
                </th>
                <th className="text-left font-['Sora'] text-[11px] font-bold tracking-wide uppercase text-[#A6A4B8] p-3.5 bg-[#F7F6FC] border-b border-[#E7E5F3]">
                  Candidate
                </th>
                <th className="text-left font-['Sora'] text-[11px] font-bold tracking-wide uppercase text-[#A6A4B8] p-3.5 bg-[#F7F6FC] border-b border-[#E7E5F3]">
                  Applied Date
                </th>
                <th className="text-left font-['Sora'] text-[11px] font-bold tracking-wide uppercase text-[#A6A4B8] p-3.5 bg-[#F7F6FC] border-b border-[#E7E5F3] cursor-pointer hover:text-[#5D5CDE]">
                  AI Match Score <span className="ml-1 text-[#5D5CDE]">▾</span>
                </th>
                <th className="text-left font-['Sora'] text-[11px] font-bold tracking-wide uppercase text-[#A6A4B8] p-3.5 bg-[#F7F6FC] border-b border-[#E7E5F3]">
                  Status
                </th>
                <th className="text-left font-['Sora'] text-[11px] font-bold tracking-wide uppercase text-[#A6A4B8] p-3.5 bg-[#F7F6FC] border-b border-[#E7E5F3] w-28">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {candidatesByJob.map((c) => {
                const sColor = getScoreColor(c.scoreByAI * 100);
                const circumference = 2 * Math.PI * 14;
                const offset =
                  c.scoreByAI !== null ? circumference * (1 - c.scoreByAI) : 0;
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCandidate(c)}
                    className="border-b border-[#E7E5F3] cursor-pointer hover:bg-[#F5F4FF] transition-colors last:border-none"
                  >
                    <td className="p-3.5 text-[13px] align-middle">
                      <input
                        type="checkbox"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (candidatesSelected.includes(c)) {
                            setCandidates(
                              candidatesSelected.filter((item) => item !== c)
                            );
                          } else {
                            setCandidates([...candidatesSelected, c]);
                          }
                        }}
                        checked={candidatesSelected.includes(c)}
                      />
                    </td>
                    <td className="p-3.5 text-[13px] align-middle">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center font-['Sora'] font-bold text-[13px] text-white shrink-0"
                          style={{
                            backgroundColor: getAvatarColor(c.fullName),
                          }}
                        >
                          {getInitials(c.fullName)}
                        </div>
                        <div>
                          <div className="font-['Sora'] font-semibold text-[13.5px] text-[#1B1A2E]">
                            {c.fullName}
                          </div>
                          <div className="text-[11.5px] text-[#6B6980] mt-0.5">
                            {c.candidateEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-[13px] align-middle text-[#6B6980]">
                      {c.createdAt}
                    </td>
                    <td className="p-3.5 text-[13px] align-middle">
                      {c.scoreByAI === null ? (
                        <div className="flex items-center gap-1.5 text-xs text-[#A6A4B8] italic">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6E6BF0] animate-pulse"></span>{" "}
                          Analyzing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                            <svg
                              className="-rotate-90 absolute top-0 left-0"
                              width="34"
                              height="34"
                              viewBox="0 0 34 34"
                            >
                              <circle
                                cx="17"
                                cy="17"
                                r="14"
                                fill="none"
                                stroke="#E7E5F3"
                                strokeWidth="4"
                              />
                              <circle
                                cx="17"
                                cy="17"
                                r="14"
                                fill="none"
                                stroke={sColor}
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                              />
                            </svg>
                          </div>
                          <span
                            className="font-['Sora'] font-bold text-[13.5px]"
                            style={{ color: sColor }}
                          >
                            {c.scoreByAI * 100}%
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-[13px] align-middle">
                      <span
                        className={`text-[11.5px] font-semibold px-3 py-1 rounded-full whitespace-nowrap ${getStatusBadgeStyle(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-[13px] align-middle">
                      <div className="flex gap-1.5">
                        <button
                          className="w-7 h-7 cursor-pointer rounded-md border border-[#E7E5F3] bg-white flex items-center justify-center text-[#6B6980] hover:bg-[#F5F4FF] hover:text-[#5D5CDE] transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          className="w-7 h-7 cursor-pointer rounded-md border border-[#E7E5F3] bg-white flex items-center justify-center text-[#6B6980] hover:bg-[#F5F4FF] hover:text-[#5D5CDE] transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4A8.4 8.4 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {candidatesByJob.length > 0 && (
              <div className="flex gap-1 justify-end items-center m-5">
                <button
                  disabled={!previousCandidate}
                  className={`px-3 py-1 border rounded
                ${
                  !previousCandidate
                    ? "bg-gray-200 text-gray-400 hover:bg-gray-50 border-gray-200 cursor-not-allowed"
                    : "bg-white text-[#5B5FC7] border-[#5B5FC7]/30 hover:bg-[#5B5FC7] hover:text-white cursor-pointer"
                }
                `}
                  onClick={() => onChangePageCandidate(pageActiveCandidate - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-3 py-1 bg-[#5B5FC7] text-white rounded text-xs">
                  {pageActiveCandidate}
                </button>
                <button
                  disabled={!nextCandidate}
                  className={`px-3 py-1 border rounded
                  ${
                    !nextCandidate
                      ? "bg-gray-200 text-gray-400 hover:bg-gray-50 border-gray-200 cursor-not-allowed"
                      : "bg-white text-[#5B5FC7] border-[#5B5FC7]/30 hover:bg-[#5B5FC7] hover:text-white cursor-pointer"
                  }
                  `}
                  onClick={() => onChangePageCandidate(pageActiveCandidate + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </table>
        </div>
      </main>

      <div
        className={`fixed inset-0 bg-[#1B1A2E]/40 backdrop-blur-[2px] z-40 transition-opacity duration-250 ${
          selectedCandidate
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />

      <aside
        className={`fixed top-0 right-0 bottom-0 w-[min(980px,92vw)] bg-white shadow-[0_20px_60px_rgba(27,26,46,0.22)] z-50 flex flex-col pointer-events-none transform transition-transform duration-300 ease-[cubic-bezier(.2,.9,.25,1)] ${
          selectedCandidate ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Resizable
          size={{ width, height: "100%" }}
          onResizeStop={(e, direction, ref, d) => {
            setWidth(ref.style.width);
          }}
          minWidth={480}
          maxWidth="95vw"
          // only drag left side
          enable={{
            top: false,
            right: false,
            bottom: false,
            left: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          handleClasses={{
            left: "w-2.5 hover:bg-blue-500/20 active:bg-blue-500 transition-colors cursor-col-resize !left-0 z-50",
          }}
          className="pointer-events-auto bg-white shadow-[0_20px_60px_rgba(27,26,46,0.22)] flex flex-col h-full border-l border-[#E7E5F3]"
        >
          {selectedCandidate && (
            <>
              <div className="flex items-center justify-between p-5 border-b border-[#E7E5F3]">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-['Sora'] font-bold text-[13px] text-white"
                    style={{
                      backgroundColor: getAvatarColor(
                        selectedCandidate.fullName
                      ),
                    }}
                  >
                    {getInitials(selectedCandidate.fullName)}
                  </div>
                  <div>
                    <h2 className="font-['Sora'] text-[17px] font-bold m-0 text-[#1B1A2E]">
                      {selectedCandidate.fullName}
                    </h2>
                    <div className="text-xs text-[#6B6980] mt-0.5">
                      Applied for {activeJob.title} · Applied on{" "}
                      {selectedCandidate.createdAt}
                    </div>
                  </div>
                </div>
                <button
                  className="w-8 h-8 rounded-lg border border-[#E7E5F3] bg-[#F7F6FC] flex items-center justify-center text-[#6B6980] hover:bg-gray-100"
                  onClick={closeDrawer}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                <div className="w-[44%] border-r border-[#E7E5F3] bg-[#F7F6FC] p-5 overflow-y-auto">
                  <div className="bg-white rounded-xl shadow-[0_8px_24px_rgba(27,26,46,0.1)] p-7 h-full text-xs text-[#38364F]">
                    {selectedCandidate?.cvSourceType === "URL" ? (
                      <iframe
                        src={getCvViewerUrl(selectedCandidate.cvUrl)}
                        title="Candidate CV Preview"
                        className="w-full h-full flex-1 border-none rounded-xl"
                      />
                    ) : (
                      <PDFViewer
                        width="100%"
                        height="100%"
                        className="w-full h-full flex-1 border-none rounded-xl"
                      >
                        <CvTemplate profileInfo={profileInfo} />
                      </PDFViewer>
                    )}
                  </div>
                </div>

                <div className="w-[56%] overflow-y-auto p-5 pb-10">
                  {loadingInsights ? (
                    <div className="rounded-[18px] bg-gradient-to-br from-[#5D5CDE] to-[#C026C8] p-[1px] mb-5">
                      <div className="bg-gradient-to-b from-[#FBFAFF] to-[#F3F1FE] rounded-[17px] p-5 flex items-center gap-3.5">
                        <div className="w-[74px] h-[74px] rounded-full border-4 border-[#EBEAFD] border-t-[#5D5CDE] animate-spin shrink-0" />
                        <div>
                          <div className="font-['Sora'] text-[10.5px] font-bold uppercase tracking-wide text-[#C026C8]">
                            AI Matching Score
                          </div>
                          <div className="text-[13px] text-[#6B6980] mt-1">
                            Detailed AI analysis in progress; please wait....
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : aiResult ? (
                    <div className="rounded-[18px] bg-gradient-to-br from-[#5D5CDE] to-[#C026C8] p-[1px] mb-5">
                      <div className="bg-gradient-to-b from-[#FBFAFF] to-[#F3F1FE] rounded-[17px] p-5">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-[74px] h-[74px] shrink-0">
                            <svg
                              className="-rotate-90"
                              width="74"
                              height="74"
                              viewBox="0 0 74 74"
                            >
                              <circle
                                cx="37"
                                cy="37"
                                r="31"
                                fill="none"
                                stroke="#E7E5F3"
                                strokeWidth="7"
                              />
                              <circle
                                cx="37"
                                cy="37"
                                r="31"
                                fill="none"
                                stroke="url(#gaugeGrad)"
                                strokeWidth="7"
                                strokeLinecap="round"
                                strokeDasharray={194.7}
                                strokeDashoffset={
                                  194.7 * (1 - aiResult.overallMatchScore / 100)
                                }
                                className="transition-all duration-1000"
                              />
                              <defs>
                                <linearGradient
                                  id="gaugeGrad"
                                  x1="0"
                                  y1="0"
                                  x2="1"
                                  y2="1"
                                >
                                  <stop offset="0%" stopColor="#5D5CDE" />
                                  <stop offset="100%" stopColor="#D946EF" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-['Sora'] font-extrabold text-[18px] text-[#1B1A2E]">
                              {aiResult.overallMatchScore}%
                            </div>
                          </div>
                          <div>
                            <div className="font-['Sora'] text-[10.5px] font-bold uppercase tracking-wide text-[#C026C8]">
                              AI Matching Score
                            </div>
                            <div className="font-['Sora'] text-base font-bold text-[#1B1A2E] mt-0.5">
                              {selectedCandidate.status}
                            </div>
                            <div className="text-xs text-[#6B6980] mt-0.5">
                              Compared with Job Description & posted JD
                            </div>
                          </div>
                        </div>

                        {aiResult.summaryComment && (
                          <p className="text-[12.5px] text-[#38364F] leading-relaxed mt-4 italic">
                            {aiResult.summaryComment}
                          </p>
                        )}

                        <ul className="flex flex-col gap-2 mt-4 text-[12.5px] text-[#38364F] leading-relaxed">
                          {aiResult.matchedSkills?.map((point, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="w-4 h-4 rounded-full bg-[#E4F7EF] text-[#1C9A6C] flex items-center justify-center shrink-0 mt-0.5">
                                ✓
                              </span>
                              {point}
                            </li>
                          ))}
                        </ul>

                        {aiResult.missingSkills?.length > 0 && (
                          <div className="mt-3.5 bg-[#FCF1DC] border border-[#F3DDA6] rounded-xl p-3 flex gap-2 text-xs text-[#8A5A05] leading-relaxed">
                            <span>⚠️</span>
                            <div>
                              <strong>Missing skills:</strong>{" "}
                              {aiResult.missingSkills.join(", ")}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 font-['Sora'] text-[13px] font-bold text-white bg-gradient-to-br from-[#5D5CDE] to-[#4338CA] py-2.5 rounded-lg text-center hover:opacity-90 transition">
                            {aiResult.overallMatchScore >= 85
                              ? "💬 Message & Schedule"
                              : "📅 Schedule Interview"}
                          </button>
                          <button className="flex-1 font-['Sora'] text-[13px] font-bold text-[#38364F] bg-white border border-[#E7E5F3] py-2.5 rounded-lg text-center hover:bg-gray-50 transition">
                            Save Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[18px] border border-[#E7E5F3] bg-[#F7F6FC] p-5 mb-5 text-[13px] text-[#6B6980] italic">
                      There is no AI analysis data available for this candidate.
                    </div>
                  )}

                  <div className="mb-5">
                    <h4 className="font-['Sora'] text-[12.5px] font-bold uppercase tracking-wide text-[#A6A4B8] mb-2.5">
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-5">
                      <div>
                        <div className="text-[11px] text-[#6B6980]">Email</div>
                        <div className="text-[13px] text-[#1B1A2E] font-medium mt-0.5">
                          {selectedCandidate.candidateEmail}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#6B6980]">Phone</div>
                        <div className="text-[13px] text-[#1B1A2E] font-medium mt-0.5">
                          {selectedCandidate.phone}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#6B6980]">
                          Experience Alignment
                        </div>
                        <div className="text-[13px] text-[#1B1A2E] font-medium mt-0.5">
                          {aiResult?.experienceAlignment || "Chưa phân tích"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <h4 className="font-['Sora'] text-[12.5px] font-bold uppercase tracking-wide text-[#A6A4B8] mb-2.5">
                      Skills to Verify
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {aiResult?.missingSkills?.length > 0 ? (
                        aiResult.missingSkills.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-3 py-1.5 rounded-full bg-[#FCF1DC] text-[#8A5A05] font-medium"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#A6A4B8] italic">
                          Không có thông tin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Resizable>
      </aside>
    </div>
  );
};

export default CandidatesManagement;

export const BulkEmailModal = ({
  templates,
  loading,
  page,
  isLastPage,
  onPageChange,
  onClose,
  onConfirm,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const selectedTemplate = templates?.find((t) => t.id === selectedTemplateId);

  const handleSubmit = () => {
    if (!selectedTemplate) return;
    onConfirm(selectedTemplate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Send Bulk Email</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-xl"
          >
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading && templates.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <span className="text-gray-500">Loading templates...</span>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6 h-full">
              <div className="w-full md:w-1/3 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a template
                </label>

                <div className="space-y-2 flex-1 overflow-y-auto pr-2 min-h-[250px]">
                  {templates?.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      No templates found.
                    </p>
                  ) : (
                    templates?.map((tmpl) => (
                      <div
                        key={tmpl.id}
                        onClick={() => setSelectedTemplateId(tmpl.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedTemplateId === tmpl.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        <p className="font-semibold text-gray-800 text-sm">
                          {tmpl.templateKey}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {tmpl.subject}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1 || loading}
                    className={`text-sm px-2 py-1 rounded transition-colors ${
                      page === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:bg-blue-50 font-medium"
                    }`}
                  >
                    &laquo; Prev
                  </button>

                  <span className="text-xs text-gray-500 font-medium">
                    Page {page}
                  </span>

                  <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={isLastPage || loading}
                    className={`text-sm px-2 py-1 rounded transition-colors ${
                      isLastPage
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:bg-blue-50 font-medium"
                    }`}
                  >
                    Next &raquo;
                  </button>
                </div>
              </div>

              <div className="w-full md:w-2/3 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview Content
                </label>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex-1 min-h-[300px]">
                  {selectedTemplate ? (
                    <div>
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm">
                          <span className="font-semibold text-gray-600">
                            Subject:{" "}
                          </span>
                          {selectedTemplate.subject}
                        </p>
                      </div>
                      <div
                        className="prose prose-sm max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: selectedTemplate.htmlContent,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      Select a template on the left to preview its content.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedTemplateId}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedTemplateId
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-300 text-white cursor-not-allowed"
            }`}
          >
            Send to Candidates
          </button>
        </div>
      </div>
    </div>
  );
};
