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
  InputNumber,
  Tooltip,
  Card,
  Descriptions,
  Row,
  Col,
  Statistic,
  Select,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  BarChartOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ServiceManagement = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editForm] = Form.useForm();

  // Fetch services data from API
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/services/service");
      console.log("Services response:", response);

      const servicesData = response.data?.data || response.data || [];
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error(
        "Failed to fetch services: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []); // Filter and sort services based on search text and sort order
  // Filter services based on search text and price range
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      service.type?.toLowerCase().includes(searchText.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      service.serviceID?.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  // Calculate statistics
  const stats = {
    totalServices: services.length,
    totalRevenue: services.reduce(
      (sum, service) => sum + service.cost * (service.monthlyOrders || 0),
      0
    ),
    totalOrders: services.reduce(
      (sum, service) => sum + (service.monthlyOrders || 0),
      0
    ),
    avgPrice:
      services.length > 0
        ? services.reduce((sum, service) => sum + service.cost, 0) /
          services.length
        : 0,
  };

  // Service table columns
  const serviceColumns = [
    {
      title: "Service ID",
      dataIndex: "serviceID",
      key: "serviceID",
      width: 100,
    },
    {
      title: "Service Type",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <Tag color="geekblue" style={{ fontSize: 14 }}>
          {name}
        </Tag>
      ),
    },
    {
      title: "Service Name",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color="blue" style={{ fontSize: 14 }}>
          {type}
        </Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "cost",
      key: "cost",
      render: (cost) =>
        cost != null
          ? cost.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " ₫"
          : "0 ₫",
    },
    {
      title: "Estimated Time",
      dataIndex: "estimatedTime",
      key: "estimatedTime",
      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          {time || "N/A"}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Price">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setEditingService(record);
                setIsEditModalVisible(true);
                editForm.setFieldsValue({
                  name: record.name,
                  type: record.type,
                  cost: record.cost,
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Service Management</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Services"
              value={stats.totalServices}
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Monthly Revenue"
              value={stats.totalRevenue}
              precision={2}
              prefix="$"
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Monthly Orders"
              value={stats.totalOrders}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Average Price"
              value={stats.avgPrice}
              precision={2}
              prefix="$"
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>{" "}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col
            xs={24}
            sm={16}
            lg={16}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}>
            <Input
              placeholder="Search by Service ID, Name, Type, ..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ maxWidth: 350, borderRadius: 6 }}
              size="large"
            />
          </Col>
          <Col
            xs={24}
            sm={8}
            lg={8}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchServices}
              type="primary"
              style={{
                background: "#1890ff",
                borderColor: "#1890ff",
                borderRadius: 6,
              }}
              size="large">
              Refresh
            </Button>
          </Col>
        </Row>
      </Card>{" "}
      <Card>
        <Table
          columns={serviceColumns}
          dataSource={filteredServices}
          loading={loading}
          rowKey="serviceID"
          bordered
          scroll={{ x: true }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} services`,
            pageSizeOptions: ["10", "20", "50"],
          }}
        />
      </Card>
      {/* Modal chỉnh sửa giá */}
      <Modal
        title={
          editingService
            ? `Edit Price for: ${editingService.name}`
            : "Edit Price"
        }
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingService(null);
          editForm.resetFields();
        }}
        onOk={() => editForm.submit()}
        okText="Save"
        cancelText="Cancel">
        <Form
          form={editForm}
          layout="vertical"
          onFinish={async (values) => {
            try {
              await api.patch(`/admin/${editingService.serviceID}/cost`, null, {
                params: {
                  serviceId: editingService.serviceID,
                  cost: values.cost,
                },
              });
              toast.success("Service price updated successfully");
              setIsEditModalVisible(false);
              setEditingService(null);
              editForm.resetFields();
              fetchServices();
            } catch (error) {
              toast.error(
                "Failed to update price: " +
                  (error.response?.data?.message || error.message)
              );
            }
          }}
          initialValues={{ cost: editingService?.cost }}>
          <Form.Item
            label="Service Name"
            name="name"
            initialValue={editingService?.name}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            initialValue={editingService?.type}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Cost ($)"
            name="cost"
            rules={[
              { required: true, message: "Please input the service cost!" },
            ]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceManagement;
