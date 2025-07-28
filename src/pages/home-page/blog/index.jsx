import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendar, FaUser, FaArrowRight, FaFilter, FaDna, FaFlask, FaGavel, FaBuilding } from "react-icons/fa";

// Data for 9 new articles with 4 topics
const articles = [
  {
    id: 1,
    title: "ILLUMINA - Công nghệ và tiên phong về xét nghiệm Gen tại Việt Nam",
    category: "Knowledge",
    excerpt: "Illumina được ví như 'người khổng lồ' trong lĩnh vực giải trình tự Gen, là công ty thế giới về giải trình tự DNA và công nghệ sinh học phục vụ khách hàng trong việc nghiên cứu, lâm sàng và ứng dụng.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
    slug: "illumina-cong-nghe-tien-phong-xet-nghiem-gen-viet-nam",
    author: "DNA Testing",
    date: "2024-01-25",
    readTime: "10 min read",
    featured: true
  },
  {
    id: 2,
    title: "Xét nghiệm ADN dân sự và pháp lý: so sánh điểm giống và khác nhau",
    category: "Administration",
    excerpt: "Tìm hiểu sự khác biệt giữa xét nghiệm ADN dân sự và pháp lý để lựa chọn đúng loại xét nghiệm phù hợp với mục đích sử dụng của bạn.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop",
    slug: "xet-nghiem-adn-dan-su-va-phap-ly-so-sanh-diem-giong-va-khac-nhau",
    author: "GeneViet",
    date: "2024-03-15",
    readTime: "10 min read",
    featured: true
  },
  {
    id: 3,
    title: "Xét nghiệm ADN cha con dân sự là gì?",
    category: "Knowledge",
    excerpt: "Ngày nay, dịch vụ xét nghiệm ADN cha con dân sự được rất nhiều người quan tâm. Vậy, xét nghiệm ADN là gì? Chi phí hết bao nhiêu? Có thể sử dụng mẫu phẩm gì?",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    slug: "xet-nghiem-adn-cha-con-dan-su-la-gi",
    author: "DNA Testing",
    date: "2024-06-25",
    readTime: "8 min read",
    featured: true
  },
  {
    id: 4,
    title: "Phân Biệt Xét Nghiệm ADN Dân Sự Và Hành Chính",
    category: "Knowledge",
    excerpt: "Hiểu rõ sự khác biệt giữa xét nghiệm ADN dân sự và hành chính để lựa chọn đúng loại xét nghiệm phù hợp với nhu cầu của bạn.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
    slug: "phan-biet-xet-nghiem-adn-dan-su-va-hanh-chinh",
    author: "TS. Nguyễn Văn Minh",
    date: "2024-06-20",
    readTime: "8 phút đọc",
    featured: true
  },
  {
    id: 5,
    title: "Bảng giá dịch vụ của Genetix",
    category: "News",
    excerpt: "Trung tâm xét nghiệm ADN Genetix cung cấp đa dạng các gói dịch vụ xét nghiệm ADN với mức giá cạnh tranh và ưu đãi hấp dẫn.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop",
    slug: "bang-gia-dich-vu-genetix",
    author: "Genetix DNA Center",
    date: "2024-06-15",
    readTime: "5 phút đọc",
    featured: true
  },
  {
    id: 6,
    title: "Thủ tục xét nghiệm - Xét nghiệm ADN",
    category: "Administration",
    excerpt: "Hướng dẫn chi tiết về thủ tục xét nghiệm ADN cho mục đích dân sự, cá nhân và mục đích pháp lý tại Trung tâm công nghệ sinh học phân tử ADNchacon.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    slug: "thu-tuc-xet-nghiem-adn",
    author: "ADNchacon",
    date: "2024-01-16",
    readTime: "7 min read",
    featured: false
  },
  {
    id: 7,
    title: "Phân Tích Sâu Hệ Thống Booking Xét Nghiệm ADN: Từ Yêu Cầu Đến Triển Khai",
    category: "News",
    excerpt: "Phân tích chi tiết về quy trình thiết kế và triển khai hệ thống đặt lịch xét nghiệm ADN, từ yêu cầu nghiệp vụ đến trải nghiệm người dùng và quản lý trạng thái.",
    image: "/images/big-data.png",
    slug: "phan-tich-he-thong-booking-xet-nghiem-adn",
    author: "Phòng Phát Triển Sản Phẩm",
    date: "2024-01-15",
    readTime: "15 min read",
    featured: false
  },
  {
    id: 8,
    title: "THÔNG TIN CHI TIẾT VỀ XÉT NGHIỆM ADN PHÁP LÝ TẠI DNA TESTING",
    category: "Civil",
    excerpt: "Ngày nay, bản kết quả của xét nghiệm ADN huyết thống không chỉ được sử dụng để xác định mối quan hệ huyết thống giữa cha và con trong gia đình, cũng như trong các thủ tục hành chính đăng ký khai sinh ở cấp xã/phường, mà còn được sử dụng làm bằng chứng trong các tranh chấp về quyền nuôi con, quyền cấp dưỡng và quyền thừa kế tại tòa án nhân dân các cấp.",
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&h=600&fit=crop",
    slug: "thong-tin-chi-tiet-xet-nghiem-adn-phap-ly-dna-testing",
    author: "DNA Testing",
    date: "2024-01-12",
    readTime: "9 min read",
    featured: true
  },
  {
    id: 9,
    title: "AI thiết kế chuỗi ADN, mở ra kỷ nguyên mới công nghệ sinh học",
    category: "Knowledge",
    excerpt: "Trí tuệ nhân tạo đang cách mạng hóa lĩnh vực sinh học bằng cách thiết kế các chuỗi ADN mới, mở ra kỷ nguyên mới cho công nghệ sinh học và y học.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    slug: "ai-thiet-ke-chuoi-adn-ky-nguyen-moi-cong-nghe-sinh-hoc",
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
    { name: "Civil", icon: "⚖️", color: "from-orange-500 to-orange-600" },
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
      {/* Header Section - Updated to match services style */}
      <div
        className="relative text-white h-[600px] mt-10 flex items-center justify-center"
        style={{
          backgroundImage:
            "url('/images/close-up-hands-typing-keyboard.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1
            className="text-5xl font-bold mb-6"
            style={{
              textShadow:
                "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080",
            }}
          >
            DNA Testing News & Articles
          </h1>
          <p
            className="text-base mb-8 max-w-3xl mx-auto leading-relaxed font-medium"
            style={{
              textShadow:
                "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080",
            }}
          >
            Explore in-depth articles on DNA testing, biotechnology, administrative procedures, and legal applications written by leading experts.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Advanced Technology</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ High Accuracy</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Legal Consultation</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Administrative Procedures</span>
            </div>
          </div>
        </div>
      </div>

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
                
                <div className="p-6 flex flex-col h-[280px]">
                  <div className="flex-grow overflow-hidden">
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
                  </div>
                  
                  <div className="mt-auto">
                    <Link
                      to={`/blog/${article.slug}`}
                      className="group/btn inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <span>Read More</span>
                      <FaArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
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

      <style>{`
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
