import React from "react";
import {
  ArrowRight,
  FileText,
  Wand2,
  Code2,
  LayoutTemplate,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CvBuilderLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <div className="max-w-5xl mx-auto pt-20 pb-12 px-4 sm:px-6 text-center">
        <p className="text-[#5B5FC7] font-bold tracking-wider text-sm uppercase mb-3">
          Elevate Your Tech Career
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
          Craft an Outstanding <span className="text-[#5B5FC7]">IT Resume</span>{" "}
          <br className="hidden md:block" />
          in Minutes.
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-12">
          Stand out to top tech recruiters with our ATS-optimized,
          developer-friendly CV builder. Showcase your tech stack, GitHub
          projects, and experience effortlessly.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <div className="bg-white border border-[#5B5FC7]/20 rounded-2xl p-8 text-left shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <FileText className="w-24 h-24 text-[#5B5FC7]" />
            </div>
            <div className="w-12 h-12 bg-[#5B5FC7]/10 rounded-xl flex items-center justify-center mb-6">
              <Wand2 className="w-6 h-6 text-[#5B5FC7]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Build from Scratch
            </h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Use our step-by-step wizard to create a professional CV tailored
              for software engineers and IT roles.
            </p>
            <button
              onClick={() => navigate("/profile#profile")}
              className="text-[#5B5FC7] font-semibold text-sm flex items-center gap-1.5 hover:gap-2 transition-all"
            >
              Start Building <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 hover:border-[#5B5FC7]/30 rounded-2xl p-8 text-left shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Code2 className="w-24 h-24 text-slate-800" />
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Upload Existing CV
            </h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Upload your current PDF or Word document and let our system
              extract and format it to ATS standards.
            </p>
            <button
              onClick={() => navigate("/profile#my-cv")}
              className="text-slate-700 font-semibold text-sm flex items-center gap-1.5 hover:gap-2 hover:text-[#5B5FC7] transition-all"
            >
              Upload Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#5B5FC7]/[0.03] border border-[#5B5FC7]/10 rounded-xl p-6">
            <LayoutTemplate className="w-7 h-7 text-[#5B5FC7] mb-4" />
            <h4 className="font-bold text-slate-900 mb-2">
              ATS-Friendly Layouts
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Clean, parseable structures that guarantee your resume passes
              through Applicant Tracking Systems at major tech giants.
            </p>
          </div>

          <div className="bg-[#5B5FC7]/[0.03] border border-[#5B5FC7]/10 rounded-xl p-6">
            <Code2 className="w-7 h-7 text-[#5B5FC7] mb-4" />
            <h4 className="font-bold text-slate-900 mb-2">
              Developer-Centric Fields
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dedicated sections to highlight your technical skills, framework
              proficiencies, and direct links to GitHub repositories.
            </p>
          </div>

          <div className="bg-[#5B5FC7]/[0.03] border border-[#5B5FC7]/10 rounded-xl p-6">
            <Briefcase className="w-7 h-7 text-[#5B5FC7] mb-4" />
            <h4 className="font-bold text-slate-900 mb-2">
              One-Click Application
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Save your generated CV to your profile and apply to thousands of
              IT jobs on Techroute with just a single click.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center">
        <button
          onClick={() => navigate("/profile#profile")}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#5B5FC7] hover:bg-[#4C50B6] active:bg-[#3F429B] text-white font-semibold rounded-lg shadow-lg shadow-[#5B5FC7]/30 hover:shadow-[#5B5FC7]/40 transition-all cursor-pointer"
        >
          Create Your CV Now
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CvBuilderLanding;
