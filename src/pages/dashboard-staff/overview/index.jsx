import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Typography, Card, Row, Col, Statistic, Spin } from "antd";
import {
  CalendarOutlined,
  ContainerOutlined,
  LoadingOutlined,
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
} from "recharts";
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;

const StaffOverviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    samplesCollectedToday: 0,
    ordersInProgress: 0,
    orderStatusDistribution: [], // For pie chart
    dailyTasks: [], // For bar chart
  });

  const fetchStaffOverviewData = useCallback(async () => {
    setLoading(true);
    try {
      // Replace with actual API calls
      const [
        appointmentsRes,
        samplesRes,
        ordersRes,
        statusDistRes,
        dailyTasksRes,
      ] = await Promise.all([
        api.get("/staff/dashboard/appointments-summary"), // Example API for appointments
        api.get("/staff/dashboard/samples-today"), // Example API for samples
        api.get("/staff/dashboard/orders-in-progress"), // Example API for orders
        api.get("/staff/dashboard/order-status-distribution"), // Example API for order status distribution
        api.get("/staff/dashboard/daily-tasks"), // Example API for daily tasks
      ]);

      setOverviewData({
        totalAppointments: appointmentsRes.data?.total || 0,
        pendingAppointments: appointmentsRes.data?.pending || 0,
        samplesCollectedToday: samplesRes.data?.count || 0,
        ordersInProgress: ordersRes.data?.count || 0,
        orderStatusDistribution: statusDistRes.data || [
          { name: "Pending", value: 5 },
          { name: "Sample Collected", value: 10 },
          { name: "Testing", value: 8 },
          { name: "Completed", value: 15 },
        ],
        dailyTasks: dailyTasksRes.data || [
          { name: "Appointments", count: 7 },
          { name: "Collections", count: 5 },
          { name: "Results", count: 3 },
        ],
      });
    } catch (error) {
      toast.error("Failed to fetch staff overview data.");
      console.error("Error fetching staff overview data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaffOverviewData();
  }, [fetchStaffOverviewData]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div style={{ padding: "0 24px" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Staff Dashboard Overview
      </Title>
      <ToastContainer />
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <p style={{ marginTop: 20 }}>Loading overview data...</p>
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Appointments"
                  value={overviewData.totalAppointments}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Pending Appointments"
                  value={overviewData.pendingAppointments}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Samples Collected Today"
                  value={overviewData.samplesCollectedToday}
                  prefix={<ContainerOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Orders In Progress"
                  value={overviewData.ordersInProgress}
                  prefix={<LoadingOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Order Status Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={overviewData.orderStatusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }>
                      {overviewData.orderStatusDistribution.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Daily Task Count">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={overviewData.dailyTasks}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default StaffOverviewPage;
