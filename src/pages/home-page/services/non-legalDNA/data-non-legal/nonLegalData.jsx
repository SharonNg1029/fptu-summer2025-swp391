import React from "react";
import { FaMale, FaFemale, FaBaby, FaHome, FaBuilding, FaMailBulk } from "react-icons/fa";

// ===== DỮ LIỆU DỊCH VỤ NON-LEGAL DNA TESTING =====
export const nonLegalServicesData = [
  {
    id: 1,                          // ID để map trong React component
    serviceID: "SNL001",            // Service ID cho API (String)
    name: "Paternity Testing",
    type: "Non-Legal",
    processingTime: "2-3 working days",
    basePrice: 2500000,
    expressPrice: 1000000,
    icon: <FaMale className="text-xl" />,
    backgroundImage: "https://cdn.internationalpaternity.com/wp-content/uploads/sites/26/2023/05/father-holding-baby-paternity-test-ip.jpg",
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
    id: 2,                          // ID để map trong React component
    serviceID: "SNL002",            // Service ID cho API (String)
    name: "Maternity Testing",
    type: "Non-Legal",
    processingTime: "2-3 working days",
    basePrice: 2500000,
    expressPrice: 1000000,
    icon: <FaFemale className="text-xl" />,
    backgroundImage: "https://easydna.ph/wp-content/uploads/2023/05/easyph-mother-and-baby-motherhood-week-2023-min-1024x683-1160x665.jpg",
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
    id: 3,                          // ID để map trong React component
    serviceID: "SNL003",            // Service ID cho API (String)
    name: "Non-Invasive Relationship Testing (NIPT)",
    type: "Non-Legal",
    processingTime: "5-7 working days",
    basePrice: 20000000,
    expressPrice: 5000000,
    icon: <FaBaby className="text-xl" />,
    backgroundImage: "https://www.choicedna.com/wp-content/uploads/2https897899516.onlinehome.usdna-testing-locationsdna-testing-labs-in-austin-tx.webp",
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

// ===== DỮ LIỆU PHƯƠNG THỨC LẤY MẪU NON-LEGAL =====
export const nonLegalCollectionMethodsData = [
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