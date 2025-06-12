import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaBalanceScale, 
  FaHeart, 
  FaShieldAlt, 
  FaClock, 
  FaUserCheck, 
  FaFileAlt, 
  FaChevronDown, 
  FaChevronUp, 
  FaBaby,
  FaUsers
} from "react-icons/fa";
import { MdScience, MdVerified, MdPregnantWoman } from "react-icons/md";
import { BiDna } from "react-icons/bi";

const ServicesOverview = () => {
  const [expandedService, setExpandedService] = useState(null);

  const services = [
    {
      id: 1,
      title: "Legal DNA Testing",
      subtitle: "Court Admissible & Legally Binding",
      description: "Legal DNA testing is conducted with strict chain of custody procedures, making results admissible in court proceedings, immigration cases, and official documentation. All samples are collected by certified professionals or witnessed collectors.",
      whatIsIt: "Legal DNA testing follows stringent protocols required by courts and government agencies. The entire process is documented, witnessed, and maintains a clear chain of custody from sample collection to result reporting.",
      features: [
        "Chain of custody documentation",
        "Court admissible results", 
        "Professional sample collection",
        "Witnessed collection process",
        "Legal authentication",
        "Government approved procedures"
      ],
      testTypes: [
        {
          category: "Paternity/Maternity Testing",
          tests: ["Father - Child", "Mother - Child"],
          icon: <FaUsers className="text-blue-600" />
        },
        {
          category: "Grandparent Testing", 
          tests: ["Grandfather - Grandson", "Grandmother - Grandchild"],
          icon: <FaUserCheck className="text-blue-600" />
        },
        {
          category: "Avuncular Testing",
          tests: ["Uncle - Nephew", "Aunt - Niece"],
          icon: <BiDna className="text-blue-600" />
        },
        {
          category: "Sibling Testing",
          tests: ["Full Siblings", "Half Siblings"],
          icon: <FaUsers className="text-blue-600" />
        },
        {
          category: "Prenatal Testing",
          tests: ["Invasive Prenatal Testing (Amniocentesis, CVS)"],
          icon: <FaBaby className="text-blue-600" />
        },
        {
          category: "Identity Testing",
          tests: ["Personal DNA Card Testing", "Biological Identity Card"],
          icon: <FaFileAlt className="text-blue-600" />
        }
      ],
      icon: <FaBalanceScale className="text-4xl text-blue-600" />,
      price: "Starting from $299",
      turnaround: "5-7 business days",
      link: "/services/legal",
      bgGradient: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      id: 2,
      title: "Non-Legal DNA Testing",
      subtitle: "Personal Knowledge & Peace of Mind",
      description: "Non-legal DNA testing is designed for personal curiosity and peace of mind. While highly accurate, these results cannot be used in court proceedings or official documentation. Samples can be collected at home using our easy-to-use collection kits.",
      whatIsIt: "Non-legal DNA testing provides the same scientific accuracy as legal testing but without the strict chain of custody requirements. It's perfect for personal knowledge, family planning, or satisfying curiosity about biological relationships.",
      features: [
        "Complete privacy & confidentiality",
        "Easy home collection kit",
        "Fast results delivery", 
        "No legal documentation required",
        "Anonymous testing available",
        "Same scientific accuracy"
      ],
      testTypes: [
        {
          category: "Paternity/Maternity Testing",
          tests: ["Father - Child", "Mother - Child"],
          icon: <FaUsers className="text-green-600" />
        },
        {
          category: "Grandparent Testing",
          tests: ["Grandfather - Grandchild", "Grandmother - Grandchild"],
          icon: <FaUserCheck className="text-green-600" />
        },
        {
          category: "Sibling Testing", 
          tests: ["Full Siblings", "Half Siblings", "Step Siblings"],
          description: "Determine relationships between siblings including full, half, or step-sibling connections",
          icon: <FaUsers className="text-green-600" />
        },
        {
          category: "Extended Family Testing",
          tests: ["Uncle - Nephew", "Aunt - Niece", "Cousin Testing"],
          description: "Determine relationships with extended family members including uncles, aunts, and cousins",
          icon: <BiDna className="text-green-600" />
        },
        {
          category: "Prenatal Testing",
          tests: ["Non-Invasive Prenatal Testing (NIPT)"],
          description: "Safe prenatal testing using mother's blood sample, no risk to baby",
          icon: <FaBaby className="text-green-600" />
        }
      ],
      icon: <FaHeart className="text-4xl text-green-600" />,
      price: "Starting from $199", 
      turnaround: "3-5 business days",
      link: "/services/non-legal",
      bgGradient: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      buttonColor: "bg-green-600 hover:bg-green-700"
    }
  ];

  const toggleExpanded = (serviceId) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  const comparisonData = [
    { feature: "Court Admissible", legal: "✓ Yes", nonLegal: "✗ No" },
    { feature: "Chain of Custody", legal: "✓ Required", nonLegal: "✗ Not Required" },
    { feature: "Sample Collection", legal: "Professional/Witnessed", nonLegal: "Home Collection" },
    { feature: "Privacy Level", legal: "Standard", nonLegal: "Maximum" },
    { feature: "Turnaround Time", legal: "5-7 Days", nonLegal: "3-5 Days" },
    { feature: "Cost", legal: "Higher", nonLegal: "Lower" },
    { feature: "Accuracy", legal: "99.9%", nonLegal: "99.9%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative text-white py-20" style={{ backgroundColor: '#003469' }}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Professional DNA Testing Services
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Choose between Legal and Non-Legal DNA testing based on your specific needs. 
            Both offer the same scientific accuracy with different documentation requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ 99.9% Accuracy</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Multiple Test Types</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="font-semibold">✓ Fast Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our DNA Testing Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Understanding the difference between Legal and Non-Legal DNA testing
            </p>
          </div>

          <div className="space-y-8">
            {services.map((service) => (
              <div
                key={service.id}
                className={`bg-gradient-to-br ${service.bgGradient} rounded-2xl ${service.borderColor} border-2 shadow-lg hover:shadow-2xl transition-all duration-300`}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      {service.icon}
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900">
                          {service.title}
                        </h3>
                        <p className="text-lg font-medium text-gray-600">
                          {service.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {service.price}
                      </div>
                      <div className="text-sm text-gray-600">
                        {service.turnaround}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-lg p-6 mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">What is {service.title}?</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {service.whatIsIt}
                    </p>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                    {service.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-lg">Key Features:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-current rounded-full text-green-600"></div>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpanded(service.id)}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium mb-6"
                  >
                    <span>View Available Test Types</span>
                    {expandedService === service.id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>

                  {expandedService === service.id && (
                    <div className="bg-white rounded-lg p-6 mb-6 border-l-4 border-blue-500">
                      <h4 className="font-bold text-gray-900 mb-6 text-xl">Available Test Types:</h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {service.testTypes.map((testType, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              {testType.icon}
                              <h5 className="font-semibold text-gray-900">{testType.category}</h5>
                            </div>
                            <ul className="space-y-1">
                              {testType.tests.map((test, testIndex) => (
                                <li key={testIndex} className="text-sm text-gray-700">
                                  • {test}
                                </li>
                              ))}
                            </ul>
                            {testType.description && (
                              <p className="text-xs text-gray-600 mt-2 italic">
                                {testType.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    to={service.link}
                    className={`inline-flex items-center justify-center w-full px-6 py-4 ${service.buttonColor} text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200`}
                  >
                    Learn More & Order {service.title}
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Legal vs Non-Legal Testing Comparison
            </h2>
            <p className="text-xl text-gray-600">
              Understanding the key differences between our testing options
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ background: 'linear-gradient(to right, #003469, #10b981)' }} className="text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold">Legal Testing</th>
                    <th className="px-6 py-4 text-center font-semibold">Non-Legal Testing</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-6 py-4 font-medium text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-center">{row.legal}</td>
                      <td className="px-6 py-4 text-center">{row.nonLegal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 text-white" style={{ background: 'linear-gradient(to right, #003469, #10b981)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 leading-relaxed">
            Choose the testing service that best fits your needs and get accurate, reliable results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services/legal"
              className="inline-flex items-center justify-center px-8 py-4 bg-white font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200"
              style={{ color: '#003469' }}
            >
              Order Legal Test
            </Link>
            <Link
              to="/services/non-legal"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white transition-all duration-200 hover:text-blue-900"
            >
              Order Non-Legal Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesOverview;