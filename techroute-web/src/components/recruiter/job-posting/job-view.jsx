import React from 'react';
import { 
  X, MapPin, DollarSign, Briefcase, 
  Layers, Users, Calendar, 
  Mail, Flame, Tag, Code2, AlignLeft,
  Target, Gift, FolderOpen, Terminal, UserCheck
} from 'lucide-react';

const JobViewDetail = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1A2238]/60 backdrop-blur-sm flex justify-center items-center p-4 sm:p-6 transition-all">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="relative p-6 md:p-8 border-b border-gray-100 bg-white shrink-0">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="pr-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A2238] tracking-tight">
                {job.title}
              </h2>
              {job.hotJob && (
                <span className="flex items-center gap-1 bg-red-50 text-red-600 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border border-red-100">
                  <Flame size={14} /> Hot
                </span>
              )}
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${
                job.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 
                job.status === 'CLOSED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}>
                {job.status || 'DRAFT'}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#5B5FC7]" /> 
                <span>{job.createdAt || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#5B5FC7]" /> 
                <span>{job.applicantCount || 0} Applicants</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[#5B5FC7]" /> 
                <span>{job.recruiterEmail}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 md:p-8 custom-scrollbar">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
              <div className="p-2.5 bg-[#5B5FC7]/10 rounded-lg text-[#5B5FC7]">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-0.5">Salary</p>
                <p className="font-bold text-[#1A2238] whitespace-nowrap">
                  {job.minSalary ? `$${job.minSalary.toLocaleString()}` : '0'} - {job.maxSalary ? `$${job.maxSalary.toLocaleString()}` : '0'}
                </p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
              <div className="p-2.5 bg-[#5B5FC7]/10 rounded-lg text-[#5B5FC7]">
                <MapPin size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-0.5">Location</p>
                <p className="font-bold text-[#1A2238] truncate" title={job.location}>{job.location}</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
              <div className="p-2.5 bg-[#5B5FC7]/10 rounded-lg text-[#5B5FC7]">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-0.5">Job Type</p>
                <p className="font-bold text-[#1A2238]">{job.workType}</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
              <div className="p-2.5 bg-[#5B5FC7]/10 rounded-lg text-[#5B5FC7]">
                <Layers size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-0.5">Level</p>
                <p className="font-bold text-[#1A2238]">{job.jobLevel}</p>
              </div>
            </div>
          </div>

          <div className="mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {job.categories && job.categories.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-[#1A2238] flex items-center gap-2 mb-4">
                    <FolderOpen size={18} className="text-gray-500" />
                    Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.categories.map((cat, idx) => (
                      <span key={`cat-${idx}`} className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 shadow-sm">
                        <Tag size={14} className="text-gray-400" /> {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.technologies && job.technologies.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-[#1A2238] flex items-center gap-2 mb-4">
                    <Terminal size={18} className="text-gray-500" />
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.technologies.map((tech, idx) => (
                      <span key={`tech-${idx}`} className="bg-[#1A2238]/5 border border-[#1A2238]/10 text-[#1A2238] px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 shadow-sm">
                        <Code2 size={14} className="text-[#1A2238]/60" /> {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {job.roles && job.roles.length > 0 && (
              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-[#1A2238] flex items-center gap-2 mb-4">
                  <UserCheck size={18} className="text-[#5B5FC7]" />
                  Roles
                </h4>
                <div className="flex flex-col gap-3">
                  {job.roles.map((role, idx) => (
                    <div key={`role-${idx}`} className="bg-[#5B5FC7]/5 border border-[#5B5FC7]/20 text-[#5B5FC7] px-4 py-3 rounded-lg text-sm font-medium shadow-sm leading-relaxed">
                      {role}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mb-8 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#1A2238] mb-4 flex items-center gap-2">
              <AlignLeft size={20} className="text-[#5B5FC7]" />
              Job Description
            </h3>
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#5B5FC7]/5 p-6 md:p-8 rounded-2xl border border-[#5B5FC7]/10">
              <h3 className="text-lg font-bold text-[#1A2238] mb-4 flex items-center gap-2">
                <Target size={20} className="text-[#5B5FC7]"/>
                Requirements
              </h3>
              <ul className="space-y-3">
                {job.requirements?.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5B5FC7] shrink-0 mt-2.5"></div>
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 p-6 md:p-8 rounded-2xl border border-green-100">
              <h3 className="text-lg font-bold text-[#1A2238] mb-4 flex items-center gap-2">
                <Gift size={20} className="text-green-600"/>
                Benefits
              </h3>
              <ul className="space-y-3">
                {job.benefits?.map((ben, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-2.5"></div>
                    <span className="leading-relaxed">{ben}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        <div className="p-4 md:p-6 border-t border-gray-100 bg-white flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default JobViewDetail;