import React from "react";
import "./legalDNA.css"; // Assuming you have a CSS file for styling

const LegalServices = () => {
  return (
    <div className="legal-dna p-6">
      <h1 className="text-3xl font-bold mb-4">Legal DNA Testing</h1>
      <p className="mb-4 text-gray-700">
        Legal DNA testing can be used in court or legal procedures. Samples are
        collected following a strict chain-of-custody protocol to ensure their
        validity.
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>
          Used for immigration, custody, inheritance, or legal identity
          verification.
        </li>
        <li>
          Sample collected at an authorized facility or under official
          supervision.
        </li>
        <li>
          Results are accompanied by official documentation and notarization if
          needed.
        </li>
      </ul>
      <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Book Legal DNA Test
      </button>
    </div>
  );
};

export default LegalServices;
