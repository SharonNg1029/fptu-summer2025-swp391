import React from "react";
import { FaBaby, FaPassport, FaMoneyBillWave, FaHome, FaBuilding, FaMailBulk } from "react-icons/fa";

// ===== DỮ LIỆU DỊCH VỤ LEGAL DNA TESTING =====
export const legalServicesData = [
  {
    id: 1,
    name: "DNA Testing for Birth Certificate",
    type: "Legal",
    processingTime: "3-7 working days",
    basePrice: 3500000,
    expressPrice: 1500000,
    icon: <FaBaby className="text-xl" />,
    backgroundImage: "https://images2.thanhnien.vn/528068263637045248/2023/6/29/giay-khai-sinh-2-1688001417801425690462.jpg",
    description: `**DNA Testing for Birth Certificate**

Court-admissible DNA testing for official birth registration and legal documentation.

This service provides legally recognized paternity testing results that can be used for:
• Official birth certificate registration
• Legal paternity establishment
• Government documentation requirements
• Court proceedings

**Key Features:**
• Chain of custody maintained throughout the process
• Results admissible in court
• Professional sample collection by certified technicians
• Official certification and documentation
• Compliance with legal standards and requirements

**Sample Collection Process:**
All samples are collected directly by certified laboratory technicians with proper identification verification and photographic documentation of all participants.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
***Legal DNA testing ensures complete chain of custody and court admissibility with >99.999999% accuracy***`,
  },
  {
    id: 2,
    name: "DNA Testing for Immigration, Sponsorship, or Citizenship Applications",
    type: "Legal",
    processingTime: "3-7 working days",
    basePrice: 6000000,
    expressPrice: 1500000,
    icon: <FaPassport className="text-xl" />,
    backgroundImage: "https://www.cis.vn/wp-content/uploads/2021/11/huong-dan-thu-tuc-xin-song-tich-cho-viet-kieu1.jpg",
    description: `**DNA Testing for Immigration and Citizenship**

Legal DNA testing specifically designed for immigration, family sponsorship, and citizenship applications.

This service is accepted by:
• Immigration authorities worldwide
• Embassies and consulates
• Citizenship application processes
• Family reunification programs
• Visa application procedures

**Documentation Provided:**
• Embassy-accepted test results
• Official certification letters
• Chain of custody documentation
• International compliance certificates
• Notarized reports

**Process Requirements:**
• Professional sample collection with witness verification
• Photographic identification of all participants
• Strict chain of custody protocols
• Compliance with international testing standards
• Multiple language support for documentation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
***Internationally recognized results accepted by immigration authorities with >99.999999% accuracy***`,
  },
  {
    id: 3,
    name: "DNA Testing for Inheritance or Asset Division",
    type: "Legal",
    processingTime: "3-7 working days",
    basePrice: 4000000,
    expressPrice: 1500000,
    icon: <FaMoneyBillWave className="text-xl" />,
    backgroundImage: "https://images2.thanhnien.vn/528068263637045248/2023/6/15/thua-ke-16868272484361420781118.jpg",
    description: `**DNA Testing for Inheritance and Asset Division**

Court-admissible DNA testing for inheritance claims and asset division proceedings.

This service supports:
• Inheritance dispute resolution
• Estate planning verification
• Asset division proceedings
• Legal heir identification
• Will contest cases
• Probate court requirements

**Legal Applications:**
• Probate court proceedings
• Will contest cases
• Estate distribution
• Inheritance rights establishment
• Trust fund verification
• Family lineage confirmation

**Professional Standards:**
• Full chain of custody documentation
• Court-admissible results
• Legal expert testimony available
• Compliance with judicial requirements
• Detailed forensic reporting
• Multi-generational testing capability

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
***Court-approved testing for legal inheritance proceedings with >99.999999% accuracy***`,
  },
];

// ===== DỮ LIỆU PHƯƠNG THỨC LẤY MẪU LEGAL =====
export const legalCollectionMethodsData = [
  {
    name: "Home Collection",
    price: 300000,
    icon: <FaHome className="text-xl text-blue-600" />,
    description: "Professional sample collection at your home with legal documentation",
  },
  {
    name: "At Facility",
    price: 0,
    icon: <FaBuilding className="text-xl text-blue-600" />,
    description: "Visit our facility for certified legal sample collection",
  },
  {
    name: "Postal Delivery",
    price: 200000,
    icon: <FaMailBulk className="text-xl text-blue-600" />,
    description: "Legal collection kit with certified chain of custody",
  },
];