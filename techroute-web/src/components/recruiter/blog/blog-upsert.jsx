import React, { useState, useEffect } from "react";
import {
  X,
  Image as ImageIcon,
  Type,
  FolderOpen,
  Tag,
  FileText,
  Save,
  Send,
  Upload,
} from "lucide-react";
import ReactQuill from "react-quill-new";
import { FiX } from "react-icons/fi";
import CircleLoading from "../../animation/animate-loading";
import { toast } from "react-toastify";
import axios from "../../../utils/axios.customize";

const BlogUpsertModal = ({
  blog,
  onClose,
  onSave,
  isAdd,
  categories,
  loading,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    thumbnailUrl: "",
    categoryId: "",
    content: "",
  });
  const [tagActive, setTagActive] = useState("");
  const [tags, setTags] = useState([]);

  const [isSaveDraft, setSaveDraft] = useState(false);

  useEffect(() => {
    if (!isAdd && blog) {
      setFormData({
        id: blog.id || "",
        title: blog.title || "",
        thumbnailUrl: blog.thumbnailUrl || "",
        categoryId: blog.categoryId || "",
        content: blog.content || "",
      });
      setTags(blog.tags || []);
      console.log("ID cate: " + blog.categoryId);
    }

    const fetchBlogDraft = async () => {
      try {
        const data = await axios.get("blogs/draft");

        if (data) {
          setFormData({
            id: data.id || "",
            title: data.title || "",
            thumbnailUrl: data.thumbnailUrl || "",
            categoryId: data.categoryId || "",
            content: data.content || "",
          });
          setTags(data.tags || []);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };

    if (isAdd) {
      fetchBlogDraft();
    }
  }, [blog, isAdd]);

  const onChangeTag = (e) => {
    const value = e.target.value;

    setTagActive(value);
  };

  const onSaveTag = (e) => {
    if (e.key === "Enter") {
      const isNew = !tags.includes(tagActive);

      if (isNew && tagActive) {
        const value = tagActive.trim();
        setTags([...tags, value]);
      }
      setTagActive("");
    }
  };

  const onDeleteTag = (tagDelete) => {
    setTags((prev) => {
      return prev.filter((tag) => tag !== tagDelete);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit!");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      thumbnailUrl: previewUrl,
      thumbnailFile: file,
    }));
  };

  const handleSubmit = (e, isDraft) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      tags: tags,
    };

    onSave(formattedData, isDraft);
    setSaveDraft(isDraft);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10 shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-[#1A2238]">
              {isAdd ? "Write New Article" : "Edit Article"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">
              {isAdd
                ? "Draft a new post for your audience"
                : "Update the information of this article"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gray-50/30 custom-scrollbar">
          <form id="blogForm" className="space-y-6 max-w-3xl mx-auto">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <ImageIcon size={16} className="text-[#5B5FC7]" />
                Cover Image
              </label>
              <div className="flex gap-4 items-center">
                <div className="flex-0.5">
                  <label className="flex items-center justify-center w-full px-4 py-2.5 bg-white border-2 border-dashed border-gray-300 hover:border-[#5B5FC7] hover:bg-[#5B5FC7]/5 rounded-xl cursor-pointer transition-all text-sm text-gray-500 font-medium group">
                    <Upload
                      size={16}
                      className="mr-2 text-gray-400 group-hover:text-[#5B5FC7] transition-colors"
                    />
                    <span>Click to choose an image file...</span>

                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      required={isAdd && !formData.thumbnailUrl}
                    />
                  </label>
                </div>

                <div className="w-86 h-51 shrink-0 rounded-lg border border-gray-200 bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400 shadow-inner">
                  {formData.thumbnailUrl ? (
                    <img
                      src={formData.thumbnailUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={16} />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Type size={16} className="text-[#5B5FC7]" />
                Article Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a catchy title..."
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B5FC7]/20 focus:border-[#5B5FC7] transition-all text-sm font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <FolderOpen size={16} className="text-[#5B5FC7]" />
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B5FC7]/20 focus:border-[#5B5FC7] transition-all text-sm cursor-pointer"
                  required
                >
                  <option defaultChecked value="" disabled>
                    Select a category
                  </option>

                  {categories.map((category) => (
                    <option value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Tag size={16} className="text-[#5B5FC7]" />
                  Tags (Keywords)
                </label>
                <div className="flex flex-col gap-2">
                  <div>
                    <input
                      type="text"
                      name="tags"
                      value={tagActive}
                      onChange={onChangeTag}
                      onKeyDown={onSaveTag}
                      placeholder="Java, AI, Career..."
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B5FC7]/20 focus:border-[#5B5FC7] transition-all text-sm"
                    />
                    <p className="text-[11px] text-gray-500 italic px-1">
                      * Press `Enter` to create multiple tag
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        onClick={() => {
                          onDeleteTag(tag);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md cursor-pointer"
                      >
                        {tag}
                        <FiX className="w-3.5 h-3.5 hover:text-red-500" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <FileText size={16} className="text-[#5B5FC7]" />
                Content
              </label>

              <div className="rounded-xl overflow-hidden border border-gray-200 focus-within:border-[#5B5FC7] focus-within:ring-2 focus-within:ring-[#5B5FC7]/20 transition-all bg-white">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(contentValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      content: contentValue,
                    }));
                  }}
                  placeholder="Write your amazing article here..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "bullet" }, { list: "ordered" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                  className="h-[550px] mb-[42px]"
                />
              </div>

              {(!formData.content || formData.content === "<p><br></p>") && (
                <input
                  type="text"
                  className="h-0 w-0 opacity-0 absolute"
                  required
                />
              )}
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-bold transition-all shadow-sm"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {isAdd && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-xl text-sm font-bold transition-all shadow-sm"
              >
                {loading && isSaveDraft ? (
                  <CircleLoading />
                ) : (
                  <span className="flex gap-2">
                    <Save size={16} />
                    Save Draft
                  </span>
                )}
              </button>
            )}
            <button
              type="button"
              disabled={loading}
              onClick={(e) => {
                const form = document.getElementById("blogForm");
                if (!formData.content) {
                  toast.warn("Content blog is required");
                  return;
                }
                if (!tags) {
                  toast.warn("Tags blog is required");
                  return;
                }
                if (!formData.thumbnailUrl) {
                  toast.warn("Thumbnail Img blog is required");
                  return;
                }
                if (form.checkValidity()) {
                  handleSubmit(e, false);
                } else {
                  form.reportValidity();
                }
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#5B5FC7] hover:bg-[#4C50B6] text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-[#5B5FC7]/30"
            >
              {loading && !isSaveDraft ? (
                <CircleLoading />
              ) : (
                <span className="flex gap-2">
                  <Save size={16} />
                  Save Changes
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogUpsertModal;
