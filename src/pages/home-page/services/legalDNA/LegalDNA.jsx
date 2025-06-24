import React, { useState, useEffect, useRef } from "react";
import {
  FaBalanceScale,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaBolt,
  FaTimes,
} from "react-icons/fa";

// Import data từ file riêng để dễ quản lý
import { legalServicesData, legalCollectionMethodsData } from './data-legal/legalData';

// ===== COMPONENT CON: BUTTON =====
const CustomButton = ({ children, onClick, className = "", disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-6 py-3 text-white font-semibold rounded-lg
        transition-all duration-200 hover:scale-105 cursor-pointer
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// ===== COMPONENT CON: CARD =====
const ServiceCard = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 ${className}`}>
      {children}
    </div>
  );
};

// ===== COMPONENT CON: MODAL =====
const ServiceModal = ({ isOpen, onClose, children }) => {
  // Đóng modal khi nhấn ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // KHÔNG khóa scroll để có thể nhìn thấy nội dung phía sau
      // document.body.style.overflow = 'hidden'; 
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Nền mờ mạnh hơn giống hình */}
      <div 
        className="absolute inset-0 backdrop-blur-md bg-white/20"
        onClick={onClose}
      ></div>
      
      {/* Nội dung modal */}
      <div 
        className="relative bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-hidden z-[1001] w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-[1003] text-white hover:text-gray-200 bg-black/20 backdrop-blur-sm rounded-full p-2 hover:bg-black/30 transition-all duration-200 cursor-pointer"
        >
          <FaTimes className="w-4 h-4" />
        </button>
        
        {children}
      </div>
    </div>
  );
};

// ===== COMPONENT CON: TAG =====
const ServiceTag = ({ children }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
      {children}
    </span>
  );
};

// ===== COMPONENT CHÍNH =====
const LegalServices = () => {
  // ===== CÁC STATE =====
  const [selectedService, setSelectedService] = useState(null); // Dịch vụ được chọn
  const [modalVisible, setModalVisible] = useState(false); // Hiển thị modal
  const [isScrolled, setIsScrolled] = useState(false); // Theo dõi scroll trong modal
  const modalContentRef = useRef(null);

  // ===== HÀM TIỆN ÍCH =====
  // Chuyển đổi số thành tiền Việt Nam
  const formatToVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // ===== XỬ LÝ IMMIGRATION LINKS =====
  // Xử lý click vào các link DNA test trong phần Immigration
  const handleImmigrationLinkClick = (serviceID, route) => {
    // Lưu thông tin service được chọn vào sessionStorage
    const bookingData = {
      serviceID: serviceID,        // "SNL001", "SNL002", "SNL004", "SNL005"
      expressService: false        // Mặc định false cho immigration links
    };

    // Lưu vào sessionStorage để trang đích có thể đọc
    sessionStorage.setItem('selectedService', JSON.stringify(bookingData));
    console.log('🔗 Immigration link clicked - Data saved:', bookingData);
    console.log('🚀 Redirecting to:', route);
    
    // 🚀 CHUYỂN HƯỚNG ĐẾN TRANG DỊCH VỤ CỤ THỂ
    window.location.href = route;
    
    // Đóng modal sau khi click (optional vì sẽ chuyển trang)
    closeServiceModal();
  };

  // ===== XỬ LÝ MARKDOWN VÀ IMMIGRATION LINKS =====
  // Xử lý text markdown với hỗ trợ links và immigration links
  const renderMarkdownText = (text, service = null) => {
    // Kiểm tra nếu service có immigration links và text chứa placeholder
    if (service && service.hasImmigrationLinks && text.includes('IMMIGRATION_LINKS_PLACEHOLDER')) {
      // Tách text thành phần trước và sau placeholder
      const beforePlaceholder = text.split('IMMIGRATION_LINKS_PLACEHOLDER')[0];
      const afterPlaceholder = text.split('IMMIGRATION_LINKS_PLACEHOLDER')[1];

      return (
        <div>
          {/* Phần text trước placeholder */}
          <div className="mb-4">
            {renderMarkdownBasic(beforePlaceholder)}
          </div>
          
          {/* Immigration links - TẠI ĐÂY LÀ PHẦN QUAN TRỌNG */}
          <ul className="mb-4 space-y-2 ml-4">
            {service.immigrationLinks.map((link, index) => (
              <li key={index}>
                • <button
                    onClick={() => handleImmigrationLinkClick(link.serviceID, link.route)}
                    className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 hover:bg-blue-50 rounded px-1"
                  >
                    {link.text}
                  </button>
              </li>
            ))}
          </ul>
          
          {/* Phần text sau placeholder */}
          <div>
            {renderMarkdownBasic(afterPlaceholder)}
          </div>
        </div>
      );
    }

    // Xử lý markdown bình thường cho các services khác
    return renderMarkdownBasic(text);
  };

  // Hàm xử lý markdown cơ bản (bold, italic, links thường)
  const renderMarkdownBasic = (text) => {
    // Tách text thành các phần theo regex pattern
    const parts = text.split(/(\[.*?\]\(.*?\)|\*\*\*.*?\*\*\*|\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      // Xử lý markdown links [text](url) - link ra website ngoài
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        const [, linkText, url] = linkMatch;
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200"
          >
            {linkText}
          </a>
        );
      }
      
      // Xử lý bold italic text (***text***)
      if (part.startsWith('***') && part.endsWith('***')) {
        return <strong key={index}><em>{part.slice(3, -3)}</em></strong>;
      }
      
      // Xử lý bold text (**text**)
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      
      // Text thường
      return <span key={index}>{part}</span>;
    });
  };

  // ===== XỬ LÝ SCROLL TRONG MODAL =====
  useEffect(() => {
    const handleScroll = () => {
      if (modalContentRef.current) {
        const scrollTop = modalContentRef.current.scrollTop;
        setIsScrolled(scrollTop > 20);
      }
    };

    const modalContent = modalContentRef.current;
    if (modalContent) {
      modalContent.addEventListener('scroll', handleScroll);
      return () => modalContent.removeEventListener('scroll', handleScroll);
    }
  }, [modalVisible]);

  // ===== XỬ LÝ SỰ KIỆN =====
  // Mở modal chi tiết dịch vụ
  const openServiceModal = (service) => {
    setSelectedService(service);
    setModalVisible(true);
    setIsScrolled(false);
  };

  // Đóng modal
  const closeServiceModal = () => {
    setModalVisible(false);
    setSelectedService(null);
    setIsScrolled(false);
  };

  // ===== XỬ LÝ BOOKING - CHỈ LƯU VÀO SESSION STORAGE =====
  const handleBookService = (service, isExpressService = false) => {
    // 🎯 CHỈ LƯU 2 THỨ THÔI - SERVICEID VÀ EXPRESSSERVICE
    const bookingData = {
      serviceID: service.serviceID,        // String: "SL001", "SL002", "SL003"
      expressService: isExpressService     // Boolean: true/false
    };

    // 🎯 LƯU VÀO SESSIONSTORAGE ĐỂ CHUYỂN SANG TRANG BOOKING
    sessionStorage.setItem('selectedService', JSON.stringify(bookingData));
    
    // Log để debug
    console.log('🎯 Legal service booking - Data saved:', bookingData);
    
    // 🚀 CHUYỂN HƯỚNG ĐẾN TRANG BOOKING (BỎ COMMENT DÒNG NÀY ĐỂ SỬ DỤNG)
    // window.location.href = '/booking';
    // Hoặc nếu dùng React Router:
    // navigate('/booking');
  };

  // ===== RENDER COMPONENT =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
      
      {/* ===== PHẦN ĐẦU TRANG (HERO SECTION) ===== */}
      <div
        className="relative text-white h-[600px] mt-10 flex items-center justify-center"
        style={{ 
          backgroundImage: "url('https://admin.acceleratingscience.com/behindthebench/wp-content/uploads/sites/9/2019/06/pg1999-pjt4745-col19534_blog207.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Lớp phủ tối */}
        <div className="absolute inset-0 bg-black opacity-60"></div>
        
        {/* Nội dung */}
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <FaBalanceScale className="text-5xl text-white mr-4" />
            <h1 
              className="text-5xl font-bold"
              style={{
                textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000"
              }}
            >
              Legal DNA Testing
            </h1>
          </div>
          
          <p
            className="text-base mb-8 max-w-3xl mx-auto leading-relaxed font-medium"
            style={{
              textShadow: "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080"
            }}
          >
            Legal DNA testing provides court-admissible results with proper chain of custody 
            for official documentation, immigration, and legal proceedings.
          </p>
          
          {/* Các điểm nổi bật */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            {["Court Admissible", "Chain of Custody", "Legal Documentation"].map((feature, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
                <span className="font-semibold">✓ {feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* ===== DANH SÁCH DỊCH VỤ ===== */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {legalServicesData.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 overflow-hidden"
              >
                
                {/* Header dịch vụ với hình nền */}
                <div 
                  className="p-6 text-white h-[180px] flex flex-col relative"
                  style={{
                    backgroundImage: `url('${service.backgroundImage}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                  }}
                >
                  {/* Lớp phủ gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#002F5E]/10 via-[#004494]/40 to-[#1677FF]/40"></div>
                  
                  {/* Nội dung header */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        {service.icon}
                        <ServiceTag>{service.type}</ServiceTag>
                      </div>
                    </div>
                    
                    {/* Tên dịch vụ */}
                    <div className="h-[80px] flex items-start">
                      <h3 
                        className="text-lg font-bold leading-tight"
                        style={{
                          textShadow: "2px 2px 4px rgba(0,0,0,0.9), 1px 1px 2px rgba(0,0,0,0.9)"
                        }}
                      >
                        {service.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Thông tin dịch vụ */}
                <div className="p-6">
                  <div className="mb-6">
                    
                    {/* Thời gian xử lý */}
                    <div className="flex items-center gap-2 mb-3">
                      <FaClock className="text-blue-500" />
                      <span className="text-gray-600">
                        Processing Time: {service.processingTime}
                      </span>
                    </div>

                    {/* Bảng giá */}
                    <div className="space-y-3">
                      {/* Giá tiêu chuẩn */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Standard Price:</span>
                        <span className="text-2xl font-bold text-blue-900">
                          {formatToVND(service.basePrice)}
                        </span>
                      </div>

                      {/* Giá nhanh */}
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2">
                          <FaBolt className="text-orange-500" />
                          <span className="font-medium text-orange-700">
                            Express Service:
                          </span>
                        </div>
                        <span className="text-lg font-bold text-orange-700">
                          +{formatToVND(service.expressPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nút xem chi tiết */}
                  <CustomButton
                    onClick={() => openServiceModal(service)}
                    className="bg-gradient-to-br from-[#002F5E] via-[#004494] to-[#1677FF] hover:from-[#001F4A] hover:via-[#003478] hover:to-[#0F6FFF]"
                  >
                    View Details & Order
                  </CustomButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== PHƯƠNG THỨC LẤY MẪU ===== */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16 border border-blue-100">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
            Sample Collection Methods
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {legalCollectionMethodsData.map((method, index) => (
              <ServiceCard
                key={index}
                className="text-center border-2 border-blue-100 hover:border-blue-300 transition-all duration-200 hover:shadow-lg"
              >
                <div className="p-6">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-blue-50 rounded-full">
                      {method.icon}
                    </div>
                  </div>
                  
                  {/* Tên phương thức */}
                  <h4 className="text-xl font-semibold text-blue-900 mb-2">
                    {method.name}
                  </h4>
                  
                  {/* Mô tả */}
                  <p className="text-gray-600 mb-4">
                    {method.description}
                  </p>
                  
                  {/* Giá */}
                  <div className="text-2xl font-bold text-blue-600">
                    {method.price === 0 ? "FREE" : formatToVND(method.price)}
                  </div>
                </div>
              </ServiceCard>
            ))}
          </div>
        </div>

        {/* ===== LIÊN HỆ HỖ TRỢ ===== */}
        <div className="rounded-2xl shadow-lg p-8 text-white text-center bg-gradient-to-br from-[#002F5E] via-[#004494] to-[#1677FF]">
          <h2 className="text-3xl font-bold text-white mb-6">
            Need Legal DNA Testing?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our legal DNA testing services meet all court requirements and
            provide admissible evidence for your legal proceedings.
          </p>
          
          {/* Thông tin liên hệ */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-16 mt-8">
            {/* Hotline - THÊM CLICK-TO-CALL */}
            <div className="flex flex-col items-center">
              <FaPhone className="text-3xl mb-2" />
              <div className="font-semibold">Hotline</div>
              <a 
                href="tel:+84901452366" 
                className="text-lg text-white hover:text-blue-200 transition-colors cursor-pointer no-underline"
              >
                +84 901 452 366
              </a>
            </div>
            
            {/* Email */}
            <div className="flex flex-col items-center">
              <FaEnvelope className="text-3xl mb-2" />
              <div className="font-semibold">Email Support</div>
              <a
                href="mailto:genetixcontactsp@gmail.com"
                className="text-lg text-white hover:text-blue-200 transition-colors cursor-pointer no-underline"
              >
                genetixcontactsp@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL CHI TIẾT DỊCH VỤ ===== */}
      <ServiceModal isOpen={modalVisible} onClose={closeServiceModal}>
        {selectedService && (
          <div className="bg-white relative">
            
            {/* Header modal - sticky */}
            <div className={`sticky top-0 z-10 transition-all duration-300 ${
              isScrolled
                ? 'shadow-2xl backdrop-blur-md bg-gradient-to-br from-[#004494]/95 to-[#1677FF]/95' 
                : 'bg-gradient-to-br from-[#004494] to-[#1677FF]'
            }`}>
              <div className="px-6 py-4 text-white">
                <div className="flex items-center gap-3 mb-2">
                  {selectedService.icon}
                  <h3 className="text-xl font-bold text-white">
                    {selectedService.name}
                  </h3>
                </div>
                <div className="ml-8">
                  <ServiceTag>{selectedService.type}</ServiceTag>
                </div>
              </div>
              
              {/* Hiệu ứng gradient fade */}
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-b from-transparent to-white/10 pointer-events-none"></div>
            </div>

            {/* Nội dung modal */}
            <div 
              ref={modalContentRef}
              className="p-6 bg-white max-h-[65vh] overflow-y-auto"
            >
              {/* Mô tả chi tiết - ĐÂY LÀ NƠI HIỂN THỊ IMMIGRATION LINKS */}
              <div className="text-gray-700 text-base mb-6 whitespace-pre-line">
                {renderMarkdownText(selectedService.description, selectedService)}
              </div>

              {/* Thông tin bổ sung */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">
                    Processing Time
                  </h5>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-500" />
                    <span className="text-gray-700">{selectedService.processingTime}</span>
                  </div>
                </div>

                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">
                    Type of Service
                  </h5>
                  <div className="flex items-center gap-2">
                    <FaBalanceScale className="text-blue-500" />
                    <span className="text-gray-700">{selectedService.type}</span>
                  </div>
                </div>
              </div>

              {/* Bảng giá chi tiết */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100">
                <h5 className="text-lg font-semibold text-gray-900 mb-4">
                  Price Details
                </h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Standard Processing:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatToVND(selectedService.basePrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-100 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2">
                      <FaBolt className="text-orange-500" />
                      <span className="text-gray-700">24-Hour Expedited Service (surcharge):</span>
                    </div>
                    <span className="text-lg font-bold text-orange-700">
                      +{formatToVND(selectedService.expressPrice)}
                    </span>
                  </div>
                  <div className="border-t border-blue-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Total (Express):</span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatToVND(selectedService.basePrice + selectedService.expressPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* NÚT ĐẶT DỊCH VỤ - LƯU VÀO SESSION STORAGE */}
              <div className="flex gap-4">
                <CustomButton 
                  onClick={() => handleBookService(selectedService, false)}
                  className="flex-1 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800"
                >
                  Book Standard Service
                </CustomButton>
                <CustomButton 
                  onClick={() => handleBookService(selectedService, true)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  Book Express Service
                </CustomButton>
              </div>
            </div>
          </div>
        )}
      </ServiceModal>
    </div>
  );
};

export default LegalServices;