import React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Typography,
  Tag,
  Modal,
  Form,
  Tooltip,
  Popconfirm,
  Card,
  Select,
  Row,
  Col,
  Statistic,
  DatePicker,
  Upload,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  ReadOutlined,
  LikeOutlined,
  CommentOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ContentManagement = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch blogs data from API
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/blogs");
      console.log("Blogs response:", response);

      const blogsData = response.data?.data || response.data || [];
      setBlogs(blogsData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error(
        "Failed to fetch blogs: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle blog edit
  const handleEdit = (record) => {
    setEditingBlog(record);
    form.setFieldsValue({
      title: record.title,
      content: record.content,
      excerpt: record.excerpt,
      author: record.author,
      status: record.status,
      category: record.category,
      tags: record.tags,
    });
    setIsModalVisible(true);
  };

  // Handle blog view
  const handleView = (record) => {
    setSelectedBlog(record);
    setIsViewModalVisible(true);
  };

  // Handle blog delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/blogs/${id}`);
      toast.success("Blog post deleted successfully");
      fetchBlogs(); // Refresh the list
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error(
        "Failed to delete blog: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Handle form submission
  const handleFormSubmit = async (values) => {
    try {
      const blogData = {
        title: values.title,
        content: values.content,
        excerpt: values.excerpt,
        author: values.author,
        status: values.status,
        category: values.category,
        tags: values.tags,
      };

      if (editingBlog) {
        // Update existing blog
        await api.put(`/admin/blogs/${editingBlog.id}`, blogData);
        toast.success("Blog post updated successfully");
      } else {
        // Create new blog
        await api.post("/admin/blogs", blogData);
        toast.success("Blog post created successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingBlog(null);
      fetchBlogs(); // Refresh the list
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error(
        "Failed to save blog: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Filter blogs based on search text, date range, and status
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchText.toLowerCase()) ||
      (blog.tags &&
        blog.tags.some((tag) =>
          tag.toLowerCase().includes(searchText.toLowerCase())
        ));

    const matchesStatus = statusFilter === "" || blog.status === statusFilter;

    const matchesDateRange =
      !dateRange ||
      !dateRange[0] ||
      !dateRange[1] ||
      (new Date(blog.createdAt) >= dateRange[0].startOf("day").toDate() &&
        new Date(blog.createdAt) <= dateRange[1].endOf("day").toDate());

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Calculate statistics
  const stats = {
    total: blogs.length,
    published: blogs.filter((blog) => blog.status === "Published").length,
    draft: blogs.filter((blog) => blog.status === "Draft").length,
    scheduled: blogs.filter((blog) => blog.status === "Scheduled").length,
    totalViews: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0),
    totalLikes: blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0),
    totalComments: blogs.reduce((sum, blog) => sum + (blog.comments || 0), 0),
  };

  // Blog table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <Space>
          <FileTextOutlined />
          <Text strong>{text}</Text>
        </Space>
      ),
      sorter: (a, b) => (a.title || "").localeCompare(b.title || ""),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tag color="blue">{category || "Uncategorized"}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue";
        if (status === "Published") color = "green";
        if (status === "Draft") color = "orange";
        if (status === "Scheduled") color = "purple";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Space>
          <CalendarOutlined />
          {date ? new Date(date).toLocaleDateString() : "N/A"}
        </Space>
      ),
      sorter: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
    },
    {
      title: "Stats",
      key: "stats",
      render: (_, record) => (
        <Space>
          <Tooltip title="Views">
            <Space>
              <ReadOutlined />
              {record.views || 0}
            </Space>
          </Tooltip>
          <Tooltip title="Likes">
            <Space>
              <LikeOutlined />
              {record.likes || 0}
            </Space>
          </Tooltip>
          <Tooltip title="Comments">
            <Space>
              <CommentOutlined />
              {record.comments || 0}
            </Space>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              type="default"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleView(record)}
            />
          </Tooltip>

          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          <Popconfirm
            title="Are you sure you want to delete this blog post?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}>
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}>
        <Title level={2}>Blog Posts</Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchBlogs}
            loading={loading}>
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => {
              setEditingBlog(null);
              form.resetFields();
              setIsModalVisible(true);
            }}>
            Create New Post
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Posts"
              value={stats.total}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Published"
              value={stats.published}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Views"
              value={stats.totalViews}
              prefix={<ReadOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Engagement"
              value={stats.totalLikes + stats.totalComments}
              prefix={<LikeOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={8}>
            <Input
              placeholder="Search by title, content, author..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={6} lg={4}>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              allowClear>
              <Option value="Published">Published</Option>
              <Option value="Draft">Draft</Option>
              <Option value="Scheduled">Scheduled</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6} lg={8}>
            <RangePicker
              style={{ width: "100%" }}
              onChange={(dates) => setDateRange(dates)}
              placeholder={["Start Date", "End Date"]}
            />
          </Col>
        </Row>
      </Card>

      {/* Blog Posts Table */}
      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredBlogs}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} posts`,
          }}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <p style={{ margin: 0 }}>
                  <strong>Excerpt:</strong>{" "}
                  {record.excerpt || "No excerpt available"}
                </p>
                <p style={{ margin: "8px 0 0 0" }}>
                  <strong>Tags:</strong>{" "}
                  {record.tags && record.tags.length > 0 ? (
                    record.tags.map((tag) => (
                      <Tag key={tag} color="blue">
                        {tag}
                      </Tag>
                    ))
                  ) : (
                    <Text type="secondary">No tags</Text>
                  )}
                </p>
              </div>
            ),
          }}
        />
      </Card>

      {/* Create/Edit Blog Modal */}
      <Modal
        title={editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingBlog(null);
        }}
        footer={null}
        width={800}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{ status: "Draft" }}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter blog title" }]}>
            <Input placeholder="Blog Title" />
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="Excerpt"
            rules={[{ required: true, message: "Please enter blog excerpt" }]}>
            <TextArea rows={2} placeholder="Short excerpt for blog preview" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Please enter blog content" }]}>
            <TextArea rows={10} placeholder="Blog Content" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="author"
                label="Author"
                rules={[
                  { required: true, message: "Please enter author name" },
                ]}>
                <Input placeholder="Author Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Please enter category" }]}>
                <Select placeholder="Select or enter category" mode="combobox">
                  <Option value="Education">Education</Option>
                  <Option value="Information">Information</Option>
                  <Option value="How-to">How-to</Option>
                  <Option value="Ethics">Ethics</Option>
                  <Option value="News">News</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="tags"
            label="Tags"
            rules={[
              { required: true, message: "Please add at least one tag" },
            ]}>
            <Select
              mode="tags"
              placeholder="Add tags"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}>
            <Select placeholder="Select status">
              <Option value="Draft">Draft</Option>
              <Option value="Published">Published</Option>
              <Option value="Scheduled">Scheduled</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Featured Image">
            <Upload listType="picture-card" maxCount={1}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large">
                {editingBlog ? "Update Post" : "Create Post"}
              </Button>
              <Button
                size="large"
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                  setEditingBlog(null);
                }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Blog Modal */}
      <Modal
        title="Blog Post Preview"
        open={isViewModalVisible}
        onCancel={() => {
          setIsViewModalVisible(false);
          setSelectedBlog(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsViewModalVisible(false);
              setSelectedBlog(null);
            }}>
            Close
          </Button>,
        ]}
        width={800}>
        {selectedBlog && (
          <div>
            <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
              {selectedBlog.title}
            </h1>

            <div style={{ marginBottom: "16px" }}>
              <Space>
                <UserOutlined /> {selectedBlog.author}
              </Space>
              <span style={{ margin: "0 8px" }}>|</span>
              <Space>
                <CalendarOutlined />{" "}
                {selectedBlog.createdAt
                  ? new Date(selectedBlog.createdAt).toLocaleDateString()
                  : "N/A"}
              </Space>
              <span style={{ margin: "0 8px" }}>|</span>
              <Tag color="blue">{selectedBlog.category || "Uncategorized"}</Tag>
            </div>

            <div style={{ marginBottom: "16px" }}>
              {selectedBlog.tags && selectedBlog.tags.length > 0 ? (
                selectedBlog.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)
              ) : (
                <Text type="secondary">No tags</Text>
              )}
            </div>

            <div style={{ marginBottom: "24px" }}>
              <img
                src={
                  selectedBlog.featuredImage ||
                  "https://via.placeholder.com/800x400"
                }
                alt={selectedBlog.title}
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div style={{ whiteSpace: "pre-line", marginBottom: "24px" }}>
              {selectedBlog.content}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Space>
                <Button icon={<ReadOutlined />}>
                  {selectedBlog.views || 0} Views
                </Button>
                <Button icon={<LikeOutlined />}>
                  {selectedBlog.likes || 0} Likes
                </Button>
                <Button icon={<CommentOutlined />}>
                  {selectedBlog.comments || 0} Comments
                </Button>
              </Space>
              <Space>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setIsViewModalVisible(false);
                    handleEdit(selectedBlog);
                  }}>
                  Edit
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContentManagement;
