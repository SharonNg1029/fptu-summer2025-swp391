import React, { useState, useRef } from "react";
import {
  FaDna,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaCheck,
  FaShieldAlt,
  FaHome,
  FaBuilding,
  FaMailBulk,
  FaBolt,
  FaUsers,
  FaBaby,
  FaUserCheck,
  FaSearch,
  FaBalanceScale,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdScience, MdVerified, MdPregnantWoman } from "react-icons/md";
import { BiDna } from "react-icons/bi";
import { Card, Button, Modal, Typography, Tag } from "antd";

const { Title, Text } = Typography;

const Pricing = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const scrollContainerRef = useRef(null);

  // Helper function to format price to VND
  const formatToVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Service data based on your requirements
  const services = {
    nonLegal: [
      {
        id: 1,
        name: "Paternity Testing",
        type: "Non-Legal",
        processingTime: "2-3 working days",
        basePrice: 3500000,
        expressPrice: 1000000,
        icon: <FaUsers className="text-2xl" />,
        description:
          "Determine biological father-child relationship for personal knowledge",
        features: [
          "99.9% accuracy",
          "Home collection available",
          "Confidential results",
        ],
      },
      {
        id: 2,
        name: "Maternity Testing",
        type: "Non-Legal",
        processingTime: "2-3 working days",
        basePrice: 4000000,
        expressPrice: 1000000,
        icon: <MdPregnantWoman className="text-2xl" />,
        description: "Confirm biological mother-child relationship",
        features: ["Highly accurate", "Private testing", "Fast results"],
      },
      {
        id: 3,
        name: "Full Sibling Testing",
        type: "Non-Legal",
        processingTime: "2-3 working days",
        basePrice: 3500000,
        expressPrice: 1000000,
        icon: <FaUsers className="text-2xl" />,
        description: "Determine if siblings share the same biological parents",
        features: [
          "Full sibling analysis",
          "Statistical reporting",
          "Detailed results",
        ],
      },
      {
        id: 4,
        name: "Grandparentage Testing",
        type: "Non-Legal",
        processingTime: "2-3 working days",
        basePrice: 4000000,
        expressPrice: 1000000,
        icon: <FaUserCheck className="text-2xl" />,
        description: "Establish grandparent-grandchild biological relationship",
        features: [
          "Extended family testing",
          "Comprehensive analysis",
          "Clear reporting",
        ],
      },
      {
        id: 5,
        name: "Extended Family Relationship Testing",
        type: "Non-Legal",
        processingTime: "2-3 working days",
        basePrice: 4000000,
        expressPrice: 1000000,
        icon: <BiDna className="text-2xl" />,
        description:
          "Test relationships between aunts, uncles, cousins, and other relatives",
        features: [
          "Multiple relationship types",
          "Advanced analysis",
          "Detailed reporting",
        ],
      },
      {
        id: 6,
        name: "Non-Invasive Prenatal Testing (NIPT)",
        type: "Non-Legal",
        processingTime: "5-7 working days",
        basePrice: 6000000,
        expressPrice: 2000000,
        icon: <FaBaby className="text-2xl" />,
        description:
          "Safe prenatal paternity testing using mother's blood sample",
        features: [
          "No risk to baby",
          "Early testing available",
          "Highly accurate",
        ],
      },
    ],
    legal: [
      {
        id: 7,
        name: "Forensic DNA Analysis",
        type: "Legal",
        processingTime: "3-5 working days",
        basePrice: 4500000,
        expressPrice: 1500000,
        icon: <FaSearch className="text-2xl" />,
        description: "Court-admissible DNA analysis for legal proceedings",
        features: [
          "Chain of custody",
          "Court admissible",
          "Legal documentation",
        ],
      },
      {
        id: 8,
        name: "Adoption DNA Testing",
        type: "Legal",
        processingTime: "3-5 working days",
        basePrice: 4000000,
        expressPrice: 1500000,
        icon: <FaShieldAlt className="text-2xl" />,
        description: "Legal DNA testing for adoption procedures",
        features: [
          "Official documentation",
          "Legal compliance",
          "Witnessed collection",
        ],
      },
      {
        id: 9,
        name: "Individual Identification Testing",
        type: "Legal",
        processingTime: "5-7 working days",
        basePrice: 4500000,
        expressPrice: 2000000,
        icon: <FaBalanceScale className="text-2xl" />,
        description: "Legal identity verification through DNA analysis",
        features: [
          "Identity verification",
          "Legal validity",
          "Official certification",
        ],
      },
    ],
  };

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
      price: 50000,
      icon: <FaMailBulk className="text-xl text-blue-600" />,
      description: "Self-collection kit delivered by post",
    },
  ];

  // Get all services for filtering
  const allServices = [...services.nonLegal, ...services.legal];

  // Filter services based on selected category
  const getFilteredServices = () => {
    if (selectedCategory === "all") return allServices;
    if (selectedCategory === "non-legal") return services.nonLegal;
    if (selectedCategory === "legal") return services.legal;
    return allServices;
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  // Open modal with service details
  const openModal = (service) => {
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
      <div
        className="relative text-white py-20"
        style={{
          background:
            "linear-gradient(135deg, #002F5E 0%, #004494 50%, #1677FF 100%)",
        }}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <FaDna className="text-5xl text-white mr-4" />
            <h1 className="text-5xl font-bold">DNA Testing Pricing</h1>
          </div>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Transparent pricing for all our DNA testing services. Choose from
            legal and non-legal options with express processing available for
            faster results.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ No Hidden Fees</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Express Options Available</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">
                ✓ Multiple Collection Methods
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-2 shadow-lg border border-blue-100">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === "all"
                    ? "all-services-gradient text-white shadow-md"
                    : "text-[#1677FF] hover:bg-blue-50"
                }`}>
                All Services
              </button>
              <button
                onClick={() => setSelectedCategory("non-legal")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === "non-legal"
                    ? "all-services-gradient text-white shadow-md"
                    : "text-[#1677FF] hover:bg-blue-50"
                }`}>
                Non-Legal Testing
              </button>
              <button
                onClick={() => setSelectedCategory("legal")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === "legal"
                    ? "all-services-gradient text-white shadow-md"
                    : "text-[#1677FF] hover:bg-blue-50"
                }`}>
                Legal Testing
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Services */}
        <div className="relative mb-16">
          <div className="flex items-center justify-between mb-6">
            <Title level={2} className="text-blue-900 mb-0">
              Our DNA Testing Services
            </Title>
            <div className="flex gap-2">
              <Button
                type="primary"
                shape="circle"
                icon={<FaChevronLeft />}
                onClick={scrollLeft}
                className="bg-blue-600 border-blue-600 hover:bg-blue-700"
              />
              <Button
                type="primary"
                shape="circle"
                icon={<FaChevronRight />}
                onClick={scrollRight}
                className="bg-blue-600 border-blue-600 hover:bg-blue-700"
              />
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className={`flex gap-6 overflow-x-auto scrollbar-hide pb-4 ${
              selectedCategory === "legal" ? "justify-center" : ""
            }`}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitScrollbar: { display: "none" },
            }}>
            {getFilteredServices().map((service) => (
              <div
                key={service.id}
                className="flex-none w-80 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 overflow-hidden">
                {/* Service Header */}
                <div className="p-6 service-card-header-gradient text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {service.icon}
                      <Tag
                        color={service.type === "Legal" ? "blue" : "cyan"}
                        className="border-0 text-xs font-semibold">
                        {service.type}
                      </Tag>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-sm opacity-90">{service.description}</p>
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
                    className={`font-semibold transition-all duration-200 ${
                      service.type === "Legal"
                        ? "bg-gradient-to-r from-sky-600 to-blue-700 border-0 hover:from-sky-700 hover:to-blue-800"
                        : "bg-gradient-to-r from-teal-500 to-cyan-600 border-0 hover:from-teal-600 hover:to-cyan-700"
                    }`}>
                    View Details & Order
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collection Methods Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16 border border-blue-100">
          <Title level={2} className="text-center text-blue-900 mb-8">
            Sample Collection Methods
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mediationMethods.map((method, index) => (
              <Card
                key={index}
                className="text-center border-2 border-blue-100 hover:border-blue-300 transition-all duration-200 hover:shadow-lg"
                bodyStyle={{ padding: "24px" }}>
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-50 rounded-full">
                    {method.icon}
                  </div>
                </div>
                <Title level={4} className="text-blue-900 mb-2">
                  {method.name}
                </Title>
                <Text className="text-gray-600 block mb-4">
                  {method.description}
                </Text>
                <div className="text-2xl font-bold text-blue-600">
                  {method.price === 0 ? "FREE" : formatToVND(method.price)}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div
          className="rounded-2xl shadow-lg p-8 text-white text-center"
          style={{
            background:
              "linear-gradient(135deg, #002F5E 0%, #004494 50%, #1677FF 100%)",
          }}>
          <Title level={2} style={{ color: "#fff" }} className="mb-6">
            Need Help Choosing?
          </Title>
          <p className="text-xl mb-8 opacity-90">
            Our experts are here to help you select the right DNA testing
            service for your needs.
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
                className="text-lg text-white hover:text-blue-200 transition-colors">
                genetixcontactsp@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Service Detail Modal */}
      <Modal
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
        className="pricing-modal">
        {selectedService && (
          <div>
            {/* Modal Header */}
            <div
              className={`p-6 -m-6 mb-6 ${
                selectedService.type === "Legal"
                  ? "legal-modal-gradient"
                  : "nonlegal-modal-gradient"
              } text-white rounded-t-lg`}>
              <div className="flex items-center gap-3 mb-2">
                {selectedService.icon}
                <Title level={3} className="text-white mb-0">
                  {selectedService.name}
                </Title>
              </div>
              <Tag
                color={selectedService.type === "Legal" ? "blue" : "cyan"}
                className="border-0">
                {selectedService.type}
              </Tag>
            </div>

            {/* Modal Body */}
            <div>
              <Text className="text-gray-700 text-base block mb-6">
                {selectedService.description}
              </Text>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Title level={5} className="text-gray-900 mb-3">
                    Processing Time
                  </Title>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-500" />
                    <span>{selectedService.processingTime}</span>
                  </div>
                </div>

                <div>
                  <Title level={5} className="text-gray-900 mb-3">
                    Service Type
                  </Title>
                  <div className="flex items-center gap-2">
                    <MdVerified className="text-blue-500" />
                    <span>{selectedService.type}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100">
                <Title level={5} className="text-gray-900 mb-4">
                  Pricing Details
                </Title>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Standard Processing:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatToVND(selectedService.basePrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-100 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2">
                      <FaBolt className="text-orange-500" />
                      <span>Express Service (additional):</span>
                    </div>
                    <span className="text-lg font-bold text-orange-700">
                      +{formatToVND(selectedService.expressPrice)}
                    </span>
                  </div>
                  <div className="border-t border-blue-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Express Total:</span>
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
                <Title level={5} className="text-gray-900 mb-3">
                  Key Features
                </Title>
                <ul className="space-y-2">
                  {selectedService.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <FaCheck className="text-teal-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <Button
                  type="primary"
                  size="large"
                  className={`flex-1 font-semibold ${
                    selectedService.type === "Legal"
                      ? "bg-gradient-to-r from-sky-600 to-blue-700 border-0"
                      : "bg-gradient-to-r from-teal-500 to-cyan-600 border-0"
                  }`}>
                  Order Standard Service
                </Button>
                <Button
                  type="primary"
                  size="large"
                  className="flex-1 font-semibold bg-gradient-to-r from-orange-500 to-orange-600 border-0">
                  Order Express Service
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .legal-modal-gradient {
          background: linear-gradient(
            135deg,
            #002f5e 0%,
            #004494 50%,
            #1677ff 100%
          ) !important;
        }
        .nonlegal-modal-gradient {
          background: linear-gradient(
            135deg,
            #004494 0%,
            #1677ff 100%
          ) !important;
        }
        .service-card-header-gradient {
          background: linear-gradient(
            135deg,
            #002f5e 0%,
            #004494 50%,
            #1677ff 100%
          ) !important;
          height: 190px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .nonlegal-card-gradient,
        .legal-card-gradient {
          /* Deprecated: use .service-card-header-gradient instead */
        }
        .all-services-gradient {
          background: linear-gradient(
            135deg,
            #002f5e 0%,
            #004494 50%,
            #1677ff 100%
          ) !important;
        }
      `}</style>
    </div>
  );
};

export default Pricing;
