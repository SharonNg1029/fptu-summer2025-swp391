// Description: Inventory Management Dashboard for Admins
import React from "react";
import { useState, useEffect } from "react";
import {
  Tabs,
  Table,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Tag,
  Typography,
  Tooltip,
  Modal,
  Descriptions,
  Alert,
  message,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  ReloadOutlined,
  UserOutlined,
  LockOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
  SafetyOutlined,
  BellOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const SystemLogs = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("activity");

  // Data states
  const [activityLogs, setActivityLogs] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  // Search and filter states
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [dateRange, setDateRange] = useState(null);

  // Modal states
  const [isActivityDetailModalVisible, setIsActivityDetailModalVisible] =
    useState(false);
  const [isSecurityDetailModalVisible, setIsSecurityDetailModalVisible] =
    useState(false);
  const [isAlertDetailModalVisible, setIsAlertDetailModalVisible] =
    useState(false);
  const [selectedActivityLog, setSelectedActivityLog] = useState(null);
  const [selectedSecurityLog, setSelectedSecurityLog] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Fetch activity logs
  const fetchActivityLogs = async () => {
    try {
      const response = await api.get("/admin/logs/activity", {
        params: {
          search: searchText,
          type: typeFilter,
          user: userFilter,
          startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
          endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
        },
      });
      console.log("Activity logs response:", response);

      const logsData = response.data?.data || response.data || [];
      setActivityLogs(logsData);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      message.error(
        "Failed to fetch activity logs: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Fetch security logs
  const fetchSecurityLogs = async () => {
    try {
      const response = await api.get("/admin/logs/security", {
        params: {
          search: searchText,
          severity: severityFilter,
          status: statusFilter,
          startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
          endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
        },
      });
      console.log("Security logs response:", response);

      const logsData = response.data?.data || response.data || [];
      setSecurityLogs(logsData);
    } catch (error) {
      console.error("Error fetching security logs:", error);
      message.error(
        "Failed to fetch security logs: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Fetch system alerts
  const fetchSystemAlerts = async () => {
    try {
      const response = await api.get("/admin/alerts", {
        params: {
          search: searchText,
          type: typeFilter,
          severity: severityFilter,
          status: statusFilter,
          startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
          endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
        },
      });
      console.log("System alerts response:", response);

      const alertsData = response.data?.data || response.data || [];
      setSystemAlerts(alertsData);
    } catch (error) {
      console.error("Error fetching system alerts:", error);
      message.error(
        "Failed to fetch system alerts: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Fetch all logs data
  const fetchAllLogs = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchActivityLogs(),
        fetchSecurityLogs(),
        fetchSystemAlerts(),
      ]);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLogs();
  }, []);

  // Handle view details
  const handleViewActivityDetails = (record) => {
    setSelectedActivityLog(record);
    setIsActivityDetailModalVisible(true);
  };

  const handleViewSecurityDetails = (record) => {
    setSelectedSecurityLog(record);
    setIsSecurityDetailModalVisible(true);
  };

  const handleViewAlertDetails = (record) => {
    setSelectedAlert(record);
    setIsAlertDetailModalVisible(true);
  };

  // Handle resolve alert
  const handleResolveAlert = async (id) => {
    try {
      await api.put(`/admin/alerts/${id}/resolve`);
      message.success("Alert marked as resolved");
      fetchSystemAlerts(); // Refresh alerts
    } catch (error) {
      console.error("Error resolving alert:", error);
      message.error(
        "Failed to resolve alert: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Filter functions
  const filterActivityLogs = () => {
    return activityLogs.filter((log) => {
      const matchesSearch =
        log.user?.toLowerCase().includes(searchText.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchText.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchText.toLowerCase()) ||
        log.id?.toLowerCase().includes(searchText.toLowerCase());

      const matchesType = typeFilter === "" || log.type === typeFilter;
      const matchesUser = userFilter === "" || log.user === userFilter;

      const matchesDateRange =
        !dateRange ||
        !dateRange[0] ||
        !dateRange[1] ||
        (new Date(log.timestamp) >= dateRange[0].startOf("day").toDate() &&
          new Date(log.timestamp) <= dateRange[1].endOf("day").toDate());

      return matchesSearch && matchesType && matchesUser && matchesDateRange;
    });
  };

  const filterSecurityLogs = () => {
    return securityLogs.filter((log) => {
      const matchesSearch =
        log.user?.toLowerCase().includes(searchText.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchText.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchText.toLowerCase()) ||
        log.id?.toLowerCase().includes(searchText.toLowerCase()) ||
        log.ipAddress?.toLowerCase().includes(searchText.toLowerCase());

      const matchesSeverity =
        severityFilter === "" || log.severity === severityFilter;
      const matchesStatus = statusFilter === "" || log.status === statusFilter;

      const matchesDateRange =
        !dateRange ||
        !dateRange[0] ||
        !dateRange[1] ||
        (new Date(log.timestamp) >= dateRange[0].startOf("day").toDate() &&
          new Date(log.timestamp) <= dateRange[1].endOf("day").toDate());

      return (
        matchesSearch && matchesSeverity && matchesStatus && matchesDateRange
      );
    });
  };

  const filterSystemAlerts = () => {
    return systemAlerts.filter((alert) => {
      const matchesSearch =
        alert.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        alert.message?.toLowerCase().includes(searchText.toLowerCase()) ||
        alert.id?.toLowerCase().includes(searchText.toLowerCase()) ||
        alert.affectedSystem?.toLowerCase().includes(searchText.toLowerCase());

      const matchesType = typeFilter === "" || alert.type === typeFilter;
      const matchesSeverity =
        severityFilter === "" || alert.severity === severityFilter;
      const matchesStatus =
        statusFilter === "" || alert.status === statusFilter;

      const matchesDateRange =
        !dateRange ||
        !dateRange[0] ||
        !dateRange[1] ||
        (new Date(alert.timestamp) >= dateRange[0].startOf("day").toDate() &&
          new Date(alert.timestamp) <= dateRange[1].endOf("day").toDate());

      return (
        matchesSearch &&
        matchesType &&
        matchesSeverity &&
        matchesStatus &&
        matchesDateRange
      );
    });
  };

  // Get unique users for filter
  const users = [
    ...new Set(activityLogs.map((log) => log.user).filter(Boolean)),
  ];

  // Calculate statistics
  const activityStats = {
    totalActivities: activityLogs.length,
    successful: activityLogs.filter((log) => log.status === "Success").length,
    failed: activityLogs.filter((log) => log.status === "Failed").length,
    uniqueUsers: users.length,
  };

  const securityStats = {
    totalEvents: securityLogs.length,
    highSeverity: securityLogs.filter(
      (log) => log.severity === "High" || log.severity === "Critical"
    ).length,
    blocked: securityLogs.filter((log) => log.status === "Blocked").length,
    critical: securityLogs.filter((log) => log.severity === "Critical").length,
  };

  const alertStats = {
    totalAlerts: systemAlerts.length,
    active: systemAlerts.filter((alert) => alert.status === "Active").length,
    critical: systemAlerts.filter((alert) => alert.severity === "Critical")
      .length,
    resolved: systemAlerts.filter((alert) => alert.status === "Resolved")
      .length,
  };

  // Table columns
  const activityColumns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) =>
        timestamp ? new Date(timestamp).toLocaleString() : "N/A",
      sorter: (a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0),
      width: 150,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (text, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <UserOutlined />
            <Text>{text || "N/A"}</Text>
          </Space>
          <Tag size="small" color="blue">
            {record.userRole || "Unknown"}
          </Tag>
        </Space>
      ),
      width: 200,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 150,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        let color = "blue";
        if (type === "Authentication") color = "green";
        if (type === "Account Management") color = "purple";
        if (type === "Service Management") color = "orange";
        if (type === "Inventory Management") color = "cyan";
        if (type === "Test Management") color = "magenta";
        if (type === "Content Management") color = "geekblue";
        return <Tag color={color}>{type || "Unknown"}</Tag>;
      },
      filters: [
        { text: "Authentication", value: "Authentication" },
        { text: "Account Management", value: "Account Management" },
        { text: "Service Management", value: "Service Management" },
        { text: "Inventory Management", value: "Inventory Management" },
        { text: "Test Management", value: "Test Management" },
        { text: "Content Management", value: "Content Management" },
      ],
      onFilter: (value, record) => record.type === value,
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "Success" ? "green" : "red";
        const icon =
          status === "Success" ? (
            <CheckCircleOutlined />
          ) : (
            <ExclamationCircleOutlined />
          );
        return (
          <Tag color={color} icon={icon}>
            {status || "Unknown"}
          </Tag>
        );
      },
      filters: [
        { text: "Success", value: "Success" },
        { text: "Failed", value: "Failed" },
      ],
      onFilter: (value, record) => record.status === value,
      width: 100,
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewActivityDetails(record)}
          />
        </Tooltip>
      ),
      width: 80,
    },
  ];

  const securityColumns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) =>
        timestamp ? new Date(timestamp).toLocaleString() : "N/A",
      sorter: (a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0),
      width: 150,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (text) => (
        <Space>
          <LockOutlined />
          <Text>{text || "N/A"}</Text>
        </Space>
      ),
      width: 180,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 150,
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      render: (severity) => {
        let color = "blue";
        let icon = <SafetyOutlined />;
        if (severity === "Critical") {
          color = "red";
          icon = <ExclamationCircleOutlined />;
        } else if (severity === "High") {
          color = "orange";
          icon = <WarningOutlined />;
        } else if (severity === "Medium") {
          color = "yellow";
          icon = <WarningOutlined />;
        } else if (severity === "Low") {
          color = "green";
          icon = <SafetyOutlined />;
        }
        return (
          <Tag color={color} icon={icon}>
            {severity || "Unknown"}
          </Tag>
        );
      },
      filters: [
        { text: "Critical", value: "Critical" },
        { text: "High", value: "High" },
        { text: "Medium", value: "Medium" },
        { text: "Low", value: "Low" },
      ],
      onFilter: (value, record) => record.severity === value,
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue";
        if (status === "Blocked") color = "red";
        if (status === "Success") color = "green";
        if (status === "Monitoring") color = "orange";
        if (status === "Locked") color = "purple";
        if (status === "Mitigated") color = "cyan";
        return <Tag color={color}>{status || "Unknown"}</Tag>;
      },
      filters: [
        { text: "Blocked", value: "Blocked" },
        { text: "Success", value: "Success" },
        { text: "Monitoring", value: "Monitoring" },
        { text: "Locked", value: "Locked" },
        { text: "Mitigated", value: "Mitigated" },
      ],
      onFilter: (value, record) => record.status === value,
      width: 120,
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      width: 130,
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewSecurityDetails(record)}
          />
        </Tooltip>
      ),
      width: 80,
    },
  ];

  const alertColumns = [
    {
      title: "Alert ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) =>
        timestamp ? new Date(timestamp).toLocaleString() : "N/A",
      sorter: (a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0),
      width: 150,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        let color = "blue";
        if (type === "Security") color = "red";
        if (type === "Inventory") color = "orange";
        if (type === "System") color = "green";
        if (type === "Performance") color = "purple";
        if (type === "Application") color = "cyan";
        return <Tag color={color}>{type || "Unknown"}</Tag>;
      },
      filters: [
        { text: "Security", value: "Security" },
        { text: "Inventory", value: "Inventory" },
        { text: "System", value: "System" },
        { text: "Performance", value: "Performance" },
        { text: "Application", value: "Application" },
      ],
      onFilter: (value, record) => record.type === value,
      width: 120,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space direction="vertical" size="small">
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.affectedSystem || "N/A"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      render: (severity) => {
        let color = "blue";
        let icon = <BellOutlined />;
        if (severity === "Critical") {
          color = "red";
          icon = <ExclamationCircleOutlined />;
        } else if (severity === "High") {
          color = "orange";
          icon = <WarningOutlined />;
        } else if (severity === "Warning" || severity === "Medium") {
          color = "yellow";
          icon = <WarningOutlined />;
        } else if (severity === "Info") {
          color = "green";
          icon = <CheckCircleOutlined />;
        }
        return (
          <Tag color={color} icon={icon}>
            {severity || "Unknown"}
          </Tag>
        );
      },
      filters: [
        { text: "Critical", value: "Critical" },
        { text: "High", value: "High" },
        { text: "Warning", value: "Warning" },
        { text: "Medium", value: "Medium" },
        { text: "Info", value: "Info" },
      ],
      onFilter: (value, record) => record.severity === value,
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue";
        let icon = <ClockCircleOutlined />;
        if (status === "Active") {
          color = "red";
          icon = <ExclamationCircleOutlined />;
        } else if (status === "Resolved") {
          color = "green";
          icon = <CheckCircleOutlined />;
        } else if (status === "Monitoring") {
          color = "orange";
          icon = <ClockCircleOutlined />;
        } else if (status === "Investigating") {
          color = "purple";
          icon = <ClockCircleOutlined />;
        }
        return (
          <Tag color={color} icon={icon}>
            {status || "Unknown"}
          </Tag>
        );
      },
      filters: [
        { text: "Active", value: "Active" },
        { text: "Resolved", value: "Resolved" },
        { text: "Monitoring", value: "Monitoring" },
        { text: "Investigating", value: "Investigating" },
      ],
      onFilter: (value, record) => record.status === value,
      width: 120,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => {
        let color = "blue";
        if (priority === "Critical") color = "red";
        if (priority === "High") color = "orange";
        if (priority === "Medium") color = "yellow";
        if (priority === "Low") color = "green";
        return <Tag color={color}>{priority || "Unknown"}</Tag>;
      },
      width: 100,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewAlertDetails(record)}
            />
          </Tooltip>
          {record.status === "Active" && (
            <Tooltip title="Mark as Resolved">
              <Button
                type="default"
                icon={<CheckCircleOutlined />}
                size="small"
                onClick={() => handleResolveAlert(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
      width: 120,
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
          <Button icon={<DownloadOutlined />}>Export</Button>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchAllLogs}
            loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      {/* Critical alerts banner */}
      {alertStats.critical > 0 && (
        <Alert
          message="Critical System Alerts"
          description={`${alertStats.critical} critical alerts require immediate attention.`}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" danger onClick={() => setActiveTab("alerts")}>
              View Critical
            </Button>
          }
        />
      )}

      {securityStats.critical > 0 && (
        <Alert
          message="Critical Security Events Detected"
          description={`${securityStats.critical} critical security events require immediate attention.`}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button
              size="small"
              danger
              onClick={() => setActiveTab("security")}>
              View Security Events
            </Button>
          }
        />
      )}

      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        {/* Activity Logs Tab */}
        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              Activity Logs
            </span>
          }
          key="activity">
          {/* Activity Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Activities"
                  value={activityStats.totalActivities}
                  prefix={<HistoryOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Successful"
                  value={activityStats.successful}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Failed"
                  value={activityStats.failed}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Unique Users"
                  value={activityStats.uniqueUsers}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Activity Filters */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8}>
                <Input
                  placeholder="Search activity logs..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={6}>
                <Select
                  placeholder="Filter by type"
                  value={typeFilter}
                  onChange={setTypeFilter}
                  style={{ width: "100%" }}
                  allowClear>
                  <Option value="Authentication">Authentication</Option>
                  <Option value="Account Management">Account Management</Option>
                  <Option value="Service Management">Service Management</Option>
                  <Option value="Inventory Management">
                    Inventory Management
                  </Option>
                  <Option value="Test Management">Test Management</Option>
                  <Option value="Content Management">Content Management</Option>
                </Select>
              </Col>
              <Col xs={24} sm={6}>
                <Select
                  placeholder="Filter by user"
                  value={userFilter}
                  onChange={setUserFilter}
                  style={{ width: "100%" }}
                  allowClear>
                  {users.map((user) => (
                    <Option key={user} value={user}>
                      {user}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={4}>
                <RangePicker
                  style={{ width: "100%" }}
                  onChange={(dates) => setDateRange(dates)}
                  placeholder={["Start", "End"]}
                />
              </Col>
            </Row>
          </Card>

          {/* Activity Logs Table */}
          <Card>
            <Table
              loading={loading}
              columns={activityColumns}
              dataSource={filterActivityLogs()}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} logs`,
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>

        {/* Security Logs Tab */}
        <TabPane
          tab={
            <span>
              <LockOutlined />
              Security Logs
            </span>
          }
          key="security">
          {/* Security Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Events"
                  value={securityStats.totalEvents}
                  prefix={<LockOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="High Severity"
                  value={securityStats.highSeverity}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Blocked"
                  value={securityStats.blocked}
                  prefix={<LockOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Critical"
                  value={securityStats.critical}
                  prefix={<WarningOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Security Filters */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8}>
                <Input
                  placeholder="Search security logs..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={6}>
                <Select
                  placeholder="Filter by severity"
                  value={severityFilter}
                  onChange={setSeverityFilter}
                  style={{ width: "100%" }}
                  allowClear>
                  <Option value="Critical">Critical</Option>
                  <Option value="High">High</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="Low">Low</Option>
                </Select>
              </Col>
              <Col xs={24} sm={6}>
                <Select
                  placeholder="Filter by status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: "100%" }}
                  allowClear>
                  <Option value="Blocked">Blocked</Option>
                  <Option value="Success">Success</Option>
                  <Option value="Monitoring">Monitoring</Option>
                  <Option value="Locked">Locked</Option>
                  <Option value="Mitigated">Mitigated</Option>
                </Select>
              </Col>
              <Col xs={24} sm={4}>
                <RangePicker
                  style={{ width: "100%" }}
                  onChange={(dates) => setDateRange(dates)}
                  placeholder={["Start", "End"]}
                />
              </Col>
            </Row>
          </Card>

          {/* Security Logs Table */}
          <Card>
            <Table
              loading={loading}
              columns={securityColumns}
              dataSource={filterSecurityLogs()}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} logs`,
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>

        {/* System Alerts Tab */}
        <TabPane
          tab={
            <span>
              <WarningOutlined />
              System Alerts
            </span>
          }
          key="alerts">
          {/* Alert Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Alerts"
                  value={alertStats.totalAlerts}
                  prefix={<BellOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Active Alerts"
                  value={alertStats.active}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Critical Alerts"
                  value={alertStats.critical}
                  prefix={<WarningOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Resolved"
                  value={alertStats.resolved}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Alert Filters */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={6}>
                <Input
                  placeholder="Search alerts..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={4}>
                <Select
                  placeholder="Type"
                  value={typeFilter}
                  onChange={setTypeFilter}
                  style={{ width: "100%" }}
                  allowClear>
                  <Option value="Security">Security</Option>
                  <Option value="Inventory">Inventory</Option>
                  <Option value="System">System</Option>
                  <Option value="Performance">Performance</Option>
                  <Option value="Application">Application</Option>
                </Select>
              </Col>
              <Col xs={24} sm={4}>
                <Select
                  placeholder="Severity"
                  value={severityFilter}
                  onChange={setSeverityFilter}
                  style={{ width: "100%" }}
                  allowClear>
                  <Option value="Critical">Critical</Option>
                  <Option value="High">High</Option>
                  <Option value="Warning">Warning</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="Info">Info</Option>
                </Select>
              </Col>
              <Col xs={24} sm={4}>
                <Select
                  placeholder="Status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: "100%" }}
                  allowClear>
                  <Option value="Active">Active</Option>
                  <Option value="Resolved">Resolved</Option>
                  <Option value="Monitoring">Monitoring</Option>
                  <Option value="Investigating">Investigating</Option>
                </Select>
              </Col>
              <Col xs={24} sm={6}>
                <RangePicker
                  style={{ width: "100%" }}
                  onChange={(dates) => setDateRange(dates)}
                  placeholder={["Start Date", "End Date"]}
                />
              </Col>
            </Row>
          </Card>

          {/* System Alerts Table */}
          <Card>
            <Table
              loading={loading}
              columns={alertColumns}
              dataSource={filterSystemAlerts()}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} alerts`,
              }}
              expandable={{
                expandedRowRender: (record) => (
                  <div>
                    <p style={{ margin: 0 }}>
                      <Text strong>Message:</Text> {record.message}
                    </p>
                    {record.recommendedAction && (
                      <p style={{ margin: "8px 0 0 0" }}>
                        <Text strong>Recommended Action:</Text>{" "}
                        {record.recommendedAction}
                      </p>
                    )}
                  </div>
                ),
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Activity Log Details Modal */}
      <Modal
        title="Activity Log Details"
        open={isActivityDetailModalVisible}
        onCancel={() => {
          setIsActivityDetailModalVisible(false);
          setSelectedActivityLog(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsActivityDetailModalVisible(false);
              setSelectedActivityLog(null);
            }}>
            Close
          </Button>,
        ]}
        width={700}>
        {selectedActivityLog && (
          <Descriptions title="Log Information" bordered column={2}>
            <Descriptions.Item label="Log ID">
              {selectedActivityLog.id}
            </Descriptions.Item>
            <Descriptions.Item label="Timestamp">
              {selectedActivityLog.timestamp
                ? new Date(selectedActivityLog.timestamp).toLocaleString()
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="User">
              {selectedActivityLog.user || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="User Role">
              <Tag color="blue">
                {selectedActivityLog.userRole || "Unknown"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Action">
              {selectedActivityLog.action || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag color="purple">{selectedActivityLog.type || "Unknown"}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedActivityLog.status === "Success" ? "green" : "red"
                }>
                {selectedActivityLog.status || "Unknown"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="IP Address">
              {selectedActivityLog.ipAddress || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Details" span={2}>
              {selectedActivityLog.details || "No details available"}
            </Descriptions.Item>

            {/* Additional fields based on log type */}
            {selectedActivityLog.sessionId && (
              <Descriptions.Item label="Session ID">
                {selectedActivityLog.sessionId}
              </Descriptions.Item>
            )}
            {selectedActivityLog.targetUser && (
              <Descriptions.Item label="Target User">
                {selectedActivityLog.targetUser}
              </Descriptions.Item>
            )}
            {selectedActivityLog.serviceId && (
              <Descriptions.Item label="Service ID">
                {selectedActivityLog.serviceId}
              </Descriptions.Item>
            )}
            {selectedActivityLog.oldValue && (
              <Descriptions.Item label="Old Value">
                {selectedActivityLog.oldValue}
              </Descriptions.Item>
            )}
            {selectedActivityLog.newValue && (
              <Descriptions.Item label="New Value">
                {selectedActivityLog.newValue}
              </Descriptions.Item>
            )}
            {selectedActivityLog.userAgent && (
              <Descriptions.Item label="User Agent" span={2}>
                {selectedActivityLog.userAgent}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Security Log Details Modal */}
      <Modal
        title="Security Log Details"
        open={isSecurityDetailModalVisible}
        onCancel={() => {
          setIsSecurityDetailModalVisible(false);
          setSelectedSecurityLog(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsSecurityDetailModalVisible(false);
              setSelectedSecurityLog(null);
            }}>
            Close
          </Button>,
        ]}
        width={700}>
        {selectedSecurityLog && (
          <Descriptions title="Security Event Information" bordered column={2}>
            <Descriptions.Item label="Event ID">
              {selectedSecurityLog.id}
            </Descriptions.Item>
            <Descriptions.Item label="Timestamp">
              {selectedSecurityLog.timestamp
                ? new Date(selectedSecurityLog.timestamp).toLocaleString()
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="User">
              {selectedSecurityLog.user || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Action">
              {selectedSecurityLog.action || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Severity">
              <Tag
                color={
                  selectedSecurityLog.severity === "Critical"
                    ? "red"
                    : selectedSecurityLog.severity === "High"
                    ? "orange"
                    : selectedSecurityLog.severity === "Medium"
                    ? "yellow"
                    : "green"
                }>
                {selectedSecurityLog.severity || "Unknown"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedSecurityLog.status === "Blocked"
                    ? "red"
                    : selectedSecurityLog.status === "Success"
                    ? "green"
                    : selectedSecurityLog.status === "Monitoring"
                    ? "orange"
                    : "blue"
                }>
                {selectedSecurityLog.status || "Unknown"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="IP Address">
              {selectedSecurityLog.ipAddress || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {selectedSecurityLog.location || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Details" span={2}>
              {selectedSecurityLog.details || "No details available"}
            </Descriptions.Item>

            {/* Additional fields based on log type */}
            {selectedSecurityLog.threatType && (
              <Descriptions.Item label="Threat Type">
                {selectedSecurityLog.threatType}
              </Descriptions.Item>
            )}
            {selectedSecurityLog.attemptCount && (
              <Descriptions.Item label="Attempt Count">
                {selectedSecurityLog.attemptCount}
              </Descriptions.Item>
            )}
            {selectedSecurityLog.riskScore && (
              <Descriptions.Item label="Risk Score">
                {selectedSecurityLog.riskScore}
              </Descriptions.Item>
            )}
            {selectedSecurityLog.userAgent && (
              <Descriptions.Item label="User Agent" span={2}>
                {selectedSecurityLog.userAgent}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Alert Details Modal */}
      <Modal
        title="System Alert Details"
        open={isAlertDetailModalVisible}
        onCancel={() => {
          setIsAlertDetailModalVisible(false);
          setSelectedAlert(null);
        }}
        footer={[
          <Button
            key="resolve"
            type="primary"
            onClick={() => {
              if (selectedAlert && selectedAlert.status === "Active") {
                handleResolveAlert(selectedAlert.id);
              }
              setIsAlertDetailModalVisible(false);
              setSelectedAlert(null);
            }}
            disabled={selectedAlert?.status !== "Active"}>
            Mark as Resolved
          </Button>,
          <Button
            key="close"
            onClick={() => {
              setIsAlertDetailModalVisible(false);
              setSelectedAlert(null);
            }}>
            Close
          </Button>,
        ]}
        width={700}>
        {selectedAlert && (
          <Descriptions title="Alert Information" bordered column={2}>
            <Descriptions.Item label="Alert ID">
              {selectedAlert.id}
            </Descriptions.Item>
            <Descriptions.Item label="Timestamp">
              {selectedAlert.timestamp
                ? new Date(selectedAlert.timestamp).toLocaleString()
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag color="blue">{selectedAlert.type || "Unknown"}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Severity">
              <Tag
                color={
                  selectedAlert.severity === "Critical"
                    ? "red"
                    : selectedAlert.severity === "High"
                    ? "orange"
                    : selectedAlert.severity === "Warning" ||
                      selectedAlert.severity === "Medium"
                    ? "yellow"
                    : "green"
                }>
                {selectedAlert.severity || "Unknown"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedAlert.status === "Active"
                    ? "red"
                    : selectedAlert.status === "Resolved"
                    ? "green"
                    : "orange"
                }>
                {selectedAlert.status || "Unknown"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Priority">
              <Tag
                color={
                  selectedAlert.priority === "Critical"
                    ? "red"
                    : selectedAlert.priority === "High"
                    ? "orange"
                    : selectedAlert.priority === "Medium"
                    ? "yellow"
                    : "green"
                }>
                {selectedAlert.priority || "Unknown"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Affected System">
              {selectedAlert.affectedSystem || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Title">
              {selectedAlert.title || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Message" span={2}>
              {selectedAlert.message || "No message available"}
            </Descriptions.Item>

            {/* Conditional fields based on alert type */}
            {selectedAlert.threshold && (
              <Descriptions.Item label="Threshold">
                {selectedAlert.threshold}
              </Descriptions.Item>
            )}
            {selectedAlert.currentValue && (
              <Descriptions.Item label="Current Value">
                {selectedAlert.currentValue}
              </Descriptions.Item>
            )}
            {selectedAlert.ipAddress && (
              <Descriptions.Item label="IP Address">
                {selectedAlert.ipAddress}
              </Descriptions.Item>
            )}
            {selectedAlert.recommendedAction && (
              <Descriptions.Item label="Recommended Action" span={2}>
                <Text strong style={{ color: "#1890ff" }}>
                  {selectedAlert.recommendedAction}
                </Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default SystemLogs;
