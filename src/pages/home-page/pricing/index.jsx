import React from "react";
import { Typography, Table, Divider } from "antd";

const { Title, Paragraph } = Typography;

const columns = [
  {
    title: "Service Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Price (VND)",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Estimated Time",
    dataIndex: "time",
    key: "time",
  },
];

const data = [
  {
    key: "1",
    type: "Civil DNA Testing",
    description: "For personal use, family relationship confirmation.",
    price: "2,000,000",
    time: "3–5 working days",
  },
  {
    key: "2",
    type: "Administrative DNA Testing",
    description: "For legal documents, birth registration, immigration.",
    price: "3,500,000",
    time: "5–7 working days",
  },
];

const Pricing = () => (
  <div className="pricing-container">
    <Typography>
      <Title level={2} className="pricing-title">
        DNA Testing Pricing
      </Title>
      <Paragraph className="pricing-intro">
        Below is the pricing table for our DNA testing services. All prices
        include consultation and result delivery.
      </Paragraph>
      <Divider />
      <Table
        className="pricing-table"
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
      />
    </Typography>
  </div>
);

export default Pricing;
