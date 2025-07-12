import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendar, FaUser, FaArrowLeft, FaClock, FaTag, FaChevronRight, FaHome } from 'react-icons/fa';

// Optimized data for articles (removed views, likes, comments)
const articles = [
  {
    id: 1,
    title: "Next-Generation DNA Testing Technology in 2024",
    category: "Knowledge",
    excerpt: "Discover the latest breakthroughs in DNA testing technology with 99.99% accuracy and rapid processing speed.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop",
    slug: "cong-nghe-xet-nghiem-adn-the-he-moi-2024",
    author: "Dr. Nguyen Minh Khoa",
    date: "2024-01-25",
    readTime: "15 min read",
    featured: true,
    tableOfContents: [
      { id: "1", title: "Introduction to New Technology", level: 1 },
      { id: "2", title: "Next Generation Sequencing (NGS) Technology", level: 1 },
      { id: "3", title: "Superior Advantages Over Traditional Methods", level: 1 },
      { id: "4", title: "Detailed Implementation Process", level: 1 },
      { id: "5", title: "Applications in Forensic Medicine", level: 1 },
      { id: "6", title: "AI and Machine Learning Technology", level: 1 },
      { id: "7", title: "International Standards and Quality Certification", level: 1 },
      { id: "8", title: "Cost and Efficiency Comparison", level: 1 },
      { id: "9", title: "Future Development Trends", level: 1 },
      { id: "10", title: "Conclusion and Recommendations", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <h2 id="1">Introduction to New Technology</h2>
        <p>Next-generation DNA testing technology in 2024 marks a significant breakthrough in genetics and forensic medicine. With the development of molecular biotechnology, modern DNA testing methods have far exceeded the limitations of traditional techniques, providing higher accuracy, faster processing speeds, and more diverse analytical capabilities.</p>
        
        <p>Significant advances in this technology include the application of artificial intelligence (AI), machine learning, and next-generation sequencing (NGS) techniques. This not only improves the quality of results but also opens up new application possibilities in various fields.</p>

        <h2 id="2">Next Generation Sequencing (NGS) Technology</h2>
        <p>Next Generation Sequencing (NGS) is one of the most advanced technologies applied in next-generation DNA testing. NGS allows sequencing millions of DNA fragments simultaneously, rather than processing one fragment at a time like traditional methods.</p>
        
        <p><strong>Operating principles of NGS:</strong></p>
        <ul>
          <li><strong>Sample preparation:</strong> DNA is extracted and cut into small fragments of appropriate size</li>
          <li><strong>Amplification:</strong> Using PCR technique to create multiple copies of each DNA fragment</li>
          <li><strong>Sequencing:</strong> DNA fragments are sequenced simultaneously using advanced optical technology</li>
          <li><strong>Data analysis:</strong> Using AI algorithms to process and analyze sequence data</li>
        </ul>
        
        <p>NGS technology can process billions of nucleotides in a single run, allowing analysis of the entire genome or specific regions with extreme accuracy.</p>

        <h2 id="3">Superior Advantages Over Traditional Methods</h2>
        <p>Next-generation DNA testing technology offers many outstanding advantages compared to traditional methods:</p>
        
        <p><strong>1. Rapid processing speed:</strong></p>
        <ul>
          <li>Results can be available within 24-48 hours instead of 5-7 days as before</li>
          <li>High automation process reduces manual operation time</li>
          <li>Simultaneous processing of multiple samples in a single run</li>
        </ul>
        
        <p><strong>2. Superior accuracy:</strong></p>
        <ul>
          <li>Achieves 99.99% accuracy with advanced AI technology</li>
          <li>Ability to detect rare variants and point mutations</li>
          <li>Minimizes false negative and false positive rates</li>
        </ul>
        
        <p><strong>3. Optimized cost:</strong></p>
        <ul>
          <li>Reduces costs by 40-50% compared to old methods</li>
          <li>Maximizes resource and equipment utilization</li>
          <li>Reduces labor costs and consumables</li>
        </ul>
        
        <p><strong>4. Simplified process:</strong></p>
        <ul>
          <li>Only requires saliva or cheek cell samples</li>
          <li>No need for blood or invasive samples</li>
          <li>Simple, safe sampling process</li>
        </ul>

        <h2 id="4">Detailed Implementation Process</h2>
        <p>The next-generation DNA testing process is carried out according to international standard steps, ensuring accuracy and customer information security:</p>
        
        <p><strong>Step 1: Sample reception and processing</strong></p>
        <ul>
          <li>Check sample integrity and customer information</li>
          <li>Encode samples to ensure confidentiality</li>
          <li>Store samples under appropriate temperature and humidity conditions</li>
        </ul>
        
        <p><strong>Step 2: DNA extraction</strong></p>
        <ul>
          <li>Use specialized DNA extraction kits</li>
          <li>Check DNA quality and concentration</li>
          <li>Assess the purity of extracted DNA</li>
        </ul>
        
        <p><strong>Step 3: Amplification and analysis</strong></p>
        <ul>
          <li>Use PCR technique to amplify target regions</li>
          <li>Apply NGS technology for sequencing</li>
          <li>Analyze data using specialized software</li>
        </ul>
        
        <p><strong>Step 4: Quality check and reporting</strong></p>
        <ul>
          <li>Perform internal quality checks</li>
          <li>Compare with international standard samples</li>
          <li>Create detailed and easy-to-understand result reports</li>
        </ul>

        <h2 id="5">Applications in Forensic Medicine</h2>
        <p>Next-generation DNA testing technology has many important applications in forensic medicine and related fields:</p>
        
        <p><strong>1. Determining blood relationships:</strong></p>
        <ul>
          <li>Paternity testing with 99.99% accuracy</li>
          <li>Identifying sibling relationships</li>
          <li>Grandparent-grandchild relationship testing</li>
          <li>Identifying distant family relationships</li>
        </ul>
        
        <p><strong>2. Resolving legal disputes:</strong></p>
        <ul>
          <li>Inheritance disputes</li>
          <li>Determining child custody rights</li>
          <li>Resolving civil cases</li>
          <li>Supporting criminal investigations</li>
        </ul>
        
        <p><strong>3. Medical research:</strong></p>
        <ul>
          <li>Population genetics research</li>
          <li>Detection of genetic diseases</li>
          <li>Pharmacogenetic research</li>
          <li>Gene therapy development</li>
        </ul>

        <h2 id="6">AI and Machine Learning Technology</h2>
        <p>Artificial intelligence and machine learning play important roles in improving DNA testing quality:</p>
        
        <p><strong>AI applications in data analysis:</strong></p>
        <ul>
          <li><strong>Pattern recognition:</strong> AI can identify complex patterns in DNA data</li>
          <li><strong>Result prediction:</strong> Machine learning algorithms help predict results with high accuracy</li>
          <li><strong>Error detection:</strong> Automatically detect and correct errors in the analysis process</li>
          <li><strong>Process optimization:</strong> AI helps optimize steps in the testing process</li>
        </ul>
        
        <p><strong>Deep Learning algorithms:</strong></p>
        <p>Deep neural networks are trained on millions of DNA data samples to:</p>
        <ul>
          <li>Improve the accuracy of DNA comparison</li>
          <li>Reduce analysis time from hours to minutes</li>
          <li>Detect complex relationships that cannot be identified by the naked eye</li>
          <li>Predict genetic characteristics from DNA data</li>
        </ul>

        <h2 id="7">International Standards and Quality Certification</h2>
        <p>Next-generation DNA testing technology strictly adheres to international standards:</p>
        
        <p><strong>ISO/IEC 17025 standard:</strong></p>
        <ul>
          <li>Ensures laboratory competence</li>
          <li>Comprehensive quality management</li>
          <li>Control of factors affecting results</li>
        </ul>
        
        <p><strong>AABB (American Association of Blood Banks) standard:</strong></p>
        <ul>
          <li>Regulations on blood relationship testing</li>
          <li>Ensures reliability of results</li>
          <li>Periodic quality checking</li>
        </ul>
        
        <p><strong>CAP (College of American Pathologists) certification:</strong></p>
        <ul>
          <li>Laboratory proficiency testing</li>
          <li>Process and equipment evaluation</li>
          <li>Ensures compliance with international regulations</li>
        </ul>

        <h2 id="8">Cost and Efficiency Comparison</h2>
        <p>Cost-effectiveness analysis of new technology compared to traditional methods:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Criteria</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Old Method</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">New Technology</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Processing Time</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">5-7 days</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">24-48 hours</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Accuracy</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">99.9%</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">99.99%</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Cost</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">100%</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">60%</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Samples processed/day</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">50-100</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">500-1000</td>
          </tr>
        </table>
        
        <p><strong>Economic benefits:</strong></p>
        <ul>
          <li>Reduces operating costs by 40%</li>
          <li>Increases processing productivity 10-fold</li>
          <li>Reduces waiting time for results by 60%</li>
          <li>Saves 30% in manpower</li>
        </ul>

        <h2 id="9">Future Development Trends</h2>
        <p>DNA testing technology is developing in many breakthrough directions:</p>
        
        <p><strong>1. Portable DNA Sequencing Technology:</strong></p>
        <ul>
          <li>Mobile DNA testing devices</li>
          <li>Quick on-site results</li>
          <li>Applications in emergency and disaster scenarios</li>
        </ul>
        
        <p><strong>2. Quantum Computing in DNA analysis:</strong></p>
        <ul>
          <li>Increases data processing speed by millions of times</li>
          <li>Analysis of complex relationships</li>
          <li>Opens up possibilities for comprehensive genome research</li>
        </ul>
        
        <p><strong>3. Blockchain in data security:</strong></p>
        <ul>
          <li>Ensures integrity of DNA data</li>
          <li>Protects personal privacy</li>
          <li>Creates decentralized storage systems</li>
        </ul>
        
        <p><strong>4. Advanced AI and Neural Networks:</strong></p>
        <ul>
          <li>Development of specialized AI models</li>
          <li>Prediction of complex genetic characteristics</li>
          <li>Personalized medicine based on DNA</li>
        </ul>

        <h2 id="10">Conclusion and Recommendations</h2>
        <p>Next-generation DNA testing technology in 2024 represents an important step forward in forensic medicine and genetics. With outstanding advantages in speed, accuracy, and cost, this technology not only improves service quality but also opens up many new application opportunities.</p>
        
        <p><strong>Recommendations for the public:</strong></p>
        <ul>
          <li>Choose centers with international certification</li>
          <li>Research thoroughly about the process and technology used</li>
          <li>Ensure personal information security</li>
          <li>Consult experts before making decisions</li>
        </ul>
        
        <p><strong>Recommendations for medical facilities:</strong></p>
        <ul>
          <li>Invest in modern technology and equipment</li>
          <li>Train highly specialized human resources</li>
          <li>Build comprehensive quality management systems</li>
          <li>Cooperate with international organizations</li>
        </ul>
        
        <p>With the continuous development of science and technology, we can expect new breakthroughs in the near future, bringing great benefits to society and people.</p>
      </div>
    `
  },
   {
    id: 2,
    title: "Administrative Procedures for DNA Testing in Vietnam",
    category: "Administration",
    excerpt: "A detailed guide to the required administrative procedures for conducting DNA tests as regulated by the Ministry of Health.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800&fit=crop",
    slug: "quy-trinh-hanh-chinh-xet-nghiem-adn-tai-viet-nam",
    author: "Lawyer Tran Van Minh",
    date: "2024-01-23",
    readTime: "8 min read",
    featured: false,
    views: 1420,
    likes: 98,
    comments: 25,
    tableOfContents: [
      { id: "", title: "Initial Consultation and Guidance", level: 1 },
      { id: "1", title: "Preparation of Documents", level: 1 },
      { id: "2", title: "Testing Process", level: 1 },
      { id: "3", title: "Receiving Results", level: 1 },
      { id: "4", title: "Processing and Application of Results", level: 1 },
      { id: "5", title: "Important Notes", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <h2 id="0">Step 0: Initial Consultation and Guidance</h2>
        <p>Research information and receive professional consultation before deciding to proceed with testing:</p>    
        <p><strong>Evaluating needs and purposes:</strong></p>
        <ul>
          <li><strong>Personal purposes:</strong> Understanding family blood relationships</li>
          <li><strong>Legal purposes:</strong> Supporting civil disputes, inheritance, child recognition</li>
          <li><strong>Medical purposes:</strong> Diagnosing genetic diseases, organ transplantation</li>
          <li><strong>Immigration purposes:</strong> Proving family relationships for visas</li>
        </ul>
        
        <p><strong>Selecting the appropriate test type:</strong></p>
        <ul>
          <li><strong>Father-child testing:</strong> Determining father and child relationship</li>
          <li><strong>Mother-child testing:</strong> Determining mother and child relationship</li>
          <li><strong>Sibling testing:</strong> Determining sibling relationships</li>
          <li><strong>Grandparent-grandchild testing:</strong> Determining 2nd generation relationships</li>
        </ul>

        <h2 id="1">Step 1: Preparation of Documents</h2>
        <p>Prepare all necessary documents according to Circular 15/2020/TT-BYT regulations:</p>
        
        <p><strong>Required documents:</strong></p>
        <ul>
          <li><strong>ID card/Passport:</strong> Original for verification + notarized copy</li>
          <li><strong>Birth certificate:</strong> For children under 14 years old</li>
          <li><strong>DNA testing request form:</strong> According to the medical facility's template</li>
          <li><strong>Responsibility commitment:</strong> For the accuracy of information provided</li>
        </ul>
        
        <p><strong>Additional documents (if applicable):</strong></p>
        <ul>
          <li>Notarized power of attorney (if represented by someone else)</li>
          <li>Court decision (for legal dispute cases)</li>
          <li>Death certificate + exhumation permit (for posthumous testing)</li>
        </ul>
        
        <p><strong>Estimated costs:</strong></p>
        <ul>
          <li>Father-child testing: 2,500,000 - 4,000,000 VND</li>
          <li>Father-mother-child testing: 3,500,000 - 4,500,000 VND</li>
          <li>20% discount for health insurance cardholders, free for poor households</li>
        </ul>

        <h2 id="2">Step 2: Testing Process</h2>
        <p>Process at an authorized medical facility:</p>
        
        <p><strong>Document reception (1-2 days):</strong></p>
        <ul>
          <li>Submit documents at the reception counter</li>
          <li>Check for completeness and validity</li>
          <li>Verify identity of participating parties</li>
          <li>Sign service contract and payment</li>
        </ul>
        
        <p><strong>Biological sample collection (30 minutes):</strong></p>
        <ul>
          <li>Consultation on appropriate sampling method</li>
          <li>Collection of saliva, cheek cell, or blood samples</li>
          <li>Packaging and coding samples to ensure confidentiality</li>
          <li>Transport samples to the laboratory</li>
        </ul>
        
        <p><strong>Testing and analysis (5-7 days):</strong></p>
        <ul>
          <li>DNA extraction from biological samples</li>
          <li>Amplification of specific DNA regions using PCR</li>
          <li>Analysis of results using automated equipment</li>
          <li>Quality control and result verification</li>
        </ul>

        <h2 id="3">Step 3: Receiving Results</h2>
        <p>Receive test results and understand their meaning:</p>
        
        <p><strong>Timing and methods of result delivery:</strong></p>
        <ul>
          <li><strong>Timing:</strong> 7-10 working days from sampling</li>
          <li><strong>In-person pickup:</strong> At the medical facility (Mon-Fri: 8am-4:30pm)</li>
          <li><strong>Postal delivery:</strong> Additional fee of 50,000-100,000 VND</li>
          <li><strong>Expedited testing:</strong> 3-5 days (30-50% surcharge)</li>
        </ul>
        
        <p><strong>Understanding test results:</strong></p>
        <ul>
          <li><strong>Accuracy:</strong> 99.99% with modern technology</li>
          <li><strong>Positive result:</strong> Confirms blood relationship</li>
          <li><strong>Negative result:</strong> Excludes blood relationship</li>
          <li><strong>Consultation:</strong> Detailed explanation of result meaning</li>
        </ul>
        
        <p><strong>Legal value:</strong></p>
        <ul>
          <li>Results have legal value when performed by an authorized facility</li>
          <li>Used in civil, criminal, inheritance cases</li>
          <li>Requires certified translation if used abroad</li>
        </ul>

        <h2 id="4">Step 4: Processing and Application of Results</h2>
        <p>Using test results for specific purposes and completing related procedures:</p>
        
        <p><strong>Applications in legal procedures:</strong></p>
        <ul>
          <li><strong>Birth registration:</strong> Adding father/mother information on birth certificates</li>
          <li><strong>Inheritance:</strong> Proving legitimate inheritance rights</li>
          <li><strong>Civil disputes:</strong> Providing evidence in court cases</li>
          <li><strong>Adoption:</strong> Proving no blood relationship</li>
        </ul>
        
        <p><strong>Applications in immigration:</strong></p>
        <ul>
          <li><strong>Family reunification visa:</strong> Proving family relationships</li>
          <li><strong>Foreign residency:</strong> Supporting family-based immigration applications</li>
          <li><strong>Certified translation:</strong> Translating results to destination country language</li>
          <li><strong>Consular legalization:</strong> Verification at embassy/consulate</li>
        </ul>
        
        <p><strong>Storage and preservation of results:</strong></p>
        <ul>
          <li><strong>Original storage:</strong> Keep in dry place, away from direct light</li>
          <li><strong>Certified copies:</strong> Make notarized copies when needed</li>
          <li><strong>Digital storage:</strong> Scan and store on secure cloud</li>
          <li><strong>Validity period:</strong> No time limit (unless legally specified)</li>
        </ul>

        <h2 id="5">Step 5: Important Notes</h2>
        <p>Things to note to ensure rights and avoid risks:</p>
        
        <p><strong>Selecting a reputable medical facility:</strong></p>
        <ul>
          <li><strong>Checking licenses:</strong> Ensure legal operating permits</li>
          <li><strong>Quality certification:</strong> ISO/IEC 17025 or AABB certification</li>
          <li><strong>Modern equipment:</strong> Using advanced testing technology</li>
          <li><strong>Professional team:</strong> Technicians with professional certifications</li>
        </ul>
        
        <p><strong>Confidentiality and privacy:</strong></p>
        <ul>
          <li><strong>Consent to participate:</strong> Ensuring consent from all parties</li>
          <li><strong>Confidentiality commitment:</strong> Request confidentiality agreement from facility</li>
          <li><strong>Right to refuse:</strong> Respecting right to refuse testing</li>
          <li><strong>Sample destruction:</strong> Request destruction of biological samples after results</li>
        </ul>
        
        <p><strong>Rights and obligations:</strong></p>
        <ul>
          <li><strong>Right to information:</strong> Full explanation of the process</li>
          <li><strong>Right to complaint:</strong> When violations occur during implementation</li>
          <li><strong>Obligation to provide accurate information:</strong> Truthful declaration</li>
          <li><strong>Payment obligation:</strong> Full payment for services</li>
        </ul>
        
        <p><strong>Psychological and social support:</strong></p>
        <ul>
          <li><strong>Psychological counseling:</strong> Support when results are not as expected</li>
          <li><strong>Family support services:</strong> Consultation on impact on relationships</li>
          <li><strong>Community support groups:</strong> Connection with similar cases</li>
          <li><strong>Post-test follow-up:</strong> Support for first 6 months</li>
        </ul>
        
        <p><strong>Rights to complaint and dispute resolution:</strong></p>
        <ul>
          <li><strong>Quality complaints:</strong> Submit to local Department of Health</li>
          <li><strong>Cost complaints:</strong> Contact medical facility directly</li>
          <li><strong>Legal disputes:</strong> Through competent court</li>
          <li><strong>Damage compensation:</strong> According to legal regulations</li>
        </ul>
        
        <p><strong>Frequently asked questions:</strong></p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Q: Is DNA testing painful?</strong><br>
          <strong>A:</strong> Not at all. It only requires saliva or gentle swabbing of the cheek with a cotton swab.</p>
          
          <p><strong>Q: Can testing be done during pregnancy?</strong><br>
          <strong>A:</strong> Yes, from the 9th week of pregnancy through maternal blood testing.</p>
          
          <p><strong>Q: Does health insurance cover it?</strong><br>
          <strong>A:</strong> Currently health insurance does not cover it, but there are discount policies for health insurance cardholders.</p>
        </div>
      </div>
    `
  },
// ... existing code ...
{
  id: 3,
  title: "Breaking News: DNA Law 2025 Effective from March",
  category: "News",
  excerpt: "The new DNA testing law officially takes effect, bringing many positive changes for the public.",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
  slug: "tin-moi-luat-adn-2024-co-hieu-luc-tu-thang-3",
  author: "Reporter Le Thi Hoa",
  date: "2025-04-22",
  readTime: "15 min read",
  featured: true,
  tableOfContents: [
    { id: "1", title: "Step 1: Overview of DNA Law 2025", level: 1 },
    { id: "2", title: "Step 2: New Administrative Procedure Regulations", level: 1 },
    { id: "3", title: "Step 3: Rights and Obligations of Participating Parties", level: 1 },
    { id: "4", title: "Step 4: DNA Testing Implementation Process", level: 1 },
    { id: "5", title: "Step 5: Legal Value of Test Results", level: 1 },
    { id: "6", title: "Step 6: Implementation Guidelines and Application Timeline", level: 1 }
  ],
  content: `
    <div class="blog-content">
      <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #2196F3;">
        <h3 style="color: #1976D2; margin-top: 0;">��️ OFFICIAL ANNOUNCEMENT</h3>
        <p style="margin-bottom: 0; font-weight: 500;">Law No. 15/2025/QH15 on DNA testing in civil and criminal activities officially comes into effect from March 15, 2025, replacing previous regulations and establishing a unified legal framework for the whole country.</p>
      </div>

      <h2 id="1">Step 1: Overview of DNA Law 2025</h2>
      <p>DNA Law 2025 was passed by the National Assembly of the 15th Legislature with 456/462 representatives in attendance, marking a significant step forward in improving the legal system of Vietnam on DNA testing.</p>
      
      <p><strong>Objectives of the Law:</strong></p>
      <ul>
        <li><strong>Unifying procedures:</strong> Establishing a unified legal framework for DNA testing across the country</li>
        <li><strong>Protecting rights:</strong> Ensuring the legal rights of citizens in DNA testing activities</li>
        <li><strong>Improving quality:</strong> Establishing high standards for DNA testing service quality</li>
        <li><strong>Transparency:</strong> Enhancing transparency in the testing process and results</li>
      </ul>
      
      <p><strong>Scope of application:</strong></p>
      <ul>
        <li>DNA testing for civil purposes (determining blood relationships, inheritance)</li>
        <li>DNA testing in investigations, prosecutions, and trials</li>
        <li>DNA testing for medical and scientific research purposes</li>
        <li>Activities of entities conducting DNA testing</li>
      </ul>
      
      <p><strong>Basic principles:</strong></p>
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <ul>
          <li><strong>Voluntary:</strong> DNA testing must be based on the voluntary consent of all parties (except where the law specifies otherwise)</li>
          <li><strong>Accuracy:</strong> Ensuring the highest accuracy in the testing process and results</li>
          <li><strong>Confidentiality:</strong> Protecting personal information and test results</li>
          <li><strong>Publicity, transparency:</strong> The testing process must be public and transparent</li>
        </ul>
      </div>

      <h2 id="2">Step 2: New Administrative Procedure Regulations</h2>
      <p>DNA Law 2025 significantly simplifies administrative procedures, reducing time and costs for the public:</p>
      
      <p><strong>Registration process:</strong></p>
      <ul>
        <li><strong>Simplified application:</strong> Only CCCD/CMND and simple registration form (uniform template)</li>
        <li><strong>Online registration:</strong> Can be registered online through the national public service portal</li>
        <li><strong>Processing time:</strong> Up to 3 working days (reduced from 7 days previously)</li>
        <li><strong>Fee waiver:</strong> 25% reduction in fees, free for poor households</li>
      </ul>
      
      <p><strong>One-stop service:</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Step</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Procedure</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Time</th>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">1</td>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Submission of documents at the one-stop service counter</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">15 minutes</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">2</td>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Review of documents and issuance of appointment slip</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">30 minutes</td>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">3</td>
          <td style="border: 1px solid #dee2e6; padding: 12px;">DNA testing sample collection</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">15 minutes</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">4</td>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Receiving results</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">24-48 hours</td>
        </tr>
      </table>
      
      <p><strong>Digital service:</strong></p>
      <ul>
        <li><strong>Mobile application:</strong> Launch of "Vietnam DNA" app for tracking progress</li>
        <li><strong>Online payment:</strong> Support for online payment through electronic wallets, internet banking</li>
        <li><strong>Digital results:</strong> Receive results via email with digital signature</li>
        <li><strong>Cloud storage:</strong> Results are securely stored on the national system</li>
      </ul>

      <h2 id="3">Step 3: Rights and Obligations of Participating Parties</h2>
      <p>DNA Law 2025 clearly defines the rights and obligations of each party involved to ensure fairness and transparency:</p>
      
      <p><strong>Rights of the person requesting testing:</strong></p>
      <ul>
        <li><strong>Right to information:</strong> Being fully explained about the process, costs, and time</li>
        <li><strong>Right to choose:</strong> Free choice of testing facility with sufficient conditions</li>
        <li><strong>Right to confidentiality:</strong> Personal information and results are kept absolutely confidential</li>
        <li><strong>Right to appeal:</strong> Appeal when violations occur during the process</li>
        <li><strong>Right to compensation:</strong> Being compensated for damages when errors occur</li>
      </ul>
      
      <p><strong>Obligations of the person requesting testing:</strong></p>
      <ul>
        <li><strong>Providing accurate information:</strong> Declaring truthfully about personal background</li>
        <li><strong>Following the procedure:</strong> Conducting the process correctly according to instructions</li>
        <li><strong>Full payment:</strong> Paying for service fees according to regulations</li>
        <li><strong>Confidentiality:</strong> Not disclosing the information of others</li>
      </ul>
      
      <p><strong>Rights of the testing participant:</strong></p>
      <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #4CAF50;">
        <ul>
          <li><strong>Right to refuse:</strong> Has the right to refuse to participate in testing (except in cases mandated by law)</li>
          <li><strong>Right to consultation:</strong> Being consulted about the meaning and consequences of testing</li>
          <li><strong>Right to know results:</strong> Being informed about test results (if consented)</li>
          <li><strong>Right to request sample destruction:</strong> Requesting destruction of biological samples after results</li>
        </ul>
      </div>
      
      <p><strong>Obligations of the testing facility:</strong></p>
      <ul>
        <li><strong>Ensuring quality:</strong> Adhering to strict technical standards</li>
        <li><strong>Confidentiality:</strong> Establishing a secure information system according to international standards</li>
        <li><strong>Periodic reporting:</strong> Reporting activities to the management authority</li>
        <li><strong>Training staff:</strong> Ensuring staff have the necessary professional skills</li>
        <li><strong>Compensation for damages:</strong> Bearing responsibility for damages when errors occur</li>
      </ul>

      <h2 id="4">Step 4: DNA Testing Implementation Process</h2>
      <p>DNA Law 2025 specifies standardized procedures, ensuring consistency across the country:</p>
      
      <p><strong>Preparation phase:</strong></p>
      <ul>
        <li><strong>Initial consultation:</strong> Explaining the process, costs, time, and legal significance</li>
        <li><strong>Signing a commitment:</strong> All parties sign a commitment to abide by the regulations</li>
        <li><strong>Identity verification:</strong> Verifying CCCD/CMND and taking photographs of the record</li>
        <li><strong>Document preparation:</strong> Recording all information about the parties involved</li>
      </ul>
      
      <p><strong>Sample collection phase:</strong></p>
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107;">
        <p><strong>⚠️ Important note:</strong> Sampling must be conducted by staff with certification, with at least 2 witnesses present and recorded.</p>
      </div>
      
      <ul>
        <li><strong>Equipment preparation:</strong> Using pre-certified sampling kits</li>
        <li><strong>Saliva or cheek cell sampling:</strong> Preferred method, non-invasive</li>
        <li><strong>Tissue culture sampling:</strong> Using cotton swabs for specific use</li>
        <li><strong>Sample packaging:</strong> Storing in appropriate temperature conditions</li>
        <li><strong>Transportation:</strong> Transporting samples to the laboratory within 24 hours</li>
      </ul>
      
      <p><strong>Analysis phase:</strong></p>
      <ul>
        <li><strong>DNA extraction:</strong> Using automated technology</li>
        <li><strong>PCR amplification:</strong> Amplifying target DNA segments</li>
        <li><strong>Electrophoresis analysis:</strong> Analyzing genetic markers</li>
        <li><strong>Data comparison:</strong> Using specialized software</li>
        <li><strong>Quality control:</strong> Conducting cross-checks with standard samples</li>
      </ul>
      
      <p><strong>Technical requirements:</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Criteria</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Minimum Requirement</th>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Number of markers</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">At least 20 markers</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Accuracy</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">≥ 99.99%</td>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Report preparation time</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">≤ 5 working days</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Sample storage</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">At least 2 years</td>
        </tr>
      </table>

      <h2 id="5">Step 5: Legal Value of Test Results</h2>
      <p>DNA Law 2025 significantly enhances the legal value of DNA test results in legal procedures:</p>
      
      <p><strong>Evidence of scientific validity:</strong></p>
      <ul>
        <li><strong>Scientific evidence:</strong> Accepted as scientifically valid high-value evidence</li>
        <li><strong>Convincing power:</strong> Strong persuasive power in civil and criminal cases</li>
        <li><strong>Reliability:</strong> Accepted by the court with high confidence</li>
        <li><strong>Mandatory:</strong> In some cases, the court may require it to be conducted</li>
      </ul>
      
      <p><strong>Applications in various fields:</strong></p>
      
      <p><strong>1. Civil:</strong></p>
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <ul>
          <li><strong>Determining father-child relationship:</strong> Providing basis for birth registration</li>
          <li><strong>Inheritance disputes:</strong> Determining legitimate heirs</li>
          <li><strong>Divorce and child custody:</strong> Determining post-divorce child custody</li>
          <li><strong>Adoption:</strong> Proving no blood relationship</li>
        </ul>
      </div>
      
      <p><strong>2. Criminal:</strong></p>
      <ul>
        <li><strong>Investigation of crimes:</strong> Determining the identity of suspects</li>
        <li><strong>Evidence at trial:</strong> Providing evidence to convict or exonerate</li>
        <li><strong>Identifying victims:</strong> In cases of accidents, disasters</li>
        <li><strong>Re-examination:</strong> Basis for appeal in criminal cases</li>
      </ul>
      
      <p><strong>3. Administrative:</strong></p>
      <ul>
        <li><strong>Immigration:</strong> Providing evidence of family relationships for visas</li>
        <li><strong>Residency:</strong> Supporting family-based immigration applications</li>
        <li><strong>Insurance:</strong> Determining beneficiaries of insurance</li>
        <li><strong>Social assistance:</strong> Determining eligible recipients of social assistance</li>
      </ul>
      
      <p><strong>Conditions for results to have legal value:</strong></p>
      <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #2196F3;">
        <ul>
          <li><strong>Facility meets the requirements:</strong> Operating under the approved scope</li>
          <li><strong>Following the procedure:</strong> Strictly following the technical process</li>
          <li><strong>Staff certification:</strong> Conducted by staff trained and certified</li>
          <li><strong>Witnessed:</strong> Sampling process has witnesses</li>
          <li><strong>Proper storage:</strong> Samples are stored according to regulations</li>
        </ul>
      </div>

      <h2 id="6">Step 6: Implementation Guidelines and Application Timeline</h2>
      <p>To ensure the effective implementation of DNA Law 2025, relevant authorities have developed specific timelines:</p>
      
      <p><strong>Phase 1 (March-June 2025): Initial rollout</strong></p>
      <ul>
        <li><strong>Training staff:</strong> Training for 100% relevant staff</li>
        <li><strong>System update:</strong> Upgrading the management information system</li>
        <li><strong>Trial implementation in 5 provinces/cities:</strong> Hanoi, Ho Chi Minh City, Da Nang, Can Tho, Hai Phong</li>
        <li><strong>Publicity:</strong> Widely disseminated to the public</li>
      </ul>
      
      <p><strong>Phase 2 (July-December 2025): Expanding implementation</strong></p>
      <ul>
        <li><strong>National-wide implementation:</strong> Applied to all 63 provinces/cities</li>
        <li><strong>Improving procedures:</strong> Adjusting based on experience from trials</li>
        <li><strong>Inter-sectoral data sharing:</strong> Sharing data between relevant authorities</li>
        <li><strong>Impact assessment:</strong> Conducting impact assessments</li>
      </ul>
      
      <p><strong>Phase 3 (From 2026): Completing and developing</strong></p>
      <ul>
        <li><strong>AI integration:</strong> Integrating artificial intelligence into the process</li>
        <li><strong>Expanding services:</strong> Developing new services</li>
        <li><strong>International cooperation:</strong> Establishing connections with international databases</li>
        <li><strong>Research and development:</strong> Investing in new technology R&D</li>
      </ul>
      
      <p><strong>Guidelines for the public:</strong></p>
      <p><strong>Supporting policies:</strong></p>
      <ul>
        <li><strong>Free of charge:</strong> Poor and near-poor households receive 100% exemption</li>
        <li><strong>50% reduction:</strong> Individuals with contributions to the revolution</li>
        <li><strong>30% reduction:</strong> Students, the elderly, and the disabled</li>
        <li><strong>Installment payments:</strong> Allowing installment payments for difficult cases</li>
      </ul>
      
      <p><strong>Quality commitment:</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Criteria</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Commitment</th>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Time to process application</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">≤ 3 working days</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Time to receive results</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">≤ 5 working days</td>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Accuracy</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">≥ 99.99%</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Customer satisfaction rate</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">≥ 95%</td>
        </tr>
      </table>
      <p><strong>Conclusion:</strong></p>
      <p>DNA Law 2025 marks a significant step forward in modernizing the legal system of Vietnam, bringing many practical benefits to the public. With specific implementation phases, the law not only simplifies procedures but also improves service quality, ensuring the rights of citizens and creating a favorable legal environment for the development of DNA testing in Vietnam.</p>
      
      <p>The public is encouraged to understand and take advantage of the new regulations to protect their legal rights, while also contributing to the construction of a civilized, modern society. The law's clear guidelines provide a clear path for the public and medical facilities to navigate, ensuring that everyone's rights are respected and their interests are protected.</p>
    </div>
  `
},
 // ... existing code ...
  {
    id: 4,
    title: "Resolving Inheritance Disputes through DNA Testing",
    category: "Civil Law",
    excerpt: "A comprehensive guide to the importance of DNA testing in resolving inheritance disputes in a fair and transparent manner.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=800&fit=crop",
    slug: "giai-quyet-tranh-chap-thua-ke-bang-xet-nghiem-adn",
    author: "Judge Pham Thi Lan",
    date: "2024-01-20",
    readTime: "12 min read",
    featured: false,
    views: 980,
    likes: 67,
    comments: 18,
    tableOfContents: [
      { id: "1", title: "When is DNA testing needed in inheritance disputes?", level: 1 },
      { id: "2", title: "What is legal DNA testing?", level: 1 },
      { id: "3", title: "Detailed Implementation Process", level: 1 },
      { id: "4", title: "Benefits of DNA testing in inheritance disputes", level: 1 },
      { id: "5", title: "Time and Cost", level: 1 },
      { id: "6", title: "Important Considerations", level: 1 },
      { id: "7", title: "Common Scenarios", level: 1 },
      { id: "8", title: "Practical Experience from Cases", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">Inheritance disputes are one of the most complex issues in civil law, especially when there is suspicion about the blood relationship between parties. DNA testing has become a reliable scientific tool, helping courts and parties involved to resolve disputes fairly, transparently, and decisively.</p>
        
        <h2 id="1">When is DNA testing needed in inheritance disputes?</h2>
        <p>DNA testing is applied in inheritance disputes when there is suspicion or dispute about the blood relationship between the deceased and potential heirs. The deceased leaves behind a will or intestate succession, and there are multiple potential heirs claiming their share.</p>
        
        <p><strong>Specific situations:</strong></p>
        <ul>
          <li><strong>Dispute over father-child relationship:</strong> When there is doubt about whether a person is the biological child of the deceased</li>
          <li><strong>Identifying sibling relationships:</strong> In cases where multiple people claim to be siblings</li>
          <li><strong>Grandparent-grandchild relationship:</strong> When there is a need to determine the relationship between the deceased's grandparents and grandchildren</li>
          <li><strong>Relationship between cousins:</strong> Determining the relationship between distant relatives</li>
          <li><strong>Stepchild situation:</strong> Distinguishing between stepchildren and biological children in inheritance</li>
          <li><strong>Adoption situation:</strong> Determining the rights of children outside of marriage</li>
        </ul>
        
        <p><strong>Role of the court:</strong></p>
        <p>The court may request DNA testing in cases where:</p>
        <ul>
          <li>A party has requested it</li>
          <li>The court believes it is necessary to clarify the truth</li>
          <li>Other evidence is insufficient to determine blood relationship</li>
          <li>There is conflict in documents and records</li>
        </ul>
        
        <div class="important-note">
          <p><strong>Legal note:</strong> DNA testing helps ensure that the true heir is recognized legally, protecting the legal rights of all parties involved.</p>
        </div>

        <h2 id="2">What is legal DNA testing?</h2>
        <p>Legal DNA testing (Legal/Administrative DNA Test) is a type of testing conducted under strict procedures, meeting legal standards to allow results to be used in legal and administrative procedures. The test is conducted by trained professionals and is kept secure to ensure confidentiality.</p>
        
        <p><strong>Features of legal DNA testing:</strong></p>
        <ul>
          <li><strong>Standardization:</strong> Following legal regulations</li>
          <li><strong>Identity verification:</strong> Thoroughly checking personal documents of all parties</li>
          <li><strong>Professional sampling:</strong> Conducted by trained personnel</li>
          <li><strong>Security:</strong> Samples are sealed and stored securely</li>
          <li><strong>Chain of custody:</strong> Tracking samples from collection to result</li>
          <li><strong>Digital signature:</strong> All parties sign a commitment to the accuracy of the information</li>
        </ul>
        
        <p><strong>Applications of legal DNA testing:</strong></p>
        <ul>
          <li>Inheritance disputes</li>
          <li>Legal disputes</li>
          <li>Divorce and property division</li>
          <li>Late birth registration</li>
          <li>Immigration-related issues</li>
          <li>Criminal investigations</li>
        </ul>
        
        <p><strong>Legal value:</strong></p>
        <p>The results of legal DNA testing are accepted as evidence in legal and administrative proceedings, with high reliability and the potential to determine the outcome of a case. The court may rely on the test results to make decisions.</p>

        <h2 id="3">Detailed Implementation Process</h2>
        <p>The process of conducting legal DNA testing in inheritance disputes follows standardized procedures to ensure accuracy and legal value:</p>
        
        <p><strong>Step 1: Court order</strong></p>
        <ul>
          <li><strong>Official document:</strong> The court issues a decision or request for DNA testing</li>
          <li><strong>Specific content:</strong> Clearly identifying the parties involved and the purpose</li>
          <li><strong>Timeframe:</strong> Specifying the time required to complete the test</li>
          <li><strong>Conducting entity:</strong> The court may specify a particular facility to conduct the test</li>
        </ul>
        
        <p><strong>Step 2: Selecting a reputable testing center</strong></p>
        <p>Criteria for selecting a reputable testing center:</p>
        <ul>
          <li><strong>Operating permit:</strong> Issued by the Ministry of Health</li>
          <li><strong>Quality certification:</strong> International standards (ISO 17025, AABB, CAP)</li>
          <li><strong>Experience and reputation:</strong> Having a long track record in the field</li>
          <li><strong>Advanced technology:</strong> Using modern equipment and techniques</li>
          <li><strong>Expert team:</strong> Having experienced doctors and technicians</li>
        </ul>
        
        <p><strong>Required documents and procedures:</strong></p>
        <ul>
          <li><strong>ID card/Passport:</strong> Original for verification</li>
          <li><strong>Birth certificate:</strong> For children under 14 years old</li>
          <li><strong>Court decision:</strong> Official request for testing</li>
          <li><strong>Power of attorney:</strong> If represented by someone else</li>
          <li><strong>Other relevant documents:</strong> Death certificate, will (if applicable), notarized translations (if necessary)</li>
        </ul>
        
        <p><strong>Sampling process:</strong></p>
        <ul>
          <li><strong>Identity verification:</strong> Thoroughly checking personal documents</li>
          <li><strong>Photography:</strong> Taking photographs of all parties involved</li>
          <li><strong>Biological sampling:</strong> Usually saliva or cheek cells, as these are non-invasive and widely used</li>
          <li><strong>Witnessed:</strong> A lawyer or representative of the court is present</li>
          <li><strong>Sealing:</strong> Samples are sealed and labeled immediately</li>
          <li><strong>Digital confirmation:</strong> All parties digitally confirm the sampling process</li>
        </ul>
        
        <p><strong>Analysis process:</strong></p>
        <ul>
          <li><strong>PCR-STR technique:</strong> Using the most advanced technology available</li>
          <li><strong>Multiple markers:</strong> Typically 15-20 different STRs are analyzed</li>
          <li><strong>High accuracy:</strong> Achieving ≥99.9% accuracy in determining relationships</li>
          <li><strong>Quality control:</strong> Strict QC/QA procedures</li>
          <li><strong>Result confirmation:</strong> At least 2 experts must confirm the results</li>
        </ul>
        
        <p><strong>Step 5: Providing results</strong></p>
        <ul>
          <li><strong>Direct submission to the court:</strong> Results are submitted in sealed envelopes</li>
          <li><strong>Notification to all parties:</strong> All parties are informed about the results</li>
          <li><strong>Explanation of results:</strong> Experts explain the meaning of the results</li>
          <li><strong>Updating the file:</strong> Results become part of the case file</li>
        </ul>

        <h2 id="4">Benefits of DNA testing in inheritance disputes</h2>
        <p>Using DNA testing in inheritance disputes brings many practical benefits to the court, parties involved, and society:</p>
        
        <p><strong>1. Scientific reliability:</strong></p>
        <ul>
          <li><strong>High accuracy:</strong> Achieving 99.99% accuracy in determining blood relationships</li>
          <li><strong>Objectivity and neutrality:</strong> Not influenced by subjective factors</li>
          <li><strong>Non-manipulable:</strong> Based on unique genetic markers</li>
          <li><strong>Recognized internationally:</strong> Widely accepted across the world</li>
        </ul>
        
        <p><strong>2. Quick resolution:</strong></p>
        <ul>
          <li><strong>Shortening the process:</strong> Avoiding lengthy disputes</li>
          <li><strong>Reducing legal costs:</strong> Fewer court hearings, fewer procedural steps</li>
          <li><strong>Final conclusion:</strong> No room for doubt or dispute</li>
          <li><strong>Reducing burden on the court:</strong> Supporting the court's decision-making</li>
        </ul>
        
        <p><strong>3. Ensuring fairness and equality:</strong></p>
        <ul>
          <li><strong>Identifying rightful heirs:</strong> Only legitimate heirs are recognized</li>
          <li><strong>Preventing unauthorized claims:</strong> Preventing unauthorized claims to property</li>
          <li><strong>Protecting the interests of all parties:</strong> Both legitimate heirs and the estate are protected</li>
          <li><strong>Building social trust:</strong> Strengthening the legal system's credibility</li>
        </ul>
        
        <p><strong>4. Special protection for children and vulnerable groups:</strong></p>
        <ul>
          <li><strong>Children's rights:</strong> Ensuring children receive their rightful inheritance</li>
          <li><strong>Protection of legitimate heirs:</strong> Preventing legitimate heirs from losing their rights</li>
          <li><strong>Deterring fraud:</strong> Preventing fraudulent claims</li>
          <li><strong>Important consideration:</strong> Especially relevant when property is large or blood relationship is unclear</li>
        </ul>
        
        <p><strong>5. Positive social impact:</strong></p>
        <ul>
          <li><strong>Reducing family conflicts:</strong> Avoiding family division and animosity</li>
          <li><strong>Preserving family traditions:</strong> Maintaining family traditions</li>
          <li><strong>Promoting legal awareness:</strong> Encouraging legal resolution of disputes</li>
          <li><strong>Enhancing legal consciousness:</strong> Helping people understand and respect the law</li>
        </ul>

        <h2 id="5">Time and Cost</h2>
        <p>The time and cost of DNA testing in inheritance disputes depend on several factors, including the type of test, the number of participants, and the urgency of the case. Generally, the process involves:</p>
        
        <p><strong>Estimated costs (2024):</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Test Type</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Cost (VND)</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Time</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Father-child (legal)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">4,000,000 - 5,000,000</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3-5 days</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Father-mother-child</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">5,500,000 - 6,500,000</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3-5 days</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Sibling relationship</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">6,000,000 - 7,000,000</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">5-7 days</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Grandparent-grandchild relationship</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">7,000,000 - 8,000,000</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">5-7 days</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Priority (1-2 days)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">+50% of base fee</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">1-2 days</td>
          </tr>
        </table>
        
        <p><strong>Factors affecting costs:</strong></p>
        <ul>
          <li><strong>Number of participants:</strong> The more people involved, the higher the cost</li>
          <li><strong>Type of relationship:</strong> More distant relationships are more complex</li>
          <li><strong>Urgency:</strong> Urgent cases have a surcharge</li>
          <li><strong>Sample quality:</strong> Poor quality samples require special handling</li>
          <li><strong>Special requirements:</strong> Detailed reports and expert consultations</li>
        </ul>
        
        <p><strong>Detailed timeline:</strong></p>
        <ul>
          <li><strong>Preparing documents:</strong> 1-2 days</li>
          <li><strong>Sampling:</strong> 1 day</li>
          <li><strong>Analysis:</strong> 2-4 days</li>
          <li><strong>Quality control:</strong> 1 day</li>
          <li><strong>Preparing report:</strong> 1 day</li>
          <li><strong>Sending results:</strong> 1 day</li>
        </ul>
        
        <p><strong>Supporting policies for costs:</strong></p>
        <ul>
          <li><strong>Poor households, near-poor:</strong> Exemption or 70-80% reduction</li>
          <li><strong>Individuals with contributions:</strong> 50% reduction in fees</li>
          <li><strong>Orphaned children:</strong> Priority support from social welfare funds</li>
          <li><strong>Installment payments:</strong> Allowing installment payments</li>
        </ul>

        <h2 id="6">Important Considerations</h2>
        <p>To ensure the test is effective and legally valid, all parties should consider the following points:</p>
        
        <p><strong>1. Choosing a reputable testing facility:</strong></p>
        <ul>
          <li><strong>Valid operating license:</strong> Checking the operating permit of the Ministry of Health</li>
          <li><strong>Quality certification:</strong> Having international quality certifications</li>
          <li><strong>Following the legal procedure:</strong> Adhering to the correct procedure to ensure results are recognized</li>
          <li><strong>Practical experience:</strong> Having many years of experience handling legal cases</li>
          <li><strong>Expert team:</strong> Having doctors and lawyers providing professional advice</li>
        </ul>
        
        <p><strong>2. Preparing complete and accurate documents:</strong></p>
        <ul>
          <li><strong>ID card/Passport:</strong> Still valid, clear, and not damaged</li>
          <li><strong>Birth certificate:</strong> Original or notarized copy</li>
          <li><strong>Court decision:</strong> Official request for testing</li>
          <li><strong>Power of attorney:</strong> Notarized if represented by someone else</li>
          <li><strong>Other relevant documents:</strong> Last will and testament, death certificate, household registration (if needed)</li>
        </ul>
        
        <p><strong>3. Ensuring the sampling process is standardized:</strong></p>
        <ul>
          <li><strong>Witnessed:</strong> A lawyer, court representative, or authorized personnel</li>
          <li><strong>Sealing:</strong> Samples are sealed immediately after collection</li>
          <li><strong>Complete record:</strong> Recording the person collecting the sample, time, and location</li>
          <li><strong>Digital confirmation:</strong> All parties digitally confirm the sampling process</li>
          <li><strong>Proper storage:</strong> Storing samples in appropriate conditions</li>
        </ul>
        
        <p><strong>4. Consulting with legal experts:</strong></p>
        <ul>
          <li><strong>Understanding rights and obligations:</strong> Legal experts explain the rights and responsibilities of all parties</li>
          <li><strong>Risk assessment:</strong> Analyzing potential scenarios</li>
          <li><strong>Preparing a strategy:</strong> Developing a plan based on the results</li>
          <li><strong>Assisting with procedures:</strong> Helping to complete legal procedures</li>
          <li><strong>Representing at court:</strong> Protecting interests during the legal process</li>
        </ul>
        
        <p><strong>5. Preparing for the outcome:</strong></p>
        <ul>
          <li><strong>Accepting the truth:</strong> Being prepared for any outcome</li>
          <li><strong>Respecting the result:</strong> Not disputing or questioning the scientific results</li>
          <li><strong>Protecting personal privacy:</strong> Keeping personal information and family matters confidential</li>
          <li><strong>Facilitating family reconciliation:</strong> Prioritizing mediation, avoiding family division</li>
          <li><strong>Following the law:</strong> Adhering to the court's decision</li>
        </ul>
        
        <div class="warning-box">
          <p><strong>Important warning:</strong> Falsifying test results or providing false information can result in criminal penalties. All parties must act honestly and in accordance with the law.</p>
        </div>

        <h2 id="7">Common Scenarios</h2>
        <p>Based on practical experience, there are some common inheritance dispute scenarios that require DNA testing:</p>
        
        <p><strong>Scenario 1: Father-child relationship dispute</strong></p>
        <ul>
          <li><strong>Situation:</strong> The husband dies, and his wife and son are disputing with another woman who claims to have had a child with the deceased</li>
          <li><strong>Solution:</strong> DNA testing between the child and the deceased's son (using samples from the son or the deceased's parents)</li>
          <li><strong>Outcome:</strong> Determining whether the child is the biological child of the deceased, and thus determining inheritance rights</li>
        </ul>
        
        <p><strong>Scenario 2: Identifying sibling relationships</strong></p>
        <ul>
          <li><strong>Situation:</strong> The family has multiple children, some of whom are being raised in different places, and there is a dispute about blood relationship between the deceased's parents</li>
          <li><strong>Solution:</strong> DNA testing between siblings to determine their relationship</li>
          <li><strong>Outcome:</strong> Distinguishing between biological children and adopted children, dividing inheritance according to the law</li>
        </ul>
        
        <p><strong>Scenario 3: Second-generation relationship dispute</strong></p>
        <ul>
          <li><strong>Situation:</strong> The deceased's grandparents have passed away, and someone has claimed to be the grandchild of the deceased, but there is no proof in the records</li>
          <li><strong>Solution:</strong> DNA testing with other grandchildren who have been confirmed or with the deceased's surviving children</li>
          <li><strong>Outcome:</strong> Determining the relationship between grandparents and grandchildren, and thus determining inheritance rights</li>
        </ul>
        
        <p><strong>Scenario 4: Child outside of marriage</strong></p>
        <ul>
          <li><strong>Situation:</strong> A man has a legal wife and children, but also has a child with another woman, and there is a dispute about inheritance after his death</li>
          <li><strong>Solution:</strong> DNA testing to determine the father-child relationship</li>
          <li><strong>Outcome:</strong> The child outside of marriage is confirmed to have inheritance rights according to the law</li>
        </ul>
        
        <p><strong>Scenario 5: Adoption without proper procedure</strong></p>
        <ul>
          <li><strong>Situation:</strong> The family adopts a child, but does not follow the proper procedure, and later there is a dispute about inheritance</li>
          <li><strong>Solution:</strong> DNA testing to distinguish between biological children and adopted children</li>
          <li><strong>Outcome:</strong> Determining the situation clearly, applying the law correctly regarding inheritance</li>
        </ul>

        <h2 id="8">Practical Experience from Cases</h2>
        <p>Based on experience handling thousands of inheritance disputes, DNA testing has proven to be highly effective in resolving disputes. The results are:</p>
        
        <p><strong>Success statistics:</strong></p>
        <ul>
          <li><strong>Resolution rate:</strong> 95% of cases are resolved without further appeal</li>
          <li><strong>Time saved:</strong> Reducing time by 60-70% compared to traditional methods</li>
          <li><strong>Cost savings:</strong> Reducing overall legal costs by 40-50%</li>
          <li><strong>Satisfaction:</strong> 90% of all parties are satisfied with the outcome</li>
        </ul>
        
        <p><strong>Lessons learned:</strong></p>
        <ul>
          <li><strong>Early action:</strong> The sooner DNA testing is conducted, the better, avoiding prolonged disputes</li>
          <li><strong>Thorough preparation:</strong> Being well-prepared with all necessary documents and mental state before conducting the test</li>
          <li><strong>Choosing a reputable facility:</strong> Selecting a facility with experience and reputation</li>
          <li><strong>Legal advice:</strong> Having legal advice throughout the process</li>
          <li><strong>Respecting the result:</strong> Accepting and respecting the scientific outcome</li>
        </ul>
        
        <p><strong>Practical insights:</strong></p>
        <ul>
          <li><strong>Poor quality samples:</strong> 5-10% of cases require re-sampling due to poor quality</li>
          <li><strong>Dispute over results:</strong> 2-3% of cases have disputes about the results, requiring detailed explanation</li>
          <li><strong>Mental issues:</strong> 15-20% of cases face challenges in the psychological aspect</li>
          <li><strong>Additional costs:</strong> 10-15% of cases have additional costs due to special requirements</li>
        </ul>
        
        <p><strong>Future recommendations:</strong></p>
        <ul>
          <li><strong>Improving public awareness:</strong> Raising public awareness about DNA testing</li>
          <li><strong>Improving the law:</strong> Supplementing the law with specific provisions regarding DNA testing in inheritance</li>
          <li><strong>Human resource development:</strong> Strengthening the training of medical and legal professionals</li>
          <li><strong>Technology development:</strong> Investing in new technology to improve quality</li>
          <li><strong>Supporting the disadvantaged:</strong> Expanding support programs for people in difficult situations</li>
        </ul>
        
        <div class="conclusion-box">
          <h3>Conclusion</h3>
          <p>DNA testing has been and continues to be an important tool in resolving inheritance disputes, providing fairness and transparency to the legal system. With the continuous development of science and technology, DNA testing will continue to contribute significantly to improving the quality of life and building a civilized society.</p>
          
          <p>To achieve the highest possible outcome, all parties should choose a reputable testing facility, prepare all necessary documents, follow the correct procedure, and consult with legal experts. This not only ensures accurate results but also protects the rights and reputation of all involved parties.</p>
        </div>
      </div>
    `
  },


  {
    id: 5,
    title: "Decoding Life: Understanding the Mechanism of DNA Testing",
    category: "Knowledge",
    excerpt: "Discover the scientific basis behind DNA testing - a powerful tool that helps 'read' the unique, one-of-a-kind design of each person with incredible accuracy.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=800&fit=crop",
    slug: "nguyen-ly-hoat-dong-cua-xet-nghiem-adn",
    author: "Dr. Vu Thanh Son",
    date: "2024-01-18",
    readTime: "15 min read",
    featured: true,
    views: 1650,
    likes: 124,
    comments: 31,
    tableOfContents: [
      { id: "1", title: "DNA: 'Design' of Your Genetic Code", level: 1 },
      { id: "2", title: "Reading DNA: From Biological Sample to Result", level: 1 },
      { id: "3", title: "Collecting Biological Samples", level: 1 },
      { id: "4", title: "Extracting DNA", level: 1 },
      { id: "5", title: "Amplifying Target DNA Segments (PCR)", level: 1 },
      { id: "6", title: "Analyzing the Size of DNA Segments", level: 1 },
      { id: "7", title: "Comparing and Evaluating Results", level: 1 },
      { id: "8", title: "Accuracy and Legal Value", level: 1 },
      { id: "9", title: "Future of DNA Technology", level: 1 },
      { id: "10", title: "Guidelines for the Public", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">DNA testing has become a powerful tool in various fields, from forensic medicine to determining blood relationships. But how does science 'read' the unique, one-of-a-kind design of each person? Let's explore the basic principles behind these incredible results.</p>
        
        <h2 id="1">DNA: "Design" of Your Genetic Code</h2>
        <p>In almost all cells of the body, we carry a complex molecule called <strong>DNA (deoxyribonucleic acid)</strong>. DNA is your personal genetic blueprint, containing information about every aspect of you. The structure of DNA is:</p>
        
        <p><strong>DNA structure:</strong></p>
        <ul>
          <li><strong>Double helix:</strong> DNA has a double helix structure similar to a ladder</li>
          <li><strong>Four "letters" of chemistry:</strong>
            <ul>
              <li>Adenine (A)</li>
              <li>Thymine (T)</li>
              <li>Guanine (G)</li>
              <li>Cytosine (C)</li>
            </ul>
          </li>
          <li><strong>Specific order:</strong> The order of these letters creates the unique genetic code for each individual</li>
        </ul>
        
        <p><strong>Short Tandem Repeats (STRs) - "Fingerprint" of genetics:</strong></p>
        <p>Interestingly, while most human DNA is similar, there are short segments that repeat multiple times with different lengths between individuals. These are called <strong>Short Tandem Repeats (STRs)</strong> - and this is the "fingerprint" of genetics that modern DNA testing focuses on.</p>

        <h2 id="2">Reading DNA: From Biological Sample to Result</h2>
        <p>In essence, DNA testing is about comparing specific STR segments between individuals. These segments are inherited from both parents, carrying high specificity, making them perfect markers for determining relationships. The testing process generally includes the following steps:</p>
        
        <p>The typical DNA testing process includes the following main steps:</p>

        <h2 id="3">1. Collecting Biological Samples</h2>
        <p>The first step is to obtain a sample containing cells and DNA. The most common samples are:</p>
        
        <p><strong>Mouthwash (saliva):</strong></p>
        <ul>
          <li>Safe, non-invasive, and easy to collect</li>
          <li>Using a cotton swab to gently swab the inside of the mouth</li>
          <li>The preferred method currently</li>
        </ul>
        
        <p><strong>Blood samples:</strong></p>
        <ul>
          <li>Often used for special cases</li>
          <li>When larger amounts of DNA are needed</li>
          <li>High reliability</li>
        </ul>
        
        <p><strong>Other samples:</strong></p>
        <ul>
          <li>Hair (must have hair follicles)</li>
          <li>Nail clippings</li>
          <li>Biological evidence from crime scenes</li>
        </ul>
        
        <div class="important-note">
          <p><strong>Important note:</strong> For legal testing, the sampling process must be conducted by trained staff, with witnesses present, and a record must be made. This is crucial for legal validity.</p>
        </div>

        <h2 id="4">2. Extracting DNA</h2>
        <p>The obtained sample will go through a process to remove unwanted components, leaving only pure DNA ready for analysis. The process is:</p>
        
        <p><strong>Extraction process:</strong></p>
        <ul>
          <li>Breaking down cell membranes to release DNA</li>
          <li>Removing proteins and other contaminants</li>
          <li>Purifying DNA to high purity</li>
          <li>Checking quality and DNA concentration</li>
        </ul>

        <h2 id="5">3. Amplifying Target DNA Segments (PCR)</h2>
        <p>Due to the small amount of DNA in the sample, the <strong>Polymerase Chain Reaction (PCR)</strong> technique will be used. PCR acts like a "copy machine" for DNA, creating millions of copies of the STR segments we need for analysis. This allows us to have enough DNA for research.</p>
        
        <p><strong>How PCR works:</strong></p>
        <ul>
          <li><strong>Denaturation:</strong> Separating the double-stranded DNA into single strands at high temperatures (94-96°C)</li>
          <li><strong>Annealing:</strong> Specific primers bind to complementary sequences on the target DNA (50-65°C)</li>
          <li><strong>Extension:</strong> Enzyme DNA polymerase synthesizes new DNA strands (72°C)</li>
          <li><strong>Repetition:</strong> The cycle repeats 25-35 times</li>
        </ul>
        
        <p>After PCR, the number of target DNA segments increases exponentially, starting from a few initial molecules to millions of copies.</p>

        <h2 id="6">4. Analyzing the Size of DNA Segments</h2>
        <p>After amplification, these STR segments will have different lengths. The <strong>Capillary Electrophoresis</strong> technology will separate and accurately measure the size of each segment. Each segment will emit a unique signal, creating a "genetic profile" that is unique.</p>
        
        <p><strong>Capillary electrophoresis process:</strong></p>
        <ul>
          <li>DNA segments are labeled with fluorescent markers</li>
          <li>Moving through ultra-thin capillary tubes</li>
          <li>Separation based on size - smaller segments move faster</li>
          <li>Laser-based detector reads fluorescence signals</li>
          <li>Generating electropherograms (electrophoresis charts)</li>
        </ul>

        <h2 id="7">5. Comparing and Evaluating Results</h2>
        <p>The data from the genetic profile is converted into digital DNA profiles. The process is:</p>
        
        <p><strong>For blood relationship testing:</strong></p>
        <ul>
          <li>The DNA profile of the child is compared with that of the presumed father and mother</li>
          <li>Because the child inherits half of their DNA from the father and half from the mother</li>
          <li>If there is a relationship, the child's STR segments must match those of the father at all tested loci</li>
          <li>Typically, 15-20 different STRs are analyzed</li>
        </ul>
        
        <p><strong>For forensic medicine:</strong></p>
        <ul>
          <li>The DNA profile from the scene is compared with a database of known offenders</li>
          <li>Comparing with the DNA database to find matches</li>
          <li>Calculating the probability of random matches</li>
        </ul>
        
        <p><strong>Role of AI and Machine Learning:</strong></p>
        <p>Today, <strong>Artificial Intelligence (AI)</strong> and <strong>Machine Learning</strong> are crucial in analyzing this vast amount of data, helping:</p>
        <ul>
          <li>Increasing data processing speed</li>
          <li>Improving analysis accuracy</li>
          <li>Reducing human error</li>
          <li>Detecting complex patterns</li>
          <li>Automating evaluation processes</li>
        </ul>

        <h2 id="8">Accuracy and Legal Value</h2>
        <p>When conducted in laboratories meeting international standards, DNA testing provides extremely high accuracy:</p>
        
        <p><strong>Quality standards:</strong></p>
        <ul>
          <li><strong>ISO 17025:</strong> Standard for laboratory competence</li>
          <li><strong>AABB:</strong> American Association of Blood Banks</li>
          <li><strong>CAP:</strong> American College of Medical Genetics and Genomics</li>
        </ul>
        
        <p><strong>Accuracy:</strong></p>
        <ul>
          <li><strong>With relationship:</strong> Accuracy is usually around 99.99% or higher</li>
          <li><strong>Without relationship:</strong> Unambiguously ruling out with 100% accuracy</li>
          <li><strong>Paternity index:</strong> Usually > 99.9% when there is a relationship</li>
          <li><strong>Combined index (CI):</strong> Usually > 10,000</li>
        </ul>
        
        <p><strong>Legal value:</strong></p>
        <p>Due to this high level of reliability, DNA testing results have very high legal value, widely accepted in:</p>
        <ul>
          <li>Legal procedures</li>
          <li>Administrative procedures</li>
          <li>Civil disputes</li>
          <li>Criminal investigations</li>
          <li>Immigration procedures</li>
        </ul>

        <h2 id="9">Future of DNA Technology</h2>
        <p>DNA testing technology is constantly advancing, with new technologies being developed:</p>
        
        <p><strong>Next-generation sequencing (NGS):</strong></p>
        <ul>
          <li>Analyzing the entire genome in more detail</li>
          <li>Reducing costs and processing time</li>
          <li>Increasing resolution and accuracy</li>
          <li>Ability to analyze degraded samples</li>
        </ul>
        
        <p><strong>New applications:</strong></p>
        <ul>
          <li><strong>Personalized medicine:</strong> Treatment based on individual genetic characteristics</li>
          <li><strong>Early disease detection:</strong> Detecting potential genetic risks</li>
          <li><strong>Pharmacogenetics:</strong> Selecting the right medication for each individual</li>
          <li><strong>Evolutionary research:</strong> Understanding human evolutionary history</li>
        </ul>
        
        <p><strong>New technologies:</strong></p>
        <ul>
          <li>Portable DNA sequencing (mobile DNA testing)</li>
          <li>Real-time PCR with higher sensitivity</li>
          <li>Microfluidics for faster testing</li>
          <li>Blockchain for secure data storage</li>
        </ul>

        <h2 id="10">Guidelines for the Public</h2>
        <p><strong>When should DNA testing be conducted?</strong></p>
        <ul>
          <li>To determine blood relationships for personal purposes</li>
          <li>To resolve legal disputes about inheritance</li>
          <li>To process immigration procedures</li>
          <li>To support medical purposes (organ transplantation, genetic disease diagnosis)</li>
        </ul>
        
        <p><strong>Choosing a reputable testing facility:</strong></p>
        <ul>
          <li>Having a valid operating license from the Ministry of Health</li>
          <li>Being certified by international organizations (ISO, AABB, CAP)</li>
          <li>Having a team of experienced professionals</li>
          <li>Using modern technology and equipment</li>
          <li>Having clear privacy policies</li>
          <li>Providing professional consultation services</li>
        </ul>
        
        <p><strong>Preparing before testing:</strong></p>
        <ul>
          <li>Researching the process and costs</li>
          <li>Having all necessary documents ready</li>
          <li>Discussing the implications and consequences of the results with all parties involved</li>
          <li>Choosing the appropriate type of test based on purpose</li>
        </ul>
        
        <p><strong>After receiving results:</strong></p>
        <ul>
          <li>Requesting detailed explanations from experts</li>
          <li>Storing results carefully</li>
          <li>Using results for the intended purpose</li>
          <li>Respecting the privacy of all parties involved</li>
        </ul>
        
        <div class="conclusion-box">
          <h3>Conclusion</h3>
          <p>Understanding the mechanism of DNA testing helps us evaluate its appropriate role and potential in decoding the mysteries of life and serving the community. With the continuous development of science and technology, DNA testing will continue to play a significant role in improving the quality of life and building a civilized society.</p>
        </div>
      </div>
    `
  },
// ... existing code ...
  {
    id: 6,
    title: "Online DNA Testing Registration",
    category: "Administration",
    excerpt: "A quick guide to registering for DNA testing online, making the process convenient and hassle-free through the Ministry of Health's electronic system.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
    slug: "thu-tuc-dang-ky-xet-nghiem-adn-online",
    author: "Specialist Nguyen Van Duc",
    date: "2024-01-16",
    readTime: "7 min read",
    featured: false,
    views: 1320,
    likes: 89,
    comments: 22,
    tableOfContents: [
      { id: "1", title: "Online registration system", level: 1 },
      { id: "2", title: "Steps to follow", level: 1 },
      { id: "3", title: "Online payment", level: 1 },
      { id: "4", title: "Tracking progress", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <h2 id="1">Online registration system</h2>
        <p>The online DNA testing registration system of the Ministry of Health allows the public to complete procedures quickly and conveniently.</p>
        
        <h2 id="2">Steps to follow</h2>
        <p>The registration process consists of 5 simple steps:</p>
        <ul>
          <li>Registering an account on the system</li>
          <li>Entering personal information</li>
          <li>Uploading required documents</li>
          <li>Selecting a collection location</li>
          <li>Confirming payment</li>
        </ul>
        
        <h2 id="3">Online payment</h2>
        <p>The system supports multiple payment methods: ATM cards, electronic wallets, bank transfers.</p>
        
        <h2 id="4">Tracking progress</h2>
        <p>Customers can track the progress of their application and receive results via SMS or email.</p>
      </div>
    `
  },
  {
    id: 7,
    title: "Update: DNA Testing Fees Reduced by 30% in February",
    category: "News",
    excerpt: "Good news for the public as many DNA testing centers across the country are reducing service fees in February 2024.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop",
    slug: "cap-nhat-gia-xet-nghiem-adn-giam-30-trong-thang-2",
    author: "Reporter Hoang Minh Tuấn",
    date: "2024-01-15",
    readTime: "4 min read",
    featured: false,
    views: 1890,
    likes: 134,
    comments: 28,
    tableOfContents: [
      { id: "1", title: "Information about the discount", level: 1 },
      { id: "2", title: "Conditions for application", level: 1 },
      { id: "3", title: "Methods of registration", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <h2 id="1">Information about the discount</h2>
        <p>From January 2, 2024, all DNA testing centers across the country are reducing service fees by 30% to make it easier for the public to access services.</p>
        
        <h2 id="2">Conditions for application</h2>
        <p>The program applies to all types of DNA testing, without any limits on the number of tests, and will continue until the end of February 2024.</p>
        
        <h2 id="3">Methods of registration</h2>
        <p>Customers can register directly at the centers or through the online system to enjoy the discounts.</p>
      </div>
    `
  },
  {
    id: 8,
    title: "Legal Rights and Obligations when Conducting DNA Testing",
    category: "Civil Law",
    excerpt: "Understanding the legal rights and obligations of all parties when conducting DNA testing under current law.",
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200&h=800&fit=crop",
    slug: "quyen-loi-phap-ly-khi-thuc-hien-xet-nghiem-adn",
    author: "Lawyer Do Thi Mai",
    date: "2024-01-12",
    readTime: "9 min read",
    featured: false,
    views: 1150,
    likes: 78,
    comments: 19,
    tableOfContents: [
      { id: "1", title: "Rights of the participant", level: 1 },
      { id: "2", title: "Legal obligations", level: 1 },
      { id: "3", title: "Protection of personal privacy", level: 1 },
      { id: "4", title: "Handling disputes", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <h2 id="1">Rights of the participant</h2>
        <p>The person conducting DNA testing has the right to be fully informed about the purpose, process, and consequences of the testing.</p>
        
        <h2 id="2">Legal obligations</h2>
        <p>All parties have the obligation to provide accurate information, cooperate during the sampling process, and comply with legal regulations.</p>
        
        <h2 id="3">Protection of personal privacy</h2>
        <p>DNA information is strictly confidential and is only used for the agreed purposes.</p>
        
        <h2 id="4">Handling disputes</h2>
        <p>In case of disputes, parties can file complaints or initiate legal action according to the law.</p>
      </div>
    `
  },
  {
    id: 9,
    title: "AI Applications in DNA Analysis",
    category: "Knowledge",
    excerpt: "Artificial intelligence technology is revolutionizing the way we analyze and process DNA results.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
    slug: "ung-dung-ai-trong-phan-tich-ket-qua-adn",
    author: "Dr. Le Minh Hai",
    date: "2024-01-10",
    readTime: "11 min read",
    featured: false,
    views: 1420,
    likes: 95,
    comments: 26,
    tableOfContents: [
      { id: "1", title: "AI in DNA testing", level: 1 },
      { id: "2", title: "Machine learning algorithms", level: 1 },
      { id: "3", title: "Advantages of AI", level: 1 },
      { id: "4", title: "Future of technology", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <h2 id="1">AI in DNA testing</h2>
        <p>Artificial intelligence is increasingly being applied in DNA data analysis, increasing accuracy and reducing processing time.</p>
        
        <h2 id="2">Machine learning algorithms</h2>
        <p>Machine learning algorithms are trained on millions of DNA data samples to identify patterns and make accurate conclusions.</p>
        
        <h2 id="3">Advantages of AI</h2>
        <p>AI brings many advantages:</p>
        <ul>
          <li>Increasing accuracy to 99.99%</li>
          <li>Reducing analysis time from days to hours</li>
          <li>Detecting complex relationships</li>
          <li>Reducing human error</li>
        </ul>
        
        <h2 id="4">Future of technology</h2>
        <p>In the future, AI will continue to develop and may be able to predict various genetic information from DNA samples.</p>
      </div>
    `
  }
];

const BlogDetail = () => {
  const { slug } = useParams();
  const [activeSection, setActiveSection] = useState('1');
  
  // Find the article by slug
  const article = articles.find(a => a.slug === slug);
  
  // If the article is not found, redirect to the blog page
  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <Link to="/blog" className="text-blue-600 hover:text-blue-800">Return to Blog</Link>
        </div>
      </div>
    );
  }

  // Get related articles (same category, different id)
  const relatedArticles = articles
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Updated to match services style */}
      <div
        className="relative text-white h-[400px] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://drugtesters.net/wp-content/uploads/2024/12/MDT-1-768x432.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              textShadow:
                "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080",
            }}
          >
            {article.title}
          </h1>
          
          <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaUser className="mr-2" />
              <span className="font-medium">{article.author}</span>
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaCalendar className="mr-2" />
              <span>{formatDate(article.date)}</span>
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaClock className="mr-2" />
              <span>{article.readTime}</span>
            </div>
            <div className={`flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm`}>
              <FaTag className="mr-2" />
              <span>{article.category}</span>
            </div>
          </div>
          
          <p className="text-lg max-w-3xl mx-auto text-white/90 mt-4">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600 flex items-center">
              <FaHome className="mr-1" />
              Home
            </Link>
            <FaChevronRight className="text-gray-400" />
            <Link to="/blog" className="hover:text-blue-600">Blog</Link>
            <FaChevronRight className="text-gray-400" />
            <span className="text-gray-800 font-medium">{article.category}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Header */}
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Featured Image */}
              <div className="px-6 pt-6">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-96 object-cover rounded-xl"
                />
              </div>

              {/* Article Content */}
              <div className="p-6">
                <div 
                  className="prose prose-lg max-w-none blog-content"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link 
                      key={relatedArticle.id}
                      to={`/blog/${relatedArticle.slug}`}
                      className="group block bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <img
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white mb-2 ${
                          relatedArticle.category === 'Knowledge' ? 'bg-green-500' :
                          relatedArticle.category === 'Administration' ? 'bg-red-500' :
                          relatedArticle.category === 'News' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`}>
                          {relatedArticle.category}
                        </span>
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {relatedArticle.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedArticle.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span>{relatedArticle.author}</span>
                          <span>{relatedArticle.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Table of Contents */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-3">
                📋 Table of Contents:
              </h3>
              <nav className="space-y-2">
                {article.tableOfContents?.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === item.id 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${
                      item.level === 2 ? 'ml-4 text-sm' : ''
                    }`}
                  >
                    {item.level === 1 ? `${item.id}. ` : `${item.id} `}
                    {item.title}
                  </button>
                ))}
              </nav>
              
              {/* Back to Blog */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link 
                  to="/blog" 
                  className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold"
                >
                  <FaArrowLeft className="mr-2" />
                  Return to Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .blog-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          color: #1f2937;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .blog-content h3 {
          font-size: 1.375rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #374151;
        }
        
        .blog-content p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
          color: #4b5563;
          text-align: justify;
        }
        
        .blog-content ul, .blog-content ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        
        .blog-content li {
          margin-bottom: 0.75rem;
          color: #4b5563;
          line-height: 1.7;
        }
        
        .blog-content strong {
          color: #1f2937;
          font-weight: 600;
        }
        
        .blog-content ul li {
          position: relative;
        }
        
        .blog-content ul li::before {
          content: "•";
          color: #3b82f6;
          font-weight: bold;
          position: absolute;
          left: -1.5rem;
        }
        
        .prose {
          max-width: none;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;