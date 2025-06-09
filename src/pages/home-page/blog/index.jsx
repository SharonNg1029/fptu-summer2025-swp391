import React from "react";
import { Typography, Card, List, Divider } from "antd";
const { Title, Paragraph } = Typography;

const blogPosts = [
  {
    title: "How to Collect DNA Samples at Home",
    summary:
      "Learn the proper way to collect cheek swab samples for accurate DNA testing results.",
  },
  {
    title: "Civil vs. Administrative DNA Testing",
    summary:
      "Understand the key differences between civil and administrative DNA testing services.",
  },
  {
    title: "Legal Process for DNA Testing in Vietnam",
    summary:
      "A step-by-step guide to using DNA test results in legal and administrative procedures.",
  },
];

const Blog = () => (
  <div className="blog-container">
    <Typography>
      <Title level={2} className="blog-title">
        DNA Knowledge & Blog
      </Title>
      <Paragraph className="blog-intro">
        Explore articles about DNA testing, sample collection, legal procedures,
        and real-life experiences shared by our community.
      </Paragraph>
      <Divider />
      <List
        className="blog-list"
        grid={{ gutter: 16, column: 1 }}
        dataSource={blogPosts}
        renderItem={(item) => (
          <List.Item className="blog-list-item">
            <Card title={item.title} className="blog-card">
              <Paragraph>{item.summary}</Paragraph>
            </Card>
          </List.Item>
        )}
      />
    </Typography>
  </div>
);

export default Blog;
