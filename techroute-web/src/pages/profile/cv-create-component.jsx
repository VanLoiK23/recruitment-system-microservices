import React, { useState } from "react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiLinkedin,
  FiGithub,
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
import cities from "../../components/city-province";

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

export {
  DynamicSection,
  EditProfileModal,
  DragHandle,
  WorkSkillSelector,
  InlineInput,
  InlineRichText,
};
