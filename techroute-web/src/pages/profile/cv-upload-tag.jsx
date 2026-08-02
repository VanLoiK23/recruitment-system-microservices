import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../utils/axios.customize";
import {
  FiUploadCloud,
  FiDownload,
  FiTrash2,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiHash,
} from "react-icons/fi";

const CvUploadTag = () => {
  const [cvs, setCvs] = useState([]);

  const uploadCv = () => {};
  const handleDelete = () => {};

  useEffect(() => {
    const loadCvsUploaded = async () => {
      try {
        const data = await axios.get("applications/profile/cv");

        if (data) {
          setCvs(data);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };
    loadCvsUploaded();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">CV Management</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage your uploaded CVs for quick job applications.
          </p>
        </div>

        <button
          className="flex items-center justify-center gap-2 bg-[#5B5FC7] hover:bg-[#4a4ea6] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md shadow-indigo-100 cursor-pointer"
          onClick={uploadCv}
        >
          <FiUploadCloud className="w-5 h-5" />
          Upload more CV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50 text-gray-600 text-xs font-bold uppercase tracking-wider">
              <th className="py-3 px-4 rounded-l-lg">
                <div className="flex items-center gap-1.5">
                  <FiFileText className="text-gray-400" /> CV's Name
                </div>
              </th>
              <th className="py-3 px-4">
                <div className="flex items-center gap-1.5">
                  <FiCheckCircle className="text-gray-400" /> Complete status
                </div>
              </th>
              <th className="py-3 px-4">
                <div className="flex items-center gap-1.5">
                  <FiClock className="text-gray-400" /> Last edited at
                </div>
              </th>
              <th className="py-3 px-4">
                <div className="flex items-center gap-1.5">
                  <FiHash className="text-gray-400" /> Code
                </div>
              </th>
              <th className="py-3 px-4 text-center rounded-r-lg">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {cvs.length > 0 ? (
              cvs.map((cv, index) => (
                <tr
                  key={cv.id || index}
                  className="hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="py-4 px-4 font-semibold text-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-[#5B5FC7] rounded-lg">
                        <FiFileText className="w-5 h-5" />
                      </div>
                      <span className="truncate max-w-[220px] sm:max-w-xs" title={cv.fileName}>
                        {cv.fileName}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Completed
                    </span>
                  </td>

                  <td className="py-4 px-4 text-gray-500 text-xs">
                    {cv.uploadedAt}
                  </td>

                  <td className="py-4 px-4 font-mono text-xs text-gray-400">
                    {cv.id}
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={cv.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-[#5B5FC7] hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Download CV"
                      >
                        <FiDownload className="w-4 h-4" />
                      </a>

                      <button
                        onClick={handleDelete}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete CV"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-3">
                    <FiUploadCloud className="w-12 h-12 text-gray-300 stroke-1" />
                    <p className="text-sm font-medium">No CVs uploaded yet.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CvUploadTag;