import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../components/context/auth.context.jsx";
import axios from "../../../utils/axios.customize.js";
import CvCreateTag from "./cv-create-tag.jsx";
import { EditProfileModal } from "./cv-create-component.jsx";
import CvUploadTag from "./cv-upload-tag.jsx";
import JobManagementTag from "./job-management-tag.jsx";
import { toast } from "react-toastify";
import EmailManagementTab from "./email-management-tag.jsx";

const ProfilePage = () => {
  const location = useLocation();

  const { auth } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [isToWork, setIsToWork] = useState(true);
  const [percent, setPercent] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [profileInfo, setProfileInfo] = useState({
    fullName: auth?.user?.fullName || "Username",
    jobPosition: "",
    cityProvince: "",
    phone: "",
    emailCandidate: auth?.user?.email || "user@gmail.com",
    github: "",
    linkedin: "",
    yearsOfExperience: 0,
    address: "",
  });

  const tabs = {
    profile: "My Techroute CV",
    "job-management": "Job management",
    "my-cv": "CV Management",
    "email-management": "Email Management",
  };

  const onChangeActiveTab = (tab) => {
    window.location.hash = tab;
    setActiveTab(tab);
  };

  useEffect(() => {
    const hash = location.hash;

    const tab = hash.replace("#", "");

    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab("profile");
    }
  }, [location]);

  useEffect(() => {
    const fetchGeneralInfo = async () => {
      try {
        const data = await axios.get("profile");
        if (data) {
          setProfileInfo(data);
          setIsToWork(data.openToWork);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchGeneralInfo();
  }, []);

  const handleProfileUpdated = (newPercent, openToWorkStatus) => {
    setPercent(newPercent);
    if (openToWorkStatus !== undefined) setIsToWork(openToWorkStatus);
  };

  const handleSaveModalInfo = async (updatedData) => {
    setProfileInfo({ ...profileInfo, ...updatedData });
    console.log({ ...profileInfo, ...updatedData });
    try {
      const data = await axios.post("profile", {
        ...profileInfo,
        ...updatedData,
      });
      if (data) toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 font-sans">
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          data={profileInfo}
          onSave={(updateData) => {
            handleSaveModalInfo(updateData);
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[320px] flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center shadow-sm">
            {(() => {
              const radius = 45;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset =
                circumference - (percent / 100) * circumference;

              return (
                <div className="flex flex-col items-center">
                  <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                    <svg
                      className="w-full h-full transform -rotate-90 absolute"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="6"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="#5B5FC7"
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-500 ease-out"
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
                </div>
              );
            })()}
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
              onClick={async () => {
                const newStatus = !isToWork;
                setIsToWork(newStatus);
                handleSaveModalInfo({ openToWork: newStatus });
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
              {Object.entries(tabs).map(([key, tab]) => (
                <button
                  key={key}
                  onClick={() => onChangeActiveTab(key)}
                  className={`py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === key
                      ? "text-[#5B5FC7] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#5B5FC7]"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === "profile" && (
            <CvCreateTag
              profileInfo={profileInfo}
              setIsEditModalOpen={setIsEditModalOpen}
              onProfileUpdated={handleProfileUpdated}
            />
          )}

          {activeTab === "job-management" && <JobManagementTag />}
          {activeTab === "my-cv" && <CvUploadTag />}
          {activeTab === "email-management" && (
            <EmailManagementTab />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
