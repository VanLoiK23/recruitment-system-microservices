import React from 'react';

function Footer() {
  return (
    <footer className="w-full bg-[#F4F6FB] pt-16 pb-8 px-4 md:px-12 border-t border-gray-100 font-sans text-center">
      <div className="w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-gray-900 tracking-wide">TechRoute</h3>
          <ul className="flex flex-col gap-2.5 text-xs text-gray-500 font-medium">
            <li><a href="#about" className="hover:text-[#5B5FC7] transition-colors">About Us</a></li>
            <li><a href="#blog" className="hover:text-[#5B5FC7] transition-colors">Recruitment Blog</a></li>
            <li><a href="#contact" className="hover:text-[#5B5FC7] transition-colors">Contact</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-gray-900 tracking-wide">For Candidates</h3>
          <ul className="flex flex-col gap-2.5 text-xs text-gray-500 font-medium">
            <li><a href="#jobs" className="hover:text-[#5B5FC7] transition-colors">Find Jobs</a></li>
            <li><a href="#cv" className="hover:text-[#5B5FC7] transition-colors">Create CV</a></li>
            <li><a href="#guide" className="hover:text-[#5B5FC7] transition-colors">Career Guide</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-gray-900 tracking-wide">For Recruiters</h3>
          <ul className="flex flex-col gap-2.5 text-xs text-gray-500 font-medium">
            <li><a href="#post" className="hover:text-[#5B5FC7] transition-colors">Post a job</a></li>
            <li><a href="#profiles" className="hover:text-[#5B5FC7] transition-colors">Find candidate profiles</a></li>
            <li><a href="#approved" className="hover:text-[#5B5FC7] transition-colors">Approved candidate</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-gray-900 tracking-wide">Connect</h3>
          <ul className="flex flex-col gap-2.5 text-xs text-gray-500 font-medium">
            <li><a href="#google" className="hover:text-[#5B5FC7] transition-colors">Google</a></li>
            <li><a href="#linkedin" className="hover:text-[#5B5FC7] transition-colors">Linkedin</a></li>
            <li><a href="mailto:support@techroute.vn" className="hover:text-[#5B5FC7] transition-colors break-all">support@techroute.vn</a></li>
          </ul>
        </div>

      </div>

      <div className="w-full mx-auto border-t border-gray-300/60 pt-6 text-center">
        <p className="text-xs text-gray-400 font-medium tracking-wide">
          © 2026 TechRoute
        </p>
      </div>
    </footer>
  );
}

export default Footer;
