import React from "react";
import { Typography, List, Divider } from "antd";

const { Title, Paragraph } = Typography;

const Guide = () => (
  <div className="guide-container">
    <Typography>
      <Title level={2} className="guide-title">
        DNA Testing Service Guide
      </Title>
      <Paragraph className="guide-intro">
        Welcome to our DNA Testing Service Platform. This guide will help you
        understand how to explore, register, and use our services effectively.
      </Paragraph>

      <Divider />

      <Title level={3} className="guide-section-title">
        For Guests (Unregistered Users)
      </Title>
      <List
        className="guide-list"
        dataSource={[
          "Explore our homepage: Learn about our medical facility and DNA testing services.",
          "View service details: Understand the differences between Civil and Administrative DNA Testing, including procedures, timelines, and pricing.",
          "Read blog articles: Gain knowledge and insights about DNA, sample collection, and legal procedures.",
          "View customer reviews: See feedback from other clients.",
          "Register/Login: Create an account to access full features and book services.",
        ]}
        renderItem={(item) => (
          <List.Item className="guide-list-item">{item}</List.Item>
        )}
      />

      <Divider />

      <Title level={3} className="guide-section-title">
        For Customers (Registered Users)
      </Title>
      <Paragraph className="guide-subsection-title">
        Access Public Content
      </Paragraph>
      <List
        className="guide-list"
        dataSource={[
          "Browse homepage, promotions, and service pricing.",
          "Read, like, and comment on blog posts.",
          "Submit your own articles (subject to admin approval).",
        ]}
        renderItem={(item) => (
          <List.Item className="guide-list-item">{item}</List.Item>
        )}
      />

      <Paragraph className="guide-subsection-title">
        Book DNA Testing Services
      </Paragraph>
      <Paragraph className="guide-subsection-title">
        1. Self-Collection at Home
      </Paragraph>
      <List
        className="guide-list"
        dataSource={[
          "Choose a service and confirm your address.",
          "A QR code for payment is generated (valid for 15 minutes).",
          "If unpaid, the order is automatically canceled.",
          "After payment, a sample collection kit is sent to your address.",
        ]}
        renderItem={(item) => (
          <List.Item className="guide-list-item">{item}</List.Item>
        )}
      />

      <Paragraph className="guide-subsection-title">
        2. Sample Collection by Medical Staff
      </Paragraph>
      <List
        className="guide-list"
        dataSource={[
          "Book an appointment (at home or at our facility).",
          "Pay via QR code within 15 minutes to confirm the booking.",
          "If unpaid, the appointment is canceled automatically.",
          "Payment options: at home, at the facility, or online.",
          "If paying at the facility, staff will assist with scheduling and kit delivery.",
          "If kits are out of stock, you’ll be notified when available.",
        ]}
        renderItem={(item) => (
          <List.Item className="guide-list-item">{item}</List.Item>
        )}
      />

      <Paragraph className="guide-subsection-title">
        Payment & QR Code
      </Paragraph>
      <List
        className="guide-list"
        dataSource={[
          "QR codes are compatible with Momo, VNPay, and banking apps.",
          "Each QR includes your order ID and exact amount.",
          "After successful payment:",
          "You receive a confirmation email.",
          "Order status updates to: Paid – Awaiting Sample.",
          "You can download an electronic invoice.",
        ]}
        renderItem={(item) => (
          <List.Item className="guide-list-item">{item}</List.Item>
        )}
      />

      <Divider />

      <Title level={3} className="guide-section-title">
        Track Your Testing Process
      </Title>
      <Paragraph className="guide-subsection-title">
        Self-Sample Submission (Civil DNA Testing)
      </Paragraph>
      <List
        className="guide-list"
        dataSource={[
          "Book a service.",
          "Receive a sample kit (if available).",
          "Collect your sample (e.g., cheek swab).",
          "Send it to our facility (via post or in person).",
          "Lab processes the sample and records results.",
          "Results are sent via email and viewable online.",
        ]}
        renderItem={(item) => (
          <List.Item className="guide-list-item">{item}</List.Item>
        )}
      />

      <Paragraph className="guide-subsection-title">
        Testing at Medical Facility
      </Paragraph>
      <List
        className="guide-list"
        dataSource={[
          "Book an appointment.",
          "Staff collects the sample and updates your order.",
          "Lab processes the sample.",
          "Results are delivered via email and online.",
        ]}
        renderItem={(item) => (
          <List.Item className="guide-list-item">{item}</List.Item>
        )}
      />

      <Paragraph className="guide-note">
        Order Timeline Status: Pending Payment → Paid → Awaiting Sample → In
        Testing → Completed
      </Paragraph>

      <Divider />

      <Title level={3} className="guide-section-title">
        View Results
      </Title>
      <List
        className="guide-list"
        dataSource={[
          "Access your test report online.",
          "Download results in PDF format.",
        ]}
        renderItem={(item) => (
          <List.Item className="guide-list-item">{item}</List.Item>
        )}
      />

      <Divider />

      <Title level={3} className="guide-section-title">
        Manage Your Profile
      </Title>
      <List
        className="guide-list"
        dataSource={[
          "Update personal and test-related information.",
          "View test history and invoices.",
          "Change your password.",
        ]}
        renderItem={(item) => (
          <List.Item className="guide-list-item">{item}</List.Item>
        )}
      />

      <Divider />

      <Title level={3} className="guide-section-title">
        Feedback & Support
      </Title>
      <List
        className="guide-list"
        dataSource={[
          "Rate services (1–5 stars) and leave comments.",
          "Edit or delete feedback within a limited time.",
          "Contact support via ticket or live chat (optional).",
          "Browse FAQs and user guides.",
        ]}
        renderItem={(item) => (
          <List.Item className="guide-list-item">{item}</List.Item>
        )}
      />

      <Divider />

      <Title level={3} className="guide-section-title">
        Security
      </Title>
      <List
        className="guide-list"
        dataSource={["Manual logout or automatic logout after inactivity."]}
        renderItem={(item) => (
          <List.Item className="guide-list-item">{item}</List.Item>
        )}
      />
    </Typography>
  </div>
);

export default Guide;
