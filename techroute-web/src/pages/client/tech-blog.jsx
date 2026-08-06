import React, { useState } from "react";
import { Search, Clock, Calendar, ArrowRight, User } from "lucide-react";

const MOCK_POSTS = [
  {
    id: 1,
    title: "Architecting a Real-Time E-commerce Platform with AI Integration",
    excerpt:
      "Explore the system design and tech stack required to build a scalable e-commerce site featuring real-time messaging and an AI-driven customer advisory bot.",
    category: "System Design",
    author: "Le Vu",
    date: "Aug 02, 2026",
    readTime: "8 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    isFeatured: true,
  },
  {
    id: 2,
    title: "Mastering React and Express.js for Full-Stack Development",
    excerpt:
      "A comprehensive guide to structuring your monolithic or microservices architecture using React for the frontend and Express.js for the backend API.",
    category: "Web Dev",
    author: "Huynh Loi",
    date: "Jul 28, 2026",
    readTime: "6 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
  },
  {
    id: 3,
    title: "Understanding Deep Learning: From CNNs to ArcFace",
    excerpt:
      "Dive into convolutional neural networks, exploring architectures like LeNet-5, MTCNN, and how ArcFace is revolutionizing modern face recognition systems.",
    category: "AI & Data",
    author: "AI Research Team",
    date: "Jul 25, 2026",
    readTime: "12 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
  },
  {
    id: 4,
    title: "Automating Workflows with n8n and AI Agents",
    excerpt:
      "How to implement legal and compliance automation for collecting and processing audit evidence using n8n workflows and generative AI.",
    category: "Automation",
    author: "Techroute Admin",
    date: "Jul 20, 2026",
    readTime: "7 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  },
  {
    id: 5,
    title: "Essential Java Web Best Practices for Enterprise Apps",
    excerpt:
      "Key takeaways and practical implementation strategies for building secure and robust Java Web applications in enterprise environments.",
    category: "Web Dev",
    author: "Le Vu",
    date: "Jul 15, 2026",
    readTime: "9 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  },
  {
    id: 6,
    title: "Building an Effective Data Warehouse for Behavioral Analysis",
    excerpt:
      "Step-by-step methodologies for constructing a data warehouse to analyze social media addiction patterns and academic performance impacts.",
    category: "AI & Data",
    author: "Huynh Loi",
    date: "Jul 10, 2026",
    readTime: "10 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
];

const CATEGORIES = [
  "All",
  "Web Dev",
  "AI & Data",
  "System Design",
  "Automation",
  "Career Advice",
];

const TechBlog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [blogs, setBlogs] = useState([]);
  const [previous, setPrevious] = useState(false);
  const [pageActive, setPageActive] = useState(1);
  const [limit, setLimit] = useState(7);
  const [next, setNext] = useState(false);

  const filteredPosts = MOCK_POSTS.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.find((post) => post.isFeatured);
  const gridPosts = featuredPost
    ? filteredPosts.filter((post) => post.id !== featuredPost.id)
    : filteredPosts;

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await axios.get(`blogs?page=${pageActive}&limit=${limit}`);

        if (data) {
          console.log(data);
          setBlogs(data.content);
          setPrevious(!data?.first);
          setNext(!data?.last);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };
    loadBlogs();
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-gray-200 pb-4">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                activeCategory === category
                  ? "bg-[#5B5FC7] text-white shadow-md shadow-[#5B5FC7]/20"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post (Chỉ hiện nếu đang ở tab All hoặc category của bài đó) */}
        {featuredPost && (
          <div className="mb-12 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-lg transition-all">
            <div className="grid md:grid-cols-2">
              <div className="overflow-hidden">
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="bg-[#5B5FC7]/10 text-[#5B5FC7] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-[#5B5FC7] transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#5B5FC7]">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {featuredPost.author}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {featuredPost.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur-sm text-[#5B5FC7] shadow-sm text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#5B5FC7] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm mb-5 line-clamp-3 flex-1 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="border-t border-gray-100 pt-4 mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {post.author}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {post.readTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {gridPosts?.length > 0 && (
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

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechBlog;
