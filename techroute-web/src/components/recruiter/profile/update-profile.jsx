import React, { useState, useEffect } from "react";

const EditProfileRecruiterModal = ({ isOpen, onClose, profile, onSave }) => {
  const [editForm, setEditForm] = useState(profile);

  useEffect(() => {
    setEditForm(profile);
  }, [profile, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B1A2E]/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(44,42,130,0.12)] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col font-['Be_Vietnam_Pro'] animate-[fadeIn_0.2s_ease-out]">
        <div className="px-6 py-5 border-b border-[#E7E5F3] flex justify-between items-center bg-white">
          <h2 className="font-['Sora'] text-xl font-bold text-[#1B1A2E]">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-[#A6A4B8] hover:text-[#D6455D] transition-colors p-1 rounded-lg hover:bg-[#FCE7EB]"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-white">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[12.5px] font-bold text-[#38364F] mb-2 font-['Sora']">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={editForm.fullName}
                onChange={handleChange}
                required
                className="w-full bg-[#F7F6FC] border border-[#E7E5F3] rounded-lg px-4 py-2.5 text-[13.5px] text-[#1B1A2E] focus:outline-none focus:border-[#5D5CDE] focus:bg-white focus:ring-2 focus:ring-[#5D5CDE]/20 transition-all"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[12.5px] font-bold text-[#38364F] mb-2 font-['Sora']">
                Job Role
              </label>
              <input
                type="text"
                name="role"
                value={editForm.role}
                onChange={handleChange}
                required
                className="w-full bg-[#F7F6FC] border border-[#E7E5F3] rounded-lg px-4 py-2.5 text-[13.5px] text-[#1B1A2E] focus:outline-none focus:border-[#5D5CDE] focus:bg-white focus:ring-2 focus:ring-[#5D5CDE]/20 transition-all"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[12.5px] font-bold text-[#38364F] mb-2 font-['Sora']">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={editForm.company}
                onChange={handleChange}
                required
                className="w-full bg-[#F7F6FC] border border-[#E7E5F3] rounded-lg px-4 py-2.5 text-[13.5px] text-[#1B1A2E] focus:outline-none focus:border-[#5D5CDE] focus:bg-white focus:ring-2 focus:ring-[#5D5CDE]/20 transition-all"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[12.5px] font-bold text-[#38364F] mb-2 font-['Sora']">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={editForm.location}
                onChange={handleChange}
                required
                className="w-full bg-[#F7F6FC] border border-[#E7E5F3] rounded-lg px-4 py-2.5 text-[13.5px] text-[#1B1A2E] focus:outline-none focus:border-[#5D5CDE] focus:bg-white focus:ring-2 focus:ring-[#5D5CDE]/20 transition-all"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[12.5px] font-bold text-[#38364F] mb-2 font-['Sora']">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                required
                readOnly
                className="w-full bg-gray-400 border border-[#E7E5F3] rounded-lg px-4 py-2.5 text-[13.5px] text-[#1B1A2E] transition-all"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[12.5px] font-bold text-[#38364F] mb-2 font-['Sora']">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={editForm.phone}
                onChange={handleChange}
                required
                className="w-full bg-[#F7F6FC] border border-[#E7E5F3] rounded-lg px-4 py-2.5 text-[13.5px] text-[#1B1A2E] focus:outline-none focus:border-[#5D5CDE] focus:bg-white focus:ring-2 focus:ring-[#5D5CDE]/20 transition-all"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[12.5px] font-bold text-[#38364F] mb-2 font-['Sora']">
                About
              </label>
              <textarea
                name="about"
                value={editForm.about}
                onChange={handleChange}
                rows="4"
                required
                className="w-full bg-[#F7F6FC] border border-[#E7E5F3] rounded-lg px-4 py-3 text-[13.5px] text-[#1B1A2E] focus:outline-none focus:border-[#5D5CDE] focus:bg-white focus:ring-2 focus:ring-[#5D5CDE]/20 transition-all resize-none leading-relaxed"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#E7E5F3] flex justify-end gap-3 bg-[#F7F6FC]">
          <button
            onClick={onClose}
            className="font-['Sora'] text-[13px] font-bold text-[#38364F] bg-white border border-[#E7E5F3] px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={() => onSave(editForm)}
            className="font-['Sora'] text-[13px] font-bold text-white bg-gradient-to-br from-[#5D5CDE] to-[#4338CA] px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileRecruiterModal;
