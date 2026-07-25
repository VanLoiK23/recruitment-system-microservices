import React, { useEffect, useRef, useState } from "react";
import CloseButton from "../button/button-close";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-toastify";
import axios from "../../utils/axios.customize";
import { Eye } from "lucide-react";
import CircleLoading from "../animation/animate-loading";

const ApplyJobModal = ({ auth, job, onClose }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [infoApply, setInfoApply] = useState({
    fullName: auth?.user?.fullName || "",
    email: auth?.user?.email || "",
    phone: "",
    recruiterEmail: job.recruiterEmail,
    jobId: job.id,
  });

  const [cvList, setCvList] = useState([]);

  const [selectedCvId, setSelectedCvId] = useState(
    cvList.length > 0 ? cvList[cvList.length - 1].id : null
  );

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const getWordCount = (htmlText) => {
    const plainText = htmlText.replace(/<[^>]+>/g, "").trim();
    return plainText === "" ? 0 : plainText.split(/\s+/).length;
  };

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "bullet" }, { list: "ordered" }],
    ],
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.warn("File's size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      uploadCv();
    } else {
      toast.warn("No file selected");
    }
  };

  useEffect(() => {
    const loadListCv = async () => {
      try {
        const data = await axios.get("applications/cv");

        if (data) {
          setCvList(data);
        }
      } catch (err) {
        toast.error(err.message);
        console.error(`Status code from Backend [${err.code}]:`, err.message);
      }
    };
    loadListCv();
  }, [job]);

  const uploadCv = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file CV trước!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    try {
      const data = await axios.post("applications/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data) {
        setCvList([...cvList, data]);
        setSelectedCvId(
          cvList.length > 0 ? cvList[cvList.length - 1].id : null
        );
      }
    } catch (err) {
      toast.error(err.message);
      console.error(`Status code from Backend [${err.code}]:`, err.message);
    } finally {
      setLoading(false);
    }
  };

  const onApply = async () => {
    if(!infoApply.email){
      toast.warn("Email is required");
      return;
    }

    if(!infoApply.fullName){
      toast.warn("Fullname is required");
      return;
    }

    if(!infoApply.phone){
      toast.warn("Phone is required");
      return;
    }

    if(infoApply.phone.length!==10){
      toast.warn("Format phone is not correct");
      return;
    }

    try {
      const data = await axios.post("applications", {
        ...infoApply,
        cvUrl: cvList[selectedCvId]?.fileUrl || "user",
        description: coverLetter,
      });

      if (data) {
        toast.success("Apply job successfully !");
      } else {
        toast.warn("Apply job failed");
      }
    } catch (err) {
      toast.error(err.message);
      console.error(`Status code from Backend [${err.code}]:`, err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100 relative">
          <div className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors">
            <CloseButton onClose={onClose} />
          </div>

          <h2 className="text-sm font-medium text-gray-500 mb-1">
            Apply for job
          </h2>
          <h1 className="text-2xl font-semibold text-gray-900 leading-snug">
            <span className="text-blue-600">{job?.title}</span> at{" "}
            {job?.location}
          </h1>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
          <section>
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Basic information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  onChange={(e) => {
                    setInfoApply({ ...infoApply, fullName: e.target.value });
                  }}
                  required
                  value={infoApply.fullName}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Phone number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    onChange={(e) => {
                      setInfoApply({ ...infoApply, phone: e.target.value });
                    }}
                    required
                    placeholder="0999999999"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    onChange={(e) => {
                      setInfoApply({ ...infoApply, email: e.target.value });
                    }}
                    required
                    value={infoApply.email}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Current resumes:
            </h3>
            <div className="flex flex-col justify-center gap-3">
              {cvList.map((cv, index) => {
                const isSelected = selectedCvId === cv.id;
                return (
                  <div
                    key={cv.id || index}
                    className={`border rounded-lg p-4 flex items-start gap-3 transition-colors ${
                      isSelected
                        ? "bg-blue-50/50 border-blue-400"
                        : "bg-[#f4f5f5] border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="resume"
                      value={cv.id}
                      checked={isSelected}
                      onChange={() => setSelectedCvId(cv.id)}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="font-medium text-gray-900">
                          {`${cv.fileName || ""}`}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="font-bold">
                            Upload from computer
                          </span>
                          <span>{cv.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <a
                        href={cv.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
              <div
                className={`border rounded-lg p-4 flex items-start gap-3 transition-colors ${
                  selectedCvId === "user"
                    ? "bg-blue-50/50 border-blue-400"
                    : "bg-[#f4f5f5] border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="resume"
                  checked={selectedCvId === "user"}
                  onChange={() => setSelectedCvId("user")}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        {`${auth?.user?.fullName || ""}`}
                      </span>
                      <span className="bg-red-50 text-red-500 text-xs font-semibold px-2 py-0.5 rounded">
                        10%
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>
                        user_profile_apply_modal_last_updated_at 22:47
                        13/06/2024
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />

              <div className="mt-5 flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleButtonClick}
                  disabled={loading}
                  className={`text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm
                    ${
                      loading
                        ? "cursor-not-allowed bg-gray-500"
                        : "cursor-pointer bg-blue-600 hover:bg-blue-700"
                    }
                    `}
                >
                  {loading ? (
                    <CircleLoading />
                  ) : (
                    <span className="flex gap-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      Upload new CV
                    </span>
                  )}
                </button>

                <span className="text-sm text-gray-500">
                  {`Support *.doc, *.docx, *.pdf, and < 5MB`}
                </span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Cover letter
            </h3>

            <div className="border border-gray-300 rounded-lg overflow-hidden transition-all bg-white">
              <ReactQuill
                theme="snow"
                value={coverLetter}
                onChange={setCoverLetter}
                modules={quillModules}
                placeholder="Enter your self-introduction or portfolio link..."
                className="h-32 mb-10 custom-quill"
              />

              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-right text-sm text-gray-500">
                {getWordCount(coverLetter)} words
              </div>
            </div>
          </section>
        </div>

        <div className="p-5 border-t border-gray-200 bg-white flex justify-end items-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={onApply}
            className="px-8 py-2.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all"
          >
            Send CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobModal;
