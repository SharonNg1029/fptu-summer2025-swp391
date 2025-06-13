import React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Table,
  Card,
  Row,
  Col,
  Tag,
  Space,
  Input,
  Select,
  Button,
  Modal,
  Form,
  message,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CustomerFeedbackPage = () => {
  const [loading, setLoading] = useState(true);
  const [feedbackList, setFeedbackList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);

  const [form] = Form.useForm();

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/manager/feedback"); // Example API endpoint
      setFeedbackList(response.data?.data || response.data || []);
    } catch (error) {
      message.error(
        "Failed to fetch customer feedback: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error fetching customer feedback:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleEdit = (record) => {
    setEditingFeedback(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleUpdateFeedback = async (values) => {
    setLoading(true);
    try {
      await api.patch(`/manager/feedback/${editingFeedback.id}`, values); // Example API endpoint for updating feedback
      message.success("Feedback updated successfully!");
      setIsModalVisible(false);
      setEditingFeedback(null);
      form.resetFields();
      fetchFeedback();
    } catch (error) {
      message.error(
        "Failed to update feedback: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error updating feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedback = feedbackList.filter((feedback) => {
    const matchesSearch =
      feedback.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
      feedback.subject?.toLowerCase().includes(searchText.toLowerCase()) ||
      feedback.message?.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === "" || feedback.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) =>
        (a.customerName || "").localeCompare(b.customerName || ""),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (text) => (
        <Typography.Paragraph ellipsis={{ rows: 2 }}>
          {text}
        </Typography.Paragraph>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
      sorter: (a, b) =>
        new Date(a.date || "1970-01-01") - new Date(b.date || "1970-01-01"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let icon = <ExclamationCircleOutlined />;
        if (status === "Pending") {
          color = "orange";
          icon = <LoadingOutlined />;
        }
        if (status === "Resolved") {
          color = "green";
          icon = <CheckCircleOutlined />;
        }
        return (
          <Tag icon={icon} color={color}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Resolved", value: "Resolved" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}>
          Manage
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}>
        <Title level={2} style={{ margin: 0 }}>
          Customer Feedback
        </Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchFeedback}
            loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={10}>
            <Input
              placeholder="Search by customer name, subject, message..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={6} lg={7}>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              allowClear>
              <Option value="">All Statuses</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Resolved">Resolved</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredFeedback}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} feedback`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title="Manage Customer Feedback"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingFeedback(null);
          form.resetFields();
        }}
        footer={null}
        width={700}>
        {editingFeedback && (
          <Form form={form} layout="vertical" onFinish={handleUpdateFeedback}>
            <Form.Item name="customerName" label="Customer Name">
              <Input disabled />
            </Form.Item>
            <Form.Item name="subject" label="Subject">
              <Input disabled />
            </Form.Item>
            <Form.Item name="message" label="Message">
              <TextArea rows={4} disabled />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status" }]}>
              <Select placeholder="Select status">
                <Option value="Pending">Pending</Option>
                <Option value="Resolved">Resolved</Option>
              </Select>
            </Form.Item>
            <Form.Item name="response" label="Your Response (Optional)">
              <TextArea
                rows={4}
                placeholder="Enter your response to the customer"
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Feedback
                </Button>
                <Button
                  onClick={() => {
                    setIsModalVisible(false);
                    setEditingFeedback(null);
                    form.resetFields();
                  }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default CustomerFeedbackPage;
