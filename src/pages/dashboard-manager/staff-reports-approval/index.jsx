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
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StaffReportsApprovalPage = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [form] = Form.useForm();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/manager/staff-reports"); // Example API endpoint
      setReports(response.data?.data || response.data || []);
    } catch (error) {
      message.error(
        "Failed to fetch staff reports: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error fetching staff reports:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleViewReport = (record) => {
    setSelectedReport(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleApproveReject = async (reportId, newStatus) => {
    setLoading(true);
    try {
      await api.patch(`/manager/staff-reports/${reportId}/status`, {
        status: newStatus,
      }); // Example API endpoint
      message.success(`Report ${newStatus.toLowerCase()} successfully!`);
      setIsModalVisible(false);
      setSelectedReport(null);
      form.resetFields();
      fetchReports();
    } catch (error) {
      message.error(
        `Failed to ${newStatus.toLowerCase()} report: ` +
          (error.response?.data?.message || error.message)
      );
      console.error(`Error ${newStatus.toLowerCase()} report:`, error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.submittedBy?.toLowerCase().includes(searchText.toLowerCase()) ||
      report.subject?.toLowerCase().includes(searchText.toLowerCase()) ||
      report.details?.toLowerCase().includes(searchText.toLowerCase()) ||
      report.reportType?.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = statusFilter === "" || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Report ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => (a.id || "").localeCompare(b.id || ""),
    },
    {
      title: "Submitted By",
      dataIndex: "submittedBy",
      key: "submittedBy",
      sorter: (a, b) =>
        (a.submittedBy || "").localeCompare(b.submittedBy || ""),
    },
    {
      title: "Report Type",
      dataIndex: "reportType",
      key: "reportType",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Date",
      dataIndex: "reportDate",
      key: "reportDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
      sorter: (a, b) =>
        new Date(a.reportDate || "1970-01-01") -
        new Date(b.reportDate || "1970-01-01"),
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
        if (status === "Approved") {
          color = "green";
          icon = <CheckCircleOutlined />;
        }
        if (status === "Rejected") {
          color = "red";
          icon = <CloseCircleOutlined />;
        }
        return (
          <Tag icon={icon} color={color}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Approved", value: "Approved" },
        { text: "Rejected", value: "Rejected" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleViewReport(record)}>
            View
          </Button>
          {record.status === "Pending" && (
            <>
              <Popconfirm
                title="Are you sure to approve this report?"
                onConfirm={() => handleApproveReject(record.id, "Approved")}
                okText="Yes"
                cancelText="No">
                <Button type="primary" icon={<CheckCircleOutlined />}>
                  Approve
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Are you sure to reject this report?"
                onConfirm={() => handleApproveReject(record.id, "Rejected")}
                okText="Yes"
                cancelText="No">
                <Button danger icon={<CloseCircleOutlined />}>
                  Reject
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
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
          Staff Reports Approval
        </Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchReports}
            loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={10}>
            <Input
              placeholder="Search by staff, subject, type..."
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
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredReports}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} reports`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title="Report Details"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedReport(null);
          form.resetFields();
        }}
        footer={null}
        width={700}>
        {selectedReport && (
          <Form form={form} layout="vertical">
            <Form.Item label="Report ID">
              <Input value={selectedReport.id} disabled />
            </Form.Item>
            <Form.Item label="Submitted By">
              <Input value={selectedReport.submittedBy} disabled />
            </Form.Item>
            <Form.Item label="Report Type">
              <Input value={selectedReport.reportType} disabled />
            </Form.Item>
            <Form.Item label="Subject">
              <Input value={selectedReport.subject} disabled />
            </Form.Item>
            <Form.Item label="Report Date">
              <Input value={selectedReport.reportDate} disabled />
            </Form.Item>
            <Form.Item label="Details">
              <TextArea rows={6} value={selectedReport.details} disabled />
            </Form.Item>
            <Form.Item label="Status">
              <Tag
                color={
                  selectedReport.status === "Pending"
                    ? "orange"
                    : selectedReport.status === "Approved"
                    ? "green"
                    : "red"
                }>
                {selectedReport.status}
              </Tag>
            </Form.Item>
            <Space style={{ marginTop: 24 }}>
              {selectedReport.status === "Pending" && (
                <>
                  <Popconfirm
                    title="Are you sure to approve this report?"
                    onConfirm={() =>
                      handleApproveReject(selectedReport.id, "Approved")
                    }
                    okText="Yes"
                    cancelText="No">
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      loading={loading}>
                      Approve
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    title="Are you sure to reject this report?"
                    onConfirm={() =>
                      handleApproveReject(selectedReport.id, "Rejected")
                    }
                    okText="Yes"
                    cancelText="No">
                    <Button
                      danger
                      icon={<CloseCircleOutlined />}
                      loading={loading}>
                      Reject
                    </Button>
                  </Popconfirm>
                </>
              )}
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setSelectedReport(null);
                  form.resetFields();
                }}>
                Close
              </Button>
            </Space>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default StaffReportsApprovalPage;
