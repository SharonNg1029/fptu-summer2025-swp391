import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendar, FaUser, FaArrowRight, FaFilter, FaDna, FaFlask, FaGavel, FaBuilding } from "react-icons/fa";

// Dữ liệu 9 bài viết mới với 4 chủ đề
const articles = [
  {
    id: 1,
    title: "Next-Generation DNA Testing Technology in 2024",
    category: "Knowledge",
    excerpt: "Discover the latest breakthroughs in DNA testing technology with 99.99% accuracy and rapid processing speed.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
    slug: "next-generation-dna-testing-technology-2024",
    author: "Dr. Nguyen Minh Khoa",
    date: "2024-01-25",
    readTime: "8 min read",
    featured: true
  },
  {
    id: 2,
    title: "Administrative Procedures for DNA Testing in Vietnam",
    category: "Administration",
    excerpt: "A detailed guide to the required administrative procedures for conducting DNA tests as regulated by the Ministry of Health.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop",
    slug: "administrative-procedures-dna-testing-vietnam",
    author: "Lawyer Tran Van Minh",
    date: "2024-01-23",
    readTime: "10 min read",
    featured: false
  },
  {
    id: 3,
    title: "Breaking News: DNA Law 2024 Effective from March",
    category: "News",
    excerpt: "The new DNA testing law officially takes effect, bringing many positive changes for the public.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    slug: "breaking-news-dna-law-2024-effective-march",
    author: "Reporter Le Thi Hoa",
    date: "2024-01-22",
    readTime: "5 min read",
    featured: true
  },
  {
    id: 4,
    title: "Resolving Inheritance Disputes Using DNA Testing",
    category: "Civil",
    excerpt: "The crucial role of DNA testing in resolving family inheritance disputes.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
    slug: "resolving-inheritance-disputes-dna-testing",
    author: "Judge Pham Thi Lan",
    date: "2024-01-20",
    readTime: "12 min read",
    featured: false
  },
  {
    id: 5,
    title: "How DNA Testing Works: Scientific Principles Explained",
    category: "Knowledge",
    excerpt: "Explore the scientific principles behind DNA testing and how this technology operates.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop",
    slug: "how-dna-testing-works-scientific-principles",
    author: "Prof. Vu Thanh Son",
    date: "2024-01-18",
    readTime: "15 min read",
    featured: true
  },
  {
    id: 6,
    title: "How to Register for DNA Testing Online",
    category: "Administration",
    excerpt: "Step-by-step guide to conveniently register for DNA testing online via the Ministry of Health’s electronic system.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    slug: "how-to-register-dna-testing-online",
    author: "Specialist Nguyen Van Duc",
    date: "2024-01-16",
    readTime: "7 min read",
    featured: false
  },
  {
    id: 7,
    title: "Update: DNA Test Prices Cut by 30% This February",
    category: "News",
    excerpt: "Great news! DNA testing centers nationwide are offering 30% discounts throughout February 2024.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
    slug: "update-dna-test-price-cut-30-february",
    author: "Reporter Hoang Minh Tuan",
    date: "2024-01-15",
    readTime: "4 min read",
    featured: false
  },
  {
    id: 8,
    title: "Legal Rights When Performing DNA Testing",
    category: "Civil",
    excerpt: "Understand the legal rights and obligations of all parties involved in DNA testing under current laws.",
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&h=600&fit=crop",
    slug: "legal-rights-dna-testing",
    author: "Lawyer Do Thi Mai",
    date: "2024-01-12",
    readTime: "9 min read",
    featured: true
  },
  {
    id: 9,
    title: "AI Applications in DNA Result Analysis",
    category: "Knowledge",
    excerpt: "Artificial intelligence is revolutionizing the analysis and processing of DNA test results.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    slug: "ai-applications-dna-result-analysis",
    author: "Dr. Le Minh Hai",
    date: "2024-01-10",
    readTime: "11 min read",
    featured: false
  }
];


