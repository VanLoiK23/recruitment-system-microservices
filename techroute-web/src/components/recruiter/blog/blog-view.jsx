import React from "react";
import { X, Calendar, Eye, FolderOpen, Tag, FileText } from "lucide-react";

const BlogViewDetail = ({ blog, onClose, renderStatusBadge }) => {
  if (!blog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#5B5FC7]/10 text-[#5B5FC7] rounded-lg">
              <FileText size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#1A2238]">
              Article Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/30">
          <div className="w-full h-48 sm:h-64 bg-gray-200 relative">
            {blog.thumbnailUrl ? (
              <img
                src={blog.thumbnailUrl}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop";
                }}
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                <span>No cover image provided</span>
              </div>
            )}
            <div className="absolute top-4 right-4 shadow-sm">
              {renderStatusBadge(blog.status)}
            </div>
          </div>

          <div className="p-6 sm:p-8 max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#5B5FC7]/10 text-[#5B5FC7] text-xs font-bold uppercase tracking-wider">
                <FolderOpen size={14} />
                {blog.category || "General"}
              </span>

              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-gray-300">|</span>
                  {blog.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 text-gray-600 rounded-md text-xs font-medium"
                    >
                      <Tag size={12} className="text-gray-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A2238] leading-tight mb-6">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 p-4 bg-white border border-gray-100 rounded-xl mb-8 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5B5FC7]/10 flex items-center justify-center text-[#5B5FC7] font-bold">
                  {(blog.authorName || "A").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Author</p>
                  <p className="text-sm font-bold text-slate-800">
                    {blog.authorName || "Anonymous"}
                  </p>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Published Date
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {blog.createdAt || "N/A"}
                  </p>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <Eye size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Total Views
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {(blog.viewCount || 0).toLocaleString()} views
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed">
              {blog.content ? (
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              ) : (
                <p className="text-center text-gray-400 italic py-10">
                  No content available.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl text-sm font-bold transition-all shadow-sm"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogViewDetail;
