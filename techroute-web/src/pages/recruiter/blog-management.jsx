import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Image as ImageIcon,
  Tag,
  Calendar,
  User,
  CircleHelp,
  AlertCircle,
  X,
} from "lucide-react";
import axios from "../../utils/axios.customize";
import CircleLoading from "../../components/animation/animate-loading";
import { toast } from "react-toastify";

const BlogManagementPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogActive, setBlogActive] = useState({});

  const [previous, setPrevious] = useState(false);
  const [pageActive, setPageActive] = useState(1);
  const [limit, setLimit] = useState(6);
  const [next, setNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showViewPopup, setShowViewPopUp] = useState(false);
  const [showUpsertPopup, setShowUpsertPopUp] = useState(false);
  const [showAddPopup, setShowAddPopUp] = useState(false);

  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        let url = `blogs/posted?page=${pageActive}&limit=${limit}`;
        if (searchQuery) url += `&query=${encodeURIComponent(searchQuery)}`;
        if (statusFilter) url += `&status=${statusFilter}`;

        const data = await axios.get(url);

        if (data) {
          setBlogs(data?.blogSlice?.content || []);
          setPrevious(!data?.blogSlice?.first);
          setNext(!data?.blogSlice?.last);
          setTotalElements(data?.totalElement || 0);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchBlogs();
    }, 300);

    return () => clearTimeout(timer);
  }, [pageActive, searchQuery, statusFilter, limit]);

  const onChangePage = (newPage) => {
    setPageActive(newPage);
  };

  const handleDelete = async (blogId) => {
    const check = window.confirm(
      "Are you sure you want to delete this blog post?"
    );
    if (!check) return;

    try {
      const data = await axios.delete(`blogs/${blogId}`);

      if (data?.success || data) {
        toast.success("Blog deleted successfully!");
        setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
        setTotalElements((prev) => Math.max(0, prev - 1));
      } else {
        toast.warn("Blog delete failed");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while deleting!");
    }
  };

  const onChangeSearch = (e) => {
    setSearchQuery(e.target.value);
    setPageActive(1);
  };

  const handleSave = async (formData, isDraft) => {
    try {
      let data;
      if (isDraft) {
        data = await axios.post(`blogs/draft`, formData);
      } else if (showAddPopup) {
        data = await axios.post(`blogs`, formData);
      } else {
        data = await axios.put(`blogs/${formData.id}`, formData);
      }

      if (data) {
        if (isDraft) {
          toast.success("Blog saved as Draft successfully!");
        } else {
          toast.success("Blog published successfully!");

          setBlogs((prevBlogs) => {
            const isExisting = prevBlogs.some((blog) => blog.id === data.id);
            if (isExisting) {
              return prevBlogs.map((blog) =>
                blog.id === data.id ? data : blog
              );
            } else {
              return [data, ...prevBlogs];
            }
          });
        }

        setShowUpsertPopUp(false);
        setShowAddPopUp(false);
      }
    } catch (err) {
      const errorData = err.message;

      if (typeof errorData === "object" && errorData !== null) {
        Object.values(errorData).forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorData || "An error occurred!");
      }
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Published
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Pending
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F7FE] p-6 md:p-8 font-sans antialiased text-slate-800">
      {showReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setShowReason(false);
                setReason("");
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Rejection Reason
                </h3>
                <p className="text-xs text-gray-500">
                  Feedback from the administration team
                </p>
              </div>
            </div>

            <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 text-sm text-rose-950 font-medium whitespace-pre-wrap leading-relaxed">
              {reason || "No specific reason provided."}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowReason(false);
                  setReason("");
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Blog & Article Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Create, manage and publish tech insights and company blogs
          </p>
        </div>

        <button
          onClick={() => {
            setBlogActive({});
            setShowUpsertPopUp(true);
            setShowAddPopUp(true);
          }}
          className="flex items-center gap-2 cursor-pointer bg-[#5B5FC7] hover:bg-[#4a4ea3] text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-[#5B5FC7]/20"
        >
          <Plus size={20} />
          <span>Write New Article</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search articles by title or keyword..."
            value={searchQuery}
            onChange={onChangeSearch}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B5FC7]/20 focus:border-[#5B5FC7] transition-all text-sm"
          />
        </div>

        <button className="relative flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
          <Filter size={18} />
          <select
            name="statusFilter"
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
            defaultValue=""
            className="border-0 outline-0"
            id="statusFilter"
          >
            <option value="" disabled>
              Filter status
            </option>
            <option value="PUBLISHED">Published</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
            <option value="">All status</option>
          </select>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Article Info
                </th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Category & Tags
                </th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                  Views
                </th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <CircleLoading />
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="relative mb-4 p-4 bg-slate-50 rounded-full border border-slate-100 shadow-inner group">
                        <img
                          src="https://i.ibb.co/pYQ0kz0/company-employees-use-web-search-find-ideas-doing-business-company-1150-43196.avif"
                          alt="Not-found"
                          className="w-40 h-40 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-1">
                        No Articles Found
                      </h3>

                      <p className="text-sm text-slate-500 max-w-sm">
                        You haven't written any blogs yet or no articles matched
                        your search.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5 max-w-md">
                        {blog.thumbnailUrl ? (
                          <img
                            src={blog.thumbnailUrl}
                            alt={blog.title}
                            className="w-14 h-14 rounded-xl object-cover border border-gray-100 shadow-sm shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=200&auto=format&fit=crop";
                            }}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                            <ImageIcon size={20} />
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <h4
                            className="font-bold text-[#1A2238] line-clamp-1 group-hover:text-[#5B5FC7] transition-colors"
                            title={blog.title}
                          >
                            {blog.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <User size={12} className="text-[#5B5FC7]" />
                            <span>{blog.authorName || "Anonymous"}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1.5 max-w-xs">
                        <span className="inline-block font-semibold text-xs text-[#5B5FC7] bg-[#5B5FC7]/10 px-2.5 py-0.5 rounded-md w-fit">
                          {blog.category}
                        </span>
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {blog.tags.slice(0, 2).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200"
                              >
                                #{tag}
                              </span>
                            ))}
                            {blog.tags.length > 2 && (
                              <span className="text-[11px] text-gray-400 self-center">
                                +{blog.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                        <Eye size={14} className="text-[#5B5FC7]" />
                        {(blog.viewCount || 0).toLocaleString()}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      {renderStatusBadge(blog.status)}
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-500 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{blog.createdAt || "N/A"}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          className="p-2 text-gray-400 hover:text-[#5B5FC7] hover:bg-[#5B5FC7]/10 rounded-lg transition-colors cursor-pointer"
                          title="View article details"
                          onClick={() => {
                            setBlogActive(blog);
                            setShowViewPopUp(true);
                          }}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit article"
                          onClick={() => {
                            setBlogActive(blog);
                            setShowUpsertPopUp(true);
                            setShowAddPopUp(false);
                          }}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete article"
                          onClick={() => handleDelete(blog.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                        {blog.status === "REJECTED" && (
                          <button
                            className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Why was this rejected?"
                            onClick={() => {
                              setShowReason(true);
                              setReason(job?.reason);
                            }}
                          >
                            <CircleHelp size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {blogs.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing {pageActive} - {Math.ceil(totalElements / limit)} of
              &nbsp;
              {Math.ceil(totalElements / limit)} postings
            </span>
            <div className="flex gap-1">
              <button
                disabled={!previous}
                className={`px-3 py-1 border rounded
              ${
                !previous
                  ? "bg-gray-200 text-gray-400 hover:bg-gray-50 border-gray-200 cursor-not-allowed"
                  : "bg-white text-[#5B5FC7] border-[#5B5FC7]/30 hover:bg-[#5B5FC7] hover:text-white cursor-pointer"
              }
              `}
                onClick={() => onChangePage(pageActive - 1)}
              >
                Previous
              </button>
              <button className="px-3 py-1 bg-[#5B5FC7] text-white rounded">
                {pageActive}
              </button>
              <button
                disabled={!next}
                className={`px-3 py-1 border rounded
                ${
                  !next
                    ? "bg-gray-200 text-gray-400 hover:bg-gray-50 border-gray-200 cursor-not-allowed"
                    : "bg-white text-[#5B5FC7] border-[#5B5FC7]/30 hover:bg-[#5B5FC7] hover:text-white cursor-pointer"
                }
                `}
                onClick={() => onChangePage(pageActive + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagementPage;
