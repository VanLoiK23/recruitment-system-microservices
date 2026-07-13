import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import NavBar from "../../components/header";
import Footer from "../../components/footer";
import { MapPin, BarChart3, Heart, Briefcase, Award, Gift } from "lucide-react";
import JobDetailCard from "../../components/job-card-detail";
import axios from "../../utils/axios.customize";
const JobDetailPage = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const { id } = useParams();
  const [job, setJobDetail] = useState({});
  const [jobsRelevant, setJobsRelevant] = useState([]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await axios.get(`jobs/${id}`);
        setJobDetail(data);
      } catch (err) {
        toast.error(err.message);
        console.error(`Status code from Backend [${err.code}]:`, err.message);
      }
    };
    if (id) {
      fetchJob();
    }
  }, []);

  useEffect(() => {
    const fetchJobsRelevant = async () => {
      try {
        const data = await axios.get(`jobs/relevant`,{
          params:{
            technologies: job.technologies
          }
        });
        setJobsRelevant(data);
      } catch (err) {
        toast.error(err.message);
        console.error(`Status code from Backend [${err.code}]:`, err.message);
      }
    };
    if (job?.technologies?.length > 0) {
      fetchJobsRelevant();
    }
  }, [job._id]);

  setJobDetail({
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
    createdAt: "Jul 01, 2026",
    applicants: 34,
    _class: "com.loihvk23.job_service.document.JobDocument",
  });

  setJobsRelevant([
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
  ]);

  const jobSummary = job?.description
    ? [job.description]
    : [
        "We are looking for a Senior Java Backend Engineer to join our team, focusing on building high-performance Microservices architectures and scalable systems.",
      ];

  const jobRequirements =
    job?.requirements && job.requirements.length > 0
      ? job.requirements
      : [
          "Must have at least 3 years of professional Java development experience.",
          "Deep understanding of data structures, algorithms, and system design.",
          "Strong communication and teamwork capabilities.",
        ];

  const jobBenefits =
    job?.benefits && job.benefits.length > 0
      ? job.benefits
      : [
          `Competitive monthly salary from $${job.minSalary?.toLocaleString()} to $${job.maxSalary?.toLocaleString()} based on capabilities.`,
          "13th-month salary and performance bonuses up to 3 months of salary per year.",
          "Annual salary review, premium health insurance, and clear career path development.",
        ];

  return (
    <div className="min-h-screen w-full bg-white relative font-sans">
      <div className="absolute top-[170px] left-[-102px] w-[291px] h-[264px] rounded-full bg-[#00C3FF] opacity-50 blur-[159px] pointer-events-none z-0" />{" "}
      <div className="hidden md:block absolute top-[300px] right-[80px] w-[250px] h-[250px] rounded-full bg-[#00C3FF] opacity-50 blur-[159px] pointer-events-none z-0" />
      <div className="absolute bottom-[300px] right-[0px] w-[200px] h-[200px] rounded-full bg-[#00C3FF] opacity-50 blur-[159px] pointer-events-none z-1" />
      <NavBar />
      <div className="w-[95%] md:w-[93%] mx-2 md:mx-auto  my-5">
        <div className="p-5 rounded-xl bg-white border border-gray-100/50 shadow-[0_0_16px_rgba(0,0,0,0.06)] sticky top-6 mb-10">
          <div className="flex flex-col justify-center gap-3">
            <div className="font-bold font-roboto text-xl text-gray-700 mb-2">
              {job?.title}
            </div>
            <div className="text-[#D6249F] text-xs flex flex-row flex-wrap items-center gap-1.5 mb-3">
              <span>
                ${job?.minSalary?.toLocaleString()} - $
                {job?.maxSalary?.toLocaleString()} / month
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span>{job?.jobLevel || "Senior"} Level</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span>Full-time</span>
            </div>
            <div className="flex flex-row flex-wrap items-center gap-12 text-xs text-gray-600 mb-4">
              <div className="flex flex-row items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{job?.location}</span>
              </div>
              <div className="flex flex-row items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 text-gray-500" />
                <span>{job?.jobLevel}</span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between gap-2 pt-1">
              <div className="flex flex-row flex-wrap max-w-[70%] items-center gap-2">
                {(job?.technologies || ["Java", "Spring Boot"]).map(
                  (tech, index) => (
                    <div
                      key={index}
                      className="py-1 px-3 rounded-full bg-[#FDF4FF] text-purple-600 text-xs font-medium border border-purple-50"
                    >
                      {tech}
                    </div>
                  )
                )}
              </div>
              <div className="hidden md:flex flex-row flex-wrap max-w-[70%] items-center py-1 px-3 text-gray-400 text-xs font-medium gap-2">
                {job.createdAt}
                <span className="w-1 h-1 rounded-full bg-gray-400" />
                <span>{job.applicants}&nbsp;Applicants</span>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex md:hidden flex-row whitespace-nowrap w-full items-center py-1 px-3 text-gray-400 text-xs font-medium gap-2">
                  {job.createdAt}
                  <span className="w-1 h-1 rounded-full bg-gray-400" />
                  <span>{job.applicants}&nbsp;Applicants</span>
                </div>
                <div className="flex flex-row items-center gap-2 shrink-0 whitespace-nowrap pt-1">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
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
                  <button className="h-9 px-6 rounded-xl bg-[#1677FF] text-white text-xs font-bold transition-all duration-200 hover:scale-105 hover:bg-[#1631ff] active:scale-95 cursor-pointer uppercase tracking-wider">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl border border-gray-100/50 shadow-[0_0_16px_rgba(0,0,0,0.06)] font-sans ">
          <div className="w-full overflow-y-auto max-h-[calc(100vh-260px)] pr-2 flex flex-col gap-8 custom-scrollbar">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[#5B5FC7]">
                <div className="w-7 h-7 rounded-lg bg-[#5B5FC7]/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="text-sm font-bold tracking-wide uppercase">
                  Job Description
                </h3>
              </div>
              <div className="pl-9 text-xs text-gray-600 leading-relaxed font-normal">
                {jobSummary.map((item, idx) => (
                  <p key={idx}>{item}</p>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[#5B5FC7]">
                <div className="w-7 h-7 rounded-lg bg-[#5B5FC7]/10 flex items-center justify-center">
                  <Award className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="text-sm font-bold tracking-wide uppercase">
                  Job Requirements
                </h3>
              </div>
              <ul className="list-disc pl-9 text-xs text-gray-600 leading-relaxed flex flex-col gap-2.5 font-normal">
                {jobRequirements.map((item, idx) => (
                  <li key={idx} className="marker:text-[#5B5FC7]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[#5B5FC7]">
                <div className="w-7 h-7 rounded-lg bg-[#5B5FC7]/10 flex items-center justify-center">
                  <Gift className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="text-sm font-bold tracking-wide uppercase">
                  Benefits & Allowances
                </h3>
              </div>
              <ul className="list-disc pl-9 text-xs text-gray-600 leading-relaxed flex flex-col gap-2.5 font-normal">
                {jobBenefits.map((item, idx) => (
                  <li key={idx} className="marker:text-[#5B5FC7]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[95%] md:w-[93%] flex flex-col p-5 justify-center gap-5 mx-2 md:mx-auto my-5 rounded-xl border border-gray-300">
        <div className="font-bold font-roboto text-xl text-gray-900 mb-2">
          {jobsRelevant?.length > 0 ? "More jobs for you" : "No job relevant"}
        </div>
        {jobsRelevant.map((jobRelevant) => (
          <JobDetailCard job={jobRelevant} isDetail={true} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default JobDetailPage;
