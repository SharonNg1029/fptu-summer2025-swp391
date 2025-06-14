import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Card } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Table,
  Button,
  Space,
  Input,
  Typography,
  Tag,
  Modal,
  Form,
  Select,
  DatePicker,
  Upload,
  Row,
  Col,
  Descriptions,
} from "antd";
import {
  EditOutlined,
  UploadOutlined,
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import moment from "moment";
import api from "../../../configs/axios"; // Import axios instance

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const OrderProcessing = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [form] = Form.useForm();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/staff/orders"); // Example API endpoint for staff orders
      setOrders(response.data?.data || response.data || []);
    } catch (error) {
      toast.error(
        "Failed to fetch orders: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleEdit = (record) => {
    setEditingOrder(record);
    form.setFieldsValue({
      ...record,
      sampleCollectionDate: record.sampleCollectionDate
        ? moment(record.sampleCollectionDate)
        : null,
      sampleCollected: record.sampleCollected,
    });
    setIsModalVisible(true);
  };

  const handleUpdateOrder = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        sampleCollectionDate: values.sampleCollectionDate
          ? values.sampleCollectionDate.toISOString()
          : null,
        status: values.progress === "Completed" ? "Completed" : values.status, // Auto-update status if progress is completed
      };
      await api.patch(`/staff/orders/${editingOrder.id}`, payload); // Example API endpoint for updating order

      toast.success("Order updated successfully!");
      setIsModalVisible(false);
      setEditingOrder(null);
      form.resetFields();
      fetchOrders(); // Refresh the list
    } catch (error) {
      toast.error(
        "Failed to update order: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error updating order:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id?.toLowerCase().includes(searchText.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
      order.service?.toLowerCase().includes(searchText.toLowerCase()) ||
      order.progress?.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = statusFilter === "" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => (a.id || "").localeCompare(b.id || ""),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) =>
        (a.customerName || "").localeCompare(b.customerName || ""),
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "Pending") color = "orange";
        if (status === "Sample Collected") color = "blue";
        if (status === "Testing") color = "purple";
        if (status === "Completed") color = "green";
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Sample Collected", value: "Sample Collected" },
        { text: "Testing", value: "Testing" },
        { text: "Completed", value: "Completed" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress) => {
        let icon = <ClockCircleOutlined />;
        let color = "blue";
        if (progress === "Sample Collected") {
          icon = <ContainerOutlined />;
          color = "geekblue";
        }
        if (progress === "Completed") {
          icon = <CheckCircleOutlined />;
          color = "green";
        }
        return (
          <Tag icon={icon} color={color}>
            {progress}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}>
          Edit
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
          Order Processing
        </Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchOrders}
            loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={10}>
            <Input
              placeholder="Search by Order ID, Customer, Service..."
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
              <Option value="Sample Collected">Sample Collected</Option>
              <Option value="Testing">Testing</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} orders`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title="Edit Order Details"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingOrder(null);
          form.resetFields();
        }}
        footer={null}
        width={700}>
        {editingOrder && (
          <Form form={form} layout="vertical" onFinish={handleUpdateOrder}>
            <Descriptions
              bordered
              column={2}
              size="small"
              style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Order ID">
                {editingOrder.id}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name">
                {editingOrder.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Service" span={2}>
                {editingOrder.service}
              </Descriptions.Item>
            </Descriptions>

            <Form.Item
              name="progress"
              label="Order Progress"
              rules={[
                { required: true, message: "Please select order progress" },
              ]}>
              <Select placeholder="Select current progress">
                <Option value="Appointment Scheduled">
                  Appointment Scheduled
                </Option>
                <Option value="Sample Received">Sample Received</Option>
                <Option value="In Lab">In Lab</Option>
                <Option value="Testing">Testing</Option>
                <Option value="Completed">Completed</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="sampleCollected"
              label="Sample Collected"
              valuePropName="checked">
              <Select>
                <Option value={true}>Yes</Option>
                <Option value={false}>No</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="sampleCollectionDate"
              label="Sample Collection Date">
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item name="testResult" label="Test Result">
              <TextArea
                rows={4}
                placeholder="Enter test results or upload a file"
              />
            </Form.Item>

            {/* Optional: File Upload for Test Results */}
            <Form.Item name="resultFile" label="Upload Test Result File">
              <Upload
                name="file"
                action="/upload.do" // Replace with your actual upload endpoint
                listType="text"
                maxCount={1}
                beforeUpload={() => false} // Prevent auto-upload
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item name="notes" label="Notes">
              <TextArea rows={3} placeholder="Add any relevant notes" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Order
                </Button>
                <Button
                  onClick={() => {
                    setIsModalVisible(false);
                    setEditingOrder(null);
                    form.resetFields();
                  }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default OrderProcessing;
