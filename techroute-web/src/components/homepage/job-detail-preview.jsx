import React, { useState } from 'react';
import JobDetailCard from '../detail/job-card';
function JobDetailView({ job,onClickDetail }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const roles = job?.roles || [
    "Tham gia các dự án sử dụng ngôn ngữ lập trình Java và các công nghệ liên quan...",
    "Phối hợp với các developer khác và QA/PM để xử lý các lỗi phát sinh..."
  ];
  
  const skills = job?.requirements || [
    "Có từ 2 năm kinh nghiệm làm việc với Java trở lên",
    "Thành thạo các framework Java Spring Boot, Spring MVC",
    "Trình độ tiếng Anh: Đọc hiểu tài liệu kỹ thuật tốt"
  ];

  const benefits = job?.benefits || [
    "Mức lương hấp dẫn và không giới hạn tùy theo trình độ",
    "Thưởng theo dự án lên tới 3 tháng lương mỗi năm và thưởng tháng 13",
    "Xét tăng lương hằng năm"
  ];

  return (
    <div className="hidden col-span-2 gap-3 p-6 bg-white md:flex flex-col w-full h-fit border border-[#D9D9D9] rounded-xl sticky top-6 shadow-xs text-left font-sans">
      
      <JobDetailCard job={job} onClickDetail={onClickDetail}/>

      <div className="w-full border-t border-gray-200/80 my-2"></div>

      <div className="w-full overflow-y-auto max-h-[calc(100vh-260px)] pr-2 flex flex-col gap-6 custom-scrollbar">
        
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-50 text-[#1677FF] flex items-center justify-center font-bold text-xs">1</span>
            <h3 className="text-sm font-bold text-[#1677FF] underline underline-offset-4">Your role & responsibilities</h3>
          </div>
          <ul className="list-disc pl-9 text-xs text-gray-700 leading-relaxed flex flex-col gap-2">
            {roles.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-50 text-[#1677FF] flex items-center justify-center font-bold text-xs">2</span>
            <h3 className="text-sm font-bold text-[#1677FF] underline underline-offset-4">Your skills & qualifications</h3>
          </div>
          <ul className="list-disc pl-9 text-xs text-gray-700 leading-relaxed flex flex-col gap-2">
            {skills.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-50 text-[#1677FF] flex items-center justify-center font-bold text-xs">3</span>
            <h3 className="text-sm font-bold text-[#1677FF] underline underline-offset-4">Benefits</h3>
          </div>
          <ul className="list-disc pl-9 text-xs text-gray-700 leading-relaxed flex flex-col gap-2">
            {benefits.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>

      </div>

    </div>
  );
}

export default JobDetailView;
