import React, { useEffect, useState } from "react";
import { Search, Clock, Calendar, User } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios.customize";

const TechBlog = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [previous, setPrevious] = useState(false);
  const [pageActive, setPageActive] = useState(1);
  const [limit, setLimit] = useState(6);
  const [next, setNext] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await axios.get("categories");
        if (data) setCategories(data);
      } catch (err) {
        toast.error(err.message);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        let url = `blogs?page=${pageActive}&limit=${limit}`;
        if (searchQuery) url += `&query=${encodeURIComponent(searchQuery)}`;
        if (activeCategory !== "All")
          url += `&category=${encodeURIComponent(activeCategory)}`;

        const data = await axios.get(url);

        if (data) {
          setBlogs(data.content || []);
          setPrevious(!data?.first);
          setNext(!data?.last);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };

    const timer = setTimeout(() => {
      loadBlogs();
    }, 300);

    return () => clearTimeout(timer);
  }, [pageActive, searchQuery, activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setPageActive(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPageActive(1);
  };

  const onChangePage = (newPage) => {
    setPageActive(newPage);
  };

  const getExcerpt = (htmlString) => {
    if (!htmlString) return "";
    const plainText = htmlString.replace(/<[^>]*>?/gm, "");
    return plainText.length > 120
      ? plainText.substring(0, 120) + "..."
      : plainText;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-20">
      <div className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Techroute <span className="text-[#5B5FC7]">Insights</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-8">
            Discover the latest trends in software engineering, AI innovations,
            system design, and career growth tips for IT professionals.
          </p>

          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#5B5FC7] transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#5B5FC7]/20 focus:border-[#5B5FC7] transition-all outline-none"
              placeholder="Search articles, tutorials, news..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-gray-200 pb-4">
          <button
            onClick={() => handleCategoryChange('All')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              activeCategory === 'All'
                ? "bg-[#5B5FC7] text-white shadow-md shadow-[#5B5FC7]/20"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                activeCategory === category.id
                  ? "bg-[#5B5FC7] text-white shadow-md shadow-[#5B5FC7]/20"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/blog/${post.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#5B5FC7] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm mb-5 flex-1 leading-relaxed">
                  {getExcerpt(post.content)}
                </p>

                <div className="border-t border-gray-100 pt-4 mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#5B5FC7]">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {post.authorName}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.createdAt}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {blogs.length > 0 && (
          <div className="flex items-center gap-3 justify-end mt-8">
            <button
              disabled={!previous}
              className={`px-4 py-2 text-center text-sm border rounded-xl font-medium transition-all ${
                !previous
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-[#5B5FC7] border-[#5B5FC7]/30 hover:bg-[#5B5FC7] hover:text-white cursor-pointer"
              }`}
              onClick={() => onChangePage(pageActive - 1)}
            >
              Previous
            </button>

            <span className="text-sm text-gray-600 font-medium">
              Page {pageActive}
            </span>

            <button
              disabled={!next}
              className={`px-4 py-2 text-center text-sm border rounded-xl font-medium transition-all ${
                !next
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-[#5B5FC7] border-[#5B5FC7]/30 hover:bg-[#5B5FC7] hover:text-white cursor-pointer"
              }`}
              onClick={() => onChangePage(pageActive + 1)}
            >
              Next
            </button>
          </div>
        )}

        {blogs.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
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
              We couldn't find what you were looking for. Try adjusting your
              search or category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechBlog;
