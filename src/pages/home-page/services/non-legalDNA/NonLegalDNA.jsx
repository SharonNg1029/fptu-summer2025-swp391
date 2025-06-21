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
  FaMale,
  FaFemale,
  FaBaby,
  FaUserCheck,
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
  icon
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const typeClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-blue-600",
    default: "bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 border border-gray-300",
    link: "bg-transparent text-blue-600 hover:text-blue-700 focus:ring-blue-500"
  };
  
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base"
  };
  
  const shapeClasses = {
    default: "rounded-md",
    circle: "rounded-full w-10 h-10 p-0"
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
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''} ${className}`}>
      <div style={bodyStyle}>
        {children}
      </div>
    </div>
  );
};

// Custom Modal Component
const Modal = ({ open, onCancel, children, width = 600, className = "" }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) {
        onCancel();
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
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
    orange: "bg-orange-100 text-orange-800"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  );
};

const NonLegalServices = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Helper function to format price to VND
  const formatToVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Helper function to render markdown text
  const renderMarkdownText = (text) => {
    const parts = text.split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('***') && part.endsWith('***')) {
        // Bold and italic
        return <strong key={index}><em>{part.slice(3, -3)}</em></strong>;
      } else if (part.startsWith('**') && part.endsWith('**')) {
        // Bold only
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // 3 dịch vụ chính
  const services = [
    {
      id: 1,
      name: "Paternity Testing",
      type: "Non-Legal",
      processingTime: "2-3 working days",
      basePrice: 2500000,
      expressPrice: 1000000,
      icon: <FaMale className="text-2xl" />,
      description: `**Who Needs Paternity DNA Testing?**

In practice, the following cases may require paternity DNA testing:

• When an individual is uncertain whether they are the biological father of a child
• When an individual seeks to identify their biological father
• When verification of the father-child relationship is needed for oneself or family members

**Types of Samples Used for Paternity DNA Testing**

The types of samples used for DNA testing in the Genetix process include:

• Blood sample
• Buccal swab sample (saliva)
• Hair sample with root follicles
• Nail clipping sample

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
***The accuracy of all DNA sample types is equivalent for biological samples from the same individual: >99.999999%***`,
    },
    {
      id: 2,
      name: "Maternity Testing",
      type: "Non-Legal",
      processingTime: "2-3 working days",
      basePrice: 2500000,
      expressPrice: 1000000,
      icon: <FaFemale className="text-2xl" />,
      description: `**Who Needs Maternity DNA Testing?**

In practice, the following cases may require maternity DNA testing:

• Reunification of a mother and child separated for an extended period, to confirm their biological relationship
• Cases where a mother is unable to carry a pregnancy, and the child is born via a surrogate, requiring verification of the biological parentage
• Pregnancies resulting from in vitro fertilization (IVF), necessitating testing to confirm the biological mother-child relationship
• Families suspecting a hospital error, such as a baby mix-up at birth

**Types of Samples Used for Maternity DNA Testing**

The types of samples used for DNA testing in the Genetix process include:

• Blood sample
• Buccal swab sample (saliva)
• Hair sample with root follicles
• Nail clipping sample

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
***The accuracy of all DNA sample types is equivalent for biological samples from the same individual: >99.999999%***`,
    },
    {
      id: 3,
      name: "Non-Invasive Relationship Testing (NIPT)",
      type: "Non-Legal",
      processingTime: "5-7 working days",
      basePrice: 20000000,
      expressPrice: 5000000,
      icon: <FaBaby className="text-2xl" />,
      description: `**About Non-Invasive Prenatal DNA Testing**

Non-Invasive Prenatal DNA Testing must be performed at a medical facility for sample collection.

Non-invasive prenatal DNA testing is designed for pregnant women who wish to accurately determine the paternity of the fetus as early as the 7th week of pregnancy until the end of the pregnancy.

"Non-invasive" means that no instruments are used to intervene or affect the safe environment of the fetus (amniotic fluid or placenta); only a maternal venous blood sample is collected.

