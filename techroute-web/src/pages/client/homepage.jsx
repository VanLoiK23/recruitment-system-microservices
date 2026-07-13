import { useCallback, useEffect, useState } from "react";
import NavBar from "../../components/header";
import SearchFilterBox from "../../components/searchFilterBox";
import Footer from "../../components/footer";
import HeroCard from "../../components/hero-card";
import JobCard from "../../components/job-card-homepage";
import JobDetailView from "../../components/job-detail-preview";
import axios from "../../utils/axios.customize";

const HomePage = () => {
  const [sortBy, setSortBy] = useState("");
  const [jobs,setListJob] = useState([])
  const [jobActive, setJobActive] = useState(false);

  const statsData = [
    { id: 1, stats: "3,200+", label: "Job openings" },
    { id: 2, stats: "850+", label: "Verified Recruiters" },
    { id: 3, stats: "12,000+", label: "Registered Candidates" },
    { id: 4, stats: "96%", label: "Success Rate" },
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await axios.get("jobs");
        if (data) {
          setListJob(data)
        }
      } catch (err) {
        toast.error(err.message);
        console.error(`Status code from Backend [${err.code}]:`, err.message);
      }
    };
    fetchJobs();
  }, []);

  const mockJobs = [
    {
      _id: "6a4526cf26fc6d054b47cecc",
      title: "Senior Java Backend Engineer",
      minSalary: 1500,
      maxSalary: 2500,
      description:
        "Chúng tôi đang tìm kiếm kỹ sư Java có kinh nghiệm làm việc với hệ thống Microservices và MongoDB.",
      status: "OPENING",
      recruiterEmail: "loi@gmail.com",
      technologies: ["Java", "Spring Boot", "MongoDB", "Docker"],
      requirements: [
        "Có tối thiểu 3 năm kinh nghiệm lập trình Java chuyên nghiệp.",
        "Hiểu sâu về cấu trúc dữ liệu, thuật toán và thiết kế hệ thống.",
        "Có khả năng giao tiếp và làm việc nhóm tốt.",
      ],
      jobLevel: "Senior",
      location: "Đà Nẵng",
      createdAt: "Jul 01, 2026", // Đã rút gọn để hiển thị UI cho đẹp
      _class: "com.loihvk23.job_service.document.JobDocument",
    },
    {
      _id: "6a4526cf26fc6d054b47ced1",
      title: "Frontend React Developer",
      minSalary: 1000,
      maxSalary: 1800,
      description:
        "Tham gia phát triển giao diện hệ thống Dashboard quản lý và tối ưu hóa hiệu năng ứng dụng Web với ReactJS.",
      status: "OPENING",
      recruiterEmail: "hr@techroute.vn",
      technologies: ["React", "Tailwind CSS", "TypeScript", "Vite"],
      requirements: [
        "Kinh nghiệm làm việc với React ít nhất 2 năm.",
        "Thành thạo tối ưu hóa UI/UX và thiết kế Responsive.",
        "Có tư duy cấu trúc component tốt.",
      ],
      jobLevel: "Intermediate",
      location: "Hà Nội",
      createdAt: "Jul 05, 2026",
      _class: "com.loihvk23.job_service.document.JobDocument",
    },
    {
      _id: "6a4526cf26fc6d054b47ced5",
      title: "AI & Data Engineer Specialist",
      minSalary: 2000,
      maxSalary: 3500,
      description:
        "Xây dựng pipeline xử lý dữ liệu lớn và triển khai các mô hình Machine Learning lên môi trường Production.",
      status: "OPENING",
      recruiterEmail: "tech@route.io",
      technologies: ["Python", "FastAPI", "PyTorch", "AWS"],
      requirements: [
        "Tốt nghiệp ngành Khoa học máy tính hoặc các ngành liên quan.",
        "Thành thạo xử lý dữ liệu lớn với Spark/Hadoop.",
        "Kinh nghiệm làm việc với Cloud (AWS/GCP).",
      ],
      jobLevel: "Expert",
      location: "Hồ Chí Minh",
      createdAt: "Jul 11, 2026",
      _class: "com.loihvk23.job_service.document.JobDocument",
    },
    {
      _id: "6a4526cf26fc6d054b47ced5",
      title: "AI & Data Engineer Specialist",
      minSalary: 2000,
      maxSalary: 3500,
      description:
        "Xây dựng pipeline xử lý dữ liệu lớn và triển khai các mô hình Machine Learning lên môi trường Production.",
      status: "OPENING",
      recruiterEmail: "tech@route.io",
      technologies: ["Python", "FastAPI", "PyTorch", "AWS"],
      requirements: [
        "Tốt nghiệp ngành Khoa học máy tính hoặc các ngành liên quan.",
        "Thành thạo xử lý dữ liệu lớn với Spark/Hadoop.",
        "Kinh nghiệm làm việc với Cloud (AWS/GCP).",
      ],
      jobLevel: "Expert",
      location: "Hồ Chí Minh",
      createdAt: "Jul 11, 2026",
      _class: "com.loihvk23.job_service.document.JobDocument",
    },
    {
      _id: "6a4526cf26fc6d054b47ced5",
      title: "AI & Data Engineer Specialist",
      minSalary: 2000,
      maxSalary: 3500,
      description:
        "Xây dựng pipeline xử lý dữ liệu lớn và triển khai các mô hình Machine Learning lên môi trường Production.",
      status: "OPENING",
      recruiterEmail: "tech@route.io",
      technologies: ["Python", "FastAPI", "PyTorch", "AWS"],
      requirements: [
        "Tốt nghiệp ngành Khoa học máy tính hoặc các ngành liên quan.",
        "Thành thạo xử lý dữ liệu lớn với Spark/Hadoop.",
        "Kinh nghiệm làm việc với Cloud (AWS/GCP).",
      ],
      jobLevel: "Expert",
      location: "Hồ Chí Minh",
      createdAt: "Jul 11, 2026",
      _class: "com.loihvk23.job_service.document.JobDocument",
    },
    {
      _id: "6a4526cf26fc6d054b47ced5",
      title: "AI & Data Engineer Specialist",
      minSalary: 2000,
      maxSalary: 3500,
      description:
        "Xây dựng pipeline xử lý dữ liệu lớn và triển khai các mô hình Machine Learning lên môi trường Production.",
      status: "OPENING",
      recruiterEmail: "tech@route.io",
      technologies: ["Python", "FastAPI", "PyTorch", "AWS"],
      requirements: [
        "Tốt nghiệp ngành Khoa học máy tính hoặc các ngành liên quan.",
        "Thành thạo xử lý dữ liệu lớn với Spark/Hadoop.",
        "Kinh nghiệm làm việc với Cloud (AWS/GCP).",
      ],
      jobLevel: "Expert",
      location: "Hồ Chí Minh",
      createdAt: "Jul 11, 2026",
      _class: "com.loihvk23.job_service.document.JobDocument",
    },
  ];

  const onClickSortBy = useCallback(
    (sort) => {
      setSortBy(sort);
    },
    [setSortBy]
  );

  return (
    <div className="min-h-screen w-full bg-white relative font-sans">
      <div className="absolute top-[170px] left-[-102px] w-[291px] h-[264px] rounded-full bg-[#00C3FF] opacity-50 blur-[159px] pointer-events-none z-0" />{" "}
      <div className="hidden md:block absolute top-[300px] right-[80px] w-[250px] h-[250px] rounded-full bg-[#00C3FF] opacity-50 blur-[159px] pointer-events-none z-0" />
      <div className="absolute bottom-[300px] right-[0px] w-[200px] h-[200px] rounded-full bg-[#00C3FF] opacity-50 blur-[159px] pointer-events-none z-1" />
      <NavBar />
      <div className="p-0 m-0 w-full flex flex-col items-center bg-linear-[to_bottom,#EEF0FC_0%,#F2F3FC_31%,white_100%]">
        <div className="md:text-3xl font-bold text-center my-4 font-[Inter] tracking-[-0.02em]">
          Find your dream job, connect <br />
          with real opportunities
        </div>
        <div className="text-[10px] md:text-xs font-bold text-gray-400 text-center mb-3 font-[Inter]">
          Thousands of jobs are waiting for you to apply.
        </div>
        <div className="w-full md:w-[93%] grid grid-cols-2 md:grid-cols-4 gap-6 mx-auto my-10">
          {statsData.map((info) => (
            <HeroCard key={info.id} info={info} />
          ))}
        </div>
        <SearchFilterBox />
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
              onChange={(e) => onClickSortBy(e.target.value)}
              className="w-full h-9 pl-3 pr-8 bg-white border border-[#77B7FF] text-[#1677FF] text-xs rounded-[10px] outline-none appearance-none cursor-pointer font-medium"
            >
              <option value="salary">Salary (High - Low)</option>
              <option value="date-desc">Date posted (latest)</option>
              <option value="date-asc">Date posted (oldest)</option>
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
                sortBy === "salary"
                  ? "bg-[#1677FF] text-white font-bold border border-transparent"
                  : "bg-white text-[#1677FF] border border-[#77B7FF] hover:bg-[#1677ffab] hover:text-white"
              }`}
              onClick={() => onClickSortBy("salary")}
            >
              Salary (High - Low)
            </button>
            <button
              className={`py-1.5 px-5 text-xs font-sans rounded-[10px] shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer ${
                sortBy === "date-desc"
                  ? "bg-[#1677FF] text-white font-bold border border-transparent"
                  : "bg-white text-[#1677FF] border border-[#77B7FF] hover:bg-[#1677ffab] hover:text-white"
              }`}
              onClick={() => onClickSortBy("date-desc")}
            >
              Date posted (latest)
            </button>
            <button
              className={`py-1.5 px-5 text-xs font-sans rounded-[10px] shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer ${
                sortBy === "date-asc"
                  ? "bg-[#1677FF] text-white font-bold border border-transparent"
                  : "bg-white text-[#1677FF] border border-[#77B7FF] hover:bg-[#1677ffab] hover:text-white"
              }`}
              onClick={() => onClickSortBy("date-asc")}
            >
              Date posted (oldest)
            </button>
          </div>
        </div>

        <div className="w-full md:w-[93%] p-3 grid grid-cols-1 md:grid-cols-3 items-start gap-8">
          <div className="col-span-1 w-full sm:w-[85%] sm:ml-15 md:w-auto md:ml-auto flex flex-col items-center gap-5">
            <div className="w-full bg-[#1677FF] text-white font-bold text-2xs p-3 rounded-xl">
              4788 results
            </div>
            {mockJobs.map((job) => (
              <JobCard job={job} key={job._id} />
            ))}
          </div>
          <JobDetailView job={mockJobs[0]} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
