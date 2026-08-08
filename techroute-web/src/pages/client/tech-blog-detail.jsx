import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Eye, Tag, Clock } from "lucide-react";
import { toast } from "react-toastify";
import axios from "../../utils/axios.customize";
import CircleLoading from "../../components/animation/animate-loading";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [previous, setPrevious] = useState(false);
  const [pageActive, setPageActive] = useState(1);
  const [limit, setLimit] = useState(6);
  const [next, setNext] = useState(false);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        const data = await axios.get(`blogs/${id}`);
        if (data) {
          setPost(data);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetail();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      if (post && post.tags && post.tags.length > 0) {
        try {
          const allTags = post.tags.join(",");

          const data = await axios.get(
            `blogs/relevant?tags=${encodeURIComponent(
              allTags
            )}&page=${pageActive}&limit=${limit}`
          );

          if (data) {
            const filteredRelated = data.content.filter((b) => b.id !== id);

            setRelatedBlogs(filteredRelated);

            setPrevious(!data?.first);
            setNext(!data?.last);
          }
        } catch (err) {
          console.error("Failed to load related blogs", err);
        }
      }
    };
    fetchRelatedBlogs();
  }, [post, id, pageActive]);

  const onChangePage = (newPage) => {
    setPageActive(newPage);
  };

  const getExcerpt = (htmlString) => {
    if (!htmlString) return "";
    const plainText = htmlString.replace(/<[^>]*>?/gm, "");
    return plainText.length > 100
      ? plainText.substring(0, 100) + "..."
      : plainText;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <CircleLoading />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Blog not found
        </h2>
        <button
          onClick={() => navigate("/blogs")}
          className="text-[#5B5FC7] hover:underline"
        >
          Return to blogs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <div className="relative h-80 md:h-[400px] w-full bg-slate-900">
        <img
          src={post.thumbnailUrl}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors text-sm font-medium w-fit cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Articles
            </button>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{post.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.createdAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.viewCount} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <article
          className="prose prose-slate prose-lg max-w-none 
                     prose-headings:text-[#5B5FC7] prose-a:text-[#5B5FC7] hover:prose-a:text-[#4C50B6]
                     prose-img:rounded-xl prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold">
              <Tag className="w-5 h-5 text-[#5B5FC7]" />
              <h3>Related Topics</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-1.5 bg-[#5B5FC7]/10 text-[#5B5FC7] rounded-full text-sm font-medium hover:bg-[#5B5FC7] hover:text-white transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {relatedBlogs.length > 0 && (
        <div className="bg-[#f8f9fa] py-16 mt-12 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8">
              Related Articles
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedPost) => (
                <div
                  key={relatedPost.id}
                  onClick={() => navigate(`/blog/${relatedPost.id}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={relatedPost.thumbnailUrl}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {relatedPost.categoryName && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/95 backdrop-blur-sm text-[#5B5FC7] shadow-sm text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          {relatedPost.categoryName}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#5B5FC7] transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-5 line-clamp-3 flex-1 leading-relaxed">
                      {getExcerpt(relatedPost.content)}
                    </p>

                    <div className="border-t border-gray-100 pt-4 mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#5B5FC7]">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-slate-800">
                          {relatedPost.authorName}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5" />{" "}
                        {relatedPost.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {relatedBlogs.length > 0 && (
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
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