For the man suspected to be the father of the fetus, DNA samples such as hair with root follicles or nail clippings are collected and compared with the fetal DNA, yielding a paternity conclusion with an accuracy of 99.99%, which is nearly absolute.

**Samples Used for Non-Invasive Prenatal DNA Testing**

Non-invasive prenatal DNA testing uses 7-10 ml of venous blood from the mother's arm. The sample collection process is performed directly by NOVAGEN's laboratory technicians, and the blood sample is preserved in specialized anticoagulant tubes.

For prenatal DNA testing, a larger amount of DNA is required compared to postnatal paternity DNA testing. Therefore, the following two types of biological samples must be collected simultaneously from the presumed father:

• Hair sample: A minimum of 12-15 hair strands with roots are plucked using tweezers
• Nail clipping sample: Nail clippings are collected from both hands using clean nail clippers

The hair roots and nail clippings are individually wrapped in tissue paper and placed in separate paper envelopes to ensure natural ventilation and prevent anaerobic bacterial contamination that could damage the samples.`,
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
    console.log('Mở modal với dịch vụ:', service);
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
            <FaDna className="text-5xl text-white mr-4" />
            <h1 className="text-5xl font-bold">Non-Legal DNA Testing</h1>
          </div>
          <p className="text-base mb-8 max-w-3xl mx-auto leading-relaxed">
            Personal DNA testing for family knowledge and peace of mind. Our non-legal 
            tests provide accurate results for personal use without court admissibility.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ For Personal Use</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Confidential Results</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Home Collection Available</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Services Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
            Non-Legal DNA Testing Services
          </h2>

          {/* Grid layout cho 3 dịch vụ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 overflow-hidden">
                {/* Service Header - CĂNG ĐỀU TÊN DỊCH VỤ */}
                <div className="p-6 text-white h-[180px] flex flex-col bg-gradient-to-br from-[#002F5E] via-[#004494] to-[#1677FF]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {service.icon}
                      <Tag color="cyan" className="border-0 text-xs font-semibold">
                        {service.type}
                      </Tag>
                    </div>
                  </div>
                  {/* TÊN DỊCH VỤ CÓ CHIỀU CAO CỐ ĐỊNH */}
                  <div className="h-[80px] flex items-start">
                    <h3 className="text-lg font-bold leading-tight">{service.name}</h3>
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

                  {/* Action Button */}
                  <Button
                    type="primary"
                    block
                    size="large"
                    onClick={() => openModal(service)}
                    className="font-semibold transition-all duration-200 bg-gradient-to-r from-teal-500 to-cyan-600 border-0 hover:from-teal-600 hover:to-cyan-700">
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
                bodyStyle={{ padding: "24px" }}>
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-50 rounded-full">
                    {method.icon}
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-blue-900 mb-2">
                  {method.name}
                </h4>
                <p className="text-gray-600 block mb-4">
                  {method.description}
                </p>
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
            Need Help Choosing?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our experts are here to help you select the right non-legal DNA testing
            service for your family needs.
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
        width={800}>
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
              <Tag color="cyan">
                {selectedService.type}
              </Tag>
            </div>

            {/* Modal Body */}
            <div className="p-6 bg-white">
              <div className="text-gray-700 text-base mb-6 whitespace-pre-line">
                {renderMarkdownText(selectedService.description)}
              </div>

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
                    <FaDna className="text-blue-500" />
                    <span className="text-gray-700">{selectedService.type}</span>
                  </div>
                </div>
              </div>

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
                        {formatToVND(
                          selectedService.basePrice + selectedService.expressPrice
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="primary"
                  size="large"
                  className="flex-1 font-semibold bg-gradient-to-r from-teal-500 to-cyan-600 border-0 text-white hover:from-teal-600 hover:to-cyan-700">
                  Book Standard Service
                </Button>
                <Button
                  type="primary"
                  size="large"
                  className="flex-1 font-semibold bg-gradient-to-r from-orange-500 to-orange-600 border-0 text-white hover:from-orange-600 hover:to-orange-700">
                  Book Express Service
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-white text-center">
            <p className="text-gray-500">No service data available</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NonLegalServices;