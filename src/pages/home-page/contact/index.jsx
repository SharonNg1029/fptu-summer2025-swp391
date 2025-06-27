import React from "react";

const contacts = [
  {
    icon: (
      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
        </svg>
      </div>
    ),
    title: "Phone Support",
    desc: "Call us directly for immediate assistance",
    content: (
      <>
        <a
          href="tel:+84901452366"
          className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          +84 901 452 366
        </a>
        <p className="text-sm text-green-600 mt-1">Available 24/7</p>
      </>
    ),
  },
  {
    icon: (
      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
        </svg>
      </div>
    ),
    title: "Email Support",
    desc: "Send us a detailed message",
    content: (
      <>
        <a
          href="https://mail.google.com/mail/?view=cm&to=genetixcontactsp@gmail.com&su=Support%20for%20DNA%20testing%20services"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          genetixcontactsp@gmail.com
        </a>
        <p className="text-sm text-gray-500 mt-1">
          We'll respond within 24 hours
        </p>
      </>
    ),
  },
  {
    icon: (
      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
        </svg>
      </div>
    ),
    title: "Visit Our Office",
    desc: "Professional medical facility",
    content: (
      <>
        <p className="text-lg font-semibold text-gray-800">
          7 D1 Street, Long Thanh My Ward,<br />
          Thu Duc City, Ho Chi Minh City, Vietnam
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Monday - Sunday: 8:00 AM - 8:00 PM
        </p>
      </>
    ),
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center pt-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to get started? Our expert team is here to help you with
              professional DNA testing services.
            </p>
          </div>
        </div>
      </div>

      {/* Main Contact Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Contact Information */}
            <div className="flex-1">
              <div className="flex flex-row gap-8">
                {contacts.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center text-center">
                    {item.icon}
                    <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-2">{item.desc}</p>
                    <div>{item.content}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* You can add a right side (form, map, etc.) here if needed */}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="rounded-3xl shadow-2xl p-12"
            style={{
              background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)"
            }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Contact us today for a free consultation about your DNA testing needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+84901452366"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Call Now: +84 901 452 366
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&to=genetixcontactsp@gmail.com&su=Free%20Consultation%20Request"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;