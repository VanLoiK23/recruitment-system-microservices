import { useEffect, useRef, useState } from "react";
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
import CircleLoading from "../../components/animation/animate-loading";

const CvUploadTag = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [previous, setPrevious] = useState(false);
  const [pageActive, setPageActive] = useState(1);
  const [limit, setLimit] = useState(5);
  const [next, setNext] = useState(false);

  const fileInputRef = useRef(null);

  const handleButtonUploadClick = () => {
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

  const uploadCv = async () => {
    if (!selectedFile) {
      toast.error("File CV is required!");
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
        setCvs([...cvs, data]);
      }
    } catch (err) {
      toast.error(err.message);
      console.error(`Status code from Backend [${err.code}]:`, err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cvId) => {
    const check = window.confirm("Are you sure you want to delete this CV ?");

    if (!check) {
      return;
    }

    try {
      const data = await axios.delete("applications/cv");

      if (data.isSuccess) {
        setCvs((prev) => prev.filter((item) => item.id != cvId));
        toast.success("Delete Cv successfully");
      } else {
        toast.warn("Delete failed");
      }
    } catch (err) {
      toast.error(err.message);
      console.error(`Status code from Backend [${err.code}]:`, err.message);
    }
  };

  useEffect(() => {
    const loadCvsUploaded = async () => {
      try {
        const data = await axios.get(
          `applications/profile/cv?page=${pageActive}&limit=${limit}`
        );

        if (data) {
          setCvs(data.content);
          setPrevious(!data?.first);
          setNext(!data?.last);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };
    loadCvsUploaded();
  }, [pageActive]);

  const onChangePage = (page, isPrev) => {
    if (isPrev) {
      if (previous) {
        setPageActive(page);
      }
    } else {
      if (next) {
        setPageActive(page);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">CV Management</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage your uploaded CVs for quick job applications.
          </p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="hidden"
        />

        <button
          onClick={handleButtonUploadClick}
          disabled={loading}
          className={`
            flex items-center justify-center gap-2 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md shadow-indigo-100
            ${
              loading
                ? "cursor-not-allowed bg-gray-500"
                : "cursor-pointer bg-[#5B5FC7] hover:bg-[#4a4ea6]"
            }
            `}
        >
          {loading ? (
            <CircleLoading />
          ) : (
            <span className="flex gap-3">
              <FiUploadCloud className="w-5 h-5" />
              Upload more CV
            </span>
          )}
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
                      <span
                        className="truncate max-w-[220px] sm:max-w-xs"
                        title={cv.fileName}
                      >
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
                        onClick={() => handleDelete(cv.id)}
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
        {cvs?.length > 0 && (
          <div className="flex items-center gap-3 justify-end">
            <div
              className={`px-2 py-1 text-center text-sm border rounded-xl border-blue-300
            ${!previous ? "bg-gray-400 pointer-events-none" : "cursor-pointer"}
            `}
              onClick={() => onChangePage(pageActive - 1, true)}
            >
              Previous
            </div>
            <div
              className={`px-2 py-1 text-center text-sm border rounded-xl border-blue-300
            ${!next ? "bg-gray-400 pointer-events-none" : "cursor-pointer"}
            `}
              onClick={() => onChangePage(pageActive + 1, false)}
            >
              Next
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CvUploadTag;
