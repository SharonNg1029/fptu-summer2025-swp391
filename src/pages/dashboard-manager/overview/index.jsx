import React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  Button,
  Divider,
  Alert,
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  FileDoneOutlined,
  LoadingOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  TeamOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;

const ManagerOverviewPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState({
    totalTestsPerformed: 0,
    staffReportsPending: 0,
    totalCustomers: 0,
  });
  // eslint-disable-next-line no-unused-vars
  const [bookingsData, setBookingsData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [staffData, setStaffData] = useState([]);
  const [chartData, setChartData] = useState({
    performanceMetrics: [],
    testStatusDistribution: [],
    staffWorkload: [],
    weeklyProgress: [],
    staffEfficiency: [],
  });
  // State cho tổng revenue từ booking Completed
  const [completedRevenue, setCompletedRevenue] = useState(0);
  // State lưu tất cả bookings từ API /booking/bookings
  const [allBookings, setAllBookings] = useState([]);
  // const [kitTransactions, setKitTransactions] = useState([]);
  const [assignedBookings, setAssignedBookings] = useState([]);

  // --- Calculate reports needing assign/approve ---
  // 1. Reports needing assign: status === "Awaiting Confirmation"
  const reportsNeedAssign = assignedBookings.filter(
    (b) =>
      b.status === "Awaiting Confirmation" || b.status === "Awaiting confirm"
  ).length;
  // 2. Reports needing approve: status !== "Completed" && isApproved !== true
  // (We don't have isApproved in assignedBookings, so only use status if needed)
  // But for demo, let's count all assignedBookings with status !== "Completed"
  const reportsNeedApprove = assignedBookings.filter(
    (b) => b.status !== "Completed"
  ).length;

  // Generate chart data for 2 charts: Performance Metrics & Test Status Distribution
  const generateChartData = useCallback(() => {
    // Tính tổng revenue từ các booking có status là 'Completed' từ allBookings
    const revenue = allBookings
      .filter((b) => b.status === "Completed")
      .reduce((sum, b) => sum + Number(b.totalCost || 0), 0);
    setCompletedRevenue(Math.round(revenue));
    // 1. Weekly Performance Metrics chart: mỗi tuần là số lượng booking thực tế theo tuần (dựa vào bookingAssigned)
    // Giả sử booking có trường createdAt dạng ISO date
    const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const now = new Date();
    // Lấy ngày đầu tháng hiện tại
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Tạo mốc tuần
    const weekRanges = Array.from({ length: 4 }, (_, i) => {
      const start = new Date(firstDayOfMonth);
      start.setDate(start.getDate() + i * 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return { start, end };
    });

    // Đếm số lượng booking completed và pending theo tuần
    const performanceMetrics = weekRanges.map((range, idx) => {
      const bookingsInWeek = assignedBookings.filter((b) => {
        if (!b.createdAt) return false;
        const created = new Date(b.createdAt);
        return created >= range.start && created <= range.end;
      });
      const performed = bookingsInWeek.filter(
        (b) => b.status === "Completed"
      ).length;
      const pending = bookingsInWeek.filter(
        (b) => b.status !== "Completed"
      ).length;
      const total = performed + pending;
      return {
        period: weekLabels[idx],
        performed,
        pending,
        efficiency: total ? Math.round((performed / total) * 100) : 0,
      };
    });

    // 2. Test Status Distribution chart: đếm số lượng booking theo status thực tế
    const statusCountMap = {};
    const validStatuses = [
      "Awaiting Confirmation",
      "Payment Confirmed",
      "Booking Confirmed",
      "Awaiting Sample",
      "In Progress",
      "Completed",
      "Cancelled",
    ];

    assignedBookings.forEach((b) => {
      // Only count valid statuses
      if (validStatuses.includes(b.status)) {
        if (!statusCountMap[b.status]) statusCountMap[b.status] = 0;
        statusCountMap[b.status] += 1;
      }
    });

    const statusColors = [
      "#52c41a", // Green for Completed
      "#faad14", // Orange for In Progress
      "#ff4d4f", // Red for Cancelled
      "#1890ff", // Blue for Booking Confirmed
      "#722ed1", // Purple for Awaiting Sample
      "#13c2c2", // Cyan for Payment Confirmed
      "#eb2f96", // Pink for Awaiting Confirmation
    ];
    const totalBookings = assignedBookings.filter((b) =>
      validStatuses.includes(b.status)
    ).length;
    const testStatusDistribution = Object.entries(statusCountMap).map(
      ([status, value], idx) => ({
        name: status,
        value,
        color: statusColors[idx % statusColors.length],
        percentage: totalBookings
          ? Math.round((value / totalBookings) * 100)
          : 0,
      })
    );

    setChartData({
      performanceMetrics,
      testStatusDistribution,
    });
  }, [assignedBookings, allBookings]);

  const fetchManagerOverviewData = useCallback(async () => {
    setLoading(true);
    try {
      // Gọi song song 3 API: kit, assigned, all bookings
      const [kitRes, assignedRes, allBookingsRes] = await Promise.all([
        api.get("/manager/kit-transaction"),
        api.get("/manager/booking-assigned"),
        api.get("/booking/bookings"),
      ]);
      const kitList = kitRes.data?.data || kitRes.data || [];
      const assignedList = assignedRes.data?.data || assignedRes.data || [];
      const allBookingList =
        allBookingsRes.data?.data || allBookingsRes.data || [];
      setAssignedBookings(assignedList);
      setAllBookings(allBookingList);

      // Tổng số kit đã nhận
      const kitsReceived = kitList.filter((k) => k.received === true).length;
      // Tổng số booking đã assign
      const totalAssigned = assignedList.length;
      // Tổng số booking completed
      const totalCompleted = assignedList.filter(
        (b) => b.status === "Completed"
      ).length;
      // Tổng số booking pending
      const totalPending = assignedList.filter(
        (b) => b.status !== "Completed"
      ).length;
      // Số staff unique
      const staffNames = Array.from(
        new Set(assignedList.map((b) => b.staffName))
      );
      const staffAvailable = staffNames.length;

      setOverviewData({
        totalTestsPerformed: totalCompleted,
        staffReportsPending: totalPending,
        totalCustomers: staffAvailable,
        kitsReceived,
        totalAssigned,
      });
      setBookingsData(assignedList);
      setStaffData(staffNames);
    } catch (error) {
      toast.error("Failed to fetch manager overview data.");
      console.error("Error fetching manager overview data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate chart data when overview data changes
  useEffect(() => {
    if (!loading) {
      generateChartData();
    }
  }, [generateChartData, loading]);

  useEffect(() => {
    fetchManagerOverviewData();
  }, [fetchManagerOverviewData]);

  const COLORS = ["#52c41a", "#faad14", "#ff4d4f", "#1890ff", "#722ed1"];

  return (
    <div style={{ padding: "0 24px" }}>
      {/* Notification for reports needing assign */}
      <Row gutter={[0, 16]} style={{ marginBottom: 8 }}>
        <Col span={24}>
          <Alert
            type="info"
            showIcon
            message={
              <span>
                There are currently <b>{reportsNeedAssign}</b> reports that need
                staff assignment.{" "}
                <Button
                  type="link"
                  icon={<ArrowRightOutlined />}
                  onClick={() =>
                    navigate("/manager-dashboard/view-staff-reports")
                  }
                  style={{ padding: 0 }}>
                  View details
                </Button>
              </span>
            }
            style={{ background: "#e6f7ff", border: "1px solid #91d5ff" }}
          />
        </Col>
      </Row>
      {/* Notification for reports needing approve */}
      <Row gutter={[0, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Alert
            type="warning"
            showIcon
            message={
              <span>
                There are <b>{reportsNeedApprove}</b> reports that need approval
                review.{" "}
                <Button
                  type="link"
                  icon={<ArrowRightOutlined />}
                  onClick={() =>
                    navigate(
                      "/manager-dashboard/view-staff-reports?tab=approve"
                    )
                  }
                  style={{ padding: 0 }}>
                  View details
                </Button>
              </span>
            }
            style={{ background: "#fffbe6", border: "1px solid #ffe58f" }}
          />
        </Col>
      </Row>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}>
        <Title level={2} style={{ marginBottom: 0 }}>
          Manager Dashboard Overview
        </Title>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={fetchManagerOverviewData}
          loading={loading}>
          Refresh Data
        </Button>
      </div>

      <ToastContainer />

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <p style={{ marginTop: 20 }}>Loading overview data...</p>
        </div>
      ) : (
        <div>
          {/* Enhanced Stats Cards */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{
                  borderRadius: 16,
                  minHeight: 140,
                  boxShadow: "0 4px 20px rgba(24, 144, 255, 0.1)",
                  border: "1px solid #e6f7ff",
                }}>
                <Statistic
                  title={
                    <span
                      style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                      Total Tests Performed
                    </span>
                  }
                  value={overviewData.totalTestsPerformed}
                  prefix={
                    <DashboardOutlined
                      style={{ color: "#1890ff", fontSize: 24 }}
                    />
                  }
                  valueStyle={{
                    color: "#1890ff",
                    fontSize: 32,
                    fontWeight: 700,
                  }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                  Completion Rate:{" "}
                  {Math.round(
                    (overviewData.totalTestsPerformed /
                      (overviewData.totalTestsPerformed +
                        overviewData.staffReportsPending)) *
                      100
                  ) || 0}
                  %
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{
                  borderRadius: 16,
                  minHeight: 140,
                  boxShadow: "0 4px 20px rgba(250, 173, 20, 0.1)",
                  border: "1px solid #fffbe6",
                }}>
                <Statistic
                  title={
                    <span
                      style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                      Tests Pending
                    </span>
                  }
                  value={overviewData.staffReportsPending}
                  prefix={
                    <FileDoneOutlined
                      style={{ color: "#faad14", fontSize: 24 }}
                    />
                  }
                  valueStyle={{
                    color: "#faad14",
                    fontSize: 32,
                    fontWeight: 700,
                  }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                  Requires immediate attention
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{
                  borderRadius: 16,
                  minHeight: 140,
                  boxShadow: "0 4px 20px rgba(82, 196, 26, 0.1)",
                  border: "1px solid #f6ffed",
                }}>
                <Statistic
                  title={
                    <span
                      style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                      Active Staff
                    </span>
                  }
                  value={overviewData.totalCustomers}
                  prefix={
                    <TeamOutlined style={{ color: "#52c41a", fontSize: 24 }} />
                  }
                  valueStyle={{
                    color: "#52c41a",
                    fontSize: 32,
                    fontWeight: 700,
                  }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                  Available for assignments
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{
                  borderRadius: 16,
                  minHeight: 140,
                  boxShadow: "0 4px 20px rgba(250, 173, 20, 0.1)",
                  border: "1px solid #fffbe6",
                }}>
                <Statistic
                  title={
                    <span
                      style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                      Revenue
                    </span>
                  }
                  value={
                    completedRevenue >= 1000000
                      ? `$${(completedRevenue / 1000000).toFixed(1)}M`
                      : completedRevenue >= 1000
                      ? `$${(completedRevenue / 1000).toFixed(1)}K`
                      : `$${completedRevenue}`
                  }
                  valueStyle={{
                    color: "#faad14",
                    fontSize: 32,
                    fontWeight: 700,
                  }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                  Revenue from completed bookings
                </div>
              </Card>
            </Col>
          </Row>

          {/* Charts Section */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            {/* Performance Metrics Chart */}
            <Col xs={24} lg={16}>
              <Card
                title={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BarChartOutlined style={{ color: "#1890ff" }} />
                    <span style={{ fontWeight: 600, fontSize: 18 }}>
                      Weekly Performance Metrics
                    </span>
                  </div>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData.performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: "#d9d9d9" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: "#d9d9d9" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #d9d9d9",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="performed"
                      fill="#52c41a"
                      name="Tests Performed"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="pending"
                      fill="#faad14"
                      name="Tests Pending"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Test Status Distribution */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <PieChartOutlined style={{ color: "#52c41a" }} />
                    <span style={{ fontWeight: 600, fontSize: 18 }}>
                      Test Status Distribution
                    </span>
                  </div>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={chartData.testStatusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value">
                      {chartData.testStatusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} tests`, name]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #d9d9d9",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* Đã xóa các chart: Staff Workload Distribution, Efficiency Metrics, Weekly Progress vs Target */}
        </div>
      )}
    </div>
  );
};

export default ManagerOverviewPage;
