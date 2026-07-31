import React, { useContext, useEffect, useState } from "react";
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
  FiBriefcase,
  FiClock,
  FiMap,
} from "react-icons/fi";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import skills from "../../components/profile/Skill-list";
import { toast } from "react-toastify";
import cities from "../../components/city-province";
import { AuthContext } from "../../components/context/auth.context";
import axios from "../../utils/axios.customize";

const EditProfileModal = ({ isOpen, onClose, data, onSave }) => {
  const [formData, setFormData] = useState(data);
  const [errs, setErrs] = useState([]);

  if (!isOpen) return null;

  const handleChange = (e, phone) => {
    if (phone) {
      setFormData((prev) => ({ ...prev, phone: e }));
      setErrs((prev) => {
        prev = prev.filter((item) => item != "phoneEmpty");
        return prev.filter((item) => item != "phoneFormat");
      });
      return;
    }
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrs((prev) => {
      return prev.filter((item) => item != name);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = [];

    if (!formData.fullName?.trim()) {
      newErrors.push("fullName");
    }

    if (!formData.jobPosition?.trim()) {
      newErrors.push("jobPosition");
    }

    if (!formData.cityProvince) {
      newErrors.push("cityProvince");
    }

    if (!formData.phone?.trim()) {
      newErrors.push("phoneEmpty");
    } else if (formData.phone.trim().length !== 10) {
      newErrors.push("phoneFormat");
    }

    setErrs(newErrors);

    if (newErrors.length > 0) {
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-blue-600">
            General information
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Click to add display name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm
                  ${
                    errs.includes("fullName")
                      ? "border-red-400"
                      : "border-gray-300"
                  }
                  `}
              />
              {errs.includes("fullName") && (
                <div className="text-sm text-red-500">
                  Please enter your name
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1.5">
                <FiBriefcase className="text-gray-400" /> Your job position
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jobPosition"
                value={formData.jobPosition}
                onChange={handleChange}
                placeholder="Exp: Back- end developer"
                className={`w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm
                  ${
                    errs.includes("jobPosition")
                      ? "border-red-400"
                      : "border-gray-300"
                  }
                  `}
              />
              {errs.includes("jobPosition") && (
                <div className="text-sm text-red-500">
                  Please enter your position
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1.5">
                <FiMapPin className="text-gray-400" /> City/Province{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                name="cityProvince"
                value={formData.cityProvince}
                onChange={handleChange}
                className={`w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm
                  ${
                    errs.includes("cityProvince")
                      ? "border-red-400"
                      : "border-gray-300"
                  }
                  `}
              >
                <option disabled value="">
                  Select city/province
                </option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errs.includes("cityProvince") && (
                <div className="text-sm text-red-500">
                  Please enter your current province/city
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1.5">
                <FiPhone className="text-gray-400" /> Phone
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, "");

                  if (onlyNumbers.length <= 11) {
                    handleChange(onlyNumbers, true);
                  }
                }}
                placeholder="Enter your phone number"
                className={`w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm
                   ${
                     errs.includes("phoneEmpty")
                       ? "border-red-400"
                       : "border-gray-300"
                   }
                    ${
                      errs.includes("phoneFormat")
                        ? "border-red-400"
                        : "border-gray-300"
                    }
                  `}
              />
              {errs.includes("phoneEmpty") && (
                <div className="text-sm text-red-500">
                  Please enter your phone
                </div>
              )}
              {errs.includes("phoneFormat") && (
                <div className="text-sm text-red-500">
                  Length of phone must be equal to 10
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1.5">
                <FiClock className="text-gray-400" /> Add years of experience
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience || 0}
                onChange={handleChange}
                min="0"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1.5">
                <FiMap className="text-gray-400" /> Addresses
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                placeholder="Enter street, ward, district name"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1.5">
                <FiMail className="text-gray-400" /> Email
              </label>
              <input
                type="email"
                name="emailCandidate"
                readOnly
                value={formData.emailCandidate}
                onChange={handleChange}
                className="w-full p-2.5 border bg-gray-200 cursor-not-allowed border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1.5">
                <FiLinkedin className="text-gray-400" /> LinkedIn
              </label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn URL"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1.5">
                <FiGithub className="text-gray-400" /> GitHub
              </label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="GitHub URL"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 mt-8 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/30"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DragHandle = () => (
  <svg
    className="w-4 h-4 text-gray-400 cursor-grab mt-2 shrink-0 hover:text-[#5B5FC7] transition-colors"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M5 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm6-8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
  </svg>
);

const WorkSkillSelector = ({ selectedSkills = [], onChange }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleAddSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      onChange([...selectedSkills, skill]);
    }
    setShowPopup(false);
  };

  const handleRemoveSkill = (skillToRemove) => {
    onChange(selectedSkills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      {selectedSkills.map((skill, index) => (
        <span
          key={index}
          className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
        >
          {skill}
          <FiX
            className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors"
            onClick={() => handleRemoveSkill(skill)}
          />
        </span>
      ))}

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPopup(!showPopup)}
          className="text-xs text-gray-400 hover:text-[#5B5FC7] px-2 py-1 bg-transparent border border-transparent hover:border-gray-200 rounded outline-none cursor-pointer transition-all"
        >
          {selectedSkills.length === 0 ? "Click to add skills" : "+ Add skill"}
        </button>

        {showPopup && (
          <div className="absolute top-7 left-0 p-2 overflow-y-auto h-[200px] w-[220px] bg-white text-left flex flex-col gap-1 shadow-lg border border-gray-200 z-100 rounded-md">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="cursor-pointer p-1.5 text-xs text-gray-700 hover:bg-indigo-50 hover:text-[#5B5FC7] rounded transition-colors"
                onClick={() => handleAddSkill(skill)}
              >
                {skill}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const InlineInput = ({
  value,
  onChange,
  placeholder,
  className,
  type = "text",
  onBlur,
  onKeyDown,
}) => (
  <input
    type={type}
    value={value || ""}
    onBlur={onBlur}
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    className={`w-full bg-transparent border border-transparent hover:border-gray-300 focus:border-[#5B5FC7] focus:bg-white rounded px-2 py-1 -ml-2 outline-none transition-all ${className}`}
  />
);

const InlineRichText = ({
  value,
  onChange,
  placeholder,
  className,
  onDone,
  onBlur,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!isEditing) {
    return (
      <div
        onClick={() => setIsEditing(true)}
        className={`w-full bg-transparent border border-transparent hover:border-gray-300 rounded px-2 py-2 -ml-2 outline-none transition-all cursor-text min-h-[40px] ${className}`}
      >
        {value && value !== "<p><br></p>" ? (
          <div
            dangerouslySetInnerHTML={{ __html: value }}
            className="text-sm text-gray-800 list-inside break-words max-h-[300px] w-full overflow-y-auto"
          />
        ) : (
          <span className="text-sm text-gray-400">{placeholder}</span>
        )}
      </div>
    );
  }

  return (
    <div className="relative border-b-2 border-[#5B5FC7] rounded bg-white z-10 shadow-lg mt-1 mb-3 w-full flex flex-col">
      <ReactQuill
        className="w-full max-h-[300px] overflow-y-auto"
        theme="snow"
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        modules={{
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "bullet" }, { list: "ordered" }],
          ],
        }}
        onBlur={() => onBlur(value)}
      />
      <div className="flex justify-end p-2 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => {
            setIsEditing(false);
            onDone();
          }}
          className="px-4 py-1 text-xs font-semibold bg-[#5B5FC7] text-white rounded hover:bg-[#4a4ea6] transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

const DynamicSection = ({
  title,
  emptyText,
  items,
  setItems,
  renderItem,
  updateDelete,
}) => {
  const handleAdd = () => setItems([...items, { id: Date.now() }]);
  const handleUpdate = (id, field, value) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };
  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
    updateDelete(items.filter((item) => item.id !== id));
  };

  return (
    <div className="mb-4 rounded-lg border border-gray-300 bg-white shadow-sm group hover:border-[#5B5FC7] transition-colors">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#5B5FC7] uppercase tracking-wider">
          {title}
        </h3>
        <button
          onClick={handleAdd}
          className="text-[#5B5FC7] hover:text-[#4a4ea6] transition-all rounded-full hover:bg-indigo-50 p-1 opacity-100 min-[1500px]:opacity-0 group-hover:opacity-100 focus:opacity-100"
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
          <div key={index}>
            {index > 0 && (
              <div className="border-t border-gray-200/60 my-3"></div>
            )}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 sm:gap-3 w-full">
                <DragHandle />
                <div className="flex-1 min-w-0">
                  {renderItem(item, (field, value) =>
                    handleUpdate(item.id, field, value)
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-gray-400 hover:text-red-600 transition-colors shrink-0 ml-2 sm:ml-4 p-1.5 hover:bg-red-50 rounded mt-1"
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
  const { auth } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("My Techroute CV");
  const [isToWork, setIsToWork] = useState(true);

  const [percent, setPercent] = useState(10);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [profileInfo, setProfileInfo] = useState({
    fullName: auth?.user?.fullName || "13_Huỳnh Lợi",
    jobPosition: "",
    cityProvince: "",
    phone: "",
    emailCandidate: auth?.user?.email || "huynhvanloi956@gmail.com",
    github: "",
    linkedin: "",
    yearsOfExperience: 0,
    address: "",
  });

  const [summary, setSummary] = useState("");
  const [skillSelected, setSkillSelected] = useState([]);
  const [softSkill, setSoftSkill] = useState("");
  const [softSkills, setSoftSkills] = useState([]);
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

  const calculatePercentCompleteCv = (data) => {
    if (!data) return 0;

    let totalPercent = 0;

    if (data.phone && data.phone.trim() !== "") totalPercent += 5;
    if (data.emailCandidate && data.emailCandidate.trim() !== "")
      totalPercent += 5;
    if (data.jobPosition && data.jobPosition.trim() !== "") totalPercent += 10;

    if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
      totalPercent += 15;
    }
    if (
      data.workExperiences &&
      Array.isArray(data.workExperiences) &&
      data.workExperiences.length > 0
    ) {
      totalPercent += 10;
    }

    if (
      data.educations &&
      Array.isArray(data.educations) &&
      data.educations.length > 0
    ) {
      totalPercent += 10;
    }
    if (
      data.projects &&
      Array.isArray(data.projects) &&
      data.projects.length > 0
    ) {
      totalPercent += 10;
    }
    if (
      data.summary &&
      data.summary.trim() !== "" &&
      data.summary !== "<p><br></p>"
    ) {
      totalPercent += 10;
    }
    if (data.cityProvince && data.cityProvince.trim() !== "") {
      totalPercent += 5;
    }

    if (data.github && data.github.trim() !== "") totalPercent += 5;
    if (data.linkedin && data.linkedin.trim() !== "") totalPercent += 5;
    if (
      data.languages &&
      Array.isArray(data.languages) &&
      data.languages.length > 0
    ) {
      totalPercent += 5;
    }
    if (
      data.yearsOfExperience !== undefined &&
      data.yearsOfExperience !== null &&
      Number(data.yearsOfExperience) >= 0
    ) {
      totalPercent += 3;
    }
    if (data.address && data.address.trim() !== "") {
      totalPercent += 1;
    }
    if (
      data.softSkills &&
      Array.isArray(data.softSkills) &&
      data.softSkills.length > 0
    ) {
      totalPercent += 1;
    }

    const finalPercent = Math.min(totalPercent, 100);

    setPercent(finalPercent);
    return finalPercent;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await axios.get("profile");

        if (data) {
          setProfileInfo(data);
          setSummary(data.summary);
          setSkillSelected(data.skills);
          setSoftSkills(data.softSkills);
          if (data.workExperiences && Array.isArray(data.workExperiences)) {
            const formattedWorks = data.workExperiences.map((item, index) => {
              return { ...item, id: item.id || `work-${index}-${Date.now()}` };
            });
            setWorks(formattedWorks);
          }
          if (data.educations && Array.isArray(data.educations)) {
            const formattedEducations = data.educations.map((item, index) => {
              return {
                ...item,
                id: item.id || `education-${index}-${Date.now()}`,
              };
            });
            setEducations(formattedEducations);
          }
          if (data.languages && Array.isArray(data.languages)) {
            const formattedLanguages = data.languages.map((item, index) => {
              return { ...item, id: item.id || `lang-${index}-${Date.now()}` };
            });
            setLanguages(formattedLanguages);
          }
          if (data.projects && Array.isArray(data.projects)) {
            const formattedProjects = data.projects.map((item, index) => {
              return {
                ...item,
                id: item.id || `project-${index}-${Date.now()}`,
              };
            });
            setProjects(formattedProjects);
          }
          calculatePercentCompleteCv(data);
        }
      } catch (err) {
        toast.error(err.message);
        console.error(`Status code from Backend [${err.code}]:`, err.message);
      }
    };

    fetchProfile();
  }, []);

  const onSetSkill = (skill, isSort) => {
    if (isSort) {
      if (softSkills.includes(skill)) return;

      const updatedSoftSkills = [...softSkills, skill];

      setSoftSkills(updatedSoftSkills);

      saveProfile({ softSkills: updatedSoftSkills });
    } else {
      if (skillSelected.includes(skill)) return;

      const updatedSkills = [...skillSelected, skill];
      setSkillSelected(updatedSkills);
      saveProfile({ skills: updatedSkills });
    }
  };

  const onSetItems = (items, field, update) => {
    if (field === "workExperiences") {
      setWorks(items);
    } else if (field === "educations") {
      setEducations(items);
    } else if (field === "languages") {
      setLanguages(items);
    } else {
      setProjects(items);
    }
    if (update) {
      saveProfile({ [field]: items });
    }
  };

  const onUpdateItem = (item, field) => {
    let items;

    if (field === "workExperiences") {
      items = works;
      items.map((i) => (i.id == item.id ? item : i));
      setWorks(items);
    } else if (field === "educations") {
      items = educations;
      items.map((i) => (i.id == item.id ? item : i));
      setEducations(items);
    } else if (field === "languages") {
      items = languages;
      items.map((i) => (i.id == item.id ? item : i));
      setLanguages(items);
    } else {
      items = projects;
      items.map((i) => (i.id == item.id ? item : i));
      setProjects(items);
    }

    console.log(items);
    saveProfile({ [field]: items });
  };

  const saveProfile = async (updatedData) => {
    try {
      console.log({
        ...profileInfo,
        summary,
        skills: skillSelected,
        softSkills: softSkills,
        languages,
        workExperiences: works,
        educations,
        projects,
        openToWork: isToWork,
        ...updatedData,
      });
      const data = await axios.post("profile", {
        ...profileInfo,
        summary,
        skills: skillSelected,
        softSkills: softSkills,
        languages,
        workExperiences: works,
        educations,
        projects,
        openToWork: isToWork,
        ...updatedData,
      });

      if (data) {
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      toast.error(err.message);
      console.error(`Status code from Backend [${err.code}]:`, err.message);
    }
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

      if (!currentItem.lang || !currentItem.lang.trim()) return;

      const updatedLanguages = [...languages];

      setLanguages(updatedLanguages);

      saveProfile({ languages: updatedLanguages });
    }
  };

  const handleBlur = (updateData) => {
    saveProfile(updateData);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 font-sans">
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          data={profileInfo}
          onSave={(updatedData) => {
            setProfileInfo(updatedData);
            saveProfile(updatedData);
          }}
        />
      )}

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
              {percent}% Completed
            </span>
            <h2 className="text-lg font-bold text-gray-900 text-center break-words w-full">
              {profileInfo.fullName}
            </h2>
            <p className="text-sm text-gray-500 text-center">
              {profileInfo.jobPosition}
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
              onClick={() => {
                const newStatus = !isToWork;
                setIsToWork(newStatus);
                saveProfile({ openToWork: newStatus });
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
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

        <div className="flex-1 flex flex-col min-w-0">
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
                  className={
                    profileInfo.phone ? "text-gray-900" : "text-gray-400"
                  }
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
                  className={
                    profileInfo.github ? "text-gray-900" : "text-gray-400"
                  }
                >
                  {profileInfo.github || "Github"}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-500">
                <FiLinkedin className="text-gray-400 shrink-0" />
                <span
                  className={
                    profileInfo.linkedin ? "text-gray-900" : "text-gray-400"
                  }
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
                  onDone={() => {
                    saveProfile({ summary });
                  }}
                  onBlur={(updateData) => {
                    handleBlur({ summary: updateData });
                  }}
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
                      onClick={() => {
                        const newSkills = skillSelected.filter(
                          (item) => item !== skill
                        );
                        setSkillSelected(newSkills);
                        saveProfile({ skills: newSkills });
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
                      onClick={() => setShowPopUpSkill(!showPopUpSkill)}
                      readOnly
                      placeholder="Select skills..."
                      className="outline-none text-sm px-2 w-full sm:min-w-[150px] bg-transparent text-gray-500 cursor-pointer"
                    />
                    {showPopUpSkill && (
                      <div className="absolute top-7 left-0 p-3 overflow-auto h-[250px] w-[250px] bg-white text-left flex flex-col gap-3 shadow-lg border border-gray-100 z-10 rounded-md">
                        {skills.map((skill, index) => (
                          <div
                            className="cursor-pointer p-2 hover:bg-indigo-50 hover:text-[#5B5FC7] rounded"
                            onClick={() => {
                              onSetSkill(skill);
                              setShowPopUpSkill(false);
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
                <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3">
                  {softSkills.map((skill, index) => (
                    <span
                      onClick={() => {
                        const newSkills = softSkills.filter(
                          (item) => item !== skill
                        );
                        setSoftSkills(newSkills);
                        saveProfile({ softSkills: newSkills });
                      }}
                      key={index}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md"
                    >
                      {skill}
                      <FiX className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" />
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
              setItems={(items) => {
                onSetItems(items, "workExperiences");
              }}
              updateDelete={(items) => {
                onSetItems(items, "workExperiences", true);
              }}
              renderItem={(item, update) => (
                <div className="flex flex-col gap-1 w-full">
                  <InlineInput
                    value={item.company}
                    onChange={(v) => {
                      update("company", v);
                    }}
                    onBlur={() => {
                      onUpdateItem(item, "workExperiences");
                    }}
                    placeholder="Company name"
                    className="font-bold text-gray-900 text-sm placeholder-gray-400"
                  />
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 px-2">
                    <input
                      type="date"
                      value={item.startDate || ""}
                      onChange={(e) => {
                        update("startDate", e.target.value);
                      }}
                      onBlur={() => {
                        onUpdateItem(item, "workExperiences");
                      }}
                      className="text-xs text-[#5B5FC7] bg-gray-50 p-1.5 rounded-md border border-transparent hover:border-gray-200 focus:border-[#5B5FC7] focus:bg-white outline-none cursor-pointer"
                    />
                    <span className="text-gray-400 text-xs">-</span>
                    <input
                      type="date"
                      value={item.endDate || ""}
                      onChange={(e) => {
                        update("endDate", e.target.value);
                      }}
                      onBlur={() => {
                        onUpdateItem(item, "workExperiences");
                      }}
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
                            w.id === item.id
                              ? { ...w, isCurrent: isChecked }
                              : w
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
                    onChange={(v) => {
                      update("desc", v);
                    }}
                    onBlur={() => {
                      onUpdateItem(item, "workExperiences");
                    }}
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
              setItems={(items) => {
                onSetItems(items, "educations");
              }}
              updateDelete={(items) => {
                onSetItems(items, "educations", true);
              }}
              renderItem={(item, update) => (
                <div className="flex flex-col gap-1 w-full">
                  <InlineInput
                    value={item.school}
                    onChange={(v) => {
                      update("school", v);
                    }}
                    onBlur={() => {
                      onUpdateItem(item, "educations");
                    }}
                    placeholder="School name"
                    className="font-bold text-gray-900 text-sm placeholder-gray-400"
                  />
                  <InlineInput
                    value={item.major}
                    onChange={(v) => {
                      update("major", v);
                    }}
                    onBlur={() => {
                      onUpdateItem(item, "educations");
                    }}
                    placeholder="Major"
                    className="text-sm text-[#5B5FC7] placeholder-[#5b5fc780]"
                  />
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 px-2">
                    <input
                      type="date"
                      value={item.startDate || ""}
                      onChange={(e) => {
                        update("startDate", e.target.value);
                      }}
                      onBlur={() => {
                        onUpdateItem(item, "educations");
                      }}
                      className="text-xs text-[#5B5FC7] bg-gray-50 p-1.5 rounded-md border border-transparent hover:border-gray-200 focus:border-[#5B5FC7] outline-none cursor-pointer"
                    />
                    <span className="text-gray-400 text-xs">-</span>
                    <input
                      type="date"
                      value={item.endDate || ""}
                      onChange={(e) => {
                        update("endDate", e.target.value);
                      }}
                      onBlur={() => {
                        onUpdateItem(item, "educations");
                      }}
                      className="text-xs text-[#5B5FC7] bg-gray-50 p-1.5 rounded-md border border-transparent hover:border-gray-200 focus:border-[#5B5FC7] outline-none cursor-pointer"
                    />
                  </div>
                  <InlineRichText
                    value={item.desc}
                    onChange={(v) => {
                      update("desc", v);
                    }}
                    onBlur={() => {
                      onUpdateItem(item, "educations");
                    }}
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
              setItems={(items) => {
                setLanguages(items);
              }}
              updateDelete={(items) => {
                onSetItems(items, "languages", true);
              }}
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
              setItems={(items) => {
                onSetItems(items, "projects");
              }}
              updateDelete={(items) => {
                onSetItems(items, "projects", true);
              }}
              renderItem={(item, update) => (
                <div className="flex flex-col gap-1 w-full">
                  <InlineInput
                    value={item.project}
                    onChange={(v) => update("project", v)}
                    onBlur={() => {
                      onUpdateItem(item, "projects");
                    }}
                    placeholder="Project name"
                    className="font-bold text-gray-900 text-sm placeholder-gray-400"
                  />
                  <div className="mt-1 px-2">
                    <input
                      type="date"
                      value={item.date || ""}
                      onChange={(e) => update("date", e.target.value)}
                      onBlur={() => {
                        onUpdateItem(item, "projects");
                      }}
                      className="text-xs text-[#5B5FC7] bg-gray-50 p-1.5 rounded-md border border-transparent hover:border-gray-200 focus:border-[#5B5FC7] outline-none cursor-pointer"
                    />
                  </div>
                  <InlineRichText
                    value={item.desc}
                    onChange={(v) => update("desc", v)}
                    onBlur={() => {
                      onUpdateItem(item, "projects");
                    }}
                    onDone={() => {
                      onUpdateItem(item, "projects");
                    }}
                    placeholder="Enter a project description"
                    className="text-sm mt-2"
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
