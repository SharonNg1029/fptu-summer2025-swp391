import React from "react";
import { Link } from "react-router-dom";
import "./index.css"; // Ensure you have the appropriate CSS for styling

const ServicesOverview = () => {
  return (
    <div className="services-overview p-6">
      <h1 className="text-3xl font-bold mb-4">Our DNA Testing Services</h1>
      <p className="mb-6 text-gray-700">
        We provide both legal and non-legal DNA testing services for individuals
        and organizations. Choose the type of service that best fits your needs.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Legal DNA Testing</h2>
          <p className="text-gray-600 mb-4">
            For administrative/legal purposes such as court cases, immigration,
            or birth certificate updates.
          </p>
          <Link
            to="/services/legal-dna-testing"
            className="text-blue-600 hover:underline"
          >
            Learn more →
          </Link>
        </div>
        <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Non-Legal DNA Testing</h2>
          <p className="text-gray-600 mb-4">
            For personal knowledge and peace of mind. This type of test is not
            admissible in court.
          </p>
          <Link
            to="/services/non-legal-dna-testing"
            className="text-blue-600 hover:underline"
          >
            Learn more →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesOverview;