// Component Blog
const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);
  const articlesPerPage = 9;

  const categories = [
    { name: "All", icon: "📚", color: "from-blue-500 to-blue-600" },
    { name: "Knowledge", icon: "🧬", color: "from-green-500 to-green-600" },
    { name: "Administration", icon: "🏛️", color: "from-red-500 to-red-600" },
    { name: "News", icon: "📰", color: "from-purple-500 to-purple-600" },
    { name: "Civil", icon: "⚖️", color: "from-orange-500 to-orange-600" }
  ];

  // Lọc và sắp xếp bài viết
  const filteredAndSortedArticles = () => {
    let filtered = articles;

    // Lọc theo danh mục
    if (selectedCategory !== "All") {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Sắp xếp
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      default:
        break;
    }

    return filtered;
  };

  const processedArticles = filteredAndSortedArticles();
  const displayedArticles = processedArticles.slice(0, articlesPerPage);

  // Simulate loading effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, sortBy]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, #023670 0%, #2563eb 100%)'
          }}></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500"></div>

        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center text-center py-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-xl mb-6 mt-8">
            DNA Testing News & Articles
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20 hover:bg-white/15 transition-colors duration-300">
              <FaDna className="text-lg text-blue-200" />
              <span className="text-sm font-medium text-white">Advanced Technology</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20 hover:bg-white/15 transition-colors duration-300">
              <FaFlask className="text-lg text-blue-200" />
              <span className="text-sm font-medium text-white">High Accuracy</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20 hover:bg-white/15 transition-colors duration-300">
              <FaGavel className="text-lg text-blue-200" />
              <span className="text-sm font-medium text-white">Legal Consultation</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20 hover:bg-white/15 transition-colors duration-300">
              <FaBuilding className="text-lg text-blue-200" />
              <span className="text-sm font-medium text-white">Administrative Procedures</span>
            </div>
          </div>

          <p className="text-lg md:text-xl text-blue-100 max-w-3xl leading-relaxed mb-8 drop-shadow-md">
            Explore in-depth articles on DNA testing, biotechnology, administrative procedures, and legal applications written by leading experts.
          </p>

          <Link
            to="/services"
            className="group inline-flex items-center px-8 py-3 bg-white/15 backdrop-blur-sm text-white font-semibold text-base rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-xl border border-white/30"
          >
            <span>Explore more</span>
            <FaArrowRight className="ml-2 text-sm group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </header>

      {/* Filter Toolbar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left side - Page info */}
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-800">📚 Articles</h2>
            </div>
            
            {/* Right side - Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 hidden md:block">Category:</span>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)} 
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 min-w-[120px]" 
                > 
                  {categories.map((cat) => ( 
                    <option key={cat.name} value={cat.name}> 
                      {cat.icon} {cat.name} 
                    </option> 
                  ))} 
                </select>
              </div>
              
              {/* Sort Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 hidden md:block">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 min-w-[120px]" 
                > 
                  <option value="newest">📅 Newest</option> 
                  <option value="oldest">📜 Oldest</option> 
                </select>
              </div>
              
              {/* Article Count */}
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <FaFilter className="text-blue-500 text-sm" /> 
                <span className="text-sm font-semibold text-blue-700">
                  {displayedArticles.length}/{processedArticles.length} Articles
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-56 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-3"></div>
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedArticles.map((article, index) => (
              <div
                key={article.id}
                className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${
                      categories.find(cat => cat.name === article.category)?.color || 'from-gray-500 to-gray-600'
                    }`}>
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                      {article.readTime}
                    </span>
                  </div>
                  {article.featured && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ⭐ Featured Article
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    <Link to={`/blog/${article.slug}`}>{article.title}</Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{article.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <FaUser className="mr-2 text-blue-500" />
                      <span className="font-medium">{article.author}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendar className="mr-2 text-blue-500" />
                      <span>{formatDate(article.date)}</span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/blog/${article.slug}`}
                    className="group/btn inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <span>Read More</span>
                    <FaArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {processedArticles.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">No articles found</h3>
            <p className="text-gray-600 mb-8 text-lg">
              {selectedCategory !== "All"
                ? `No articles found"${selectedCategory}"`
                : "There are no articles available"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {selectedCategory !== "All" && (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="bg-gray-600 text-white px-8 py-3 rounded-xl hover:bg-gray-700 transition-colors duration-300 font-semibold"
                > 
                  View All Categories
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Blog;
