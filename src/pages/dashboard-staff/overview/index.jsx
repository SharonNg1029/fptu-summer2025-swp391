import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Typography, Card, Row, Col, Statistic, Spin } from "antd";
import {
  CalendarOutlined,
  ContainerOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
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
    appointmentsToday: 0,
    totalAppointmentFinished: 0,
    orderStatusDistribution: [], // For pie chart
    dailyTasks: [], // For bar chart
  });

  // Lấy staffID từ Redux store
  const currentUser = useSelector((state) => state.user?.currentUser);
  const staffID =
    currentUser?.id || currentUser?.staffId || currentUser?.userId;
  const fetchStaffOverviewData = useCallback(async () => {
    if (!staffID) {
      toast.error("Staff ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Gọi API để lấy assignments của staff
      const response = await api.get(`/staff/my-assignment/${staffID}`);
      const assignments = response.data || [];

      // Tính toán các thống kê từ dữ liệu assignments
      const totalAppointments = assignments.length;

      // Đếm appointments có status là "Awaiting Sample" cho Pending Appointments
      const pendingAppointments = assignments.filter(
        (assignment) => assignment.status === "Awaiting Sample"
      ).length; // Đếm appointments có trong ngày hiện tại
      const today = new Date().toDateString();
      const appointmentsToday = assignments.filter((assignment) => {
        if (assignment.appointmentDate) {
          const appointmentDate = new Date(
            assignment.appointmentDate
          ).toDateString();
          return appointmentDate === today;
        }
        return false;
      }).length;

      // Tạo distribution data cho pie chart
      const statusCounts = {};
      assignments.forEach((assignment) => {
        const status = assignment.status || "Unknown";
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      const orderStatusDistribution = Object.entries(statusCounts).map(
        ([name, value]) => ({ name, value })
      ); // Tạo daily tasks data cho bar chart
      const dailyTasks = [
        { name: "Total Assignments", count: totalAppointments },
        { name: "Pending Samples", count: pendingAppointments },
        { name: "Appointments Today", count: appointmentsToday },
        {
          name: "Finished",
          count: assignments.filter((a) => a.status === "Completed").length,
        },
      ];
      setOverviewData({
        totalAppointments,
        pendingAppointments,
        appointmentsToday,
        totalAppointmentFinished: assignments.filter(
          (a) => a.status === "Completed"
        ).length,
        orderStatusDistribution:
          orderStatusDistribution.length > 0
            ? orderStatusDistribution
            : [{ name: "No Data", value: 1 }],
        dailyTasks,
      });
    } catch (error) {
      toast.error("Failed to fetch staff assignment data.");
      console.error("Error fetching staff assignment data:", error); // Set default data in case of error
      setOverviewData({
        totalAppointments: 0,
        pendingAppointments: 0,
        appointmentsToday: 0,
        totalAppointmentFinished: 0,
        orderStatusDistribution: [{ name: "No Data", value: 1 }],
        dailyTasks: [
          { name: "Total Assignments", count: 0 },
          { name: "Pending Samples", count: 0 },
          { name: "Appointments Today", count: 0 },
          { name: "Finished", count: 0 },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, [staffID]);

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
            </Col>{" "}
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Appointments Today"
                  value={overviewData.appointmentsToday}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Appointment Finished"
                  value={overviewData.totalAppointmentFinished}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
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
