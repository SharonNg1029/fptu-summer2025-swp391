// Description: Inventory Management Dashboard for Admins
import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Input,
  Typography,
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  ReloadOutlined,
  UserOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title } = Typography;

const SystemLogs = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Fetch system logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/system-log");
      setLogs(response.data?.data || response.data || []);
    } catch (error) {
      toast.error(
        "Failed to fetch system logs: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter logs by search text
  const filteredLogs = logs.filter(
    (log) =>
      log.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchText.toLowerCase()) ||
      log.ipAddress?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Statistics
  const stats = {
    total: logs.length,
    login: logs.filter((l) => l.action?.toLowerCase().includes("login")).length,
    logout: logs.filter((l) => l.action?.toLowerCase().includes("logout"))
      .length,
    register: logs.filter((l) => l.action?.toLowerCase().includes("register"))
      .length,
    uniqueUsers: new Set(logs.map((l) => l.username)).size,
  };

  // Export PDF function
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("System Logs Report", 14, 16);
      const tableColumn = ["ID", "User", "Action", "IP Address", "Timestamp"];
      const tableRows = filteredLogs.map((log) => [
        log.id,
        log.username,
        log.action,
        log.ipAddress,
        log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A",
      ]);
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 22,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
      });
      doc.save("system-logs.pdf");
      toast.success("PDF exported successfully!");
    } catch (err) {
      toast.error("PDF export failed: " + (err?.message || err));
      console.error("Export PDF error:", err);
    }
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    {
      title: "User",
      dataIndex: "username",
      key: "username",
      render: (text) => (
        <Space>
          <UserOutlined />
          {text || "N/A"}
        </Space>
      ),
      width: 180,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 180,
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      width: 160,
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) =>
        timestamp ? new Date(timestamp).toLocaleString() : "N/A",
      sorter: (a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0),
      width: 180,
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}>
        <Title level={2}>System Logs & Monitoring</Title>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleExportPDF}>
            Export
          </Button>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchLogs}
            loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Logs"
              value={stats.total}
              prefix={<HistoryOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Login Events"
              value={stats.login}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Logout Events"
              value={stats.logout}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Unique Users"
              value={stats.uniqueUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Card>
        <Input
          placeholder="Search by username, action, IP..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ marginBottom: 16, maxWidth: 400 }}
        />
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredLogs}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
          }}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
};

export default SystemLogs;
