import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCalendar, FaUser, FaArrowLeft, FaClock, FaTag, FaChevronRight, FaHome } from 'react-icons/fa';

// Optimized data for articles (removed views, likes, comments)
const articles = [
  {
    id: 1,
    title: "ILLUMINA - Pioneer Technology in Genetic Testing in Vietnam",
    category: "Knowledge",
    excerpt: "Illumina is considered a 'giant' in the field of gene sequencing, a global company specializing in DNA sequencing and biotechnology serving customers in research, clinical applications, and practical implementations.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop",
    slug: "illumina-pioneer-technology-genetic-testing-vietnam",
    author: "DNA Testing",
    date: "2024-01-25",
    readTime: "10 min read",
    featured: true,
    tableOfContents: [
      { id: "1", title: "Illumina - The giant in the field of Gene sequencing", level: 1 },
      { id: "2", title: "The legal battle against copyright infringement by Illumina", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">Illumina is considered a 'giant' in the field of gene sequencing, a global company specializing in DNA sequencing and biotechnology serving customers in research, clinical applications, and practical implementations. With its contributions and development efforts, Illumina increasingly affirms its position in the field of gene sequencing and is used for applications in life sciences, cancer, reproductive health, agriculture, and other life applications.</p>

        <p>Illumina is the world's leading technology company in gene decoding and analysis based in San Diego, California, founded in 1998 with the mission: "Improve human health by unlocking the power of the genome". For over two decades, Illumina has developed pioneering technologies of superior quality used in pathological research, drug development, and the development of tests in the field of molecular biology.</p>

        <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
          <img src="/images/about-illumina-web-graphic.jpg" alt="Illumina Headquarters" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
        </div>

        <p>Illumina has partnerships with over 115 countries and territories worldwide, including Vietnam, and continues to optimize solutions to become simpler, more expansive, and more accessible to an increasing number of scientific researchers.</p>

        <h2 id="1">1. The giant in the field of Gene sequencing</h2>
        <p>When mentioning gene sequencing, one thinks of Illumina. According to statistics from Illumina, up to 90% of gene sequencing data worldwide is sequenced from Illumina's Next Generation Sequencing (NGS) system. It is known that Illumina has used the Illumina NGS system since 2007, built on previous genome sequencing methods to significantly reduce the necessary time.</p>

        <p>Illumina has contributed to the development of technologies, opening an important era, especially as the company's gene sequencing technology is applied to a series of research and tests related to clinical practice.</p>

        <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
          <img src="/images/so-lieu-illumina.jpg" alt="Illumina Statistics" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
        </div>
        <p style="font-style: italic; margin-top: 8px; font-size: 0.9em; text-align: center;">Illumina ended Q4 2020 with a 7.5% increase in net income compared to the same period last year (Source: Illumina)</p>

        <p>Illumina's research focuses on developing technological solutions that allow researchers to continue making scientific advances in genetic diseases, common genetic disorders, population genetics, and cell biology; basic molecular research related to clinical applications such as reproductive health, cancer testing, infectious disease testing and monitoring.</p>

        <p>Accordingly, Illumina's NGS technology has helped revolutionize genome research and has wide applications in many fields such as infectious diseases, cancer, genetic diseases, agriculture, and in environments such as clinics, hospitals, research laboratories, and government agencies.</p>

        <p>In efforts to control the outbreak of the coronavirus disease in early 2020, Illumina's gene sequencing system was used to identify and publish the genome profile of the coronavirus in a public database, which was the first important step in developing diagnostic tests, laying the groundwork for vaccine formulation.</p>

        <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
          <img src="/images/thu-nghiem-DNA.jpg" alt="Illumina and IDbyDNA Launch DNA Test" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
        </div>
        <p style="font-style: italic; margin-top: 8px; font-size: 0.9em; text-align: center;">Illumina and IDbyDNA Launch DNA Test That Can Find the Next Pandemic (Source: IDbyDNA)</p>

        <p>Along with many contributions and efforts, Illumina is increasingly affirming its position in the field of gene sequencing with important applications in non-invasive prenatal screening VeriSeq NIPT; preimplantation genetic screening VeriSeq PGS; early cancer screening and diagnosis TSO500.</p>

        <h2 id="2">2. The legal battle against copyright infringement by Illumina</h2>
        <p>With important contributions and opening a new era for world medicine, Illumina holds a large market share in the field of gene sequencing. Because of this, the issue of protecting ownership of patents and copyrights has become more urgent than ever. In reality, many companies have illegally used these patents under the guise of scientific research to copy and create technological solutions for themselves. This action has seriously violated patent rights, and the company has submitted applications to protect its intellectual property.</p>

        <p>Specifically, according to international media information, in February 2020, Illumina filed a patent infringement lawsuit against BGI related to gene sequencing products. In early January 2021, at the UK Supreme Court of Justice, the Chancery Division and Patents Court ruled in favor of Illumina.</p>

        <p>Accordingly, 4/5 patents were confirmed to be valid and infringed by BGI. These patents refer to different aspects of Illumina's proprietary synthetic biology sequencing method, including paired-end sequencing and nucleotide labeling.</p>
      </div>
    `
  },
   {
    id: 2,
    title: "Non-legal vs. Legal DNA Testing: Similarities and Differences",
    category: "Administration",
    excerpt: "Understand the differences between non-legal and legal DNA testing to choose the right type of test for your specific needs.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800&fit=crop",
    slug: "civil-vs-legal-dna-testing-similarities-differences",
    author: "GeneViet",
    date: "2024-03-15",
    readTime: "10 min read",
    featured: true,
    views: 2250,
    likes: 178,
    comments: 42,
    tableOfContents: [
      { id: "1", title: "Understanding DNA testing for non-legal and legal purposes", level: 1 },
      { id: "2", title: "How are non-legal and legal DNA testing similar and different?", level: 1 },
      { id: "3", title: "Similarities between non-legal and legal DNA testing", level: 1 },
      { id: "4", title: "Differences between non-legal and legal DNA testing", level: 1 },
      { id: "5", title: "Important notes", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">DNA testing is becoming increasingly popular for various purposes and is divided into two main groups: non-legal and legal. However, many people are still unclear about the differences between these two types of testing.</p>
        
        <p>To better understand the similarities and differences between non-legal and legal DNA testing, please follow the information in the article below from GeneViet.</p>
        


        <h2 id="1">1. Understanding DNA testing for non-legal and legal purposes</h2>
        
        <p><strong>DNA testing for non-legal purposes</strong></p>
        <p>DNA testing for non-legal purposes is the use of DNA analysis technology to determine blood relationships between individuals for personal purposes, not used in legal administrative procedures.</p>
        
        <p><strong>Applications of DNA testing for non-legal purposes include:</strong></p>
        <ul>
          <li><strong>Determining blood relationships:</strong> This is the most common application, helping to resolve doubts or confirm blood relationships within families. It is particularly useful in cases where paternity, maternity, siblings, or relatives need to be determined.</li>
          <li><strong>Genealogy and ancestry research:</strong> This testing helps people learn about their family origins and ancestors. Through DNA test results, it can help connect with distant family members or better understand family history.</li>
          <li><strong>Health and medicine:</strong> Non-legal DNA testing can help detect genetic risks early, thereby helping people plan better prevention and health management. In addition, DNA testing also helps determine compatibility in organ transplantation or finding suitable organ donors.</li>
          <li><strong>Finding missing relatives:</strong> In cases such as adoption, disappearance, or natural disasters, DNA testing can help reconnect family members.</li>
        </ul>
        

        
        <p><strong>DNA testing for legal purposes: </strong></p>
        <p>DNA testing for legal purposes is the use of DNA analysis technology to determine blood relationships between individuals to serve legal administrative procedures, such as birth certificates, immigration, inheritance, etc.</p>
        
        <p><strong>Specific applications of legal DNA testing include:</strong></p>
        <ul>
          <li><strong>Criminal investigation support:</strong> DNA testing is an important tool in identifying or excluding suspects in criminal cases. DNA collected from crime scenes can be compared with suspects' DNA or criminal databases to find perpetrators.</li>
          <li><strong>Resolving family disputes:</strong> In cases of child custody disputes, adoption, or inheritance disputes, DNA testing helps determine accurate blood relationships, thereby providing legal basis for court decisions.</li>
          <li><strong>Victim identification in accidents or disasters:</strong> When traditional identification methods are not feasible, DNA testing can help identify victims, helping families reclaim the bodies of their loved ones and supporting the investigation process into accident causes.</li>
          <li><strong>Verifying family relationships in immigration files:</strong> Immigration files often require verification of blood relationships between sponsors and sponsored individuals. DNA testing provides clear and accurate evidence to support the file review process.</li>
        </ul>
        
        <h2 id="2">2. How are non-legal and legal DNA testing similar and different?</h2>
        <p>It can be affirmed that DNA testing to determine blood relationships for non-legal/personal and legal/administrative needs are the two main purposes today. The similarities and differences between these two forms are as follows.</p>

        <h2 id="3">3. Similarities between non-legal and legal DNA testing</h2>
        <ul>
          <li><strong>Technology and methods:</strong> Both non-legal and legal DNA testing use the same technology and DNA analysis methods. The main steps include sample collection, DNA extraction, DNA amplification, and DNA sample analysis to determine genetic characteristics.</li>
          <li><strong>Accuracy:</strong> The accuracy of DNA test results in both cases is very high, usually reaching over 99.99%. This ensures that the results provided are reliable and valuable.</li>
          <li><strong>Types of test samples:</strong> The types of samples used, such as blood, saliva, hair, or fingernails, can all be applied to both non-legal and legal testing.</li>
        </ul>

        <div style="text-align: center; margin: 20px 0;">
          <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=800&fit=crop" alt="Non-legal and legal blood relationship testing" style="max-width: 100%; height: auto; border-radius: 8px;">
        </div>

        <h2 id="4">4. Differences between non-legal and legal DNA testing</h2>
        
        <p><strong>Purpose of use:</strong></p>
        <ul>
          <li><strong>Non-legal DNA testing:</strong> Usually performed for personal or family purposes, such as determining blood relationships (father-child, mother-child, siblings), genealogy research, or determining ancestral origins.</li>
          <li><strong>Legal DNA testing:</strong> Used in situations related to law, such as criminal cases (identifying suspects), civil cases (property disputes, child custody) and other legal requirements (immigration, adoption).</li>
        </ul>
        
        <p><strong>Sample collection process:</strong></p>
        <ul>
          <li><strong>Non-legal DNA testing:</strong> Usually allows self-collection of samples at home according to laboratory instructions. Users will receive a sample collection kit, collect samples themselves and send them back to the laboratory.</li>
          <li><strong>Legal DNA testing:</strong> Requires stricter sample collection procedures, usually performed by experts or forensic personnel to ensure sample integrity and result accuracy. Samples must be collected and stored according to standard procedures to avoid interference or distortion.</li>
        </ul>

        <p><strong>Legal validity of results:</strong></p>
        <ul>
          <li><strong>Non-legal DNA testing:</strong> Provides results mainly for personal purposes and usually has no legal value in disputes or lawsuits.</li>
          <li><strong>Legal DNA testing:</strong> Provides results with legal value that can be used as evidence in court. These results are usually accompanied by detailed reports and signatures from forensic experts.</li>
        </ul>
        
        <p><strong>Cost:</strong></p>
        <ul>
          <li><strong>Non-legal DNA testing:</strong> Blood relationship testing for non-legal purposes is usually lower in cost due to simpler sample collection processes and less stringent security and management requirements.</li>
          <li><strong>Legal DNA testing:</strong> Has higher costs due to strict sample collection and preservation procedures, and high professional requirements of forensic experts.</li>
        </ul>
        
        <p><strong>Result delivery time:</strong></p>
        <ul>
          <li><strong>Non-legal DNA testing:</strong> Result delivery time is usually faster due to simpler processes and fewer stringent requirements.</li>
          <li><strong>Legal DNA testing:</strong> Result delivery time may be longer due to strict verification processes and compliance with legal regulations.</li>
        </ul>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Criteria</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Non-legal DNA testing</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Legal DNA testing</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Purpose</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Personal, family</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Legal procedures, administrative</td>
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
        
        <h2 id="5">5. Important notes</h2>
        <div class="warning-box" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #dc3545;">
          <p><strong>Note:</strong></p>
          <ul>
            <li>The information in this article is for reference only. For more details about non-legal and legal DNA testing, you should contact reputable DNA testing laboratories for specific consultation.</li>
            <li>Regulations on legal DNA testing may vary by country or region. Therefore, you need to carefully understand these regulations before conducting testing.</li>
        </ul>
        </div>
        
        <p>Thus, it can be confirmed that regardless of the purpose for which DNA testing is used, the requirement for accuracy of results is always set at the highest level. If you are looking for a reputable DNA testing address for non-legal or legal purposes, please contact GeneViet immediately for support.</p>
        
        
        <div class="conclusion-box" style="background-color: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ccc;">
          <h3 style="color: #1976D2; margin-top: 0;">About GeneViet</h3>
          <p>With more than 10 years operating in the field of DNA testing, GeneViet has performed millions of blood relationship tests for customers domestically and internationally. The advantages of using services at GeneViet include:</p>
          
          <ul>
            <li><strong>High accuracy:</strong> GeneViet uses the most advanced DNA analysis technology, ensuring test results have accuracy over 99.99%. Samples are processed by experienced expert teams and laboratories meeting international standards.</li>
            <li><strong>Absolute confidentiality:</strong> GeneViet commits to protecting customer information at the highest level. All samples and test data are encrypted and stored securely, with access only by authorized personnel. We understand that genetic information is private and sensitive, therefore, information security is our top priority.</li>
            <li><strong>Flexible and fast process:</strong> For legal testing purposes, GeneViet provides home sample collection kits, helping customers easily collect samples themselves and send them back to the center. This process is not only simple and time-saving but also ensures privacy for customers. Test results are usually returned in a short time, meeting customers' timely needs.</li>
            <li><strong>Professional consulting support:</strong> GeneViet's consulting team is always ready to support customers from sample collection, explaining test results to related legal aspects. GeneViet commits to providing dedicated and professional service.</li>
        </ul>
        </div>
      </div>
    `
  },

{
  id: 3,
  title: "What is non-legal father-child DNA testing?",
  category: "Knowledge",
  excerpt: "Today, non-legal father-child DNA testing services are of great interest to many people. So, what is DNA testing? How much does it cost? What samples can be used?",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
  slug: "xet-nghiem-adn-cha-con-dan-su-la-gi",
  author: "DNA Testing",
  date: "2024-06-25",
    readTime: "8 min read",
  featured: true,
    tableOfContents: [
    { id: "1", title: "What is non-legal father-child DNA testing?", level: 1 },
    { id: "2", title: "Information you need to know when doing non-legal father-child DNA testing", level: 1 }
    ],
    content: `
      <div class="blog-content">
      <p class="lead-paragraph">Today, non-legal father-child DNA testing services are of great interest to many people. So, what is DNA testing? How much does it cost? What samples can be used? Let's learn in detail in the article below.</p>

      <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
        <img src="/images/xet-nghiem-adn-cha-con-dan-su-la-gi-2.jpg" alt="Non-legal father-child DNA testing" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
      </div>

      <h2 id="1">1. What is non-legal father-child DNA testing?</h2>
      
      <p>Non-legal father-child DNA testing is a voluntary type of testing that helps verify the blood relationship between a child and presumed father, where the result confirmation certificate will not be/has no value for use as legal evidence or in administrative procedures.</p>

      <p>Usually, non-legal father-child DNA testing will be conducted in the following cases:</p>
      
      <ul>
        <li>There are doubts about the blood relationship between father and child, which need to be clearly verified to dispel doubts and resolve conflicts and misunderstandings within the family.</li>
        <li>Single mothers want to confirm their child's blood relationship with the father to request parenting and support responsibilities.</li>
        <li>Child custody disputes occur when parents are not registered for marriage, or the father is denied his role and not granted visiting, parenting, or child support rights.</li>
        </ul>

      <h2 id="2">2. Information you need to know when doing non-legal father-child DNA testing</h2>
      
      <p>Below is some important information you need to know when doing non-legal father-child DNA testing:</p>
      
      <p><strong>- Test samples and sample collection methods</strong></p>
      
      <p>If for administrative father-child DNA testing purposes, only 2 types of samples are used: blood and oral mucosal cells, then for non-legal father-child DNA testing, we can prepare any type of sample for the testing process: hair, nails, blood, saliva, umbilical cord, amniotic fluid, placenta... even special samples like chewed gum, cigarette filters, or even used condoms by the person whose blood relationship needs to be verified.</p>
      
      <p>Regarding sample collection methods, since non-legal father-child DNA testing only serves personal purposes and is not used for legal or administrative purposes, sample collection can be conducted secretly, at home, or directly at the DNA testing center for guidance and support, or request testing center staff to come home to assist with sample collection... generally depending on each person's wishes and conditions, each case.</p>
      
      <p><strong>- Procedures</strong></p>
      
      <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
        <img src="/images/xet-nghiem-adn-cha-con-dan-su-nhung-thong-tin-can-biet-1.jpg" alt="Non-legal father-child DNA testing procedures" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
      </div>
      
      <p>Procedures for non-legal father-child DNA testing are very simple due to the absence of legal elements. Participants requesting testing do not need to bring any identification documents, nor do they need to declare accurate personal information but can use aliases and choose anonymous testing. All that needs to be done is contact the testing center to register for non-legal father-child DNA testing, pay the fee and wait for results to be returned.</p>
      
      <strong>- Non-legal father-child DNA testing costs</strong>
      
      <p>The cost of non-legal father-child DNA testing currently ranges from 2.5 million VND, depending on the required result delivery time.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
      </table>
      </p>
      <div class="conclusion-box" style="background-color: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ccc;">
        <h3 style="color: #1976D2; margin-top: 0;">Conclusion</h3>
        <p>Non-legal father-child DNA testing is an effective solution for determining blood relationships between father and child for personal purposes. With simple procedures, reasonable costs and the ability to use many different types of samples, this service is increasingly chosen by many people. However, it should be noted that non-legal DNA test results have no legal value and cannot be used in administrative procedures.</p>
        
        <p>If you need non-legal father-child DNA testing, please contact reputable DNA testing centers for the best consultation and support.</p>
        </div>
      </div>
    `
  },

  {
    id: 4,
    title: "Distinguishing Non-Legal and Administrative DNA Testing",
    category: "Knowledge",
    excerpt: "Understand the differences between non-legal and administrative DNA testing to choose the right type of testing that suits your needs.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=800&fit=crop",

    slug: "phan-biet-xet-nghiem-adn-dan-su-va-hanh-chinh",
    author: "TS. Nguyễn Văn Minh",
    date: "2024-06-20",
    readTime: "8 phút đọc",
  featured: true,
    views: 1580,
    likes: 167,
    comments: 38,

  tableOfContents: [
      { id: "1", title: "Comparing non-legal and administrative DNA testing", level: 1 },
      { id: "2", title: "Non-legal DNA testing - testing 'for personal purposes'", level: 1 },
      { id: "3", title: "Administrative DNA testing - accurate and legally valid", level: 1 }
  ],
  content: `
    <div class="blog-content">
        <p class="lead-paragraph">In modern society, DNA testing plays an important role in many aspects of life, from resolving inheritance issues to determining blood relationships. However, many people are still confused between two common types of DNA testing: non-legal and administrative. Understanding the differences between them will help you choose the right type of testing that suits your needs.</p>
        
        <h2 id="1">1. Comparing non-legal and administrative DNA testing</h2>
        <p>Before going into details, let's explore the basic differences between these two types of testing through the following comparison table:</p>
        
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Criteria</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Non-legal DNA testing</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Administrative DNA testing</th>
        </tr>
        <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Purpose of use</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Only for personal purposes</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Used for legal or administrative purposes</td>
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
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Requires identification documents and identity verification</td>
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
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Simple, fewer procedures</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Strict, compliant with legal regulations</td>
        </tr>
      </table>
      
        <h2 id="2">2. Non-legal DNA testing - testing 'for personal purposes'</h2>
        <p>Non-legal DNA testing (also called personal DNA testing) is a type of testing designed to meet the need to learn information about blood relationships for personal purposes. This is a suitable choice for those who want to determine parent-child, sibling, or other relationships without needing to use the results for legal purposes.</p>
        
        <p><strong>Characteristics of non-legal DNA testing:</strong></p>
        <ul>
          <li><strong>High privacy:</strong> Personal information and test results are kept absolutely confidential</li>
          <li><strong>Home sample collection:</strong> Can self-collect samples at home using provided kits</li>
          <li><strong>Simple process:</strong> No identification documents or identity verification required</li>
          <li><strong>Reasonable cost:</strong> Lower cost compared to administrative DNA testing</li>
          <li><strong>Quick results:</strong> Faster processing and result delivery time</li>
      </ul>
      
        <p><strong>Applications of non-legal DNA testing:</strong></p>
        <ul>
          <li>Determining parent-child relationships for personal peace of mind</li>
          <li>Learning about blood relationships between siblings</li>
          <li>Determining distant family relationships (such as grandparent-grandchild, aunt/uncle-niece/nephew)</li>
          <li>Learning about family origins or lineage</li>
          <li>Resolving doubts about blood relationships within the family</li>
      </ul>
      
        <div class="important-note" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #dc3545;">
          <p><strong>Important note:</strong> Non-legal DNA test results have no legal value and cannot be used in administrative procedures, litigation in court, or immigration procedures.</p>
      </div>
      
        <h2 id="3">3. Administrative DNA testing - accurate and legally valid</h2>
        <p>Administrative DNA testing (also called legal DNA testing) is a type of testing performed according to strict procedures, complying with legal regulations, to ensure results have legal value and can be used in administrative procedures and litigation in court.</p>
        
        <p><strong>Quy trình xét nghiệm ADN hành chính:</strong></p>
        <ul>
          <li><strong>Đặt lịch hẹn:</strong> Liên hệ với cơ sở y tế được ủy quyền để đặt lịch xét nghiệm</li>
          <li><strong>Chuẩn bị giấy tờ:</strong> CMND/CCCD/Hộ chiếu, giấy khai sinh (đối với trẻ em dưới 14 tuổi)</li>
          <li><strong>Xác minh danh tính:</strong> Danh tính của tất cả các bên tham gia đều được xác minh</li>
          <li><strong>Lấy mẫu sinh học:</strong> Thực hiện tại cơ sở y tế bởi nhân viên y tế chuyên nghiệp</li>
          <li><strong>Phân tích mẫu:</strong> Sử dụng công nghệ tiên tiến, phân tích ít nhất 16-24 vị trí STR</li>
          <li><strong>Kiểm tra chất lượng:</strong> Kết quả được kiểm tra bởi ít nhất 2 chuyên gia</li>
          <li><strong>Cấp giấy chứng nhận:</strong> Kết quả được cấp kèm giấy chứng nhận có con dấu hợp pháp</li>
      </ul>

        <p><strong>Applications of administrative DNA testing:</strong></p>
        <ul>
          <li><strong>Resolving inheritance disputes:</strong> Determining blood relationships for inheritance asset distribution</li>
          <li><strong>Birth registration:</strong> Adding father/mother information to birth certificates</li>
          <li><strong>Citizenship procedures:</strong> Proving family relationships in immigration files</li>
          <li><strong>Child custody disputes:</strong> Determining parent-child relationships in divorce cases</li>
          <li><strong>Resolving legal disputes:</strong> Evidence in legal cases</li>
          <li><strong>Identity verification:</strong> In cases of suspected identity or newborn baby switching</li>
      </ul>
      
        <p><strong>Facilities performing administrative DNA testing:</strong></p>
        <ul>
          <li>National Institute of Forensic Medicine and branches nationwide</li>
          <li>Licensed central and provincial general hospitals</li>
          <li>DNA testing centers licensed by the Ministry of Health</li>
          <li>Laboratories with ISO 17025 certification for DNA testing</li>
      </ul>
      
        <div class="warning-box" style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #2196F3;">
          <p><strong>Criteria for choosing reputable DNA testing facilities:</strong></p>
          <ul>
            <li>Licensed by the Ministry of Health and has international certifications (ISO, AABB, CAP)</li>
            <li>Has a team of experts with specialized training and experience</li>
            <li>Uses modern testing technology and advanced equipment</li>
            <li>Has strict information security procedures and test results</li>
            <li>Provides professional pre and post-test counseling services</li>
            <li>Has many years of experience in genetic testing</li>
      </ul>
        </div>

        <p><strong>Notes when performing administrative DNA testing:</strong></p>
        <ul>
          <li><strong>Schedule in advance:</strong> Should schedule appointments in advance to avoid waiting and ensure sufficient time for procedures</li>
          <li><strong>Bring complete documents:</strong> Original ID card/Citizen ID/Passport and notarized copies, children's birth certificates</li>
          <li><strong>Ensure presence of all parties:</strong> All related parties must be present for sample collection</li>
          <li><strong>No eating or drinking before sampling:</strong> Avoid eating, drinking, smoking at least 30 minutes before sampling</li>
          <li><strong>Pre-test counseling:</strong> Should participate in counseling sessions to understand the process and meaning of results</li>
          <li><strong>Higher cost:</strong> Prepare budget as administrative DNA testing costs are higher than non-legal testing</li>
      </ul>
      
        <div class="conclusion-box" style="background-color: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ccc;">
          <h3 style="color: #1976D2; margin-top: 0;">Conclusion</h3>
          <p>Understanding the differences between non-legal and administrative DNA testing will help people choose the right type of testing suitable for their purposes, avoiding wasted time, costs and legal complications. If you need to confirm blood relationships just for personal knowledge, non-legal testing is a simple and discreet choice. Conversely, if you need to use results for legal purposes - choose administrative testing at reputable centers that are licensed to perform and provide legal results.</p>
          
         
      </div>
      
        


      </div>
    `
  },


  {
    id: 5,
    title: "Bảng giá dịch vụ của Genetix",
    category: "Knowledge",
    excerpt: "Trung tâm xét nghiệm ADN Genetix cung cấp đa dạng các gói dịch vụ xét nghiệm ADN với mức giá cạnh tranh và ưu đãi hấp dẫn.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=800&fit=crop",

    slug: "bang-gia-dich-vu-genetix",
    author: "Genetix DNA Center",
    date: "2024-06-15",
    readTime: "5 phút đọc",

    featured: true,
    views: 2650,
    likes: 194,
    comments: 51,
    tableOfContents: [
      { id: "1", title: "Xét nghiệm ADN không đủ giá trị pháp lý (Non-Legal DNA Testing)", level: 1 },
      { id: "2", title: "Xét nghiệm ADN pháp lý (Legal DNA Testing)", level: 1 },
      { id: "3", title: "Chế độ ưu đãi (Ưu đãi cho):", level: 1 },
      { id: "4", title: "Lưu ý khi lựa chọn dịch vụ", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">Trung tâm xét nghiệm ADN Genetix tự hào cung cấp các dịch vụ xét nghiệm ADN chất lượng cao với giá cả cạnh tranh. Chúng tôi cung cấp hai loại dịch vụ xét nghiệm ADN chính: xét nghiệm ADN không đủ giá trị pháp lý (Non-Legal DNA Testing) và xét nghiệm ADN pháp lý (Legal DNA Testing).</p>
        
        <h2 id="1">1. Xét nghiệm ADN không đủ giá trị pháp lý (Non-Legal DNA Testing)</h2>
        <p>Phù hợp với các mục đích cá nhân mà không cần sử dụng kết quả cho thủ tục pháp lý. Thủ tục đơn giản, chi phí thấp và bảo mật cao.</p>
        
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Dịch vụ</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Số lượng mẫu cần lấy</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Giá niêm yết</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Giá ưu đãi</th>
        </tr>
        <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm cha - con</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-3 người (cha con)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3,000,000 VNĐ</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2,000,000 VNĐ</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm mẹ - con</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-3 người (mẹ con)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3,000,000 VNĐ</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2,000,000 VNĐ</td>
        </tr>
        <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm anh/chị/em (không cần mẹ/cha)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-3 người (anh em)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3,500,000 VNĐ</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2,500,000 VNĐ</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm cô/dì/chú bác...</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3-4 người</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3,500,000 VNĐ</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2,500,000 VNĐ</td>
        </tr>
      </table>
      
        <div class="important-note" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #007bff;">
          <p><strong>Đặc điểm xét nghiệm ADN không đủ giá trị pháp lý:</strong> Phù hợp với các mục đích cá nhân như: xác minh quan hệ huyết thống, để biết thông tin cho bản thân, tìm hiểu về nguồn gốc dòng họ. Thủ tục đơn giản, chi phí thấp, có thể tự lấy mẫu tại nhà, thời gian xử lý nhanh chóng.</p>
    </div>

        <h2 id="2">2. Xét nghiệm ADN pháp lý (Legal DNA Testing)</h2>
        <p>Đáp ứng các yêu cầu pháp lý khi cần xác định quan hệ huyết thống cho các thủ tục hành chính, tố tụng tại tòa án, thủ tục di trú.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Dịch vụ</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Số lượng người</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Giá niêm yết</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Giá ưu đãi</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm cha-con</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-7 người</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">5,000,000 VNĐ</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">+2,500,000 VNĐ</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm mẹ-con</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-7 người</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">6,000,000 VNĐ</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">+2,500,000 VNĐ</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm quan hệ khác, trong họ hàng</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-7 người</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">6,000,000 VNĐ</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">+2,500,000 VNĐ</td>
          </tr>
        </table>
        
        <div class="important-note" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #dc3545;">
          <p><strong>Đặc điểm xét nghiệm ADN pháp lý:</strong> Dịch vụ chuyên cho thủ tục pháp lý như: đăng ký khai sinh, bổ sung thông tin cha/mẹ trên giấy khai sinh, thủ tục nhập quốc tịch, giải quyết tranh chấp thừa kế. Lấy mẫu tại cơ sở y tế, có xác minh danh tính, phí cao hơn, quy trình nghiêm ngặt và được thực hiện bởi nhân viên y tế chuyên nghiệp.</p>
        </div>

        <h2 id="3">3. Chế độ ưu đãi (Ưu đãi cho):</h2>
        <p>Genetix cung cấp nhiều ưu đãi hấp dẫn cho khách hàng:</p>
        
        <ul style="list-style-type: none; padding-left: 0;">
          <li style="margin-bottom: 10px;">
            <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FFD700; border-radius: 50%; margin-right: 10px;">📦</span>
            <strong>Chi phí trọn gói:</strong> Nhận mẫu đến khi trả kết quả 300.000 VNĐ
          </li>
          <li style="margin-bottom: 10px;">
            <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FFD700; border-radius: 50%; margin-right: 10px;">🏆</span>
            <strong>Giá ưu đãi (giảm đến):</strong> 250.000 VNĐ
          </li>
          <li style="margin-bottom: 10px;">
            <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FFD700; border-radius: 50%; margin-right: 10px;">📋</span>
            <strong>Giấm thêm nếu đi kèm gói khác:</strong> 250.000 VNĐ
          </li>
        </ul>

        <h2 id="4">4. Lưu ý khi lựa chọn dịch vụ</h2>
        <p>Một số lưu ý quan trọng khi lựa chọn dịch vụ xét nghiệm ADN:</p>
        
        <ul style="list-style-type: none; padding-left: 0;">
          <li style="margin-bottom: 10px;">
            <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FF6B6B; border-radius: 50%; margin-right: 10px;">⚠️</span>
            <strong>Giá không phụ thuộc lý do:</strong> Dù lý do đi xét nghiệm khác nhau, giá dịch vụ đều giữ ở mức cao nhất để đảm bảo chất lượng
          </li>
          <li style="margin-bottom: 10px;">
            <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FF6B6B; border-radius: 50%; margin-right: 10px;">⚠️</span>
            <strong>Giá phù hợp với thủ tục:</strong> Các xét nghiệm cho thủ tục di trú, đơn xin cứu xét, thủ tục pháp lý sẽ cao hơn so với thủ tục dân sự để đảm bảo tính chính xác và giá trị pháp lý
          </li>
          <li style="margin-bottom: 10px;">
            <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FF6B6B; border-radius: 50%; margin-right: 10px;">⚠️</span>
            <strong>Dịch vụ chuyên nghiệp:</strong> Genetix cam kết phục vụ nghiêm túc, kết quả chính xác với quy trình 1-2 ngày làm việc cho 7-8 ngày trả kết quả
          </li>
        </ul>
        
    `
  },
// ... existing code ...
  {
    id: 6,
    title: "Thủ tục xét nghiệm - Xét nghiệm ADN",
    category: "Administration",
    excerpt: "Hướng dẫn chi tiết về thủ tục xét nghiệm ADN cho mục đích dân sự, cá nhân và mục đích pháp lý tại Trung tâm công nghệ sinh học phân tử ADNchacon.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
    slug: "thu-tuc-xet-nghiem-adn",
    author: "ADNchacon",
    date: "2024-01-16",
    readTime: "7 min read",
    featured: false,
    views: 1320,
    likes: 89,
    comments: 22,
    tableOfContents: [
      { id: "1", title: "XÉT NGHIỆM ADN CHO MỤC ĐÍCH DÂN SỰ, CÁ NHÂN", level: 1 },
      { id: "2", title: "XÉT NGHIỆM ADN CHO MỤC ĐÍCH PHÁP LÝ", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <h2 id="1">I. XÉT NGHIỆM ADN CHO MỤC ĐÍCH DÂN SỰ, CÁ NHÂN</h2>
        <p>Quý khách có thể sử dụng các kết quả xét nghiệm ADN cha con để phục vụ mục đích chỉ để xác định mối quan hệ người thân của mình có cùng quan hệ huyết thống hay không và có được các quyết định riêng của mình.</p>
        
        <p>Thủ tục xét nghiệm ADN chỉ khoảng 15 phút gồm các bước sau:</p>
        
        <p><strong>Bước 1: Đăng ký xét nghiệm ADN</strong></p>
        <p>Quý khách cần lựa chọn chính xác mục đích xét nghiệm để tư vấn viên có thể tư vấn chính xác và thực hiện các thủ tục phù hợp với mục đích xét nghiệm ADN.</p>
        
        <p><strong>Bước 2: Mẫu xét nghiệm ADN</strong></p>
        <ul>
          <li>Tư vấn viên của trung tâm sẽ tư vấn các bước lấy mẫu và loại mẫu phù hợp với hoàn cảnh của quý khách.</li>
          <li>Tư vấn viên sẽ thực hiện lấy mẫu tại trung tâm hoặc hướng dẫn quý khách lấy mẫu chính xác để gửi tới trung tâm.</li>
        </ul>
        
        <p><strong>Bước 3: Trả kết quả xét nghiệm ADN</strong></p>
        <p>Để đảm bảo tính bảo mật cho khách hàng, chúng tôi chỉ trả kết quả xét nghiệm cho người đứng trên Đơn đề nghị và số điện thoại đăng ký nhận kết quả hoặc biên nhận thu tiền của LOCI hoặc trả theo yêu cầu người đứng đơn.</p>
        
        <h2 id="2">II. XÉT NGHIỆM ADN CHO MỤC ĐÍCH PHÁP LÝ</h2>
        <p>Trung tâm công nghệ sinh học phân tử ADNchacon thuộc Viện sinh học phân tử LOCI là đơn vị tiên phong trong lĩnh vực xét nghiệm huyết thống đáng tin cậy đã được công dân, các tổ chức, cơ quan trong và ngoài nước tin dùng. Trong nhiều năm qua, chúng tôi thường xuyên cung cấp dịch vụ xét nghiệm ADN cho mục đích pháp lý cho:</p>
        
        <ul>
          <li>Đại sứ quán các nước tại Việt Nam: Mục đích di dân, nhập tịch, xin visa.</li>
          <li>Tòa án nhân dân các cấp.</li>
          <li>Ủy ban Nhân dân Phường/ Xã – Quận/ Huyện: mục đích Khai Sinh</li>
          <li>Cơ quan tư pháp, Sở tư pháp các tỉnh thành.</li>
        </ul>
        
        <p>Thủ tục xét nghiệm ADN cho mục đích pháp lý chỉ khoảng từ 15 – 20 phút:</p>
        
        <p><strong>Bước 1: Thủ tục đăng ký xét nghiệm ADN</strong></p>
        <p>Tư vấn viên sẽ tư vấn đăng ký và hoàn thành hồ sơ đăng ký xét nghiệm để làm căn cứ pháp lý. Bao gồm:</p>
        <ul>
          <li>Phiếu đăng ký đề nghị xét nghiệm ADN pháp lý</li>
          <li>Các giấy tờ nhân thân như sau:
            <ul>
              <li>Đối với người mang quốc tịch Việt Nam xin vui lòng mang theo giấy tờ tùy thân bản gốc khi đến thực hiện xét nghiệm</li>
              <li>Đối với trẻ em dưới 16 tuổi chưa có Căn cước công dân hoặc hộ chiếu thì có thể mang theo giấy khai sinh có xác nhận của chính quyền, hoặc giấy chứng sinh của bệnh viện bản gốc.</li>
              <li>Đối với người nước ngoài vui lòng mang Hộ chiếu bản gốc theo để photo sao lưu.</li>
        </ul>
          </li>
        </ul>

        <p><strong>Bước 2: Lấy mẫu xét nghiệm ADN</strong></p>
        <p>Quý khách bắt buộc phải đến văn phòng chúng tôi thu mẫu trực tiếp, trong trường hợp đi lại gặp khó khăn, quý khách vui lòng gọi điện tới tổng đài 24/7 1900 8043 hoặc 098 604 3113 để được trợ giúp</p>
        
        <p><strong>Chú ý:</strong></p>
        <ul>
          <li>Khách hàng không tự thu mẫu tại nhà. Kỹ thuật viên của trung tâm sẽ thực hiện các bước thu mẫu theo đúng quy trình để đảm bảo kết quả có tính chính xác và pháp lý.</li>
          <li>Khi thực hiện lấy mẫu xét nghiệm ADN khách hàng không phải nhịn ăn uống hoặc dùng thuốc chữa bệnh.</li>
        </ul>
        
        <p><strong>Bước 3: Nhận kết quả xét nghiệm ADN</strong></p>
        <p>Để đảm bảo tính bảo mật, chúng tôi chỉ trả kết quả xét nghiệm cho người đứng trên Phiếu đề nghị và số điện thoại đăng ký nhận kết quả hoặc biên nhận thu tiền của ADNchacon hoặc trả theo yêu cầu người đứng đơn.</p>
        
        <p>Trung tâm Công nghệ Sinh học phân tử ADNchacon trả kết quả xét nghiệm ADN theo hình thức sau:</p>
        <ul>
          <li>Đến Trung tâm lấy kết quả xét nghiệm của mình</li>
          <li>Gửi chuyển phát tới địa chỉ theo yêu cầu</li>
          <li>Gửi trả kết quả xét nghiệm ADN vào email</li>
          <li>Thông báo qua điện thoại</li>
        </ul>
        
        <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
          <img src="/images/Co-so-vat-chat-Trang-thiet-bi-ADNChacon-3-1024x768.jpg" alt="Trang thiết bị xét nghiệm ADN hiện đại tại ADNchacon" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
        </div>
        <p style="font-style: italic; margin-top: 8px; font-size: 0.9em; text-align: center;"></p>
      </div>
    `
  },
  {
    id: 7,
    title: "Phân Tích Sâu Hệ Thống Booking Xét Nghiệm ADN: Từ Yêu Cầu Đến Triển Khai",
    category: "News",
    excerpt: "Phân tích chi tiết về quy trình thiết kế và triển khai hệ thống đặt lịch xét nghiệm ADN, từ yêu cầu nghiệp vụ đến trải nghiệm người dùng và quản lý trạng thái.",
    image: "/images/big-data.png",
    slug: "phan-tich-he-thong-booking-xet-nghiem-adn",
    author: "Phòng Phát Triển Sản Phẩm",
    date: "2024-01-15",
    readTime: "15 min read",
    featured: false,
    views: 1890,
    likes: 134,
    comments: 28,
    tableOfContents: [
      { id: "1", title: "Yêu Cầu và Luồng Nghiệp Vụ Cốt Lõi", level: 1 },
      { id: "2", title: "Kiến Trúc Hệ Thống và Các Quy Tắc Nghiệp Vụ", level: 1 },
      { id: "3", title: "Thiết Kế Giao Diện và Trải Nghiệm Người Dùng (UI/UX)", level: 1 },
      { id: "4", title: "Logic Chuyên Sâu - Quản Lý Mối Quan Hệ", level: 1 },
      { id: "5", title: "Luồng Thanh Toán và Quản Lý Trạng Thái Booking", level: 1 },
      { id: "6", title: "Diễn Giải Kết Quả Xét Nghiệm", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
          <img src="/images/G2101041-DNA_analysis.jpg" alt="Phân tích DNA và giải trình tự gen" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
        </div>
        
        <p class="lead-paragraph">Trong thế giới công nghệ y tế, việc xây dựng một hệ thống đặt lịch (booking) hiệu quả không chỉ là về việc chọn ngày giờ. Nó đòi hỏi sự thấu hiểu sâu sắc về quy trình nghiệp vụ, các quy tắc logic phức tạp và trải nghiệm người dùng. Bài viết này sẽ phân tích chi tiết một hệ thống booking cho dịch vụ xét nghiệm ADN, từ những yêu cầu ban đầu đến kiến trúc triển khai, luồng thanh toán và quản lý trạng thái.</p>
        
        <h2 id="1">Phần 1: Yêu Cầu và Luồng Nghiệp Vụ Cốt Lõi</h2>
        <p>Hệ thống cần quản lý hai quy trình xét nghiệm chính, mỗi quy trình phục vụ những nhu cầu khác nhau của khách hàng.</p>
        
        <p><strong>Tự Thu Mẫu và Gửi Mẫu (Chỉ áp dụng cho ADN Dân sự):</strong> Đây là luồng dành cho khách hàng muốn sự riêng tư và chủ động.</p>
        <p>Luồng thực hiện: Đăng ký đặt hẹn → Nhận bộ kit thu mẫu → Tự thu thập mẫu tại nhà → Gửi mẫu đến phòng xét nghiệm → Chờ xử lý và nhận kết quả.</p>
        
        <p><strong>Thu Mẫu Tại Cơ Sở Y Tế (CSYT):</strong> Luồng này đảm bảo tính pháp lý hoặc dành cho khách hàng muốn được hỗ trợ chuyên nghiệp.</p>
        <p>Luồng thực hiện: Đăng ký đặt hẹn → Nhân viên y tế thu mẫu (tại CSYT hoặc tại nhà) → Mẫu được xử lý tại phòng xét nghiệm → Trả kết quả.</p>
        
        <h2 id="2">Phần 2: Kiến Trúc Hệ Thống và Các Quy Tắc Nghiệp Vụ</h2>
        <p>Để hệ thống hóa các luồng trên, chúng tôi định nghĩa các thuộc tính cốt lõi và các quy tắc đi kèm.</p>
        
        <p><strong>Các thành phần chính:</strong></p>
        
        <p>Service Type (Loại dịch vụ):</p>
        <ul>
          <li>Legal (Hành Chính): Các xét nghiệm yêu cầu tính pháp lý cao (khai sinh, nhập tịch, thừa kế).</li>
          <li>Non-Legal (Dân Sự): Các xét nghiệm mang tính cá nhân, không yêu cầu thủ tục pháp lý.</li>
        </ul>
        
        <p>Collection Method (Phương thức thu thập mẫu):</p>
        <ul>
          <li>At Home: Thu mẫu tại địa chỉ của khách hàng.</li>
          <li>At Facility: Khách hàng đến trực tiếp cơ sở y tế để thu mẫu.</li>
        </ul>
        
        <p>Mediation Method (Phương thức vận chuyển/trung gian):</p>
        <ul>
          <li>Postal Delivery (Vận chuyển bưu điện): Khách hàng nhận kit và gửi mẫu qua đơn vị vận chuyển thứ ba.</li>
          <li>Staff Collection (Nhân viên thu mẫu): Nhân viên của CSYT đến tận nhà khách hàng để thu mẫu.</li>
          <li>Walk-in Service (Khách tự đến): Khách hàng tự đến CSYT để thực hiện.</li>
        </ul>
        
        <p><strong>Các quy tắc nghiệp vụ quan trọng:</strong></p>
        <ul>
          <li>Postal Delivery chỉ áp dụng cho dịch vụ Non-Legal (Dân sự).</li>
          <li>Khi chọn Postal Delivery, khách hàng bắt buộc phải thanh toán trả trước qua cổng thanh toán (VNPay) vì có sự tham gia của bên vận chuyển thứ ba.</li>
          <li>Express Service (Dịch vụ ưu tiên trả kết quả sớm) chỉ áp dụng cho Staff Collection và Walk-in Service.</li>
          <li>Đối với Postal Delivery, khách hàng có 3 ngày để gửi lại bộ kit chứa mẫu sau khi nhận. Quá hạn, lịch hẹn sẽ tự động bị hủy.</li>
        </ul>

        <h2 id="3">Phần 3: Thiết Kế Giao Diện và Trải Nghiệm Người Dùng (UI/UX)</h2>
        <p>Sau khi khách hàng chọn một dịch vụ cụ thể và nhấn "Đặt lịch", họ sẽ được chuyển đến trang Booking với một biểu mẫu thông minh, hiển thị các lựa chọn dựa trên quy tắc đã định.</p>
        
        <p><strong>Luồng lựa chọn của người dùng:</strong></p>
        <ul>
          <li>Loại dịch vụ & Tên dịch vụ: Được chọn từ trang trước.</li>
          <li>Phương thức thu thập mẫu (Collection Method):
            <ul>
              <li>Nếu chọn At Home, một ô nhập địa chỉ sẽ xuất hiện.</li>
              <li>Nếu chọn At Facility, hệ thống sẽ hiển thị địa chỉ cố định của CSYT.</li>
        </ul>
          </li>
          <li>Phương thức vận chuyển (Mediation Method): Đây là phần có logic phức tạp nhất, các lựa chọn sẽ được lọc tự động:
            <ul>
              <li>Nếu dịch vụ là Legal (Hành chính):
                <ul>
                  <li>At Home → Chỉ có lựa chọn Staff Collection.</li>
                  <li>At Facility → Chỉ có lựa chọn Walk-in Service.</li>
        </ul>
              </li>
              <li>Nếu dịch vụ là Non-Legal (Dân sự):
                <ul>
                  <li>At Home → Có 2 lựa chọn: Postal Delivery hoặc Staff Collection.</li>
                  <li>At Facility → Chỉ có lựa chọn Walk-in Service.</li>
        </ul>
              </li>
            </ul>
          </li>
          <li>Dịch vụ ưu tiên (Express Service): Một checkbox chỉ hiển thị khi Mediation Method là Staff Collection hoặc Walk-in Service.</li>
          <li>Lịch hẹn (Schedule):
            <ul>
              <li>Postal Delivery: Khách hàng chọn ngày nhận kit.</li>
              <li>Staff Collection / Walk-in Service: Khách hàng chọn ngày và khung giờ cụ thể. Hệ thống sẽ vô hiệu hóa các khung giờ đã qua trong ngày hiện tại.</li>
        </ul>
          </li>
          <li>Chi phí (Cost): Được tính toán tự động và minh bạch.
            <ul>
              <li>Service Cost: Phí dịch vụ xét nghiệm.</li>
              <li>Mediation Method Cost:
                <ul>
                  <li>Postal Delivery: 250,000 VND</li>
                  <li>Staff Collection: 500,000 VND</li>
                  <li>Walk-in Service: 0 VND</li>
                </ul>
              </li>
              <li>Express Service Cost: Phí dịch vụ nhanh.</li>
              <li>Total Cost: Tổng các chi phí trên.</li>
            </ul>
          </li>
        </ul>

        <p><strong>Lưu ý đặc biệt:</strong> Nếu khách hàng chọn Staff Collection và Express Service, Total Cost = Service Cost + Express Service Cost. Phí Mediation Method (500,000 VND) sẽ được miễn.</p>
        
        <p><strong>Thông tin người xét nghiệm (Test Subject Information):</strong></p>
        <ul>
          <li>Bao gồm các trường thông tin cá nhân cần thiết như Họ tên, Ngày sinh, Giới tính, SĐT, Email, Mối quan hệ, Loại mẫu, CCCD/CMND.</li>
          <li>Các quy tắc validation được áp dụng (người đại diện >18 tuổi, định dạng email/SĐT, không trùng mối quan hệ...).</li>
        </ul>
        
        <h2 id="4">Phần 4: Logic Chuyên Sâu - Quản Lý Mối Quan Hệ</h2>
        <p>Để đảm bảo tính chính xác, hệ thống chỉ cho phép chọn các cặp quan hệ hợp lệ tương ứng với từng loại dịch vụ xét nghiệm.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Tên Dịch Vụ</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Cặp Quan Hệ Hợp Lệ</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Ghi Chú Logic</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Paternity Testing (Cha-Con)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Father - Child</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;"></td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Maternity Testing (Mẹ-Con)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Mother - Child</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;"></td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">NIPT (Thai nhi không xâm lấn)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Father - Child</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Mẫu của Child là null (tự động)</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Sibling Testing (Anh/Chị/Em)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Sibling - Sibling</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;"></td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Grandparent Testing (Ông/Bà-Cháu)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Grandparent - Grandchild</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;"></td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">DNA Testing for Birth Registration</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Father - Child<br>Mother - Child</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Cho phép một trong hai</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">DNA Testing for Immigration</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Father - Child<br>Mother - Child<br>Sibling - Sibling<br>Grandparent - Grandchild</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Phải chọn đúng cặp</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">DNA Testing for Inheritance</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;"> Father/Mother - Child<br> Grandparent - Grandchild<br>Sibling - Sibling</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Gợi ý theo thứ tự ưu tiên</td>
          </tr>
        </table>
        
        <p>Trên giao diện, khi khách hàng chọn một dịch vụ, danh sách Mối quan hệ sẽ được lọc tự động để chỉ hiển thị các tùy chọn hợp lệ.</p>
        
        <h2 id="5">Phần 5: Luồng Thanh Toán và Quản Lý Trạng Thái Booking</h2>
        <p>Ngay khi khách hàng nhấn nút "Xác nhận đặt lịch", một booking mới sẽ được tạo với trạng thái Pending Payment, khởi động luồng thanh toán và quản lý trạng thái.</p>
        
        <p><strong>Luồng thanh toán:</strong></p>
        <ul>
          <li>Cash (Tiền mặt):
            <ul>
              <li>Khách hàng xác nhận thông tin.</li>
              <li>Hệ thống yêu cầu ký tên điện tử.</li>
              <li>Thông báo đặt lịch thành công, kèm theo mã thanh toán (paymentCode) để cung cấp cho nhân viên khi thu mẫu.</li>
        </ul>
          </li>
          <li>QR Code (VNPay):
            <ul>
              <li>Khách hàng xác nhận thông tin.</li>
              <li>Hệ thống hiển thị mã QR kèm paymentCode (nội dung chuyển khoản). Khách hàng có 15 phút để thanh toán.</li>
              <li>Nếu quá 15 phút, mã QR hết hạn. Nếu quá 30 phút mà chưa thanh toán, booking sẽ bị hủy.</li>
              <li>Sau khi hệ thống nhận được thanh toán thành công, khách hàng sẽ ký tên điện tử.</li>
              <li>Thông báo đặt lịch thành công.</li>
        </ul>
          </li>
        </ul>
        

        <p><strong>Vòng đời trạng thái của một Booking (Payment Success):</strong></p>
        <p>Awaiting Confirmation → Pending Payment (Chờ thanh toán) → Booking Confirmed (Đã xác nhận & phân công) → Awaiting Sample (Chờ lấy mẫu) → In Progress (Đang xử lý) → Ready (Sẵn sàng trả kết quả) → Completed (Hoàn thành).</p>

        
        <p><strong>Luồng trạng thái trên trang "My Booking" của khách hàng:</strong></p>
        <ul>
          <li>Đối với vận chuyển bưu điện: Đã xác nhận → Đang vận chuyển kit → Đã giao kit → Chờ nhận mẫu → Đang xét nghiệm → Trả kết quả.</li>
          <li>Đối với thu mẫu bởi CSYT: Đã xác nhận → Chờ thu mẫu → Đang xét nghiệm → Trả kết quả.</li>
        </ul>
        

        <h2 id="6">Phần 6: Diễn Giải Kết Quả Xét Nghiệm</h2>
        <p>Cuối cùng, kết quả xét nghiệm được kết luận dựa trên tỷ lệ trùng khớp ADN (Matching Percentage).</p>

        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Mối Quan Hệ</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">MATCH (Có quan hệ)</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">INCONCLUSIVE (Không xác định)</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">NOT MATCH (Không quan hệ)</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Cha – Con</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~50%</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">-</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~0–1%</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Mẹ – Con</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~50%</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">-</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~0–1%</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Anh/Chị/Em ruột</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~50%</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~10–25% (họ hàng gần)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~0–1%</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Ông/Bà – Cháu</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~25%</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~10–15% (họ hàng xa)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~0–5%</td>
          </tr>
        </table>
        
        <h3>Kết Luận</h3>
        <p>Việc phân tích và thiết kế một hệ thống booking cho dịch vụ chuyên sâu như xét nghiệm ADN là một bài toán phức tạp, đòi hỏi sự kết hợp nhuần nhuyễn giữa logic nghiệp vụ, công nghệ và trải nghiệm người dùng. Bằng cách định nghĩa rõ ràng các quy tắc, phân luồng thông minh và minh bạch hóa thông tin, chúng ta có thể xây dựng một nền tảng không chỉ mạnh mẽ về mặt kỹ thuật mà còn thân thiện và đáng tin cậy với người dùng. Mô hình phân tích này chính là bản thiết kế vững chắc cho giai đoạn phát triển và triển khai sản phẩm.</p>
      </div>
    `
  },
  {
    id: 8,
    title: "THÔNG TIN CHI TIẾT VỀ XÉT NGHIỆM ADN PHÁP LÝ TẠI DNA TESTING",
    category: "Legal",
    excerpt: "Ngày nay, bản kết quả của xét nghiệm ADN huyết thống không chỉ được sử dụng để xác định mối quan hệ huyết thống giữa cha và con trong gia đình, cũng như trong các thủ tục hành chính đăng ký khai sinh ở cấp xã/phường, mà còn được sử dụng làm bằng chứng trong các tranh chấp về quyền nuôi con, quyền cấp dưỡng và quyền thừa kế tại tòa án nhân dân các cấp.",
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200&h=800&fit=crop",

    slug: "thong-tin-chi-tiet-xet-nghiem-adn-phap-ly-dna-testing",
    author: "DNA Testing",

    date: "2024-01-12",
    readTime: "9 min read",
    featured: false,
    views: 1150,
    likes: 78,
    comments: 19,
    tableOfContents: [
      { id: "1", title: "Mục đích của xét nghiệm ADN pháp lý", level: 1 },
      { id: "2", title: "Quy trình xét nghiệm ADN pháp lý", level: 1 },
      { id: "3", title: "Cơ sở khoa học", level: 1 },
      { id: "4", title: "Lý do nên chọn DNA – Testing", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">Ngày nay, bản kết quả của xét nghiệm ADN huyết thống không chỉ được sử dụng để xác định mối quan hệ huyết thống giữa cha và con trong gia đình, cũng như trong các thủ tục hành chính đăng ký khai sinh ở cấp xã/phường, mà còn được sử dụng làm bằng chứng trong các tranh chấp về quyền nuôi con, quyền cấp dưỡng và quyền thừa kế tại tòa án nhân dân các cấp. Hãy cùng DNA – Testing tìm hiểu chi tiết về thông tin xét nghiệm ADN pháp lý trong bài viết này.</p>
        
        <h2 id="1">Mục đích của xét nghiệm ADN pháp lý</h2>
        <ul>
          <li>Quá trình nhập quốc tịch và định cư.</li>
          <li>Thủ tục làm thị thực, cấp VISA.</li>
          <li>Thực hiện xét nghiệm ADN để nộp hồ sơ bảo lãnh.</li>
          <li>Các thủ tục pháp lý liên quan đến xét nghiệm ADN nhằm hoàn thiện các yêu cầu của Nhà nước.</li>
          <li>Cha nhận con và làm lại giấy khai sinh.</li>
          <li>Làm giấy khai sinh cho con trong trường hợp quá hạn.</li>
          <li>Thực hiện xét nghiệm ADN theo yêu cầu của tòa án.</li>
        </ul>
        
        <h2 id="2">Quy trình xét nghiệm ADN pháp lý</h2>
        <p><strong>Lưu ý:</strong></p>
        <p>Thủ tục có tính pháp lý: Trong trường hợp xét nghiệm ADN mang tính chất pháp lý, khách hàng không được tự thu mẫu và gửi đi xét nghiệm. Việc thu mẫu sẽ được thực hiện bởi nhân viên của Viện Công nghệ ADN và Phân tích Di truyền.</p>
        
        <p><strong>Yêu cầu đối với người tham gia xét nghiệm:</strong></p>
        <ul>
          <li>Xuất trình chứng minh nhân dân, thẻ căn cước hoặc hộ chiếu của mỗi người.</li>
          <li>Xuất trình giấy khai sinh của người con hoặc giấy chứng sinh.</li>
          <li>Điền đầy đủ thông tin trong đơn xin xét nghiệm.</li>
          <li>Chứng kiến quy trình thu mẫu và quá trình niêm phong phong bì đựng mẫu xét nghiệm.</li>
        </ul>
        
        <p><strong>Yêu cầu với người thu mẫu xét nghiệm:</strong></p>
        <ul>
          <li>Kiểm tra và sao chép lưu giữ các giấy tờ tùy thân (CMND, hộ chiếu, giấy khai sinh, giấy chứng sinh…) của người được xét nghiệm.</li>
          <li>Hướng dẫn khách hàng điền đầy đủ thông tin vào đơn xin xét nghiệm. Kiểm tra và xác nhận thông tin chính xác.</li>
          <li>Chụp ảnh lưu hồ sơ.</li>
          <li>Thu mẫu, ghi rõ tên từng người trên phong bì đựng mẫu xét nghiệm tương ứng, niêm phong phong bì đựng mẫu.</li>
        </ul>
        
        <p>Tất cả thông tin về khách hàng và quá trình thu mẫu tại Viện Công nghệ ADN và Phân tích Di truyền sẽ được lưu giữ và bảo mật tuyệt đối.</p>

        <h2 id="3">Cơ sở khoa học</h2>
        <p>Hầu hết DNA của con người rất tương đồng (99.7%) giữa các cá nhân khác nhau. Tuy nhiên, chỉ cần 0.3% sự khác biệt trong bộ gen để phân biệt mỗi người.</p>
        
        <p>Phần nhỏ này chứa những đặc điểm riêng biệt của DNA, được gọi là các marker di truyền, có thể được sử dụng trong các xét nghiệm huyết thống để xác định cha của một đứa trẻ. Mỗi em bé thừa hưởng một nửa DNA từ mẹ và một nửa từ cha, điều này có nghĩa là một phần số marker di truyền của người con sẽ tương ứng với một phần của người cha. Xét nghiệm ADN pháp lý dựa trên những dấu vết di truyền này.</p>
        
        <p>Số lượng marker di truyền được sử dụng trong xét nghiệm càng nhiều, khả năng xác định chính xác mối quan hệ huyết thống cha con càng cao. Do đó, các xét nghiệm ADN pháp lý sử dụng nhiều marker hơn sẽ có độ tin cậy cao hơn.</p>
        
        <p><strong>Đối tượng xét nghiệm ADN pháp lý:</strong></p>
        <ul>
          <li>Cha-Con | Mẹ-Con</li>
          <li>Quan hệ Ông-Cháu trai, Chú (Bác trai)-Cháu Trai, Anh-Em Trai…</li>
          <li>Quan hệ Bà Ngoại-Cháu, Anh chị em Cùng mẹ, Cháu-Chị em gái của mẹ…</li>
        </ul>

        <h2 id="4">Lý do nên chọn DNA – Testing</h2>
        <p>Trung tâm xét nghiệm ADN – DNA Testing có khả năng thực hiện xét nghiệm ADN từ nhiều loại mẫu phẩm khác nhau như: máu, bàn chải đánh răng, móng, tóc, cuống rốn… với độ chính xác cao nhờ vào những ưu điểm vượt trội sau đây:</p>
        
        <ul>
          <li><strong>Trang thiết bị hiện đại:</strong> Phòng xét nghiệm tại Trung tâm xét nghiệm ADN – DNA Testing được đầu tư hơn 2 triệu USD, tuân thủ tiêu chuẩn ISO 15189:2012 và 9001:2015 với trang thiết bị và công nghệ hiện đại, bao gồm các bộ KIT chuyên dùng cho xét nghiệm ADN hình sự như Kit HDPlex, PowerPlex Fusion, Kit Argus X-12, KIT PowerPlex Y23 của Promega – Mỹ, Qiagen – Đức.</li>
          
          <li><strong>Đội ngũ chuyên gia giàu kinh nghiệm:</strong> Tại Trung tâm xét nghiệm ADN – DNA Testing, các chuyên gia thực hiện xét nghiệm ADN đều là những chuyên gia hàng đầu trong lĩnh vực phân tích di truyền. Trong đó, đại tá Hà Quốc Khanh, với hơn 40 năm kinh nghiệm và nhiều chức vụ cao trong ngành, là người đứng đầu giám sát quy trình xét nghiệm.</li>
          
          <li><strong>Thủ tục nhanh chóng:</strong> Các xét nghiệm ADN tại Trung tâm xét nghiệm ADN – DNA Testing được thực hiện với thủ tục ngắn gọn và đơn giản. Đặc biệt, Trung tâm đã mở rộng với hơn 40 điểm thu mẫu và hỗ trợ lấy mẫu tại nhà ở khắp các tỉnh thành trên cả nước.</li>
          
          <li><strong>Trả kết quả trong thời gian ngắn:</strong> Khách hàng có thể nhận được kết quả xét nghiệm ADN từ Trung tâm xét nghiệm ADN – DNA Testing chỉ trong vòng 4 giờ, phụ thuộc vào loại mẫu phẩm và gói dịch vụ mà họ chọn.</li>
          
          <li><strong>Kết quả chính xác:</strong> Với máy móc trang thiết bị tiên tiến và đội ngũ chuyên gia giàu kiến thức kinh nghiệm, kết quả xét nghiệm ADN từ Trung tâm xét nghiệm ADN – DNA Testing đạt độ chính xác cao lên đến khoảng 99.99999998%.</li>
          
          <li><strong>Bảo mật thông tin khách hàng:</strong> Mọi thông tin của khách hàng được cam kết bảo mật tuyệt đối và Trung tâm xét nghiệm ADN – DNA Testing cam kết đảm bảo trách nhiệm với chính sách này.</li>
        </ul>
      </div>
    `
  },
  {
    id: 9,
    title: "AI thiết kế chuỗi ADN, mở ra kỷ nguyên mới công nghệ sinh học",
    category: "Knowledge",
    excerpt: "Trí tuệ nhân tạo đang cách mạng hóa lĩnh vực sinh học bằng cách thiết kế các chuỗi ADN mới, mở ra kỷ nguyên mới cho công nghệ sinh học và y học.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",

    slug: "ai-thiet-ke-chuoi-adn-ky-nguyen-moi-cong-nghe-sinh-hoc",

    author: "Dr. Le Minh Hai",
    date: "2024-01-10",
    readTime: "11 min read",
    featured: false,
    views: 1420,
    likes: 95,
    comments: 26,
    tableOfContents: [
      { id: "1", title: "AI thiết kế chuỗi ADN: Từ mô phỏng sang sáng tạo", level: 1 },
      { id: "2", title: "Cơ hội lớn, thách thức cũng không nhỏ", level: 1 },
      { id: "3", title: "Tương lai thiết kế sinh học có thể giống như lập trình phần mềm", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">AI đang góp mặt vào lĩnh vực sinh học bằng cách thiết kế các chuỗi ADN mới. Công nghệ này giúp tăng tốc nghiên cứu protein, vắc xin, vi sinh vật và nhiều ứng dụng y sinh tiềm năng khác. Một thời, thiết kế sinh học là công việc của các phòng thí nghiệm sinh học phân tử phức tạp. Giờ đây, trí tuệ nhân tạo (AI) mở ra một lĩnh vực mới: thiết kế sinh học bằng máy tính.</p>
        
        <p>Thay vì mất nhiều năm thử nghiệm sinh học truyền thống, các nhà khoa học hiện có thể "lập trình" sinh vật giống như viết phần mềm, và AI chính là công cụ tăng tốc đột phá đó.</p>
        
        <h2 id="1">1. AI thiết kế chuỗi ADN: Từ mô phỏng sang sáng tạo</h2>
        <p>Theo tìm hiểu của Tuổi Trẻ Online, việc giải mã ADN từng là kỳ tích lớn trong sinh học, nay chỉ là bước đầu. Với sự trợ giúp của AI, quá trình đã chuyển từ "đọc" sang "viết" mã di truyền. Các mô hình học sâu (deep learning) được huấn luyện trên hàng triệu trình tự gene, có khả năng nhận biết cấu trúc, chức năng và thậm chí dự đoán cách gene hoạt động trong tế bào.</p>
        
        <p>Một ví dụ điển hình là công cụ như ProGen, mô hình ngôn ngữ gene hoạt động tương tự ChatGPT, nhưng thay vì sinh ra văn bản, nó tạo ra các chuỗi protein mới. Các AI này không chỉ "sáng tác" gene, mà còn đánh giá khả năng gấp cuộn, hoạt động sinh học và tính ứng dụng của sản phẩm.</p>
        
        <p>Điều quan trọng là AI không thay thế nhà khoa học, mà giúp họ rút ngắn đáng kể thời gian thử nghiệm và tối ưu. Một chuỗi ADN có thể có hàng tỉ tổ hợp khác nhau, điều gần như bất khả thi để kiểm tra thủ công. AI giúp chọn ra những tổ hợp khả thi nhất, nhanh và chính xác hơn nhiều lần.</p>
        
        <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
          <img src="/images/AI-thiet-ke-chuoi-ADN.webp" alt="AI thiết kế chuỗi ADN" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
        </div>
        
        <h2 id="2">2. Cơ hội lớn, thách thức cũng không nhỏ</h2>
        <p>Nhờ AI, các công ty công nghệ sinh học đang chế tạo vi khuẩn có khả năng phân hủy nhựa, cây trồng chịu hạn tốt hơn, hay thậm chí vắc xin cá nhân hóa cho từng người.</p>
        
        <p>Trong y học, AI viết mã cho các enzyme phân giải khối u, kháng thể có độ đặc hiệu cao, hay phân tử sinh học dùng để chẩn đoán sớm ung thư.</p>
        
        <p>Tuy nhiên, nhiều chuyên gia cảnh báo rằng công nghệ này cũng tiềm ẩn nguy cơ bị lạm dụng. AI có thể được dùng để thiết kế vi rút hoặc tác nhân sinh học nguy hiểm nếu rơi vào tay kẻ xấu. Chính vì vậy đi cùng với tốc độ phát triển là nhu cầu cấp thiết về kiểm soát đạo đức, minh bạch nguồn dữ liệu huấn luyện và giám sát an toàn sinh học.</p>
        
        <p>Ngoài ra, công nghệ này vẫn còn phụ thuộc vào dữ liệu huấn luyện, nghĩa là AI chỉ mạnh nếu có đủ dữ liệu sinh học chuẩn xác, đa dạng. Với những lĩnh vực còn chưa được nghiên cứu đầy đủ, AI vẫn có thể tạo ra "thiết kế lỗi", hoặc không phù hợp sinh học trong thực tế.</p>
        
        <p>Cuối cùng, cũng cần cân nhắc đến vấn đề bản quyền gene: Khi AI tạo ra một chuỗi ADN chưa từng có, ai là người sở hữu nó? Nhà nghiên cứu, công ty, hay mô hình AI?</p>
        
        <h2 id="3">3. Tương lai thiết kế sinh học có thể giống như lập trình phần mềm</h2>
        <p>Chúng ta đang tiến vào kỷ nguyên nơi sinh vật không chỉ được phát hiện mà còn được "viết nên" từ đầu bởi máy móc. Giống như lập trình viên viết mã cho ứng dụng, nhà sinh học trong tương lai có thể thiết kế vi sinh vật hoặc protein đặc biệt bằng cách mô tả yêu cầu, để AI tính toán phần còn lại.</p>
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
                          relatedArticle.category === 'Legal' ? 'bg-orange-500' :
                          'bg-yellow-500'
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