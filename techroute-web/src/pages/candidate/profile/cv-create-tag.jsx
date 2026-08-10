import React, { useEffect, useState } from "react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiLinkedin,
  FiGithub,
  FiEdit2,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import skills from "../../../components/profile/Skill-list.jsx";
import axios from "../../../utils/axios.customize.js";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import CvTemplate from "../../../pdf-templates/cv-template.jsx";
import {
  DynamicSection,
  WorkSkillSelector,
  InlineInput,
  InlineRichText,
} from "./cv-create-component.jsx";

const CvCreateTag = ({ profileInfo, setIsEditModalOpen, onProfileUpdated }) => {
  const [showPdf, setShowPdfCv] = useState(false);
  const [showDemoPdf, setShowDemoPdf] = useState(false);

  const [summary, setSummary] = useState("");
  const [skillSelected, setSkillSelected] = useState([]);
  const [softSkill, setSoftSkill] = useState("");
  const [softSkills, setSoftSkills] = useState([]);
  const [showPopUpSkill, setShowPopUpSkill] = useState(false);

  const [works, setWorks] = useState([]);
  const [educations, setEducations] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [projects, setProjects] = useState([]);

  const calculatePercent = (data) => {
    if (!data) return 0;
    let total = 0;

    if (data.phone?.trim()) total += 5;
    if (data.emailCandidate?.trim()) total += 5;
    if (data.jobPosition?.trim()) total += 10;
    if (data.skills?.length > 0) total += 15;
    if (data.workExperiences?.length > 0) total += 10;
    if (data.educations?.length > 0) total += 10;
    if (data.projects?.length > 0) total += 10;
    if (data.summary?.trim() && data.summary !== "<p><br></p>") total += 10;
    if (data.cityProvince?.trim()) total += 5;
    if (data.github?.trim()) total += 5;
    if (data.linkedin?.trim()) total += 5;
    if (data.languages?.length > 0) total += 5;
    if (data.yearsOfExperience >= 0) total += 3;
    if (data.address?.trim()) total += 1;
    if (data.softSkills?.length > 0) total += 1;

    const finalPercent = Math.min(total, 100);

    if (onProfileUpdated) {
      onProfileUpdated(finalPercent, data.openToWork);
    }
    return finalPercent;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setShowPdfCv(false);
      try {
        const data = await axios.get("profile");
        if (data) {
          setSummary(data.summary || "");
          setSkillSelected(data.skills || []);
          setSoftSkills(data.softSkills || []);

          if (data.workExperiences && Array.isArray(data.workExperiences)) {
            setWorks(
              data.workExperiences.map((i, idx) => ({
                ...i,
                id: i.id || `work-${idx}-${Date.now()}`,
              }))
            );
          }
          if (data.educations && Array.isArray(data.educations)) {
            setEducations(
              data.educations.map((i, idx) => ({
                ...i,
                id: i.id || `edu-${idx}-${Date.now()}`,
              }))
            );
          }
          if (data.languages && Array.isArray(data.languages)) {
            setLanguages(
              data.languages.map((i, idx) => ({
                ...i,
                id: i.id || `lang-${idx}-${Date.now()}`,
              }))
            );
          }
          if (data.projects && Array.isArray(data.projects)) {
            setProjects(
              data.projects.map((i, idx) => ({
                ...i,
                id: i.id || `proj-${idx}-${Date.now()}`,
              }))
            );
          }
          calculatePercent(data);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setShowPdfCv(true);
      }
    };

    fetchProfile();
  }, []);

  const saveProfile = async (updatedData) => {
    try {
      const payload = {
        ...profileInfo,
        summary,
        skills: skillSelected,
        softSkills,
        languages,
        workExperiences: works,
        educations,
        projects,
        ...updatedData,
      };

      const percent = calculatePercent(payload);
      const data = await axios.post("profile", {
        ...payload,
        totalPercent: percent,
      });
      if (data) toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const onSetSkill = (skill, isSoft) => {
    if (isSoft) {
      if (softSkills.includes(skill)) return;
      const newSkills = [...softSkills, skill];
      setSoftSkills(newSkills);
      saveProfile({ softSkills: newSkills });
    } else {
      if (skillSelected.includes(skill)) return;
      const newSkills = [...skillSelected, skill];
      setSkillSelected(newSkills);
      saveProfile({ skills: newSkills });
    }
  };

  const onSetItems = (items, field, isUpdate) => {
    if (field === "workExperiences") setWorks(items);
    else if (field === "educations") setEducations(items);
    else if (field === "languages") setLanguages(items);
    else setProjects(items);

    if (isUpdate) saveProfile({ [field]: items });
  };

  const onUpdateItem = (item, field) => {
    let items;
    if (field === "workExperiences") {
      items = works.map((i) => (i.id === item.id ? item : i));
      setWorks(items);
    } else if (field === "educations") {
      items = educations.map((i) => (i.id === item.id ? item : i));
      setEducations(items);
    } else if (field === "languages") {
      items = languages.map((i) => (i.id === item.id ? item : i));
      setLanguages(items);
    } else {
      items = projects.map((i) => (i.id === item.id ? item : i));
      setProjects(items);
    }
    saveProfile({ [field]: items });
  };

  const handleKeyDownSoftSkill = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!softSkill.trim()) return;
      onSetSkill(softSkill.trim(), true);
      setSoftSkill("");
    }
  };

  const handleKeyDownLanguage = (e, currentItem) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!currentItem.lang?.trim()) return;
      saveProfile({ languages });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#5B5FC7] truncate">
          {profileInfo.fullName}
        </h1>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center shrink-0 gap-1.5 px-3 py-1.5 border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <FiEdit2 className="w-3.5 h-3.5" /> Edit Info
        </button>

        <div className="flex flex-col items-center gap-4 p-6">
          {showPdf && (
            <>
              <PDFDownloadLink
                document={
                  <CvTemplate
                    profileInfo={profileInfo}
                    summary={summary}
                    skills={skillSelected}
                    softSkills={softSkills}
                    languages={languages}
                    works={works}
                    educations={educations}
                    projects={projects}
                  />
                }
                onMouseOver={() => setShowDemoPdf(true)}
                fileName={`${profileInfo.fullName || "Candidate"}.pdf`}
                className="px-6 py-2.5 bg-[#5B5FC7] cursor-pointer text-white font-semibold text-sm rounded-lg shadow hover:bg-[#4a4ea6] transition-colors"
              >
                {({ loading }) =>
                  loading
                    ? "Handling create CV..."
                    : "📄 Download PDF (ATS Standard)"
                }
              </PDFDownloadLink>

              {showDemoPdf && (
                <PDFViewer
                  width="100%"
                  height="100%"
                  onMouseOver={() => setShowDemoPdf(true)}
                  onMouseLeave={() => setShowDemoPdf(false)}
                >
                  <CvTemplate
                    profileInfo={profileInfo}
                    summary={summary}
                    skills={skillSelected}
                    softSkills={softSkills}
                    languages={languages}
                    works={works}
                    educations={educations}
                    projects={projects}
                  />
                </PDFViewer>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mb-10 pb-8">
        <div className="flex items-center gap-2.5 text-sm text-gray-500">
          <FiMapPin className="text-gray-400 shrink-0" />
          <span
            className={
              profileInfo.cityProvince ? "text-gray-900" : "text-gray-400"
            }
          >
            {profileInfo.cityProvince || "Add Province/ City"}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-gray-500">
          <FiPhone className="text-gray-400 shrink-0" />
          <span
            className={profileInfo.phone ? "text-gray-900" : "text-gray-400"}
          >
            {profileInfo.phone || "Add phone number"}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-gray-900">
          <FiMail className="text-gray-400 shrink-0" />
          {profileInfo.emailCandidate}
        </div>
        <div className="flex items-center gap-2.5 text-sm text-gray-900">
          <FiGithub className="text-gray-400 shrink-0" />
          <span
            className={profileInfo.github ? "text-gray-900" : "text-gray-400"}
          >
            {profileInfo.github || "Github"}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-gray-500">
          <FiLinkedin className="text-gray-400 shrink-0" />
          <span
            className={profileInfo.linkedin ? "text-gray-900" : "text-gray-400"}
          >
            {profileInfo.linkedin || "Click to add LinkedIn"}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#5B5FC7] uppercase tracking-wider mb-2">
          Summary
        </h3>
        <div className="bg-gray-50/50 border-gray-100 rounded w-full">
          <InlineRichText
            value={summary}
            onChange={setSummary}
            placeholder="Click to add summary"
            onDone={() => saveProfile({ summary })}
            onBlur={(val) => saveProfile({ summary: val })}
          />
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
                key={index}
                onClick={() => {
                  const newSkills = skillSelected.filter(
                    (item) => item !== skill
                  );
                  setSkillSelected(newSkills);
                  saveProfile({ skills: newSkills });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md cursor-pointer"
              >
                {skill}
                <FiX className="w-3.5 h-3.5 hover:text-red-500" />
              </span>
            ))}
            <div className="relative">
              <input
                type="text"
                onClick={() => setShowPopUpSkill(!showPopUpSkill)}
                readOnly
                placeholder="Select skills..."
                className="outline-none text-sm px-2 w-full sm:min-w-[150px] bg-transparent text-gray-500 cursor-pointer"
              />
              {showPopUpSkill && (
                <div className="absolute top-7 left-0 p-3 overflow-auto h-[250px] w-[250px] bg-white text-left flex flex-col gap-3 shadow-lg border border-gray-100 z-10 rounded-md">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="cursor-pointer p-2 hover:bg-indigo-50 hover:text-[#5B5FC7] rounded"
                      onClick={() => {
                        onSetSkill(skill, false);
                        setShowPopUpSkill(false);
                      }}
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
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3">
            {softSkills.map((skill, index) => (
              <span
                key={index}
                onClick={() => {
                  const newSkills = softSkills.filter((item) => item !== skill);
                  setSoftSkills(newSkills);
                  saveProfile({ softSkills: newSkills });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md cursor-pointer"
              >
                {skill}
                <FiX className="w-3.5 h-3.5 hover:text-red-500" />
              </span>
            ))}
            <input
              type="text"
              value={softSkill}
              onChange={(e) => setSoftSkill(e.target.value)}
              onKeyDown={handleKeyDownSoftSkill}
              placeholder="Enter a soft skill and press Enter"
              className="w-55 outline-none text-sm p-2 bg-transparent text-gray-500 border border-gray-200 rounded-md focus:border-[#5B5FC7]"
            />
          </div>
        </div>
      </div>

      <DynamicSection
        title="Work Experience"
        emptyText="No experience added yet."
        items={works}
        setItems={(items) => onSetItems(items, "workExperiences")}
        updateDelete={(items) => onSetItems(items, "workExperiences", true)}
        renderItem={(item, update) => (
          <div className="flex flex-col gap-1 w-full">
            <InlineInput
              value={item.company}
              onChange={(v) => update("company", v)}
              onBlur={() => onUpdateItem(item, "workExperiences")}
              placeholder="Company name"
              className="font-bold text-gray-900 text-sm placeholder-gray-400"
            />
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 px-2">
              <input
                type="date"
                value={item.startDate || ""}
                onChange={(e) => update("startDate", e.target.value)}
                onBlur={() => onUpdateItem(item, "workExperiences")}
                className="text-xs text-[#5B5FC7] bg-gray-50 p-1.5 rounded-md border border-transparent hover:border-gray-200 focus:border-[#5B5FC7] focus:bg-white outline-none cursor-pointer"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="date"
                value={item.endDate || ""}
                onChange={(e) => update("endDate", e.target.value)}
                onBlur={() => onUpdateItem(item, "workExperiences")}
                disabled={item.isCurrent}
                className="text-xs text-[#5B5FC7] bg-gray-50 p-1.5 rounded-md border border-transparent hover:border-gray-200 focus:border-[#5B5FC7] focus:bg-white outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer w-full sm:w-auto mt-2 sm:mt-0">
                <input
                  type="checkbox"
                  checked={item.isCurrent || false}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    update("isCurrent", isChecked);
                    const updatedWorks = works.map((w) =>
                      w.id === item.id ? { ...w, isCurrent: isChecked } : w
                    );
                    setWorks(updatedWorks);
                    saveProfile({ workExperiences: updatedWorks });
                  }}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-[#5B5FC7] focus:ring-[#5B5FC7]"
                />
                I am currently working in this role
              </label>
            </div>
            <WorkSkillSelector
              selectedSkills={item.skills || []}
              onChange={(updatedSkills) => {
                update("skills", updatedSkills);
                const updatedWorks = works.map((w) =>
                  w.id === item.id ? { ...w, skills: updatedSkills } : w
                );
                setWorks(updatedWorks);
                saveProfile({ workExperiences: updatedWorks });
              }}
            />
            <InlineRichText
              value={item.desc}
              onChange={(v) => update("desc", v)}
              onBlur={() => onUpdateItem(item, "workExperiences")}
              onDone={() => onUpdateItem(item, "workExperiences")}
              placeholder="Enter detailed job description and role"
              className="text-sm mt-1"
            />
          </div>
        )}
      />

      <DynamicSection
        title="Education"
        emptyText="No education added yet."
        items={educations}
        setItems={(items) => onSetItems(items, "educations")}
        updateDelete={(items) => onSetItems(items, "educations", true)}
        renderItem={(item, update) => (
          <div className="flex flex-col gap-1 w-full">
            <InlineInput
              value={item.school}
              onChange={(v) => update("school", v)}
              onBlur={() => onUpdateItem(item, "educations")}
              placeholder="School name"
              className="font-bold text-gray-900 text-sm placeholder-gray-400"
            />
            <InlineInput
              value={item.major}
              onChange={(v) => update("major", v)}
              onBlur={() => onUpdateItem(item, "educations")}
              placeholder="Major"
              className="text-sm text-[#5B5FC7] placeholder-[#5b5fc780]"
            />
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 px-2">
              <input
                type="date"
                value={item.startDate || ""}
                onChange={(e) => update("startDate", e.target.value)}
                onBlur={() => onUpdateItem(item, "educations")}
                className="text-xs text-[#5B5FC7] bg-gray-50 p-1.5 rounded-md border border-transparent hover:border-gray-200 focus:border-[#5B5FC7] outline-none cursor-pointer"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="date"
                value={item.endDate || ""}
                onChange={(e) => update("endDate", e.target.value)}
                onBlur={() => onUpdateItem(item, "educations")}
                className="text-xs text-[#5B5FC7] bg-gray-50 p-1.5 rounded-md border border-transparent hover:border-gray-200 focus:border-[#5B5FC7] outline-none cursor-pointer"
              />
            </div>
            <InlineRichText
              value={item.desc}
              onChange={(v) => update("desc", v)}
              onBlur={() => onUpdateItem(item, "educations")}
              onDone={() => onUpdateItem(item, "educations")}
              placeholder="Describe your education program, degrees, and achievements"
              className="text-sm mt-2"
            />
          </div>
        )}
      />

      <DynamicSection
        title="Languages"
        emptyText="No language added yet."
        items={languages}
        setItems={setLanguages}
        updateDelete={(items) => onSetItems(items, "languages", true)}
        renderItem={(item, update) => (
          <InlineInput
            value={item.lang}
            onChange={(v) => update("lang", v)}
            onKeyDown={(e) => handleKeyDownLanguage(e, item)}
            placeholder="Language (e.g. English) - Press Enter to save & add new"
            className="font-bold text-gray-900 text-sm placeholder-gray-400"
          />
        )}
      />

      <DynamicSection
        title="Projects"
        emptyText="No project added yet."
        items={projects}
        setItems={(items) => onSetItems(items, "projects")}
        updateDelete={(items) => onSetItems(items, "projects", true)}
        renderItem={(item, update) => (
          <div className="flex flex-col gap-1 w-full">
            <InlineInput
              value={item.project}
              onChange={(v) => update("project", v)}
              onBlur={() => onUpdateItem(item, "projects")}
              placeholder="Project name"
              className="font-bold text-gray-900 text-sm placeholder-gray-400"
            />
            <div className="mt-1 px-2">
              <input
                type="date"
                value={item.date || ""}
                onChange={(e) => update("date", e.target.value)}
                onBlur={() => onUpdateItem(item, "projects")}
                className="text-xs text-[#5B5FC7] bg-gray-50 p-1.5 rounded-md border border-transparent hover:border-gray-200 focus:border-[#5B5FC7] outline-none cursor-pointer"
              />
            </div>
            <InlineRichText
              value={item.desc}
              onChange={(v) => update("desc", v)}
              onBlur={() => onUpdateItem(item, "projects")}
              onDone={() => onUpdateItem(item, "projects")}
              placeholder="Enter a project description"
              className="text-sm mt-2"
            />
          </div>
        )}
      />
    </div>
  );
};

export default CvCreateTag;
