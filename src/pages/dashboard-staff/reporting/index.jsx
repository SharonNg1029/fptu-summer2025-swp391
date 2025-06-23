import React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Tabs,
  Table,
  Button,
  Space,
  Input,
  Typography,
  Form,
  Select,
  DatePicker,
  Card,
  Tag,
} from "antd";
import {
  SendOutlined,
  HistoryOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import api from "../../../configs/axios"; // Import axios instance
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const StaffReporting = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("workReports");
  const [workReports, setWorkReports] = useState([]);

  const [form] = Form.useForm();

  const fetchWorkReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/staff/reports"); // Example API endpoint for staff reports
      setWorkReports(response.data?.data || response.data || []);
    } catch (error) {
      toast.error(
        "Failed to fetch work reports: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error fetching work reports:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "workReports") {
      fetchWorkReports();
    }
  }, [activeTab, fetchWorkReports]);

  const handleSubmitReport = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        reportDate: values.reportDate
          ? values.reportDate.format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
        status: "Pending", // Default status for new reports
      };
      await api.post("/staff/reports", payload); // Example API endpoint for submitting reports

      toast.success("Report submitted successfully!");
      form.resetFields();
      setActiveTab("workReports"); // Switch back to view reports
      fetchWorkReports(); // Refresh reports list
    } catch (error) {
      toast.error(
        "Failed to submit report: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error submitting report:", error);
    } finally {
      setLoading(false);
    }
  };

  const workReportColumns = [
    {
      title: "Report ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => (a.id || "").localeCompare(b.id || ""),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        let color = "blue";
        if (type === "Leave Request") color = "volcano";
        if (type === "Issue Report") color = "red";
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "N/A"),
      sorter: (a, b) =>
        moment(a.date || "1970-01-01").unix() -
        moment(b.date || "1970-01-01").unix(),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "Approved" || status === "Resolved") color = "green";
        if (status === "Pending") color = "orange";
        if (status === "Rejected") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
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
          Staff Reporting
        </Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchWorkReports}
            loading={loading}>
            Refresh Reports
          </Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              Work Reports
            </span>
          }
          key="workReports">
          <Card>
            <Table
              loading={loading}
              columns={workReportColumns}
              dataSource={workReports}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} reports`,
              }}
            />
          </Card>
        </TabPane>
        <TabPane
          tab={
            <span>
              <SendOutlined />
              Submit Report to Manager
            </span>
          }
          key="submitReport">
          <Card title="Submit New Report">
            <Form form={form} layout="vertical" onFinish={handleSubmitReport}>
              <Form.Item
                name="reportType"
                label="Report Type"
                rules={[
                  { required: true, message: "Please select a report type" },
                ]}>
                <Select placeholder="Select report type">
                  <Option value="Daily Report">Daily Report</Option>
                  <Option value="Weekly Report">Weekly Report</Option>
                  <Option value="Leave Request">Leave Request</Option>
                  <Option value="Issue Report">Issue Report</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="subject"
                label="Subject"
                rules={[{ required: true, message: "Please enter a subject" }]}>
                <Input placeholder="e.g., Daily tasks summary, Leave request for May 20-22" />
              </Form.Item>
              <Form.Item
                name="details"
                label="Details"
                rules={[{ required: true, message: "Please provide details" }]}>
                <TextArea
                  rows={6}
                  placeholder="Provide detailed information about your report or request."
                />
              </Form.Item>
              <Form.Item name="reportDate" label="Report Date">
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SendOutlined />}>
                  Submit Report
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
      <ToastContainer />
    </div>
  );
};

export default StaffReporting;
