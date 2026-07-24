import React, { useState } from "react";
import CloseButton from "../button/button-close";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; 

const ApplyJobModal = ({ auth, job, onClose, uploadCV }) => {
  const [coverLetter, setCoverLetter] = useState("");

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
                  defaultValue={`${auth?.user?.fullName || ""}`}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Phone number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="0999999999"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    defaultValue={`${auth?.user?.email || ""}`}
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
            <div className="bg-[#f4f5f5] border border-gray-200 rounded-lg p-4 flex items-start gap-3">
              <input
                type="radio"
                name="resume"
                defaultChecked
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
                      user_profile_apply_modal_last_updated_at 22:47 13/06/2024
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-4" onClick={uploadCV}>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm">
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
              </button>
              <span className="text-sm text-gray-500">
                Support *.doc, *.docx, *.pdf, and {"<"} 5MB
              </span>
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
            onClick={() =>
              console.log("Nội dung Cover Letter là:", coverLetter)
            }
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
