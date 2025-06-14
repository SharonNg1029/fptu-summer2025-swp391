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
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;
const { Option } = Select;

const TestingProcessMonitoringPage = () => {
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/manager/testing-process"); // Example API endpoint
      setTests(response.data?.data || response.data || []);
    } catch (error) {
      toast.error(
        "Failed to fetch testing process data: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error fetching testing process data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.testId?.toLowerCase().includes(searchText.toLowerCase()) ||
      test.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
      test.serviceType?.toLowerCase().includes(searchText.toLowerCase()) ||
      test.assignedStaff?.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = statusFilter === "" || test.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Test ID",
      dataIndex: "testId",
      key: "testId",
      sorter: (a, b) => (a.testId || "").localeCompare(b.testId || ""),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) =>
        (a.customerName || "").localeCompare(b.customerName || ""),
    },
    {
      title: "Service Type",
      dataIndex: "serviceType",
      key: "serviceType",
    },
    {
      title: "Assigned Staff",
      dataIndex: "assignedStaff",
      key: "assignedStaff",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let icon = <ClockCircleOutlined />;
        if (status === "Pending Payment") {
          color = "orange";
          icon = <ExclamationCircleOutlined />;
        }
        if (status === "Paid") {
          color = "blue";
          icon = <CheckCircleOutlined />;
        }
        if (status === "Awaiting Sample") {
          color = "purple";
          icon = <LoadingOutlined />;
        }
        if (status === "In Progress") {
          color = "cyan";
          icon = <LoadingOutlined />;
        }
        if (status === "Completed") {
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
        { text: "Pending Payment", value: "Pending Payment" },
        { text: "Paid", value: "Paid" },
        { text: "Awaiting Sample", value: "Awaiting Sample" },
        { text: "In Progress", value: "In Progress" },
        { text: "Completed", value: "Completed" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Last Update",
      dataIndex: "lastUpdate",
      key: "lastUpdate",
      render: (date) => (date ? new Date(date).toLocaleString() : "N/A"),
      sorter: (a, b) =>
        new Date(a.lastUpdate || "1970-01-01") -
        new Date(b.lastUpdate || "1970-01-01"),
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
          Testing Process Monitoring
        </Title>
        <ToastContainer />
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchTests}
            loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={10}>
            <Input
              placeholder="Search by Test ID, Customer, Staff..."
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
              <Option value="Pending Payment">Pending Payment</Option>
              <Option value="Paid">Paid</Option>
              <Option value="Awaiting Sample">Awaiting Sample</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredTests}
          rowKey="testId"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} tests`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default TestingProcessMonitoringPage;
