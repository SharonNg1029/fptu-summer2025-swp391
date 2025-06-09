import React from "react";
import "./nonlegalDNA.css";

const NonLegalServices = () => {
  return (
    <div className="non-legal-dna p-6">
      <h1 className="text-3xl font-bold mb-4">Non-Legal DNA Testing</h1>
      <p className="mb-4 text-gray-700">
        Non-legal DNA testing is ideal for personal peace of mind. It's easy to
        do at home and does not require any legal supervision.
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Best for confirming biological relationships privately.</li>
        <li>
          Sample can be collected at home using our free DNA collection kit.
        </li>
        <li>Not valid in legal proceedings or official matters.</li>
      </ul>
      <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Book Non-Legal DNA Test
      </button>
    </div>
  );
};

export default NonLegalServices;
