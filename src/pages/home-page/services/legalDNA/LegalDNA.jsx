import React, { useState, useEffect } from "react";
import {
  FaDna,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaCheck,
  FaHome,
  FaBuilding,
  FaMailBulk,
  FaBolt,
  FaBalanceScale,
  FaPassport,
  FaMoneyBillWave,
  FaBaby,
  FaTimes,
} from "react-icons/fa";

// Custom Button Component
const Button = ({
  children,
  onClick,
  type = "default",
  size = "medium",
  className = "",
  disabled = false,
  block = false,
  shape = "default",
  icon,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const typeClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-blue-600",
    default:
      "bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 border border-gray-300",
    link: "bg-transparent text-blue-600 hover:text-blue-700 focus:ring-blue-500",
  };

  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
  };

  const shapeClasses = {
    default: "rounded-md",
    circle: "rounded-full w-10 h-10 p-0",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${typeClasses[type]}
        ${sizeClasses[size]}
        ${shapeClasses[shape]}
        ${block ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Custom Card Component
const Card = ({ children, className = "", bodyStyle = {}, hover = true }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden ${
        hover ? "hover:shadow-lg transition-shadow duration-200" : ""
      } ${className}`}
    >
      <div style={bodyStyle}>{children}</div>
    </div>
  );
};

// Custom Modal Component
const Modal = ({ open, onCancel, children, width = 600, className = "" }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) {
        onCancel();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      ></div>

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto z-[1001] ${className}`}
        style={{ width: `min(${width}px, 95vw)` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 z-[1002] text-gray-500 hover:text-gray-700 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

// Custom Tag Component
const Tag = ({ children, color = "default", className = "" }) => {
  const colorClasses = {
    default: "bg-gray-100 text-gray-800",
    cyan: "bg-cyan-100 text-cyan-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    orange: "bg-orange-100 text-orange-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
};

const LegalServices = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Helper function to format price to VND
  const formatToVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // 3 dịch vụ Legal mới
  const services = [
    {
      id: 1,
      name: "DNA Testing for Birth Registration",
      type: "Legal",
      processingTime: "3-7 working days",
      basePrice: 3500000,
      expressPrice: 1500000,
      icon: <FaBaby className="text-2xl" />,
      description:
        "Court-admissible DNA testing for official birth registration and legal documentation",
      features: [
        "Court admissible results",
        "Official birth registration",
        "Legal documentation",
        "Chain of custody maintained",
      ],
    },
    {
      id: 2,
      name: "DNA Testing for Immigration, Sponsorship, or Citizenship Applications",
      type: "Legal",
      processingTime: "3-7 working days",
      basePrice: 6000000,
      expressPrice: 1500000,
      icon: <FaPassport className="text-2xl" />,
      description:
        "Legal DNA testing for immigration, family sponsorship, and citizenship applications",
      features: [
        "Immigration compliant",
        "Embassy accepted",
        "Official certification",
        "International standards",
      ],
    },
    {
      id: 3,
      name: "DNA Testing for Inheritance or Asset Division",
      type: "Legal",
      processingTime: "3-7 working days",
      basePrice: 4000000,
      expressPrice: 1500000,
      icon: <FaMoneyBillWave className="text-2xl" />,
      description:
        "Legal DNA testing for inheritance claims and asset division proceedings",
      features: [
        "Court admissible",
        "Legal inheritance proof",
        "Asset division support",
        "Official documentation",
      ],
    },
  ];

  // Mediation methods pricing
  const mediationMethods = [
    {
      name: "Home Collection",
      price: 300000,
      icon: <FaHome className="text-xl text-blue-600" />,
      description: "Professional sample collection at your home",
    },
    {
      name: "At Facility",
      price: 0,
      icon: <FaBuilding className="text-xl text-blue-600" />,
      description: "Visit our facility for sample collection",
    },
    {
      name: "Postal Delivery",
      price: 200000,
      icon: <FaMailBulk className="text-xl text-blue-600" />,
      description: "Self-collection kit delivered by post",
    },
  ];

  // Open modal with service details
  const openModal = (service) => {
    console.log("Mở modal với dịch vụ:", service);
    setSelectedService(service);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
      {/* Hero Section */}
      <div className="relative text-white py-20 bg-gradient-to-br from-[#002F5E] via-[#004494] to-[#1677FF]">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <FaBalanceScale className="text-5xl text-white mr-4" />
            <h1 className="text-5xl font-bold">Legal DNA Testing</h1>
          </div>
          <p className="text-base mb-8 max-w-3xl mx-auto leading-relaxed">
            Legal DNA testing provides blood DNA testing services, and the results of DNA testing have sufficient legal basis to provide evidence according to the requirements of courts and state institutions (UBND Township). Different from the Non-Legal DNA testing service, the legal DNA testing will be directly sampled by Genetix experts, and everyone's personal documents will be photographed and signed.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Court Admissible</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Chain of Custody</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Legal Documentation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Services Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
            Legal DNA Testing Services
          </h2>

          {/* Grid layout cho 3 dịch vụ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 overflow-hidden"
              >
                {/* Service Header - CHIỀU CAO CỐ ĐỊNH CHO ĐỒNG ĐỀU */}
                <div className="p-6 text-white h-[180px] flex flex-col bg-gradient-to-br from-[#002F5E] via-[#004494] to-[#1677FF]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {service.icon}
                      <Tag
                        color="blue"
                        className="border-0 text-xs font-semibold"
                      >
                        {service.type}
                      </Tag>
                    </div>
                  </div>
                  {/* TÊN DỊCH VỤ CÓ CHIỀU CAO CỐ ĐỊNH */}
                  <div className="h-[80px] flex items-start">
                    <h3 className="text-lg font-bold leading-tight">
                      {service.name}
                    </h3>
                  </div>
                </div>

                {/* Service Body */}
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FaClock className="text-blue-500" />
                      <span className="text-gray-600">
                        Processing Time: {service.processingTime}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Standard Price:</span>
                        <span className="text-2xl font-bold text-blue-900">
                          {formatToVND(service.basePrice)}
                        </span>
                      </div>

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

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Key Features:
                    </h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <FaCheck className="text-teal-500 text-sm" />
                          <span className="text-sm text-gray-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Button
                    type="primary"
                    block
                    size="large"
                    onClick={() => openModal(service)}
                    className="font-semibold transition-all duration-200 bg-gradient-to-r from-sky-600 to-blue-700 border-0 hover:from-sky-700 hover:to-blue-800"
                  >
                    View Details & Order
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collection Methods Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16 border border-blue-100">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
            Sample Collection Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mediationMethods.map((method, index) => (
              <Card
                key={index}
                className="text-center border-2 border-blue-100 hover:border-blue-300 transition-all duration-200 hover:shadow-lg"
                bodyStyle={{ padding: "24px" }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-50 rounded-full">
                    {method.icon}
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-blue-900 mb-2">
                  {method.name}
                </h4>
                <p className="text-gray-600 block mb-4">{method.description}</p>
                <div className="text-2xl font-bold text-blue-600">
                  {method.price === 0 ? "FREE" : formatToVND(method.price)}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="rounded-2xl shadow-lg p-8 text-white text-center bg-gradient-to-br from-[#002F5E] via-[#004494] to-[#1677FF]">
          <h2 className="text-3xl font-bold text-white mb-6">
            Need Legal DNA Testing?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our legal DNA testing services meet all court requirements and
            provide admissible evidence for your legal proceedings.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-16 mt-8">
            <div className="flex flex-col items-center">
              <FaPhone className="text-3xl mb-2" />
              <div className="font-semibold">Hotline</div>
              <div className="text-lg">+84 901 452 366</div>
            </div>
            <div className="flex flex-col items-center">
              <FaEnvelope className="text-3xl mb-2" />
              <div className="font-semibold">Email Support</div>
              <a
                href="mailto:genetixcontactsp@gmail.com"
                className="text-lg text-white hover:text-blue-200 transition-colors"
              >
                genetixcontactsp@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Service Detail Modal */}
      <Modal open={modalVisible} onCancel={closeModal} width={800}>
        {selectedService ? (
          <div className="bg-white">
            {/* Modal Header */}
            <div className="p-6 text-white bg-gradient-to-br from-[#004494] to-[#1677FF] rounded-t-lg">
              <div className="flex items-center gap-3 mb-2">
                {selectedService.icon}
                <h3 className="text-2xl font-bold text-white">
                  {selectedService.name}
                </h3>
              </div>
              <Tag color="blue">{selectedService.type}</Tag>
            </div>

            {/* Modal Body */}
            <div className="p-6 bg-white">
              <p className="text-gray-700 text-base mb-6">
                {selectedService.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">
                    Processing Time
                  </h5>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-500" />
                    <span className="text-gray-700">
                      {selectedService.processingTime}
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">
                    Type of Service
                  </h5>
                  <div className="flex items-center gap-2">
                    <FaBalanceScale className="text-blue-500" />
                    <span className="text-gray-700">
                      {selectedService.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100">
                <h5 className="text-lg font-semibold text-gray-900 mb-4">
                  Price details
                </h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Xử lý tiêu chuẩn:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatToVND(selectedService.basePrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-100 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2">
                      <FaBolt className="text-orange-500" />
                      <span className="text-gray-700">
                        24-Hour Expedited Service (with surcharge):
                      </span>
                    </div>
                    <span className="text-lg font-bold text-orange-700">
                      +{formatToVND(selectedService.expressPrice)}
                    </span>
                  </div>
                  <div className="border-t border-blue-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">
                        Total:
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatToVND(
                          selectedService.basePrice +
                            selectedService.expressPrice
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-900 mb-3">
                  Tính năng chính
                </h5>
                <ul className="space-y-2">
                  {selectedService.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <FaCheck className="text-teal-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <Button
                  type="primary"
                  size="large"
                  className="flex-1 font-semibold bg-gradient-to-r from-sky-600 to-blue-700 border-0 text-white hover:from-sky-700 hover:to-blue-800"
                >
                  Đặt dịch vụ tiêu chuẩn
                </Button>
                <Button
                  type="primary"
                  size="large"
                  className="flex-1 font-semibold bg-gradient-to-r from-orange-500 to-orange-600 border-0 text-white hover:from-orange-600 hover:to-orange-700"
                >
                  Đặt dịch vụ nhanh
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-white text-center">
            <p className="text-gray-500">Không có dữ liệu dịch vụ</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LegalServices;
