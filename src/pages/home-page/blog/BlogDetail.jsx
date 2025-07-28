import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCalendar, FaUser, FaArrowLeft, FaClock, FaTag, FaChevronRight, FaHome } from 'react-icons/fa';

// Optimized data for articles (removed views, likes, comments)
const articles = [
  {
    id: 1,
    title: "ILLUMINA - Technology and Pioneer in Genetic Testing in Vietnam",
    category: "Knowledge",
    excerpt: "Illumina is considered a 'giant' in the field of genetic sequencing, being the world's leading company in DNA sequencing and biotechnology serving customers in research, clinical, and applications.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop",
    slug: "illumina-technology-pioneer-genetic-testing-vietnam",
    author: "DNA Testing",
    date: "2024-01-25",
    readTime: "10 min read",
    featured: true,
    tableOfContents: [
      { id: "1", title: "Illumina - The Giant in Genetic Sequencing", level: 1 },
      { id: "2", title: "Legal Battle Against Illumina Patent Infringement", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">Illumina is considered a 'giant' in the field of genetic sequencing, being the world's leading company in DNA sequencing and biotechnology serving customers in research, clinical, and applications. With its contributions and development efforts, Illumina is increasingly asserting its position in the field of genetic sequencing and is used for applications in life sciences, oncology, reproductive health, agriculture, and other life applications.</p>

        <p>Illumina is the world's leading genetic decoding and analysis technology company headquartered in San Diego, California, founded in 1998 with the mission: "Improving human health by unlocking the power of the genome." For more than two decades, Illumina has developed pioneering technologies of superior quality used in disease research, drug development, and development of tests in the field of molecular biology.</p>

        <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
          <img src="/images/about-illumina-web-graphic.jpg" alt="Illumina Headquarters" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
        </div>

        <p>Illumina has connected with more than 115 countries and territories worldwide, including Vietnam, and continues to optimize solutions to become simpler, more expansive and accessible to more and more scientific researchers.</p>

        <h2 id="1">1. The Giant in Genetic Sequencing</h2>
        <p>When it comes to genetic sequencing, one thinks of Illumina. According to statistics from Illumina, up to 90% of genetic sequencing data worldwide is sequenced from Illumina's Next Generation Sequencing (NGS) system. It is known that Illumina has been using the NGS Illumina system since 2007, built on previous genome sequencing methods to significantly reduce the time required.</p>

        <p>Illumina has contributed to the development of technologies, opening an important era, especially the company's genetic sequencing technology is applied to a series of research and clinical-related tests.</p>

        <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
          <img src="/images/so-lieu-illumina.jpg" alt="Illumina Statistics" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
        </div>
        <p style="font-style: italic; margin-top: 8px; font-size: 0.9em; text-align: center;">Illumina ended Q4 2020 with net revenue up 7.5% compared to the same period last year (Source: Illumina)</p>

        <p>Illumina's research focuses on developing technology solutions that enable researchers to continue making scientific advances in genetic diseases, common genetic disorders, population genetics, and cell biology; basic molecular research related to clinical applications such as reproductive health, cancer testing, testing and monitoring of infectious diseases.</p>

        <p>Accordingly, Illumina's NGS technology has helped revolutionize genome research and has wide applications in many fields such as infectious diseases, cancer, genetic diseases, agriculture, and in environments such as clinics, hospitals, research laboratories, and government agencies.</p>

        <p>In efforts to control the coronavirus disease outbreak that erupted in early 2020, Illumina's genetic sequencing system was used to identify and publish the coronavirus genome profile in public databases, this is the first important step in developing diagnostic tests, creating a premise for vaccine production.</p>

        <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
          <img src="/images/thu-nghiem-DNA.jpg" alt="Illumina and IDbyDNA Launch DNA Test" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
        </div>
        <p style="font-style: italic; margin-top: 8px; font-size: 0.9em; text-align: center;">Illumina and IDbyDNA Launch DNA Test That Could Find Next Epidemic (Source: IDbyDNA)</p>

        <p>Along with many contributions and efforts, Illumina is increasingly asserting its position in the field of genetic sequencing with important applications for non-invasive prenatal screening VeriSeq NIPT; preimplantation genetic screening VeriSeq PGS; early cancer screening and diagnosis TSO500.</p>

        <h2 id="2">2. Legal Battle Against Illumina Patent Infringement</h2>
        <p>With important contributions and opening a new era for world medicine, Illumina is holding most of the market share in the genetic sequencing field. Therefore, the issue of protecting intellectual property rights of patents and copyrights has become more urgent than ever. In fact, many companies have illegally used these patents under the name of scientific research to copy and create their own technology solutions. This action has seriously violated patent copyrights and the company has filed lawsuits to protect its intellectual property.</p>

        <p>Specifically, according to international media information, in February 2020, Illumina filed a patent infringement lawsuit against BGI related to genetic sequencing products. At the beginning of January 2021, at the UK Supreme Court of Justice, the Chancery Division and Patents Court ruled that Illumina won the case.</p>

        <p>Accordingly, 4/5 patents were confirmed as valid and infringed by BGI. These patents cover different aspects of Illumina's proprietary synthetic biology sequencing method, including paired-end sequencing and nucleotide labeling.</p>
      </div>
    `
  },
  {
    id: 2,
    title: "Non-legal and Legal DNA Testing: Comparing Similarities and Differences",
    category: "Administration",
    excerpt: "Learn about the differences between non-legal and legal DNA testing to choose the right type of test that suits your intended purpose.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800&fit=crop",
    slug: "non-legal-legal-dna-testing-comparing-similarities-differences",
    author: "GeneViet",
    date: "2024-03-15",
    readTime: "10 min read",
    featured: true,
    tableOfContents: [
      { id: "1", title: "Understanding Non-legal and Legal DNA Testing", level: 1 },
      { id: "2", title: "How are Non-legal and Legal DNA Tests Similar and Different?", level: 1 },
      { id: "3", title: "Similarities Between Non-legal and Legal DNA Testing", level: 1 },
      { id: "4", title: "Differences Between Non-legal and Legal DNA Testing", level: 1 },
      { id: "5", title: "Important Notes", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">DNA testing is becoming increasingly popular for various purposes and is divided into two main groups: non-legal and legal. However, many people are still unclear about the differences between these two types of testing.</p>
        
        <p>To better understand the similarities and differences between non-legal and legal DNA testing, please follow the information in the article below from GeneViet.</p>

        <h2 id="1">1. Understanding Non-legal and Legal DNA Testing</h2>
        
        <p><strong>Non-legal DNA Testing</strong></p>
        <p>Non-legal DNA testing is the use of DNA analysis technology to determine blood relationships between individuals for personal purposes, not for use in legal administrative procedures.</p>
        
        <p><strong>Applications of non-legal DNA testing include:</strong></p>
        <ul>
          <li><strong>Determining blood relationships:</strong> This is the most common application, helping to resolve doubts or confirm blood relationships within families. It is particularly useful in cases where paternity, maternity, siblings, or relatives need to be determined.</li>
          <li><strong>Genealogy and ancestry research:</strong> This testing helps people learn about their family origins and ancestors. Through DNA test results, it can help connect with distant family members or better understand family history.</li>
          <li><strong>Health and medical purposes:</strong> Non-legal DNA testing can help detect genetic risks early, thereby helping people plan better disease prevention and health management. Additionally, DNA testing also helps determine compatibility in organ transplantation or finding suitable organ donors.</li>
          <li><strong>Finding missing relatives:</strong> In cases such as adoption, disappearances, or natural disasters, DNA testing can help reconnect family members.</li>
        </ul>
        
        <p><strong>Legal DNA Testing:</strong></p>
        <p>Legal DNA testing is the use of DNA analysis technology to determine blood relationships between individuals to serve legal administrative procedures, such as birth certificates, immigration, inheritance, etc.</p>
        
        <p><strong>Specific applications of legal DNA testing include:</strong></p>
        <ul>
          <li><strong>Supporting criminal investigations:</strong> DNA testing is an important tool in identifying or excluding suspects in criminal cases. DNA collected from crime scenes can be compared with suspect DNA or criminal databases to find perpetrators.</li>
          <li><strong>Resolving family disputes:</strong> In cases of child custody disputes, adoption, or inheritance disputes, DNA testing helps determine accurate blood relationships, thereby providing legal basis for court decisions.</li>
          <li><strong>Identifying victims in accidents or disasters:</strong> When traditional identification methods are not feasible, DNA testing can help identify victims, helping families reclaim their loved ones' remains and supporting accident cause investigations.</li>
          <li><strong>Verifying family relationships in immigration applications:</strong> Immigration applications often require verification of blood relationships between sponsors and sponsored individuals. DNA testing provides clear and accurate evidence to support the application review process.</li>
        </ul>

        <h2 id="2">2. How are Non-legal and Legal DNA Tests Similar and Different?</h2>
        <p>It can be confirmed that blood relationship DNA testing for non-legal/personal and legal/administrative needs are the two main purposes today. The similarities and differences between these two forms are as follows.</p>

        <h2 id="3">3. Similarities Between Non-legal and Legal DNA Testing</h2>
        <ul>
          <li><strong>Technology and methods:</strong> Both non-legal and legal DNA testing use the same technology and DNA analysis methods. The main steps include sample collection, DNA extraction, DNA amplification, and DNA sample analysis to determine genetic characteristics.</li>
          <li><strong>Accuracy:</strong> The accuracy of DNA test results in both cases is very high, usually achieving over 99.99%. This ensures that the results provided are reliable and valuable for use.</li>
          <li><strong>Types of test samples:</strong> The types of samples used, such as blood, saliva, hair, or fingernails, can be applied to both non-legal and legal testing.</li>
        </ul>
        
        <div style="text-align: center; margin: 20px 0;">
          <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=800&fit=crop" alt="Non-legal and Legal Blood Relationship Testing" style="max-width: 100%; height: auto; border-radius: 8px;">
        </div>

        <h2 id="4">4. Differences Between Non-legal and Legal DNA Testing</h2>
        
        <p><strong>Purpose of use:</strong></p>
        <ul>
          <li><strong>Non-legal DNA testing:</strong> Usually performed for personal or family purposes, such as determining blood relationships (father-child, mother-child, siblings), genealogy research, or determining ancestral origins.</li>
          <li><strong>Legal DNA testing:</strong> Used in situations related to law, such as criminal cases (identifying suspect identity), civil cases (property disputes, child custody rights), and other legal requirements (immigration, adoption).</li>
        </ul>
        
        <p><strong>Sample collection process:</strong></p>
        <ul>
          <li><strong>Non-legal DNA testing:</strong> Usually allows self-collection of samples at home according to laboratory instructions. Users will receive a sample collection kit, collect samples themselves, and send them back to the laboratory.</li>
          <li><strong>Legal DNA testing:</strong> Requires a stricter sample collection process, usually performed by experts or forensic personnel to ensure sample integrity and result accuracy. Samples must be collected and stored according to standard procedures to avoid interference or distortion.</li>
        </ul>
        
        <p><strong>Legal validity of results:</strong></p>
        <ul>
          <li><strong>Non-legal DNA testing:</strong> Provides results mainly for personal purposes and usually has no legal value in disputes or court cases.</li>
          <li><strong>Legal DNA testing:</strong> Provides results with legal value that can be used as evidence in court. These results usually come with detailed reports and signatures from forensic experts.</li>
        </ul>
        
        <p><strong>Cost:</strong></p>
        <ul>
          <li><strong>Non-legal DNA testing:</strong> Blood relationship testing prices for non-legal purposes are usually lower due to simpler sample collection processes and less strict security and management requirements.</li>
          <li><strong>Legal DNA testing:</strong> Has higher costs due to strict sample collection and storage processes, and high professional requirements of forensic experts.</li>
        </ul>
        
        <p><strong>Result delivery time:</strong></p>
        <ul>
          <li><strong>Non-legal DNA testing:</strong> Result delivery time is usually faster due to simple processes and fewer strict requirements.</li>
          <li><strong>Legal DNA testing:</strong> Result delivery time may be longer due to strict checking processes and compliance with legal regulations.</li>
        </ul>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Criteria</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Non-legal DNA Testing</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Legal DNA Testing</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Purpose</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Personal, family</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Legal procedures, administration</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Sample collection</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Self-collection at home</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Performed by experts</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Legal value</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">No</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Yes</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Cost</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Lower</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Higher</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Result delivery time</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Faster (3-5 days)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Longer (7-10 days)</td>
          </tr>
        </table>

        <h2 id="5">5. Important Notes</h2>
        <div class="warning-box" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #dc3545;">
          <p><strong>Note:</strong></p>
          <ul>
            <li>The information in this article is for reference only. For more details about non-legal and legal DNA testing, you should contact reputable DNA testing laboratories for specific advice.</li>
            <li>Regulations regarding legal DNA testing may vary depending on the country or region. Therefore, you need to thoroughly understand these regulations before conducting testing.</li>
          </ul>
        </div>
        
        <p>Thus, it can be confirmed that regardless of the purpose for which DNA testing is used, the requirement for accuracy of results is always placed at the highest priority. If customers are looking for a reputable DNA testing address for non-legal or legal purposes, please contact GeneViet immediately for support.</p>
        
        <div class="conclusion-box" style="background-color: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ccc;">
          <h3 style="color: #1976D2; margin-top: 0;">About GeneViet</h3>
          <p>With more than 10 years of operation in the DNA testing field, GeneViet has performed millions of blood relationship tests for customers domestically and internationally. The advantages of using services at GeneViet include:</p>
          
          <ul>
            <li><strong>High accuracy:</strong> GeneViet uses the most advanced DNA analysis technology, ensuring test results have accuracy above 99.99%. Samples are processed by an experienced team of experts and internationally standard laboratories.</li>
            <li><strong>Absolute confidentiality:</strong> GeneViet commits to protecting customer information at the highest level. All samples and test data are encrypted and stored securely, only authorized personnel can access. We understand that genetic information is private and sensitive, so information security is our top priority.</li>
            <li><strong>Flexible and fast process:</strong> For legal testing, GeneViet provides home sample collection kits, making it easy for customers to collect samples themselves and send them back to the center. This process is not only simple and time-saving but also ensures privacy for customers. Test results are usually returned within a short time, meeting customers' timely needs.</li>
            <li><strong>Professional consulting support:</strong> GeneViet's consulting team is always ready to support customers from sample collection, explaining test results to related legal aspects. GeneViet commits to providing dedicated and professional services.</li>
          </ul>
        </div>
      </div>
    `
  },
// ... existing code ...
{
  id: 3,
  title: "What is Non-legal Father-Child DNA Testing?",
  category: "Knowledge",
  excerpt: "Today, non-legal father-child DNA testing services are of great interest to many people. So, what is DNA testing? How much does it cost? What samples can be used?",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
  slug: "what-is-non-legal-father-child-dna-testing",
  author: "DNA Testing",
  date: "2024-06-25",
  readTime: "8 min read",
  featured: true,
  tableOfContents: [
    { id: "1", title: "What is Non-legal Father-Child DNA Testing?", level: 1 },
    { id: "2", title: "Important Information When Needing Non-legal Father-Child DNA Testing", level: 1 }
  ],
  content: `
    <div class="blog-content">
      <p class="lead-paragraph">Today, non-legal father-child DNA testing services are of great interest to many people. So, what is DNA testing? How much does it cost? What samples can be used? Let's find out in detail in the article below.</p>

      <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
        <img src="/images/xet-nghiem-adn-cha-con-dan-su-la-gi-2.jpg" alt="Non-legal Father-Child DNA Testing" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
      </div>

      <h2 id="1">1. What is Non-legal Father-Child DNA Testing?</h2>
      
      <p>Non-legal father-child DNA testing is a voluntary type of testing that helps verify the blood relationship between a child and the presumed father, after which the test result certificate will not be/does not have legal value for use as legal evidence or use in administrative procedures.</p>

      <p>Usually, non-legal father-child DNA testing will be conducted in the following cases:</p>
      
      <ul>
        <li>There are doubts about the blood relationship between father and child that need to be clearly verified to resolve doubts and resolve conflicts and misunderstandings in the family.</li>
        <li>Single mothers want to confirm the blood relationship of their child with the father to request responsibility for child support and care.</li>
        <li>There are disputes over child custody rights when the father/mother is not married, or the father is denied his role and is not allowed visitation, support, or care rights for the child.</li>
      </ul>

      <h2 id="2">2. Important Information When Needing Non-legal Father-Child DNA Testing</h2>
      
      <p>Below is some important information you need to know when needing non-legal father-child DNA testing:</p>
      
      <p><strong>- Samples and sample collection methods</strong></p>
      
      <p>If for legal father-child DNA testing purposes, only 2 types of samples - blood and buccal swab cells - are used, then for non-legal father-child DNA testing, we can prepare any type of sample for use in the testing process: hair, nails, blood, saliva, umbilical cord, amniotic fluid, placenta... even special samples like chewed gum, cigarette filters, or even used condoms by the person who needs blood relationship verification.</p>
      
      <p>Regarding the sampling method, since non-legal father-child DNA testing only serves personal purposes and is not used for legal or administrative purposes, sample collection can be conducted secretly, at home, or directly at the DNA testing center for guidance and support, or request center staff to come to the home to assist with sampling... generally depending on the wishes and conditions of each person and each case.</p>
      
      <p><strong>- Procedures</strong></p>
      
      <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
        <img src="/images/xet-nghiem-adn-cha-con-dan-su-nhung-thong-tin-can-biet-1.jpg" alt="Non-legal Father-Child DNA Testing Procedures" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
      </div>
      
      <p>Procedures for non-legal father-child DNA testing are very simple due to no legal factors. Participants and those requesting testing do not need to bring any identification documents, nor do they need to declare accurate personal information but can use aliases and choose anonymous testing. All that needs to be done is to contact the testing center to register for non-legal father-child DNA testing, pay fees, and wait for results to be returned.</p>
      
      <p><strong>- Non-legal Father-Child DNA Testing Costs</strong></p>
      
      <p>Non-legal father-child DNA testing costs currently range from 2.5 million VND, depending on the required result delivery time.</p>
      
      <div class="conclusion-box" style="background-color: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ccc;">
        <h3 style="color: #1976D2; margin-top: 0;">Conclusion</h3>
        <p>Non-legal father-child DNA testing is an effective solution for determining blood relationships between father and child for personal purposes. With simple procedures, reasonable costs, and the ability to use many different types of samples, this service is increasingly chosen by many people. However, it should be noted that non-legal DNA test results have no legal value and cannot be used in administrative procedures.</p>
        
        <p>If you need non-legal father-child DNA testing, please contact reputable DNA testing centers for the best advice and support.</p>
      </div>
    </div>
  `
},
 // ... existing code ...
 {
  id: 4,
  title: "Distinguishing Between Non-legal and Legal DNA Testing",
  category: "Knowledge",
  excerpt: "Understand the clear differences between non-legal and legal DNA testing to choose the right type of test that suits your needs.",
  image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=800&fit=crop",
  slug: "distinguishing-non-legal-legal-dna-testing",
  author: "Dr. Nguyen Van Minh",
  date: "2024-06-20",
  readTime: "8 min read",
  featured: true,
  tableOfContents: [
    { id: "1", title: "Comparing Non-legal and Legal DNA Testing", level: 1 },
    { id: "2", title: "Non-legal DNA Testing - Testing 'for Personal Purposes'", level: 1 },
    { id: "3", title: "Legal DNA Testing - Accurate and Legally Valid", level: 1 }
  ],
  content: `
    <div class="blog-content">
      <p class="lead-paragraph">In modern society, DNA testing plays an important role in many aspects of life, from resolving inheritance issues to determining blood relationships. However, many people are still confused between two common types of DNA testing: non-legal and legal. Understanding the differences between them will help you choose the right type of testing that suits your needs.</p>
      
      <h2 id="1">1. Comparing Non-legal and Legal DNA Testing</h2>
      <p>Before going into details, let's explore the basic differences between these two types of testing through the comparison table below:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Criteria</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Non-legal DNA Testing</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Legal DNA Testing</th>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Purpose of use</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Only for personal use</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">For legal or administrative purposes</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Legal value</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">No legal value</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Has legal value</td>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Sample collection</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Self-collection at home</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Must be performed at authorized medical facilities</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Identity verification</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Not required</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Requires identification documents and identity proof</td>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Cost</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Lower (1-2 million VND)</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Higher (3-5 million VND)</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Processing time</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3-5 days</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">5-7 working days</td>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Process</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Simple, few procedures</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Strict, compliant with legal regulations</td>
        </tr>
      </table>
      
      <h2 id="2">2. Non-legal DNA Testing - Testing 'for Personal Purposes'</h2>
      <p>Non-legal DNA testing (also called personal DNA testing) is a type of testing designed to meet the need to learn information about blood relationships for personal purposes. This is a suitable choice for those who want to determine father-child, sibling, or other relationships without needing to use the results for legal purposes.</p>
      
      <p><strong>Characteristics of non-legal DNA testing:</strong></p>
      <ul>
        <li><strong>High privacy:</strong> Personal information and test results are kept absolutely confidential</li>
        <li><strong>Home sample collection:</strong> Can self-collect samples at home using provided kits</li>
        <li><strong>Simple procedures:</strong> No identification documents or identity proof required</li>
        <li><strong>Reasonable cost:</strong> Lower cost compared to legal DNA testing</li>
        <li><strong>Quick results:</strong> Faster processing and result delivery time</li>
      </ul>
      
      <p><strong>Applications of non-legal DNA testing:</strong></p>
      <ul>
        <li>Determining father-child relationships for personal peace of mind</li>
        <li>Learning about blood relationships between siblings</li>
        <li>Determining distant family relationships (such as grandparent-grandchild, aunt/uncle-nephew/niece)</li>
        <li>Learning about family origins or lineage</li>
        <li>Resolving doubts about blood relationships within the family</li>
      </ul>
      
      <div class="important-note" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #dc3545;">
        <p><strong>Important note:</strong> Non-legal DNA test results have no legal value and cannot be used in administrative procedures, court litigation, or immigration procedures.</p>
      </div>

      <h2 id="3">3. Legal DNA Testing - Accurate and Legally Valid</h2>
      <p>Legal DNA testing is a type of testing performed according to strict procedures, complying with legal regulations, to ensure results have legal value and can be used in administrative procedures and court litigation.</p>
      
      <p><strong>Legal DNA testing procedures:</strong></p>
      <ul>
        <li><strong>Appointment scheduling:</strong> Contact authorized medical facilities to schedule testing</li>
        <li><strong>Document preparation:</strong> ID card/Citizen ID/Passport, birth certificate (for children under 14 years old)</li>
        <li><strong>Identity verification:</strong> Identity of all participating parties is verified</li>
        <li><strong>Biological sample collection:</strong> Performed at medical facilities by professional medical staff</li>
        <li><strong>Sample analysis:</strong> Using advanced technology, analyzing at least 16-24 STR locations</li>
        <li><strong>Quality control:</strong> Results are checked by at least 2 experts</li>
        <li><strong>Certificate issuance:</strong> Results are issued with certificates bearing legal seals</li>
      </ul>
      
      <p><strong>Applications of legal DNA testing:</strong></p>
      <ul>
        <li><strong>Resolving inheritance disputes:</strong> Determining blood relationships for property inheritance division</li>
        <li><strong>Birth registration:</strong> Adding father/mother information to birth certificates</li>
        <li><strong>Citizenship procedures:</strong> Proving family relationships in immigration applications</li>
        <li><strong>Child custody disputes:</strong> Determining parent-child relationships in divorce cases</li>
        <li><strong>Civil dispute resolution:</strong> Serving as evidence in civil lawsuits</li>
        <li><strong>Identity verification:</strong> In cases of suspected identity or newborn switching</li>
      </ul>
      
      <p><strong>Facilities performing legal DNA testing:</strong></p>
      <ul>
        <li>National Institute of Forensic Medicine and branches nationwide</li>
        <li>General hospitals at central and provincial levels that are licensed</li>
        <li>DNA testing centers licensed by the Ministry of Health</li>
        <li>Laboratories with ISO 17025 certification for DNA testing</li>
      </ul>
      
      <div class="warning-box" style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #2196F3;">
        <p><strong>Criteria for choosing reputable DNA testing facilities:</strong></p>
        <ul>
          <li>Licensed by the Ministry of Health and internationally certified (ISO, AABB, CAP)</li>
          <li>Team of experts with specialized training and experience</li>
          <li>Using modern testing technology and advanced equipment</li>
          <li>Strict information and result confidentiality procedures</li>
          <li>Professional pre- and post-testing consultation services</li>
          <li>Many years of experience in genetic testing</li>
        </ul>
      </div>

      <p><strong>Important considerations for legal DNA testing:</strong></p>
      <ul>
        <li><strong>Schedule in advance:</strong> Should schedule appointments in advance to avoid waiting and ensure sufficient time for procedures</li>
        <li><strong>Bring complete documents:</strong> Original ID card/Citizen ID/Passport and notarized copies, children's birth certificates</li>
        <li><strong>Ensure presence of all parties:</strong> All related parties must be present for sample collection</li>
        <li><strong>No eating or drinking before sampling:</strong> Avoid eating, drinking, smoking at least 30 minutes before sample collection</li>
        <li><strong>Pre-testing consultation:</strong> Should participate in consultation sessions to clearly understand the process and meaning of results</li>
        <li><strong>Higher costs:</strong> Prepare budget as legal DNA testing costs are higher than non-legal testing</li>
      </ul>
      
      <div class="conclusion-box" style="background-color: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ccc;">
        <h3 style="color: #1976D2; margin-top: 0;">Conclusion</h3>
        <p>Understanding the differences between non-legal and legal DNA testing will help people choose the right type of testing suitable for their purposes, avoiding wasted time, costs, and legal complications. If you need blood relationship confirmation just for personal knowledge, non-legal testing is a simple and discreet choice. Conversely, if you need results for legal purposes – choose legal testing at reputable, licensed centers that provide legally valid results.</p>
      </div>
    </div>
  `
},


{
  id: 5,
  title: "Genetix Service Price List",
  category: "News",
  excerpt: "Genetix DNA Testing Center provides diverse DNA testing service packages with competitive prices and attractive offers.",
  image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=800&fit=crop",
  slug: "genetix-service-price-list",
  author: "Genetix DNA Center",
  date: "2024-06-15",
  readTime: "5 min read",
  featured: true,
  tableOfContents: [
    { id: "1", title: "Non-legal DNA Testing (No Legal Value)", level: 1 },
    { id: "2", title: "Legal DNA Testing", level: 1 },
    { id: "3", title: "Special Offers", level: 1 },
    { id: "4", title: "Important Notes When Choosing Services", level: 1 }
  ],
  content: `
    <div class="blog-content">
      <p class="lead-paragraph">Genetix DNA Testing Center proudly provides high-quality DNA testing services at competitive prices. We offer two main types of DNA testing services: Non-legal DNA Testing (No Legal Value) and Legal DNA Testing.</p>
      
      <h2 id="1">1. Non-legal DNA Testing (No Legal Value)</h2>
      <p>Suitable for personal purposes that do not require using results for legal procedures. Simple procedures, low cost, and high confidentiality.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Service</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Number of Samples Required</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Listed Price</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Promotional Price</th>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Father-Child Testing</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-3 people (father-child)</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3,000,000 VND</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2,000,000 VND</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Mother-Child Testing</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-3 people (mother-child)</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3,000,000 VND</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2,000,000 VND</td>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Sibling Testing (without parent)</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-3 people (siblings)</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3,500,000 VND</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2,500,000 VND</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Aunt/Uncle/Cousin Testing...</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3-4 people</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3,500,000 VND</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2,500,000 VND</td>
        </tr>
      </table>
      
      <div class="important-note" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #007bff;">
        <p><strong>Characteristics of Non-legal DNA Testing:</strong> Suitable for personal purposes such as: verifying blood relationships, knowing information for oneself, learning about family lineage origins. Simple procedures, low cost, can self-collect samples at home, fast processing time.</p>
      </div>

      <h2 id="2">2. Legal DNA Testing</h2>
      <p>Meets legal requirements when needing to determine blood relationships for administrative procedures, court litigation, immigration procedures.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Service</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Number of People</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Listed Price</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Promotional Price</th>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Father-Child Testing</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-7 people</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">5,000,000 VND</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">+2,500,000 VND</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Mother-Child Testing</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-7 people</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">6,000,000 VND</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">+2,500,000 VND</td>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Other Family Relationship Testing</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-7 people</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">6,000,000 VND</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">+2,500,000 VND</td>
        </tr>
      </table>
      
      <div class="important-note" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #dc3545;">
        <p><strong>Characteristics of Legal DNA Testing:</strong> Specialized service for legal procedures such as: birth registration, adding father/mother information to birth certificates, citizenship procedures, resolving inheritance disputes. Sample collection at medical facilities, with identity verification, higher fees, strict procedures performed by professional medical staff.</p>
      </div>

      <h2 id="3">3. Special Offers</h2>
      <p>Genetix provides many attractive offers for customers:</p>
      
      <ul style="list-style-type: none; padding-left: 0;">
        <li style="margin-bottom: 10px;">
          <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FFD700; border-radius: 50%; margin-right: 10px;">📦</span>
          <strong>Complete package cost:</strong> From sample receipt to result delivery 300,000 VND
        </li>
        <li style="margin-bottom: 10px;">
          <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FFD700; border-radius: 50%; margin-right: 10px;">🏆</span>
          <strong>Promotional price (discount up to):</strong> 250,000 VND
        </li>
        <li style="margin-bottom: 10px;">
          <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FFD700; border-radius: 50%; margin-right: 10px;">📋</span>
          <strong>Additional discount when combined with other packages:</strong> 250,000 VND
        </li>
      </ul>

      <h2 id="4">4. Important Notes When Choosing Services</h2>
      <p>Some important considerations when choosing DNA testing services:</p>
      
      <ul style="list-style-type: none; padding-left: 0;">
        <li style="margin-bottom: 10px;">
          <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FF6B6B; border-radius: 50%; margin-right: 10px;">⚠️</span>
          <strong>Price independent of reason:</strong> Regardless of different testing reasons, service prices are maintained at the highest level to ensure quality
        </li>
        <li style="margin-bottom: 10px;">
          <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FF6B6B; border-radius: 50%; margin-right: 10px;">⚠️</span>
          <strong>Price appropriate to procedures:</strong> Tests for immigration procedures, appeals, legal procedures will be higher than non-legal procedures to ensure accuracy and legal value
        </li>
        <li style="margin-bottom: 10px;">
          <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FF6B6B; border-radius: 50%; margin-right: 10px;">⚠️</span>
          <strong>Professional service:</strong> Genetix commits to serious service, accurate results with 1-2 working days process for 7-8 days result delivery
        </li>
      </ul>
    </div>
  `
},
// ... existing code ...
{
  id: 6,
  title: "Testing Procedures - DNA Testing",
  category: "Administration",
  excerpt: "Detailed guide on DNA testing procedures for non-legal, personal purposes and legal purposes at ADNchacon Molecular Biotechnology Center.",
  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
  slug: "testing-procedures-dna-testing",
  author: "ADNchacon",
  date: "2024-01-16",
  readTime: "7 min read",
  featured: false,
  tableOfContents: [
    { id: "1", title: "DNA TESTING FOR NON-LEGAL, PERSONAL PURPOSES", level: 1 },
    { id: "2", title: "DNA TESTING FOR LEGAL PURPOSES", level: 1 }
  ],
  content: `
    <div class="blog-content">
      <h2 id="1">I. DNA TESTING FOR NON-LEGAL, PERSONAL PURPOSES</h2>
      <p>Customers can use father-child DNA test results to serve the purpose of only determining blood relationships of their relatives and making their own private decisions.</p>
      
      <p>DNA testing procedures take only about 15 minutes and include the following steps:</p>
      
      <p><strong>Step 1: DNA Testing Registration</strong></p>
      <p>Customers need to accurately choose the testing purpose so that consultants can provide accurate advice and perform procedures suitable for DNA testing purposes.</p>
      
      <p><strong>Step 2: DNA Testing Samples</strong></p>
      <ul>
        <li>Center consultants will advise on sampling steps and sample types suitable for customer circumstances.</li>
        <li>Consultants will perform sample collection at the center or guide customers to collect samples accurately for sending to the center.</li>
      </ul>
      
      <p><strong>Step 3: DNA Test Result Delivery</strong></p>
      <p>To ensure customer confidentiality, we only deliver test results to the person listed on the Request Form and the registered phone number for receiving results or LOCI receipt or deliver according to the applicant's request.</p>
      
      <h2 id="2">II. DNA TESTING FOR LEGAL PURPOSES</h2>
      <p>ADNchacon Molecular Biotechnology Center under LOCI Molecular Biology Institute is a pioneering unit in the reliable blood relationship testing field that has been trusted by citizens, organizations, and domestic and international agencies. Over the years, we regularly provide legal DNA testing services for:</p>
      
      <ul>
        <li>Embassies of various countries in Vietnam: For immigration, naturalization, visa applications.</li>
        <li>People's Courts at all levels.</li>
        <li>Ward/Commune - District People's Committees: for Birth Registration purposes</li>
        <li>Judicial agencies, Provincial Justice Departments.</li>
      </ul>
      
      <p>Legal DNA testing procedures take only about 15-20 minutes:</p>
      
      <p><strong>Step 1: DNA Testing Registration Procedures</strong></p>
      <p>Consultants will advise on registration and complete testing registration files to serve as legal basis. Including:</p>
      <ul>
        <li>Legal DNA testing request form</li>
        <li>Personal identification documents as follows:
          <ul>
            <li>For Vietnamese nationals, please bring original identification documents when coming for testing</li>
            <li>For children under 16 years old who do not have Citizen ID or passport, they can bring original birth certificates confirmed by authorities, or hospital birth certificates.</li>
            <li>For foreigners, please bring original passports for photocopying.</li>
          </ul>
        </li>
      </ul>
      
      <p><strong>Step 2: DNA Testing Sample Collection</strong></p>
      <p>Customers must come directly to our office for sample collection. In case of travel difficulties, please call our 24/7 hotline 1900 8043 or 098 604 3113 for assistance.</p>
      
      <p><strong>Note:</strong></p>
      <ul>
        <li>Customers do not collect samples at home. Center technicians will perform sample collection steps according to proper procedures to ensure accurate and legal results.</li>
        <li>When performing DNA testing sample collection, customers do not need to fast or stop taking medications.</li>
      </ul>
      
      <p><strong>Step 3: Receiving DNA Test Results</strong></p>
      <p>To ensure confidentiality, we only deliver test results to the person listed on the Request Form and the registered phone number for receiving results or ADNchacon receipt or deliver according to the applicant's request.</p>
      
      <p>ADNchacon Molecular Biotechnology Center delivers DNA test results in the following ways:</p>
      <ul>
        <li>Come to the Center to receive your test results</li>
        <li>Send by express delivery to the requested address</li>
        <li>Send DNA test results to email</li>
        <li>Notification by phone</li>
      </ul>
      
      <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
        <img src="/images/Co-so-vat-chat-Trang-thiet-bi-ADNChacon-3-1024x768.jpg" alt="Modern DNA testing equipment at ADNchacon" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
      </div>
    </div>
  `
},
{
  id: 7,
  title: "In-depth Analysis of DNA Testing Booking System: From Requirements to Implementation",
  category: "News",
  excerpt: "Detailed analysis of the design and implementation process of DNA testing appointment scheduling system, from business requirements to user experience and state management.",
  image: "/images/big-data.png",
  slug: "in-depth-analysis-dna-testing-booking-system-requirements-implementation",
  author: "Product Development Department",
  date: "2024-01-15",
  readTime: "15 min read",
  featured: false,
  tableOfContents: [
    { id: "1", title: "Core Business Requirements and Workflow", level: 1 },
    { id: "2", title: "System Architecture and Business Rules", level: 1 },
    { id: "3", title: "Interface Design and User Experience (UI/UX)", level: 1 },
    { id: "4", title: "Advanced Logic - Relationship Management", level: 1 },
    { id: "5", title: "Payment Flow and Booking State Management", level: 1 },
    { id: "6", title: "Test Result Interpretation", level: 1 }
  ],
  content: `
    <div class="blog-content">
      <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
        <img src="/images/G2101041-DNA_analysis.jpg" alt="DNA analysis and genetic sequencing" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
      </div>
      
      <p class="lead-paragraph">In the world of medical technology, building an effective booking system is not just about choosing dates and times. It requires deep understanding of business processes, complex logical rules, and user experience. This article will analyze in detail a booking system for DNA testing services, from initial requirements to deployment architecture, payment flow, and state management.</p>
      
      <h2 id="1">Part 1: Core Business Requirements and Workflow</h2>
      <p>The system needs to manage two main testing processes, each serving different customer needs.</p>
      
      <p><strong>Self-Collection and Sample Shipping (Only for Non-legal DNA):</strong> This flow is for customers who want privacy and autonomy.</p>
      <p>Implementation flow: Register appointment → Receive sample collection kit → Self-collect samples at home → Send samples to testing laboratory → Wait for processing and receive results.</p>
      
      <p><strong>Sample Collection at Medical Facility (CSYT):</strong> This flow ensures legality or is for customers who want professional support.</p>
      <p>Implementation flow: Register appointment → Medical staff collect samples (at CSYT or at home) → Samples processed at testing laboratory → Return results.</p>
      
      <h2 id="2">Part 2: System Architecture and Business Rules</h2>
      <p>To systematize the above flows, we define core attributes and accompanying rules.</p>
      
      <p><strong>Main components:</strong></p>
      
      <p>Service Type:</p>
      <ul>
        <li>Legal: Tests requiring high legality (birth registration, naturalization, inheritance).</li>
        <li>Non-Legal: Tests of a personal nature, not requiring legal procedures.</li>
      </ul>
      
      <p>Collection Method:</p>
      <ul>
        <li>At Home: Sample collection at customer's address.</li>
        <li>At Facility: Customer comes directly to medical facility for sample collection.</li>
      </ul>
      
      <p>Mediation Method:</p>
      <ul>
        <li>Postal Delivery: Customer receives kit and sends samples via third-party shipping.</li>
        <li>Staff Collection: CSYT staff comes to customer's home to collect samples.</li>
        <li>Walk-in Service: Customer comes to CSYT themselves.</li>
      </ul>
      
      <p><strong>Important business rules:</strong></p>
      <ul>
        <li>Postal Delivery only applies to Non-Legal services.</li>
        <li>When choosing Postal Delivery, customers must pay in advance through payment gateway (VNPay) due to third-party shipping involvement.</li>
        <li>Express Service (priority early result delivery) only applies to Staff Collection and Walk-in Service.</li>
        <li>For Postal Delivery, customers have 3 days to send back the kit containing samples after receipt. If overdue, the appointment will be automatically cancelled.</li>
      </ul>
      
      <h2 id="3">Part 3: Interface Design and User Experience (UI/UX)</h2>
      <p>After customers choose a specific service and click "Book appointment", they will be redirected to the Booking page with an intelligent form that displays options based on predefined rules.</p>
      
      <p><strong>User selection flow:</strong></p>
      <ul>
        <li>Service Type & Service Name: Selected from previous page.</li>
        <li>Collection Method:
          <ul>
            <li>If choosing At Home, an address input field will appear.</li>
            <li>If choosing At Facility, the system will display the fixed CSYT address.</li>
          </ul>
        </li>
        <li>Mediation Method: This is the most complex logic part, options will be automatically filtered:
          <ul>
            <li>If service is Legal:
              <ul>
                <li>At Home → Only Staff Collection option.</li>
                <li>At Facility → Only Walk-in Service option.</li>
              </ul>
            </li>
            <li>If service is Non-Legal:
              <ul>
                <li>At Home → 2 options: Postal Delivery or Staff Collection.</li>
                <li>At Facility → Only Walk-in Service option.</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>Express Service: A checkbox only displayed when Mediation Method is Staff Collection or Walk-in Service.</li>
        <li>Schedule:
          <ul>
            <li>Postal Delivery: Customer chooses kit receipt date.</li>
            <li>Staff Collection / Walk-in Service: Customer chooses specific date and time slot. System will disable past time slots in current day.</li>
          </ul>
        </li>
        <li>Cost: Calculated automatically and transparently.
          <ul>
            <li>Service Cost: Testing service fee.</li>
            <li>Mediation Method Cost:
              <ul>
                <li>Postal Delivery: 250,000 VND</li>
                <li>Staff Collection: 500,000 VND</li>
                <li>Walk-in Service: 0 VND</li>
              </ul>
            </li>
            <li>Express Service Cost: Fast service fee.</li>
            <li>Total Cost: Sum of above costs.</li>
          </ul>
        </li>
      </ul>
      
      <p><strong>Special note:</strong> If customer chooses Staff Collection and Express Service, Total Cost = Service Cost + Express Service Cost. Mediation Method fee (500,000 VND) will be waived.</p>
      
      <p><strong>Test Subject Information:</strong></p>
      <ul>
        <li>Includes necessary personal information fields like Full name, Date of birth, Gender, Phone, Email, Relationship, Sample type, ID card.</li>
        <li>Validation rules applied (representative >18 years old, email/phone format, no duplicate relationships...).</li>
      </ul>
      
      <h2 id="4">Part 4: Advanced Logic - Relationship Management</h2>
      <p>To ensure accuracy, the system only allows selection of valid relationship pairs corresponding to each type of testing service.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Service Name</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Valid Relationship Pairs</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Logic Notes</th>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Paternity Testing (Father-Child)</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Father - Child</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;"></td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Maternity Testing (Mother-Child)</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Mother - Child</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;"></td>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">NIPT (Non-invasive Prenatal)</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Father - Child</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Child sample is null (automatic)</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Sibling Testing</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Sibling - Sibling</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;"></td>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Grandparent Testing</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Grandparent - Grandchild</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;"></td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">DNA Testing for Birth Registration</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Father - Child<br>Mother - Child</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Allows either one</td>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">DNA Testing for Immigration</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Father - Child<br>Mother - Child<br>Sibling - Sibling<br>Grandparent - Grandchild</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Must choose correct pair</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">DNA Testing for Inheritance</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Father/Mother - Child<br>Grandparent - Grandchild<br>Sibling - Sibling</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Suggests in priority order</td>
        </tr>
      </table>
      
      <p>On the interface, when customers choose a service, the Relationship list will be automatically filtered to only display valid options.</p>
      
      <h2 id="5">Part 5: Payment Flow and Booking State Management</h2>
      <p>As soon as customers click "Confirm booking", a new booking will be created with Pending Payment status, initiating the payment flow and state management.</p>
      
      <p><strong>Payment flow:</strong></p>
      <ul>
        <li>Cash:
          <ul>
            <li>Customer confirms information.</li>
            <li>System requests electronic signature.</li>
            <li>Successful booking notification, along with payment code (paymentCode) to provide to staff when collecting samples.</li>
          </ul>
        </li>
        <li>QR Code (VNPay):
          <ul>
            <li>Customer confirms information.</li>
            <li>System displays QR code with paymentCode (transfer content). Customer has 15 minutes to pay.</li>
            <li>If over 15 minutes, QR code expires. If over 30 minutes without payment, booking will be cancelled.</li>
            <li>After system receives successful payment, customer will sign electronically.</li>
            <li>Successful booking notification.</li>
          </ul>
        </li>
      </ul>
      
      <p><strong>Booking lifecycle states (Payment Success):</strong></p>
      <p>Awaiting Confirmation → Pending Payment → Booking Confirmed (Confirmed & assigned) → Awaiting Sample → In Progress → Ready (Ready for result delivery) → Completed.</p>
      
      <p><strong>State flow on customer's "My Booking" page:</strong></p>
      <ul>
        <li>For postal delivery: Confirmed → Shipping kit → Kit delivered → Awaiting sample → Testing in progress → Result delivery.</li>
        <li>For CSYT sample collection: Confirmed → Awaiting sample collection → Testing in progress → Result delivery.</li>
      </ul>
      
      <h2 id="6">Part 6: Test Result Interpretation</h2>
      <p>Finally, test results are concluded based on DNA matching percentage.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Relationship</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">MATCH (Related)</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">INCONCLUSIVE (Undetermined)</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">NOT MATCH (Unrelated)</th>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Father – Child</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~50%</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">-</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~0–1%</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Mother – Child</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~50%</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">-</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~0–1%</td>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Full Siblings</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~50%</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~10–25% (close relatives)</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~0–1%</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Grandparent – Grandchild</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~25%</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~10–15% (distant relatives)</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~0–5%</td>
        </tr>
      </table>
      
      <h3>Conclusion</h3>
      <p>Analyzing and designing a booking system for specialized services like DNA testing is a complex problem, requiring seamless integration of business logic, technology, and user experience. By clearly defining rules, intelligent routing, and transparent information, we can build a platform that is not only technically robust but also user-friendly and reliable. This analysis model is the solid foundation for the product development and deployment phase.</p>
    </div>
  `
},
  {
    id: 8,
    title: "DETAILED INFORMATION ABOUT LEGAL DNA TESTING AT DNA TESTING",
    category: "Civil",
    excerpt: "Today, DNA paternity test results are not only used to determine blood relationships between father and child within families, as well as in administrative procedures for birth registration at commune/ward level, but are also used as evidence in disputes over child custody rights, alimony rights, and inheritance rights in people's courts at all levels.",
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200&h=800&fit=crop",
    slug: "detailed-information-legal-dna-testing-dna-testing",
    author: "DNA Testing",
    date: "2024-01-12",
    readTime: "9 min read",
    featured: true,
    tableOfContents: [
      { id: "1", title: "Purpose of Legal DNA Testing", level: 1 },
      { id: "2", title: "Legal DNA Testing Procedures", level: 1 },
      { id: "3", title: "Scientific Basis", level: 1 },
      { id: "4", title: "Why Choose DNA Testing", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">Today, DNA paternity test results are not only used to determine blood relationships between father and child within families, as well as in administrative procedures for birth registration at commune/ward level, but are also used as evidence in disputes over child custody rights, alimony rights, and inheritance rights in people's courts at all levels. Let's explore detailed information about legal DNA testing with DNA Testing in this article.</p>
        
        <h2 id="1">Purpose of Legal DNA Testing</h2>
        <ul>
          <li>Citizenship and immigration processes.</li>
          <li>Visa and visa application procedures.</li>
          <li>Performing DNA testing for sponsorship application submission.</li>
          <li>Legal procedures related to DNA testing to fulfill state requirements.</li>
          <li>Father acknowledging child and redoing birth certificate.</li>
          <li>Making birth certificates for children in cases of overdue registration.</li>
          <li>Performing DNA testing as required by courts.</li>
        </ul>
        
        <h2 id="2">Legal DNA Testing Procedures</h2>
        <p><strong>Note:</strong></p>
        <p>Legal procedures: In cases where DNA testing has legal nature, customers are not allowed to self-collect samples and send for testing. Sample collection will be performed by staff of the DNA Technology and Genetic Analysis Institute.</p>
        
        <p><strong>Requirements for test participants:</strong></p>
        <ul>
          <li>Present identity card, citizen ID card, or passport of each person.</li>
          <li>Present child's birth certificate or birth certificate.</li>
          <li>Complete all information in the testing application form.</li>
          <li>Witness the sample collection process and sealing of sample envelopes.</li>
        </ul>
        
        <p><strong>Requirements for sample collectors:</strong></p>
        <ul>
          <li>Check and copy for safekeeping personal documents (ID card, passport, birth certificate, birth certificate...) of test subjects.</li>
          <li>Guide customers to complete all information in the testing application form. Check and confirm accurate information.</li>
          <li>Take photos for record keeping.</li>
          <li>Collect samples, clearly write each person's name on corresponding sample envelopes, seal sample envelopes.</li>
        </ul>
        
        <p>All customer information and sample collection process at the DNA Technology and Genetic Analysis Institute will be stored and kept absolutely confidential.</p>

        <h2 id="3">Scientific Basis</h2>
        <p>Most human DNA is very similar (99.7%) between different individuals. However, just 0.3% difference in the genome is enough to distinguish each person.</p>
        
        <p>This small part contains unique DNA characteristics, called genetic markers, which can be used in paternity tests to determine a child's father. Each baby inherits half the DNA from the mother and half from the father, meaning part of the child's genetic markers will correspond to part of the father's. Legal DNA testing is based on these genetic traces.</p>
        
        <p>The more genetic markers used in testing, the higher the ability to accurately determine father-child blood relationships. Therefore, legal DNA tests using more markers will have higher reliability.</p>
        
        <p><strong>Legal DNA testing subjects:</strong></p>
        <ul>
          <li>Father-Child | Mother-Child</li>
          <li>Grandfather-Grandson relationships, Uncle-Nephew, Brother relationships...</li>
          <li>Grandmother-Grandchild relationships, Same-mother siblings, Grandchild-Mother's sisters relationships...</li>
        </ul>

        <h2 id="4">Why Choose DNA Testing</h2>
        <p>DNA Testing Center has the capability to perform DNA testing from various sample types such as: blood, toothbrush, nails, hair, umbilical cord... with high accuracy thanks to the following outstanding advantages:</p>
        
        <ul>
          <li><strong>Modern equipment:</strong> The laboratory at DNA Testing Center is invested with over 2 million USD, complying with ISO 15189:2012 and 9001:2015 standards with modern equipment and technology, including specialized KIT sets for criminal DNA testing such as HDPlex Kit, PowerPlex Fusion, Argus X-12 Kit, PowerPlex Y23 KIT from Promega – USA, Qiagen – Germany.</li>
          
          <li><strong>Experienced expert team:</strong> At DNA Testing Center, DNA testing experts are all leading experts in the field of genetic analysis. Among them, Colonel Ha Quoc Khanh, with over 40 years of experience and many high positions in the industry, heads the testing process supervision.</li>
          
          <li><strong>Quick procedures:</strong> DNA tests at DNA Testing Center are performed with brief and simple procedures. Especially, the Center has expanded with over 40 sample collection points and supports home sample collection in provinces and cities nationwide.</li>
          
          <li><strong>Quick result delivery:</strong> Customers can receive DNA test results from DNA Testing Center in just 4 hours, depending on the sample type and service package they choose.</li>
          
          <li><strong>Accurate results:</strong> With advanced equipment and knowledgeable, experienced expert team, DNA test results from DNA Testing Center achieve high accuracy up to about 99.99999998%.</li>
          
          <li><strong>Customer information security:</strong> All customer information is committed to absolute confidentiality and DNA Testing Center commits to ensuring responsibility with this policy.</li>
        </ul>
      </div>
    `
  },
  {
    id: 9,
    title: "AI Designs DNA Sequences, Opening a New Era of Biotechnology",
    category: "Knowledge",
    excerpt: "Artificial intelligence is revolutionizing the field of biology by designing new DNA sequences, opening a new era for biotechnology and medicine.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
    slug: "ai-designs-dna-sequences-new-era-biotechnology",
    author: "Dr. Le Minh Hai",
    date: "2024-01-10",
    readTime: "11 min read",
    featured: false,
    tableOfContents: [
      { id: "1", title: "AI Designs DNA Sequences: From Simulation to Creation", level: 1 },
      { id: "2", title: "Great Opportunities, Significant Challenges", level: 1 },
      { id: "3", title: "Future Biological Design May Resemble Software Programming", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">AI is entering the field of biology by designing new DNA sequences. This technology helps accelerate research on proteins, vaccines, microorganisms, and many other potential biomedical applications. Once, biological design was the work of complex molecular biology laboratories. Now, artificial intelligence (AI) opens a new field: computer-based biological design.</p>
        
        <p>Instead of spending many years on traditional biological experiments, scientists can now "program" organisms like writing software, and AI is the tool that accelerates this breakthrough.</p>
        
        <h2 id="1">1. AI Designs DNA Sequences: From Simulation to Creation</h2>
        <p>According to research, DNA decoding was once a great miracle in biology, now it's just the beginning. With AI assistance, the process has shifted from "reading" to "writing" genetic code. Deep learning models trained on millions of gene sequences can recognize structure, function, and even predict how genes operate in cells.</p>
        
        <p>A typical example is tools like ProGen, a gene language model that works similarly to ChatGPT, but instead of generating text, it creates new protein sequences. These AIs not only "compose" genes but also evaluate folding capability, biological activity, and application potential of products.</p>
        
        <p>Importantly, AI doesn't replace scientists but helps them significantly reduce experimental time and optimize. A DNA sequence can have billions of different combinations, nearly impossible to check manually. AI helps select the most feasible combinations, much faster and more accurate.</p>
        
        <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
          <img src="/images/AI-thiet-ke-chuoi-ADN.webp" alt="AI designs DNA sequences" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
        </div>
        
        <h2 id="2">2. Great Opportunities, Significant Challenges</h2>
        <p>Thanks to AI, biotechnology companies are creating bacteria capable of decomposing plastic, drought-resistant crops, or even personalized vaccines for each individual.</p>
        
        <p>In medicine, AI writes code for tumor-degrading enzymes, highly specific antibodies, or biological molecules for early cancer diagnosis.</p>
        
        <p>However, many experts warn that this technology also has potential for misuse. AI could be used to design dangerous viruses or biological agents if it falls into wrong hands. Therefore, along with development speed comes urgent need for ethical control, training data transparency, and biological safety supervision.</p>
        
        <p>Additionally, this technology still depends on training data, meaning AI is only strong if there's enough accurate, diverse biological data. For fields not yet fully researched, AI may still create "faulty designs" or biologically inappropriate ones in reality.</p>
        
        <p>Finally, gene copyright issues need consideration: When AI creates a never-before-seen DNA sequence, who owns it? The researcher, company, or AI model?</p>
        
        <h2 id="3">3. Future Biological Design May Resemble Software Programming</h2>
        <p>We are entering an era where organisms are not just discovered but also "written" from scratch by machines. Like programmers writing code for applications, future biologists may design special microorganisms or proteins by describing requirements, letting AI calculate the rest.</p>
      </div>
    `
  }
];

const BlogDetail = () => {
  const { slug } = useParams();
  const [activeSection, setActiveSection] = useState('1');
  const navigate = useNavigate();
  
  // Xử lý chuyển hướng từ URL cũ sang URL mới
  useEffect(() => {
    // Nếu slug là URL cũ của bài viết về phân biệt xét nghiệm ADN
    if (slug === "giai-quyet-tranh-chap-thua-ke-bang-xet-nghiem-adn") {
      // Chuyển hướng đến URL mới
      navigate("/blog/phan-biet-xet-nghiem-adn-dan-su-va-hanh-chinh", { replace: true });
    }
    // Nếu có người truy cập từ URL cũ của bài viết Decoding Life
    else if (slug === "decoding-life-understanding-dna-testing") {
      // Chuyển hướng đến URL mới
      navigate("/blog/nguyen-ly-hoat-dong-cua-xet-nghiem-adn", { replace: true });
    }
  }, [slug, navigate]);
  
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
            "url('/images/close-up-hands-typing-keyboard.jpg')",
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

                      <div className="p-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white mb-2 ${
                          relatedArticle.category === 'Knowledge' ? 'bg-green-500' :
                          relatedArticle.category === 'Administration' ? 'bg-red-500' :
                          relatedArticle.category === 'News' ? 'bg-purple-500' :
                          relatedArticle.category === 'Service' ? 'bg-yellow-500' :
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

      <style>{`
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