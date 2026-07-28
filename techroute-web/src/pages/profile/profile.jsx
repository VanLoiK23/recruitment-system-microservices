import React, { useState } from "react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiLinkedin,
  FiGithub,
  FiEdit2,
  FiTrash2,
  FiX,
  FiPlusCircle,
} from "react-icons/fi";
import skills from "../../components/profile/Skill-list";
import { toast } from "react-toastify";

const DragHandle = () => (
  <svg
    className="w-4 h-4 text-gray-400 cursor-grab mt-2 shrink-0 hover:text-[#5B5FC7] transition-colors"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M5 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm6-8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
  </svg>
);

const InlineInput = ({
  value,
  onChange,
  placeholder,
  className,
  type = "text",
}) => (
  <input
    type={type}
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full bg-transparent border border-transparent hover:border-gray-300 focus:border-[#5B5FC7] focus:bg-white rounded px-2 py-1 -ml-2 outline-none transition-all ${className}`}
  />
);

const InlineTextarea = ({ value, onChange, placeholder, className }) => (
  <textarea
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows="2"
    className={`w-full bg-transparent border border-transparent hover:border-gray-300 focus:border-[#5B5FC7] focus:bg-white rounded px-2 py-1 -ml-2 outline-none transition-all resize-none ${className}`}
  ></textarea>
);

const DynamicSection = ({ title, emptyText, items, setItems, renderItem }) => {
  const handleAdd = () => {
    setItems([...items, { id: Date.now() }]);
  };

  const handleUpdate = (id, field, value) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="mb-4 rounded-lg border border-gray-300 bg-white shadow-sm overflow-hidden group hover:border-[#5B5FC7] transition-colors">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#5B5FC7] uppercase tracking-wider">
          {title}
        </h3>
        <button
          onClick={handleAdd}
          className="text-[#5B5FC7] hover:text-[#4a4ea6] transition-all rounded-full hover:bg-indigo-50 p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Add new item"
        >
          <FiPlusCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {items.length === 0 && (
          <p className="text-sm text-gray-500 py-1">{emptyText}</p>
        )}

        {items.map((item, index) => (
          <div key={item.id}>
            {index > 0 && (
              <div className="border-t border-gray-200/60 my-3"></div>
            )}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 w-full">
                <DragHandle />
                <div className="flex-1">
                  {renderItem(item, (field, value) =>
                    handleUpdate(item.id, field, value)
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-gray-400 hover:text-red-600 transition-colors shrink-0 ml-4 p-1.5 hover:bg-red-50 rounded mt-1"
                title="Delete this item"
              >
                <FiTrash2 className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("My Techroute CV");
  const [isToWork, setIsToWork] = useState(true);

  const [name, setName] = useState("Van Loi");
  const [jobTitle, setJobTitle] = useState("Fullstack Developer");
  
  const [province, setProvince] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("loihv.23ite@vku.udn.vn");
  const [github, setGithub] = useState("github.com/VanLoiK23");
  const [linkedin, setLinkedin] = useState("");

  const [skillSelected, setSkillSelected] = useState([]);
  const [softSkill, setSoftSkill] = useState("");
  const [showPopUpSkill, setShowPopUpSkill] = useState(false);

  const [works, setWorks] = useState([]);
  const [educations, setEducations] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [projects, setProjects] = useState([]);

  const tabs = [
    "My Techroute CV",
    "Job management",
    "CV Management",
    "Email Management",
    "Personality Test",
  ];

  const onSetSkill = (skill) => {
    setSkillSelected((prev) => {
      if (prev.includes(skill)) {
        return prev;
      }
      return [...prev, skill];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[320px] flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center shadow-sm">
            <div className="relative w-28 h-28 flex items-center justify-center mb-4">
              <svg
                className="w-full h-full transform -rotate-90 absolute"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#5B5FC7"
                  strokeWidth="6"
                  strokeDasharray="283"
                  strokeDashoffset="85"
                />
              </svg>
              <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-2 border-white z-10 flex items-center justify-center">
                <svg
                  className="w-14 h-14 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>
            <span className="text-[#5B5FC7] font-bold text-sm mb-2">
              70% Completed
            </span>
            <h2 className="text-lg font-bold text-gray-900 text-center">
              {name}
            </h2>
            <p className="text-sm text-gray-500 text-center">
              {jobTitle}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between shadow-sm">
            <div className="pr-4">
              <h3 className="font-bold text-gray-900 text-sm">
                Open to work now
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Activate Open to Work mode to connect with employers.
              </p>
            </div>
            <button
              onClick={() => setIsToWork(!isToWork)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isToWork ? "bg-[#5B5FC7]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isToWork ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
            <nav className="flex space-x-8 min-w-max px-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === tab
                      ? "text-[#5B5FC7] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#5B5FC7]"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-[#5B5FC7]">
                {name}
              </h1>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <FiEdit2 className="w-3.5 h-3.5" /> Edit Info
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mb-10 pb-8">
              <div className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-[#5B5FC7] cursor-pointer">
                <FiMapPin className="text-gray-400 shrink-0" />
                <InlineInput value={province} onChange={setProvince} placeholder="Add Province/ City" className="p-0 text-sm" />
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-[#5B5FC7] cursor-pointer">
                <FiPhone className="text-gray-400 shrink-0" />
                <InlineInput value={phone} onChange={setPhone} placeholder="Add phone number" className="p-0 text-sm" />
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-900">
                <FiMail className="text-gray-400 shrink-0" />
                <InlineInput value={email} onChange={setEmail} placeholder="Email" className="p-0 text-sm" />
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-900">
                <FiGithub className="text-gray-400 shrink-0" />
                <InlineInput value={github} onChange={setGithub} placeholder="Github" className="p-0 text-sm" />
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-[#5B5FC7] cursor-pointer">
                <FiLinkedin className="text-gray-400 shrink-0" />
                <InlineInput value={linkedin} onChange={setLinkedin} placeholder="Click to add LinkedIn" className="p-0 text-sm" />
              </div>
            </div>

            <div className="mb-4 rounded-lg border border-gray-300 bg-white shadow-sm p-4">
              <h3 className="text-sm font-bold text-[#5B5FC7] uppercase tracking-wider mb-4">
                Skills
              </h3>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  Technical Skills
                </label>
                <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3">
                  {skillSelected.map((skill, index) => (
                    <span
                      onClick={() => {
                        const skillAfterRemoved = skillSelected.filter(
                          (item) => item !== skill
                        );
                        setSkillSelected(skillAfterRemoved);
                      }}
                      key={index}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md"
                    >
                      {skill}
                      <FiX className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" />
                    </span>
                  ))}
                  <div className="relative">
                    <input
                      type="text"
                      onClick={() => {
                        setShowPopUpSkill(!showPopUpSkill);
                      }}
                      readOnly
                      placeholder="Select skills..."
                      className="outline-none text-sm px-2 min-w-[120px] bg-transparent text-gray-500 cursor-pointer"
                    />
                    {showPopUpSkill && (
                      <div className="absolute top-7 left-0 p-3 overflow-auto h-[250px] w-[250px] bg-white text-left flex flex-col gap-3 shadow-lg border border-gray-100 z-10">
                        {skills.map((skill, index) => (
                          <div
                            className="cursor-pointer p-2 hover:bg-blue-200 hover:text-blue-500"
                            onClick={() => {
                              onSetSkill(skill);
                            }}
                            key={index}
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  Soft Skills ( Optional )
                </label>
                <input
                  type="text"
                  value={softSkill}
                  onChange={(e) => setSoftSkill(e.target.value)}
                  placeholder="Enter a soft skill and press Enter"
                  className="w-full outline-none text-sm p-2 bg-transparent text-gray-500 border border-gray-200 rounded-md focus:border-[#5B5FC7]"
                />
              </div>
            </div>

            <DynamicSection
              title="Work Experience"
              emptyText="No experience added yet."
              items={works}
              setItems={setWorks}
              renderItem={(item, update) => (
                <div className="flex flex-col gap-1 w-full">
                  <InlineInput
                    value={item.company}
                    onChange={(v) => update("company", v)}
                    placeholder="Company name"
                    className="font-bold text-gray-900 text-sm placeholder-gray-400"
                  />

                  <div className="flex flex-wrap items-center gap-4 mt-1 px-2">
                    <input
                      type="date"
                      value={item.startDate || ""}
                      onChange={(e) => update("startDate", e.target.value)}
                      className="text-xs text-[#5B5FC7] bg-gray-50 p-1.5 rounded-md border border-transparent hover:border-gray-200 focus:border-[#5B5FC7] focus:bg-white outline-none cursor-pointer"
                    />
                    <span className="text-gray-400 text-xs">-</span>
                    <input
                      type="date"
                      value={item.endDate || ""}
                      onChange={(e) => update("endDate", e.target.value)}
                      disabled={item.isCurrent}
                      className="text-xs text-[#5B5FC7] bg-gray-50 p-1.5 rounded-md border border-transparent hover:border-gray-200 focus:border-[#5B5FC7] focus:bg-white outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer ml-2">
                      <input
                        type="checkbox"
                        checked={item.isCurrent || false}
                        onChange={(e) => update("isCurrent", e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-[#5B5FC7] focus:ring-[#5B5FC7]"
                      />
                      I am currently working in this role
                    </label>
                  </div>

                  <InlineInput
                    value={item.skills}
                    onChange={(v) => update("skills", v)}
                    placeholder="Click to add skills"
                    className="text-xs text-gray-400 mt-2"
                  />
                  <InlineTextarea
                    value={item.desc}
                    onChange={(v) => update("desc", v)}
                    placeholder="Enter detailed job description and role"
                    className="text-xs text-gray-500 mt-1"
                  />
                </div>
              )}
            />

            <DynamicSection
              title="Education"
              emptyText="No education added yet."
              items={educations}
              setItems={setEducations}
              renderItem={(item, update) => (
                <div className="flex flex-col gap-1 w-full">
                  <InlineInput
                    value={item.school}
                    onChange={(v) => update("school", v)}
                    placeholder="School name"
                    className="font-bold text-gray-900 text-sm placeholder-gray-400"
                  />
                  <InlineInput
                    value={item.major}
                    onChange={(v) => update("major", v)}
                    placeholder="Major"
                    className="text-sm text-[#5B5FC7] placeholder-[#5b5fc780]"
                  />

                  <div className="flex items-center gap-2 mt-1 px-2">
                    <input
                      type="date"
                      value={item.startDate || ""}
                      onChange={(e) => update("startDate", e.target.value)}
                      className="text-xs text-[#5B5FC7] bg-gray-50 p-1.5 rounded-md border border-transparent hover:border-gray-200 focus:border-[#5B5FC7] outline-none cursor-pointer"
                    />
                    <span className="text-gray-400 text-xs">-</span>
                    <input
                      type="date"
                      value={item.endDate || ""}
                      onChange={(e) => update("endDate", e.target.value)}
                      className="text-xs text-[#5B5FC7] bg-gray-50 p-1.5 rounded-md border border-transparent hover:border-gray-200 focus:border-[#5B5FC7] outline-none cursor-pointer"
                    />
                  </div>

                  <InlineTextarea
                    value={item.desc}
                    onChange={(v) => update("desc", v)}
                    placeholder="Describe your education program, degrees, and achievements"
                    className="text-xs text-gray-500 mt-2"
                  />
                </div>
              )}
            />

            <DynamicSection
              title="Languages"
              emptyText="No language added yet."
              items={languages}
              setItems={setLanguages}
              renderItem={(item, update) => (
                <InlineInput
                  value={item.lang}
                  onChange={(v) => update("lang", v)}
                  placeholder="Language (e.g. English)"
                  className="font-bold text-gray-900 text-sm placeholder-gray-400"
                />
              )}
            />

            <DynamicSection
              title="Projects"
              emptyText="No project added yet."
              items={projects}
              setItems={setProjects}
              renderItem={(item, update) => (
                <div className="flex flex-col gap-1 w-full">
                  <InlineInput
                    value={item.project}
                    onChange={(v) => update("project", v)}
                    placeholder="Project name"
                    className="font-bold text-gray-900 text-sm placeholder-gray-400"
                  />
                  <div className="mt-1 px-2">
                    <input
                      type="date"
                      value={item.date || ""}
                      onChange={(e) => update("date", e.target.value)}
                      className="text-xs text-[#5B5FC7] bg-gray-50 p-1.5 rounded-md border border-transparent hover:border-gray-200 focus:border-[#5B5FC7] outline-none cursor-pointer"
                    />
                  </div>
                  <InlineTextarea
                    value={item.desc}
                    onChange={(v) => update("desc", v)}
                    placeholder="Enter a project description"
                    className="text-xs text-gray-500 mt-2"
                  />
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;