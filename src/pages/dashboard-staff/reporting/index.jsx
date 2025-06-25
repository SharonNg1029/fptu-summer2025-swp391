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
  DownloadOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios"; // Import axios instance
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const { Title } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const StaffReporting = () => {
  const [loading, setLoading] = useState(true);
  const [workReports, setWorkReports] = useState([]);

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
    fetchWorkReports();
  }, [fetchWorkReports]);

  const handleExportPDF = () => {
    try {
      if (!jsPDF || !jsPDF.prototype.autoTable) {
        toast.error(
          "jsPDF autoTable plugin is not available. Please check your dependencies."
        );
        return;
      }
      const doc = new jsPDF();
      const columns = workReportColumns.map((col) => col.title);
      const rows = workReports.map((row) => [
        row.id,
        row.type,
        row.appointmentTime || "-",
        row.status,
        row.note || "-",
      ]);
      doc.autoTable({ head: [columns], body: rows });
      doc.save("work_reports.pdf");
      toast.success("PDF exported successfully!");
    } catch (error) {
      toast.error("Failed to export PDF: " + error.message);
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
      title: "Appointment Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (time) => time || "-",
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
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (note) => note || "-",
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
          Reporting Today
        </Title>
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportPDF}
            style={{ marginRight: 8 }}>
            Export PDF
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchWorkReports}
            loading={loading}
            style={{ background: "#1677ff", color: "#fff", border: "none" }}>
            Refresh Reports
          </Button>
        </Space>
      </div>
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
        <div
          style={{
            textAlign: "right",
            marginTop: 16,
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}>
          <Button
            icon={<SendOutlined />}
            onClick={() => toast.info("Create Report feature coming soon!")}
            style={{
              background: "#fff",
              color: "#1677ff",
              border: "1px solid #d9d9d9",
            }}>
            Create Report
          </Button>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => toast.info("Submit Report feature coming soon!")}>
            Submit Report
          </Button>
        </div>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default StaffReporting;
