import React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Table,
  Tag,
  Button,
  DatePicker,
  Divider,
} from "antd";
import {
  UserOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
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
  Area,
  AreaChart,
} from "recharts";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [stats, setStats] = useState({
    totalCustomer: 0,
    completedTests: 0,
    revenue: 0,
    kitsSold: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [chartData, setChartData] = useState({
    monthlyStats: [],
    statusDistribution: [],
    weeklyTrends: [],
  });

  // Generate chart data based on current stats and bookings
  const generateChartData = useCallback(() => {
    // Group bookings by month and week for real chart data
    const bookings = allBookings;
    // Helper: get month label (e.g. 'Jan') from date string
    const getMonthLabel = (dateStr) => {
      const d = new Date(dateStr);
      return d.toLocaleString("default", { month: "short" });
    };
    // Helper: get year-month key (e.g. '2025-06')
    const getYearMonth = (dateStr) => {
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    };
    // Helper: get week number in year
    const getWeekNumber = (dateStr) => {
      const d = new Date(dateStr);
      const firstDay = new Date(d.getFullYear(), 0, 1);
      const pastDays = (d - firstDay) / 86400000;
      return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
    };

    // Monthly stats: group by year-month
    const monthlyMap = {};
    bookings.forEach((b) => {
      if (!b.request_date) return;
      const ym = getYearMonth(b.request_date);
      if (!monthlyMap[ym]) {
        monthlyMap[ym] = {
          tests: 0,
          revenue: 0,
          month: getMonthLabel(b.request_date),
        };
      }
      monthlyMap[ym].tests += 1;
      monthlyMap[ym].revenue += Number(b.totalCost || 0);
    });
    // Sort by year-month ascending, limit to 6 months (latest)
    const sortedMonths = Object.keys(monthlyMap).sort().slice(-6);
    const monthlyStats = sortedMonths.map((ym) => ({
      month: monthlyMap[ym].month,
      tests: monthlyMap[ym].tests,
      revenue: Math.round(monthlyMap[ym].revenue),
    }));

    // Status distribution based on ALL bookings
    const statusCounts = bookings.reduce((acc, booking) => {
      const status = booking.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    const statusDistribution = Object.entries(statusCounts).map(
      ([status, count]) => ({
        name: status,
        value: count,
        color:
          status === "Completed"
            ? "#52c41a"
            : status === "Pending"
            ? "#faad14"
            : status === "Cancelled"
            ? "#ff4d4f"
            : "#1890ff",
      })
    );

    // Weekly trends: group by week number in current year
    const weekMap = {};
    bookings.forEach((b) => {
      if (!b.request_date) return;
      const d = new Date(b.request_date);
      const year = d.getFullYear();
      const week = getWeekNumber(b.request_date);
      const key = `${year}-W${week}`;
      if (!weekMap[key]) {
        weekMap[key] = { week: `W${week}`, bookings: 0, revenue: 0 };
      }
      weekMap[key].bookings += 1;
      weekMap[key].revenue += Number(b.totalCost || 0);
    });
    // Sort by week key ascending, limit to 4 weeks (latest)
    const sortedWeeks = Object.keys(weekMap).sort().slice(-4);
    const weeklyTrends = sortedWeeks.map((key) => ({
      week: weekMap[key].week,
      bookings: weekMap[key].bookings,
      revenue: Math.round(weekMap[key].revenue),
    }));

    setChartData({
      monthlyStats,
      statusDistribution,
      weeklyTrends,
    });
  }, [allBookings]);

  // Main function to fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    // Move getDateParams and fetchRecentBookings inside useCallback to avoid dependency warning
    const getDateParams = () => ({
      startDate: dateRange[0]?.format("YYYY-MM-DD"),
      endDate: dateRange[1]?.format("YYYY-MM-DD"),
    });

    const fetchRecentBookings = async () => {
      try {
        const response = await api.get("/booking/bookings", {
          params: { limit: 5, sort: "desc", sortBy: "request_date" },
        });
        console.log("Recent bookings response:", response);

        let bookingsData = response.data?.data || response.data || [];
        // Ensure only 5 most recent bookings are shown, sorted by request_date descending
        bookingsData = bookingsData
          .slice() // clone array
          .sort((a, b) => new Date(b.request_date) - new Date(a.request_date))
          .slice(0, 5);
        setRecentBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching recent bookings:", error);
        let errorMessage = "Error fetching recent bookings";
        if (error.response?.data?.data) {
          errorMessage = error.response.data.data;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
        throw error;
      }
    };

    const fetchTotalCustomers = async () => {
      try {
        const response = await api.get("/admin/dashboard/customers", {
          params: getDateParams(),
        });
        console.log("Total customers response:", response);

        const customerData = response.data || {};
        setStats((prev) => ({
          ...prev,
          totalCustomer: customerData.totalCustomer || 0,
        }));
      } catch (error) {
        console.error("Error fetching total customers:", error);
        let errorMessage = "Error fetching total customers";
        if (error.response?.data?.data) {
          errorMessage = error.response.data.data;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
        throw error;
      }
    };

    const fetchCompletedTests = async () => {
      try {
        const response = await api.get("/booking/bookings", {
          params: getDateParams(),
        });
        console.log("Completed tests response:", response);

        const bookings = response.data?.data || response.data || [];
        const completedCount = Array.isArray(bookings)
          ? bookings.filter((b) => b.status === "Completed").length
          : 0;
        setStats((prev) => ({
          ...prev,
          completedTests: completedCount,
        }));
      } catch (error) {
        console.error("Error fetching completed tests:", error);
        let errorMessage = "Error fetching completed tests";
        if (error.response?.data?.data) {
          errorMessage = error.response.data.data;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
        throw error;
      }
    };

    const fetchKitsSold = async () => {
      try {
        const response = await api.get("/admin/kitInventory/available", {
          params: getDateParams(),
        });
        console.log("Kits sold response:", response);

        const kitsData = response.data?.data || response.data || [];
        const totalKitSold = Array.isArray(kitsData)
          ? kitsData.reduce((sum, kit) => sum + (kit.isSelled || 0), 0)
          : 0;
        setStats((prev) => ({
          ...prev,
          kitsSold: totalKitSold,
        }));
      } catch (error) {
        console.error("Error fetching kits sold:", error);
        let errorMessage = "Error fetching kits sold";
        if (error.response?.data?.data) {
          errorMessage = error.response.data.data;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
        throw error;
      }
    };

    const fetchRevenue = async () => {
      try {
        const response = await api.get("/booking/bookings", {
          params: { limit: 10000 },
        });
        const bookings = response.data?.data || response.data || [];
        // Lấy revenue của tháng hiện tại
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0-based
        const currentMonthRevenue = bookings.reduce((sum, b) => {
          if (!b.request_date) return sum;
          const d = new Date(b.request_date);
          if (
            d.getFullYear() === currentYear &&
            d.getMonth() === currentMonth
          ) {
            return sum + Number(b.totalCost || 0);
          }
          return sum;
        }, 0);
        setStats((prev) => ({
          ...prev,
          revenue: Math.round(currentMonthRevenue),
        }));
      } catch (error) {
        toast.error(error);
        setStats((prev) => ({ ...prev, revenue: 0 }));
      }
    };

    const fetchAllBookings = async () => {
      try {
        const response = await api.get("/booking/bookings", {
          params: { limit: 10000 }, // get all bookings (or as many as possible)
        });
        setAllBookings(response.data?.data || response.data || []);
        // For backward compatibility with generateChartData
        window.__ALL_BOOKINGS__ = response.data?.data || response.data || [];
      } catch (error) {
        let errorMessage = "Error fetching all bookings";
        if (error.response?.data?.data) {
          errorMessage = error.response.data.data;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
        setAllBookings([]);
      }
    };

    try {
      setLoading(true);
      await Promise.all([
        fetchTotalCustomers(),
        fetchCompletedTests(),
        fetchKitsSold(),
        fetchRecentBookings(),
        fetchAllBookings(),
        fetchRevenue(),
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      let errorMessage = "Failed to fetch dashboard data";
      if (error.response?.data?.data) {
        errorMessage = error.response.data.data;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  // Generate chart data when stats or bookings change
  useEffect(() => {
    if (!loading) {
      generateChartData();
    }
  }, [generateChartData, loading]);

  // Fetch data on component mount and when date range changes
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Table columns for Recent Bookings
  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      key: "bookingID",
    },
    {
      title: "Customer ID",
      dataIndex: "customerID",
      key: "customerID",
    },
    {
      title: "Service Type",
      dataIndex: "bookingType",
      key: "bookingType",
    },
    {
      title: "Request Date",
      dataIndex: "request_date",
      key: "request_date",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue";
        let style = {};
        if (status === "Completed") color = "green";
        if (status === "Pending") color = "orange";
        if (status === "Cancelled" || status === "Cancel") {
          color = "red";
          style = {
            border: "1px solid #ff4d4f",
            borderRadius: 4,
            padding: "0 8px",
          };
        }
        return (
          <Tag color={color} style={style}>
            {status || "Unknown"}
          </Tag>
        );
      },
    },
  ];

  const COLORS = ["#52c41a", "#faad14", "#ff4d4f", "#1890ff", "#722ed1"];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}>
        <Title level={2}>Dashboard Overview</Title>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <RangePicker
            onChange={(dates) => setDateRange(dates)}
            format="YYYY-MM-DD"
          />
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchDashboardData}
            loading={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} justify="center" style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card
            loading={loading}
            style={{
              borderRadius: 16,
              minHeight: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(24, 144, 255, 0.1)",
              border: "1px solid #e6f7ff",
            }}>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                  Total Customers
                </span>
              }
              value={stats.totalCustomer}
              prefix={
                <UserOutlined style={{ color: "#1890ff", fontSize: 24 }} />
              }
              valueStyle={{
                color: "#1890ff",
                fontSize: 28,
                fontWeight: 700,
              }}
            />
            <div style={{ marginTop: 8, color: "#bfbfbf", fontSize: 14 }}>
              Unique customers this period
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            loading={loading}
            style={{
              borderRadius: 16,
              minHeight: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(82, 196, 26, 0.1)",
              border: "1px solid #f6ffed",
            }}>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                  Completed Tests
                </span>
              }
              value={stats.completedTests}
              prefix={
                <CheckCircleOutlined
                  style={{ color: "#52c41a", fontSize: 24 }}
                />
              }
              valueStyle={{
                color: "#52c41a",
                fontSize: 28,
                fontWeight: 700,
              }}
            />
            <div style={{ marginTop: 8, color: "#bfbfbf", fontSize: 14 }}>
              Completion Rate:{" "}
              {stats.totalCustomer > 0
                ? Math.round((stats.completedTests / stats.totalCustomer) * 100)
                : 0}
              %
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            loading={loading}
            style={{
              borderRadius: 16,
              minHeight: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(235, 47, 150, 0.1)",
              border: "1px solid #fff0f6",
            }}>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                  Kits Sold
                </span>
              }
              value={stats.kitsSold}
              prefix={
                <MedicineBoxOutlined
                  style={{ color: "#eb2f96", fontSize: 24 }}
                />
              }
              valueStyle={{
                color: "#eb2f96",
                fontSize: 28,
                fontWeight: 700,
              }}
            />
            <div style={{ marginTop: 8, color: "#bfbfbf", fontSize: 14 }}>
              Kits sold this period
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            loading={loading}
            style={{
              borderRadius: 16,
              minHeight: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(250, 173, 20, 0.1)",
              border: "1px solid #fffbe6",
            }}>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#666" }}>
                  Revenue
                </span>
              }
              value={
                stats.revenue >= 1000000
                  ? `$${(stats.revenue / 1000000).toFixed(1)}M`
                  : stats.revenue >= 1000
                  ? `$${(stats.revenue / 1000).toFixed(1)}K`
                  : `$${stats.revenue}`
              }
              valueStyle={{
                color: "#faad14",
                fontSize: 28,
                fontWeight: 700,
              }}
            />
            <div style={{ marginTop: 8, color: "#bfbfbf", fontSize: 14 }}>
              Revenue for current month
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {/* Monthly Performance Chart */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BarChartOutlined style={{ color: "#1890ff" }} />
                <span style={{ fontWeight: 600, fontSize: 18 }}>
                  Monthly Performance
                </span>
              </div>
            }
            loading={loading}
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
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
                  dataKey="tests"
                  fill="#52c41a"
                  name="Tests"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="revenue"
                  fill="#faad14"
                  name="Revenue"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Status Distribution Chart */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PieChartOutlined style={{ color: "#52c41a" }} />
                <span style={{ fontWeight: 600, fontSize: 18 }}>
                  Booking Status
                </span>
              </div>
            }
            loading={loading}
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value">
                  {chartData.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
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

      {/* Weekly Trends Chart */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24}>
          <Card
            title={
              <span style={{ fontWeight: 600, fontSize: 18 }}>
                Weekly Trends
              </span>
            }
            loading={loading}
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData.weeklyTrends}>
                <defs>
                  <linearGradient
                    id="colorBookings"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#52c41a" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="week"
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
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#1890ff"
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                  name="Bookings"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#52c41a"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Recent Bookings Table */}
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24}>
          <Card
            title={
              <span style={{ fontWeight: 600, fontSize: 18 }}>
                Recent Bookings
              </span>
            }
            loading={loading}
            extra={<Button type="link">View All</Button>}
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}>
            <Table
              dataSource={recentBookings}
              columns={columns}
              pagination={false}
              size="middle"
              locale={{
                emptyText: "No recent bookings available",
              }}
              style={{ minHeight: 300 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
