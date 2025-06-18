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
} from "@ant-design/icons";
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
    kitsSold: 0, // Đã có sẵn
  });
  const [recentBookings, setRecentBookings] = useState([]); // Helper function to get date params
  const getDateParams = () => ({
    startDate: dateRange[0]?.format("YYYY-MM-DD"),
    endDate: dateRange[1]?.format("YYYY-MM-DD"),
  });

  // Fetch total customers count
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

  // Fetch completed tests count
  const fetchCompletedTests = async () => {
    try {
      const response = await api.get("/booking/bookings", {
        params: getDateParams(),
      });
      console.log("Completed tests response:", response);

      // Đếm số lượng booking có status là 'Completed'
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

  // Fetch kits sold count
  const fetchKitsSold = async () => {
    try {
      // Lấy danh sách kit từ API
      const response = await api.get("/admin/kitInventory/available", {
        params: getDateParams(),
      });
      console.log("Kits sold response:", response);

      // Tổng hợp số lượng kit sold từ tất cả các kit (cộng dồn isSelled)
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

  // Fetch recent bookings
  const fetchRecentBookings = async () => {
    try {
      const response = await api.get("/booking/bookings", {
        params: { limit: 5 },
      });
      console.log("Recent bookings response:", response);

      const bookingsData = response.data?.data || response.data || [];
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
  }; // Main function to fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Execute all API calls in parallel for better performance
      await Promise.all([
        fetchTotalCustomers(),
        fetchCompletedTests(),
        fetchKitsSold(),
        fetchRecentBookings(),
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
  }, [dateRange]); // eslint-disable-line react-hooks/exhaustive-deps
  // Fetch data on component mount and when date range changes
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Table columns cho Recent Bookings
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
        if (status === "Completed") color = "green";
        if (status === "Pending") color = "orange";
        if (status === "Cancelled") color = "red";
        return <Tag color={color}>{status || "Unknown"}</Tag>;
      },
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
        <Col xs={24} sm={12} md={8}>
          <Card
            loading={loading}
            style={{
              borderRadius: 16,
              minHeight: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 2px 12px #e6f7ff",
            }}>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 18 }}>
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
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            loading={loading}
            style={{
              borderRadius: 16,
              minHeight: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 2px 12px #f6ffed",
            }}>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 18 }}>
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
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            loading={loading}
            style={{
              borderRadius: 16,
              minHeight: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 2px 12px #fff0f6",
            }}>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 18 }}>Kits Sold</span>
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
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Recent Bookings Only */}
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} md={16}>
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
              minHeight: 400,
              boxShadow: "0 2px 12px #f0f5ff",
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
