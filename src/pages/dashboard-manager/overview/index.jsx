import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Typography, Card, Row, Col, Statistic, Spin } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  MessageOutlined,
  FileDoneOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;

const ManagerOverviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState({
    totalTestsPerformed: 0,
    pendingFeedback: 0,
    staffReportsPending: 0,
    totalCustomers: 0,
    testingProcessTrend: [], // For line chart
    feedbackCategories: [], // For area chart
  });

  const fetchManagerOverviewData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch total tests performed (count all bookings)
      const testsRes = await api.get("/booking/bookings");
      const bookings = testsRes.data?.data || testsRes.data || [];
      const totalTestsPerformed = Array.isArray(bookings) ? bookings.length : 0;

      // Fetch total customers (reuse admin logic)
      const customersRes = await api.get("/admin/dashboard/customers");
      const customerData = customersRes.data || {};
      const totalCustomers = customerData.totalCustomer || 0;

      // Other API calls remain unchanged
      const [feedbackRes, reportsRes, trendRes, categoriesRes] =
        await Promise.all([
          api.get("/manager/dashboard/pending-feedback"),
          api.get("/manager/dashboard/staff-reports-pending"),
          api.get("/manager/dashboard/testing-process-trend"),
          api.get("/manager/dashboard/feedback-categories"),
        ]);

      setOverviewData({
        totalTestsPerformed,
        pendingFeedback: feedbackRes.data?.count || 0,
        staffReportsPending: reportsRes.data?.count || 0,
        totalCustomers,
        testingProcessTrend: trendRes.data || [
          { name: "Jan", tests: 4000 },
          { name: "Feb", tests: 3000 },
          { name: "Mar", tests: 2000 },
          { name: "Apr", tests: 2780 },
          { name: "May", tests: 1890 },
          { name: "Jun", tests: 2390 },
        ],
        feedbackCategories: categoriesRes.data || [
          { name: "Service Quality", count: 2400 },
          { name: "Appointment", count: 1398 },
          { name: "Results Delivery", count: 9800 },
          { name: "Staff Interaction", count: 3908 },
          { name: "Pricing", count: 4800 },
        ],
      });
    } catch (error) {
      toast.error("Failed to fetch manager overview data.");
      console.error("Error fetching manager overview data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchManagerOverviewData();
  }, [fetchManagerOverviewData]);

  return (
    <div style={{ padding: "0 24px" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Manager Dashboard Overview
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
                  title="Total Tests Performed"
                  value={overviewData.totalTestsPerformed}
                  prefix={<DashboardOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Pending Customer Feedback"
                  value={overviewData.pendingFeedback}
                  prefix={<MessageOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Staff Reports Pending Approval"
                  value={overviewData.staffReportsPending}
                  prefix={<FileDoneOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Customers"
                  value={overviewData.totalCustomers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Monthly Testing Process Trend">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={overviewData.testingProcessTrend}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tests"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Customer Feedback Categories">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={overviewData.feedbackCategories}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ManagerOverviewPage;
