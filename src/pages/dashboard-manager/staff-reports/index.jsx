import React, { useState, useEffect, useCallback } from "react";
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
  Modal,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  EditOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ViewReports = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [todayReports, setTodayReports] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [activeTab, setActiveTab] = useState("today");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [staffFilter, setStaffFilter] = useState("");
  const [dateRange, setDateRange] = useState([]);

  // Pagination states
  const [todayPagination, setTodayPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [allPagination, setAllPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // Get today's date
  const today = dayjs().format("YYYY-MM-DD");

  // Status options
  const reportStatusOptions = [
    "Pending",
    "Approved",
    "Rejected",
    "Resolved",
    "Completed",
    "Delay",
    "Cancel",
  ];

  // Fetch staff list for filter dropdown
  const fetchStaffList = useCallback(async () => {
    try {
      const response = await api.get("/manager/staff-list");
      setStaffList(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Failed to fetch staff list:", error);
    }
  }, []);

  // Fetch today's reports
  const fetchTodayReports = useCallback(
    async (filters = {}) => {
      setLoading(true);
      try {
        const response = await api.get("/manager/today-reports", {
          params: { date: today, ...filters },
        });
        setTodayReports(response.data?.data || response.data || []);
      } catch (error) {
        toast.error(
          "Failed to fetch today's reports: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
      }
    },
    [today]
  );

  // Fetch all reports with filters
  const fetchAllReports = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await api.get("/manager/all-reports", {
        params: filters,
      });
      setReports(response.data?.data || response.data || []);
    } catch (error) {
      toast.error(
        "Failed to fetch reports: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaffList();
    fetchTodayReports();
    fetchAllReports();
  }, [fetchStaffList, fetchTodayReports, fetchAllReports]);

  // Handle search and filter for today's reports
  // Removed unused handleTodaySearch, handleAllSearch, handleReset (no longer needed)

  // Export today's reports to PDF
  const handleExportTodayPDF = () => {
    try {
      if (!jsPDF || !jsPDF.prototype.autoTable) {
        toast.error("jsPDF autoTable plugin is not available.");
        return;
      }

      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.text(`Today's Staff Reports - ${today}`, 14, 20);

      const tableColumns = [
        "Report ID",
        "Staff Name",
        "Booking ID",
        "Appointment Time",
        "Status",
        "Note",
      ];

      const tableRows = todayReports.map((row) => [
        row.id || "-",
        row.staffName || "N/A",
        row.bookingId || "-",
        row.appointmentTime || "-",
        row.status || "-",
        row.note || "-",
      ]);

      doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 30,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 119, 255] },
      });

      doc.save(`today_reports_${today}.pdf`);
      toast.success("Today's reports PDF exported successfully!");
    } catch (error) {
      toast.error("Failed to export PDF: " + error.message);
    }
  };

  // Export all reports to PDF
  const handleExportAllPDF = () => {
    try {
      if (!jsPDF || !jsPDF.prototype.autoTable) {
        toast.error("jsPDF autoTable plugin is not available.");
        return;
      }

      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.text("All Staff Reports", 14, 20);

      const tableColumns = [
        "Report ID",
        "Staff Name",
        "Booking ID",
        "Appointment Time",
        "Status",
        "Note",
      ];

      const tableRows = reports.map((row) => [
        row.id || "-",
        row.staffName || "N/A",
        row.bookingId || "-",
        row.appointmentTime || "-",
        row.status || "-",
        row.note || "-",
      ]);

      doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 30,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 119, 255] },
      });

      doc.save(`all_staff_reports_${dayjs().format("YYYY-MM-DD")}.pdf`);
      toast.success("All reports PDF exported successfully!");
    } catch (error) {
      toast.error("Failed to export PDF: " + error.message);
    }
  };

  // Get statistics for today's reports
  const getTodayStats = () => {
    const completed = todayReports.filter(
      (r) => r.status === "Completed" || r.status === "Resolved"
    ).length;
    const pending = todayReports.filter((r) => r.status === "Pending").length;
    const delayed = todayReports.filter((r) => r.status === "Delay").length;
    const cancelled = todayReports.filter(
      (r) => r.status === "Cancel" || r.status === "Rejected"
    ).length;

    return {
      completed,
      pending,
      delayed,
      cancelled,
      total: todayReports.length,
    };
  };

  // Table columns for today's reports
  const todayReportColumns = [
    {
      title: "Report ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => (a.id || "").localeCompare(b.id || ""),
      width: 100,
    },
    {
      title: "Staff Name",
      dataIndex: "staffName",
      key: "staffName",
      sorter: (a, b) => (a.staffName || "").localeCompare(b.staffName || ""),
      width: 120,
    },
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      render: (bookingId) => bookingId || "-",
      width: 100,
    },
    {
      title: "Appointment Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (time) => (time ? dayjs(time).format("HH:mm DD/MM/YYYY") : "-"),
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let icon = null;
        if (status === "Completed" || status === "Resolved") {
          color = "green";
          icon = <CheckCircleOutlined />;
        }
        if (status === "Pending") {
          color = "orange";
          icon = <ClockCircleOutlined />;
        }
        if (status === "Delay") {
          color = "orange";
          icon = <ClockCircleOutlined />;
        }
        if (status === "Cancel" || status === "Rejected") {
          color = "red";
          icon = <CloseCircleOutlined />;
        }
        if (status === "Approved") {
          color = "blue";
          icon = <CheckCircleOutlined />;
        }
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
      width: 100,
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (note) => note || "-",
      ellipsis: true,
    },
  ];

  // Table columns for all reports
  const allReportColumns = [
    {
      title: "Report ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => (a.id || "").localeCompare(b.id || ""),
      width: 100,
    },
    {
      title: "Staff Name",
      dataIndex: "staffName",
      key: "staffName",
      sorter: (a, b) => (a.staffName || "").localeCompare(b.staffName || ""),
      width: 120,
    },
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      render: (bookingId) => bookingId || "-",
      width: 100,
    },
    {
      title: "Appointment Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (time) => (time ? dayjs(time).format("HH:mm DD/MM/YYYY") : "-"),
      sorter: (a, b) =>
        dayjs(a.appointmentTime).unix() - dayjs(b.appointmentTime).unix(),
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let icon = null;
        if (status === "Completed" || status === "Resolved") {
          color = "green";
          icon = <CheckCircleOutlined />;
        }
        if (status === "Pending") {
          color = "orange";
          icon = <ClockCircleOutlined />;
        }
        if (status === "Delay") {
          color = "orange";
          icon = <ClockCircleOutlined />;
        }
        if (status === "Cancel" || status === "Rejected") {
          color = "red";
          icon = <CloseCircleOutlined />;
        }
        if (status === "Approved") {
          color = "blue";
          icon = <CheckCircleOutlined />;
        }
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
      filters: reportStatusOptions.map((status) => ({
        text: status,
        value: status,
      })),
      onFilter: (value, record) => record.status === value,
      width: 100,
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (note) => note || "-",
      ellipsis: true,
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      width: 120,
    },
  ];

  const stats = getTodayStats();

  // Tab items
  const tabItems = [
    {
      key: "today",
      label: (
        <span>
          <CalendarOutlined style={{ marginRight: 8 }} />
          Today's Reports
        </span>
      ),
      children: (
        <>
          {/* Statistics Cards */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Reports"
                  value={stats.total}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: "#1677ff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Completed"
                  value={stats.completed}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Pending"
                  value={stats.pending}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Issues"
                  value={stats.delayed + stats.cancelled}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Table */}
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
                gap: 16,
                flexWrap: "wrap",
              }}>
              <Title level={4} style={{ margin: 0, flex: 1 }}>
                Today's Staff Reports ({todayReports.length})
              </Title>
              {/* Action buttons for Export PDF and Refresh (moved here) */}
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExportAllPDF}
                type="default">
                Export PDF
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchAllReports()}
                loading={loading}
                type="primary">
                Refresh
              </Button>
            </div>

            <div
              style={{
                marginBottom: 16,
                display: "flex",
                gap: 16,
                alignItems: "center",
                flexWrap: "wrap",
              }}>
              <Input
                placeholder="Search reports..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  const filters = {
                    staffId: staffFilter,
                    status: statusFilter,
                    search: e.target.value,
                  };
                  fetchTodayReports(filters);
                }}
                allowClear
                style={{ width: 300 }}
              />

              <Select
                placeholder="All Staff"
                value={staffFilter}
                onChange={(value) => {
                  setStaffFilter(value);
                  const filters = {
                    staffId: value,
                    status: statusFilter,
                    search: searchText,
                  };
                  fetchTodayReports(filters);
                }}
                allowClear
                style={{ width: 200 }}>
                {staffList.map((staff) => (
                  <Option key={staff.id} value={staff.id}>
                    {staff.name || staff.fullName}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="All Statuses"
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  const filters = {
                    staffId: staffFilter,
                    status: value,
                    search: searchText,
                  };
                  fetchTodayReports(filters);
                }}
                allowClear
                style={{ width: 200 }}>
                <Option value="Pending">Pending</Option>
                <Option value="Approved">Approved</Option>
                <Option value="Rejected">Rejected</Option>
                <Option value="Resolved">Resolved</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Delay">Delay</Option>
                <Option value="Cancel">Cancel</Option>
              </Select>

              {/* Action buttons for Export PDF and Refresh (moved here) */}
            </div>

            <Table
              loading={loading}
              columns={todayReportColumns}
              dataSource={todayReports}
              rowKey="id"
              pagination={{
                ...todayPagination,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50],
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} reports`,
              }}
              onChange={(paginationConfig) => {
                setTodayPagination({
                  current: paginationConfig.current,
                  pageSize: paginationConfig.pageSize,
                });
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </>
      ),
    },
    {
      key: "all",
      label: (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          All Reports
        </span>
      ),
      children: (
        <>
          {/* Table */}
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
                gap: 16,
                flexWrap: "wrap",
              }}>
              <Title level={4} style={{ margin: 0, flex: 1 }}>
                All Staff Reports ({reports.length})
              </Title>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExportTodayPDF}
                type="default">
                Export PDF
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchTodayReports()}
                loading={loading}
                type="primary">
                Refresh
              </Button>
            </div>

            <div
              style={{
                marginBottom: 16,
                display: "flex",
                gap: 16,
                alignItems: "center",
                flexWrap: "wrap",
              }}>
              <Input
                placeholder="Search reports..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  const filters = {
                    staffId: staffFilter,
                    status: statusFilter,
                    search: e.target.value,
                  };
                  if (dateRange && dateRange.length === 2) {
                    filters.startDate = dateRange[0].format("YYYY-MM-DD");
                    filters.endDate = dateRange[1].format("YYYY-MM-DD");
                  }
                  fetchAllReports(filters);
                }}
                allowClear
                style={{ width: 300 }}
              />

              <Select
                placeholder="All Staff"
                value={staffFilter}
                onChange={(value) => {
                  setStaffFilter(value);
                  const filters = {
                    staffId: value,
                    status: statusFilter,
                    search: searchText,
                  };
                  if (dateRange && dateRange.length === 2) {
                    filters.startDate = dateRange[0].format("YYYY-MM-DD");
                    filters.endDate = dateRange[1].format("YYYY-MM-DD");
                  }
                  fetchAllReports(filters);
                }}
                allowClear
                style={{ width: 200 }}>
                {staffList.map((staff) => (
                  <Option key={staff.id} value={staff.id}>
                    {staff.name || staff.fullName}
                  </Option>
                ))}
              </Select>

              <RangePicker
                value={dateRange}
                onChange={(range) => {
                  setDateRange(range);
                  const filters = {
                    staffId: staffFilter,
                    status: statusFilter,
                    search: searchText,
                  };
                  if (range && range.length === 2) {
                    filters.startDate = range[0].format("YYYY-MM-DD");
                    filters.endDate = range[1].format("YYYY-MM-DD");
                  }
                  fetchAllReports(filters);
                }}
                style={{ width: 300 }}
              />

              <Select
                placeholder="All Statuses"
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  const filters = {
                    staffId: staffFilter,
                    status: value,
                    search: searchText,
                  };
                  if (dateRange && dateRange.length === 2) {
                    filters.startDate = dateRange[0].format("YYYY-MM-DD");
                    filters.endDate = dateRange[1].format("YYYY-MM-DD");
                  }
                  fetchAllReports(filters);
                }}
                allowClear
                style={{ width: 200 }}>
                <Option value="Pending">Pending</Option>
                <Option value="Approved">Approved</Option>
                <Option value="Rejected">Rejected</Option>
                <Option value="Resolved">Resolved</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Delay">Delay</Option>
                <Option value="Cancel">Cancel</Option>
              </Select>
            </div>

            <Table
              loading={loading}
              columns={allReportColumns}
              dataSource={reports}
              rowKey="id"
              pagination={{
                ...allPagination,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50, 100],
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} reports`,
              }}
              onChange={(paginationConfig) => {
                setAllPagination({
                  current: paginationConfig.current,
                  pageSize: paginationConfig.pageSize,
                });
              }}
              scroll={{ x: 1000 }}
            />
          </Card>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 24px" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Staff Work Reports Management
      </Title>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        style={{ marginBottom: 24 }}
        tabBarStyle={{ marginBottom: 32 }}
        items={tabItems}
      />

      <ToastContainer />
    </div>
  );
};

export default ViewReports;
