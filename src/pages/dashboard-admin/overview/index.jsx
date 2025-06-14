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
  DollarOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Line, Column, Pie } from "@ant-design/plots";
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
  const [revenueData, setRevenueData] = useState([]);
  const [kitSalesData, setKitSalesData] = useState([]);
  const [serviceDistribution, setServiceDistribution] = useState([]);
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
      throw error;
    }
  };

  // Fetch revenue data
  const fetchRevenue = async () => {
    try {
      const response = await api.get("/admin/dashboard/revenue", {
        params: getDateParams(),
      });
      console.log("Revenue response:", response);

      const revenueData = response.data?.data || response.data || {};
      setStats((prev) => ({
        ...prev,
        revenue: revenueData.revenue || revenueData.total || 0,
      }));
    } catch (error) {
      console.error("Error fetching revenue:", error);
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
      throw error;
    }
  };

  // Fetch revenue chart data
  const fetchRevenueData = async () => {
    try {
      const response = await api.get("/admin/dashboard/revenue-chart", {
        params: getDateParams(),
      });
      console.log("Revenue chart response:", response);

      const revenueChartData = response.data?.data || response.data || [];
      setRevenueData(revenueChartData);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      throw error;
    }
  };

  // Fetch kit sales chart data
  const fetchKitSalesData = async () => {
    try {
      const response = await api.get("/admin/dashboard/kit-sales-chart", {
        params: getDateParams(),
      });
      console.log("Kit sales chart response:", response);

      const kitSalesChartData = response.data?.data || response.data || [];
      setKitSalesData(kitSalesChartData);
    } catch (error) {
      console.error("Error fetching kit sales data:", error);
      throw error;
    }
  };

  // Fetch service distribution data
  const fetchServiceDistribution = async () => {
    try {
      const response = await api.get("/admin/dashboard/service-distribution");
      console.log("Service distribution response:", response);

      const serviceDistData = response.data?.data || response.data || [];
      setServiceDistribution(serviceDistData);
    } catch (error) {
      console.error("Error fetching service distribution:", error);
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
        fetchRevenue(),
        fetchKitsSold(),
        fetchRevenueData(),
        fetchKitSalesData(),
        fetchServiceDistribution(),
        fetchRecentBookings(),
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error(
        "Failed to fetch dashboard data: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  }, [dateRange]); // eslint-disable-line react-hooks/exhaustive-deps
  // Fetch data on component mount and when date range changes
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Revenue chart config
  const revenueConfig = {
    data: revenueData,
    xField: "month",
    yField: "revenue",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
    smooth: true,
    lineStyle: {
      stroke: "#1890ff",
      lineWidth: 3,
    },
    areaStyle: {
      fill: "l(270) 0:#ffffff 0.5:#1890ff 1:#1890ff",
      fillOpacity: 0.2,
    },
  };

  // Kit sales chart config
  const kitSalesConfig = {
    data: kitSalesData,
    xField: "week",
    yField: "sales",
    columnWidthRatio: 0.6,
    color: "#1890ff",
    label: {
      position: "top",
      style: {
        fill: "#1890ff",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  // Service distribution chart config
  const serviceDistributionConfig = {
    data: serviceDistribution,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name}: {percentage}",
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

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
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Customers"
              value={stats.totalCustomer}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
              suffix={<Tag color="blue">+12%</Tag>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Completed Tests"
              value={stats.completedTests}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
              suffix={<Tag color="green">+8%</Tag>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Revenue"
              value={stats.revenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#faad14" }}
              suffix={<Tag color="orange">+15%</Tag>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Kits Sold"
              value={stats.kitsSold}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: "#eb2f96" }}
              suffix={<Tag color="purple">+5%</Tag>}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="Monthly Revenue"
            loading={loading}
            extra={<Button type="link">View Details</Button>}>
            {revenueData.length > 0 ? (
              <Line {...revenueConfig} height={300} />
            ) : (
              <div
                style={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Text type="secondary">No revenue data available</Text>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Weekly Kit Sales"
            loading={loading}
            extra={<Button type="link">View Details</Button>}>
            {kitSalesData.length > 0 ? (
              <Column {...kitSalesConfig} height={300} />
            ) : (
              <div
                style={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Text type="secondary">No kit sales data available</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card
            title="Service Distribution"
            loading={loading}
            extra={<Button type="link">View Details</Button>}>
            {serviceDistribution.length > 0 ? (
              <Pie {...serviceDistributionConfig} height={300} />
            ) : (
              <div
                style={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Text type="secondary">
                  No service distribution data available
                </Text>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Recent Bookings"
            loading={loading}
            extra={<Button type="link">View All</Button>}>
            <Table
              dataSource={recentBookings}
              columns={columns}
              pagination={false}
              size="small"
              locale={{
                emptyText: "No recent bookings available",
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
