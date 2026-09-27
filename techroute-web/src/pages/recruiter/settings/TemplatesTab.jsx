import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Type,
} from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "../../../utils/axios.customize";
import { toast } from "react-toastify";

const AVAILABLE_VARIABLES = [
  { key: "{{candidateName}}", label: "Candidate Name" },
  { key: "{{jobTitle}}", label: "Job Title" },
  { key: "{{interviewDate}}", label: "Interview Date" },
];

export default function TemplatesTab() {
  const [templates, setTemplates] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [searchKey, setSearchKey] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    id: "",
    templateKey: "",
    subject: "",
    description: "",
    htmlContent: "",
  });

  const quillRef = useRef(null);

  useEffect(() => {
    fetchTemplates();
  }, [page, searchKey]);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await axios.get(
        `notifications/templates?templateKey=${searchKey}&page=${page}&limit=1&sortBy=createdAt`
      );
      if (data) {
        setTemplates(data.content || []);
        setHasNext(!data.last || false);
        console.log(data.hasNext);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const keyRegex = /^[A-Z_]+$/;

    if (!formData.templateKey)
      newErrors.templateKey = "Template key is required";
    else if (formData.templateKey.length > 100)
      newErrors.templateKey = "Must not exceed 100 characters";
    else if (!keyRegex.test(formData.templateKey))
      newErrors.templateKey = "Only uppercase letters and underscores allowed";

    if (!formData.subject) newErrors.subject = "Subject is required";
    else if (formData.subject.length > 255)
      newErrors.subject = "Must not exceed 255 characters";

    if (formData.description && formData.description.length > 500)
      newErrors.description = "Must not exceed 500 characters";

    if (!formData.htmlContent || formData.htmlContent === "<p><br></p>")
      newErrors.htmlContent = "HTML content is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const isUpdate = !!formData.id;
    const url = isUpdate
      ? `notifications/templates/${formData.id}`
      : "notifications/templates";
    const method = isUpdate ? "PUT" : "POST";

    try {
      const data =
        method === "POST"
          ? await axios.post(url, formData)
          : await axios.put(url, formData);

      if (data) {
        if (isUpdate) {
          setTemplates(templates.map((t) => (t.id === data.id ? data : t)));
        } else {
          setTemplates([data, ...templates]);
        }
        setActiveTemplate(data);
        setFormData(data);
        setErrors({});

        fetchTemplates();

        toast.success("Upsert template successfully !");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    try {
      const data = await axios.delete(`notifications/templates/${formData.id}`);
      if (data) {
        setTemplates(templates.filter((t) => t.id !== formData.id));
        handleCreateNew();
        fetchTemplates();
        toast.success("Delete template successfully !");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCreateNew = () => {
    setActiveTemplate(null);
    setFormData({
      id: "",
      templateKey: "",
      subject: "",
      description: "",
      htmlContent: "",
    });
    setErrors({});
  };

  const selectTemplate = (tpl) => {
    setActiveTemplate(tpl);
    setFormData({
      id: tpl.id || "",
      templateKey: tpl.templateKey || "",
      subject: tpl.subject || "",
      description: tpl.description || "",
      htmlContent: tpl.htmlContent || "",
    });
    setErrors({});
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setPage(1);
      fetchTemplates();
    }
  };

  const insertVariable = (variable) => {
    if (!quillRef.current) return;
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection(true);
    if (range) {
      editor.insertText(range.index, variable);
      editor.setSelection(range.index + variable.length);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "bullet" }, { list: "ordered" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="flex h-[800px]">
      <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <button
            onClick={handleCreateNew}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5D5CDE] text-white rounded-lg hover:bg-[#4A49B2] transition-colors shadow-sm font-medium mb-4"
          >
            <Plus size={18} />
            Create Template
          </button>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search keys..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D5CDE] outline-none text-sm"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {isLoading ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              Loading...
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              No templates found
            </div>
          ) : (
            templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => selectTemplate(tpl)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                  activeTemplate?.id === tpl.id
                    ? "bg-[#5D5CDE]/10 border border-[#5D5CDE]/20"
                    : "bg-transparent border border-transparent hover:bg-gray-200"
                }`}
              >
                <div
                  className={`font-semibold text-sm truncate ${
                    activeTemplate?.id === tpl.id
                      ? "text-[#5D5CDE]"
                      : "text-gray-900"
                  }`}
                >
                  {tpl.templateKey}
                </div>
                <div className="text-xs text-gray-500 truncate mt-1">
                  {tpl.subject}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-white">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <span className="text-xs font-medium text-gray-600">Page {page}</span>
          <button
            disabled={!hasNext}
            onClick={() => setPage((p) => p + 1)}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-900">
            {activeTemplate?.id ? "Edit Template" : "New Template"}
          </h3>
          <div className="flex items-center gap-3">
            {activeTemplate?.id && (
              <button
                onClick={handleDelete}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              onClick={handleSave}
              className="px-6 py-2.5 text-sm font-medium text-white bg-[#5D5CDE] rounded-lg hover:bg-[#4A49B2] transition-colors shadow-sm"
            >
              Save Template
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col space-y-5 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6 flex-shrink-0">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Template Key
              </label>
              <input
                type="text"
                value={formData.templateKey}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    templateKey: e.target.value.toUpperCase(),
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D5CDE] outline-none uppercase font-mono text-sm ${
                  errors.templateKey ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="E.g. OFFER_ACCEPTED"
              />
              {errors.templateKey && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.templateKey}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D5CDE] outline-none ${
                  errors.subject ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description (Optional)
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D5CDE] outline-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="flex-1 flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Content
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <Type size={14} /> Insert Variables:
                </span>
                {AVAILABLE_VARIABLES.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => insertVariable(v.key)}
                    className="px-2.5 py-1 bg-white border border-gray-200 rounded text-xs font-mono text-[#5D5CDE] hover:border-[#5D5CDE] hover:bg-[#5D5CDE]/5 transition-colors shadow-sm"
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`flex-1 flex flex-col border rounded-lg overflow-hidden ${
                errors.htmlContent ? "border-red-500" : "border-gray-300"
              }`}
            >
              <ReactQuill
                key={formData.id || "new-template"}
                ref={quillRef}
                theme="snow"
                value={formData.htmlContent}
                onChange={(contentValue) =>
                  setFormData({ ...formData, htmlContent: contentValue })
                }
                placeholder="Compose your email template here..."
                modules={quillModules}
                className="flex-1 flex flex-col h-full [&>.ql-container]:flex-1 [&>.ql-container]:overflow-y-auto [&>.ql-container]:text-sm [&>.ql-toolbar]:bg-gray-50"
              />
            </div>
            {errors.htmlContent && (
              <p className="text-red-500 text-xs mt-1">{errors.htmlContent}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
