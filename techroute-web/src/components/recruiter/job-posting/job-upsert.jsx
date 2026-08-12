import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Plus,
  Trash2,
  Tag,
  CheckCircle2,
  DraftingCompass,
  BookMarked,
} from "lucide-react";
import categories from "../../homepage/Categories";
import experienceLevels from "../../homepage/experience-level";
import workTypes from "../../homepage/work-type";
import cities from "../../city-province";
import { toast } from "react-toastify";
import axios from "../../../utils/axios.customize";

const categoriesData = categories;

const JobEditModal = ({ job, onClose, onSave, isAdd }) => {
  const [formData, setFormData] = useState({
    title: "",
    minSalary: 0,
    maxSalary: 0,
    status: "PENDING",
    categories: [],
    roles: [""],
    technologies: [],
    requirements: [""],
    benefits: [""],
    jobLevel: experienceLevels[0],
    workType: workTypes[0],
    location: cities[0],
    hotJob: false,
    description: "",
    deadline: "",
  });

  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    if (job) {
      setFormData({
        ...job,
        categories: job.categories || [],
        roles: job.roles?.length ? job.roles : [""],
        technologies: job.technologies || [],
        requirements: job.requirements?.length ? job.requirements : [""],
        benefits: job.benefits?.length ? job.benefits : [""],
        deadline: job.deadline ? job.deadline.substring(0, 10) : "",
      });
    }

    const fetchJobDraft = async () => {
      try {
        const data = await axios.get("jobs/draft");

        if (data) {
          setFormData({
            ...data,
            categories: data.categories || [],
            roles: data.roles?.length ? data.roles : [""],
            technologies: data.technologies || [],
            requirements: data.requirements?.length ? data.requirements : [""],
            benefits: data.benefits?.length ? data.benefits : [""],
            deadline: data.deadline ? data.deadline.substring(0, 10) : "",
          });
        }
      } catch (err) {
        toast.error(err.message);
      }
    };

    if (isAdd) {
      fetchJobDraft();
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (index, field, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayItem = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray.length ? newArray : [""] });
  };

  const handleAddTag = (e, field, inputState, setInputState) => {
    if (e.key === "Enter" && inputState.trim()) {
      e.preventDefault();
      if (!formData[field].includes(inputState.trim())) {
        setFormData({
          ...formData,
          [field]: [...formData[field], inputState.trim()],
        });
      }
      setInputState("");
    }
  };

  const removeTag = (tagToRemove, field) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((tag) => tag !== tagToRemove),
    });
  };

  const handleCategorySelect = (e) => {
    const value = e.target.value;
    if (value && !formData.categories.includes(value)) {
      setFormData({ ...formData, categories: [...formData.categories, value] });
    }
    e.target.value = "";
  };

  const validateForm = () => {
    if (!formData.title || !formData.title.trim()) {
      toast.warn("Job title is required.");
      return null;
    }

    if (
      formData.minSalary === null ||
      formData.minSalary === undefined ||
      formData.minSalary < 0
    ) {
      toast.warn("Minimum salary must be greater than or equal to 0.");
      return null;
    }
    if (
      formData.maxSalary === null ||
      formData.maxSalary === undefined ||
      formData.maxSalary < 0
    ) {
      toast.warn("Maximum salary must be greater than or equal to 0.");
      return null;
    }
    if (Number(formData.maxSalary) < Number(formData.minSalary)) {
      toast.warn(
        "Maximum salary must be greater than or equal to minimum salary."
      );
      return null;
    }

    if (!formData.categories || formData.categories.length === 0) {
      toast.warn("At least one category is required.");
      return null;
    }

    if (!formData.technologies || formData.technologies.length === 0) {
      toast.warn("At least one technology is required.");
      return null;
    }

    const cleanedRoles = formData.roles.map((r) => r.trim()).filter(Boolean);
    if (cleanedRoles.length === 0) {
      toast.warn("At least one role is required.");
      return null;
    }

    if (!formData.description || !formData.description.trim()) {
      toast.warn("Job description is required.");
      return null;
    }

    if (!formData.deadline) {
      toast.warn("Job deadline is required.");
      return null;
    }

    const cleanedRequirements = formData.requirements
      .map((r) => r.trim())
      .filter(Boolean);
    if (cleanedRequirements.length === 0) {
      toast.warn("At least one requirement is required.");
      return null;
    }

    const cleanedBenefits = formData.benefits
      .map((b) => b.trim())
      .filter(Boolean);
    if (cleanedBenefits.length === 0) {
      toast.warn("At least one benefit is required.");
      return null;
    }

    return {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      minSalary: Number(formData.minSalary),
      maxSalary: Number(formData.maxSalary),
      roles: cleanedRoles,
      requirements: cleanedRequirements,
      benefits: cleanedBenefits,
      deadline: formData.deadline.includes(" ")
        ? formData.deadline
        : `${formData.deadline} 23:59:59`,
    };
  };

  const cleanFormData = (data) => {
    const cleaned = { ...data };

    Object.keys(cleaned).forEach((key) => {
      if (Array.isArray(cleaned[key])) {
        cleaned[key] = cleaned[key]
          .map((item) => (typeof item === "string" ? item.trim() : item))
          .filter((item) => item !== "" && item !== null && item !== undefined);
      } else if (typeof cleaned[key] === "string") {
        cleaned[key] = cleaned[key].trim();
      }
    });

    return cleaned;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let cleanedData;
    let isDraft;
    if (formData.status !== "DRAFT") {
      cleanedData = validateForm();

      if (!cleanedData) return;
    } else {
      cleanedData = formData;
      const formattedDeadline = formData.deadline.includes(" ")
        ? formData.deadline
        : `${formData.deadline} 23:59:59`;

      cleanedData = { ...formData, deadline: formattedDeadline };
      isDraft = true;
    }

    cleanedData = cleanFormData(cleanedData);

    onSave(cleanedData, isDraft);
    console.log("Valid Data submitted:", cleanedData);
  };

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1A2238]/60 backdrop-blur-sm flex justify-center items-center p-4 sm:p-6 transition-all font-sans antialiased text-slate-800">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-[#1A2238]">
              {isAdd ? "Add" : "Edit"} Job Posting
            </h2>
            {!isAdd && (
              <p className="text-sm text-gray-500 mt-1">
                Update information for {formData.title || "this position"}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto bg-[#F4F7FE]/40 p-6 custom-scrollbar flex flex-col gap-6"
        >
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[#1A2238] mb-2">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A2238] mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status ? formData.status : "DRAFT"}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7] transition-all"
              >
                <option value="PENDING">PENDING</option>
                {isAdd ? (
                  <option value="DRAFT">DRAFT</option>
                ) : (
                  <option value="CLOSED">CLOSED</option>
                )}
              </select>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <input
                type="checkbox"
                name="hotJob"
                id="hotJob"
                checked={formData.hotJob}
                onChange={handleChange}
                className="w-5 h-5 accent-[#5B5FC7] cursor-pointer"
              />
              <label
                htmlFor="hotJob"
                className="text-sm font-bold text-red-600 cursor-pointer"
              >
                Mark as Hot Job
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A2238] mb-2">
                Minimum Salary ($)
              </label>
              <input
                type="number"
                name="minSalary"
                value={formData.minSalary}
                onChange={(e) => {
                  if (Number.isInteger(e.target.value)) {
                    handleChange(e);
                  }
                }}
                min="0"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A2238] mb-2">
                Maximum Salary ($)
              </label>
              <input
                type="number"
                name="maxSalary"
                value={formData.maxSalary}
                onChange={(e) => {
                  if (Number.isInteger(e.target.value)) {
                    handleChange(e);
                  }
                }}
                min="0"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A2238] mb-2">
                Job Level
              </label>
              <select
                name="jobLevel"
                value={formData.jobLevel}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7] transition-all"
              >
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A2238] mb-2">
                Work Type
              </label>
              <select
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7] transition-all"
              >
                {workTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A2238] mb-2">
                Location
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7] transition-all"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A2238] mb-2">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7] transition-all"
                required
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#1A2238] mb-2">
                Categories
              </label>
              <select
                onChange={handleCategorySelect}
                defaultValue=""
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7] transition-all mb-3"
              >
                <option value="" disabled>
                  Select categories to add...
                </option>
                {categoriesData.map((group) => (
                  <optgroup key={group.title} label={group.title}>
                    {group.jobs.map((job) => (
                      <option key={job} value={job}>
                        {job}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 border border-gray-200"
                  >
                    {cat}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-red-500"
                      onClick={() => removeTag(cat, "categories")}
                    />
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A2238] mb-2">
                Technologies (Press Enter)
              </label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) =>
                  handleAddTag(e, "technologies", techInput, setTechInput)
                }
                placeholder="e.g. React, Java"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7] transition-all mb-3"
              />
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="bg-[#1A2238]/5 text-[#1A2238] px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 border border-[#1A2238]/10"
                  >
                    {tech}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-red-500"
                      onClick={() => removeTag(tech, "technologies")}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-bold text-[#1A2238]">Roles</label>
              <button
                type="button"
                onClick={() => addArrayItem("roles")}
                className="text-[#5B5FC7] hover:bg-[#5B5FC7]/10 p-1.5 rounded-lg transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {formData.roles.map((role, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <textarea
                    value={role}
                    onChange={(e) =>
                      handleArrayChange(idx, "roles", e.target.value)
                    }
                    rows={2}
                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7] text-sm resize-none transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(idx, "roles")}
                    className="text-gray-400 hover:text-red-500 mt-2 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-bold text-[#1A2238] mb-2">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7] transition-all resize-y"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-bold text-[#1A2238]">
                  Requirements
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem("requirements")}
                  className="text-[#5B5FC7] hover:bg-[#5B5FC7]/10 p-1.5 rounded-lg transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {formData.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <textarea
                      value={req}
                      onChange={(e) =>
                        handleArrayChange(idx, "requirements", e.target.value)
                      }
                      rows={2}
                      className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7] text-sm resize-none transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(idx, "requirements")}
                      className="text-gray-400 hover:text-red-500 mt-2 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-bold text-[#1A2238]">
                  Benefits
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem("benefits")}
                  className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {formData.benefits.map((ben, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <textarea
                      value={ben}
                      onChange={(e) =>
                        handleArrayChange(idx, "benefits", e.target.value)
                      }
                      rows={2}
                      className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7] text-sm resize-none transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(idx, "benefits")}
                      className="text-gray-400 hover:text-red-500 mt-2 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-4 shrink-0">
          {isAdd && (
            <button
              onClick={(e) => {
                setFormData({ ...formData, status: "DRAFT" });
                handleSubmit(e);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#51acf2] hover:bg-[#517794] text-white font-bold flex items-center gap-2 transition-all shadow-md shadow-[#5B5FC7]/20"
            >
              <BookMarked size={18} />
              Save as Draft
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-[#5B5FC7] hover:bg-[#4C50B6] text-white font-bold flex items-center gap-2 transition-all shadow-md shadow-[#5B5FC7]/20"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobEditModal;
