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
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;

const ManagerOverviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState({
    totalTestsPerformed: 0,
    staffReportsPending: 0,
    totalCustomers: 0,
  });

  const fetchManagerOverviewData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all bookings
      const testsRes = await api.get("/booking/bookings");
      const bookings = testsRes.data?.data || testsRes.data || [];
      // 1. Total Tests Performed: count bookings with status "Completed"
      const totalTestsPerformed = Array.isArray(bookings)
        ? bookings.filter((b) => b.status === "Completed").length
        : 0;
      // 3. Total Tests Unperformed: count bookings with status !== "Completed" and !== "Cancel"
      const totalTestsUnperformed = Array.isArray(bookings)
        ? bookings.filter(
            (b) => b.status !== "Completed" && b.status !== "Cancel"
          ).length
        : 0;
      // 4. Staff Available: count staff with role === "STAFF" and status === true
      const staffRes = await api.get("/admin/account");
      const staffList = staffRes.data?.data || staffRes.data || [];
      const staffAvailable = Array.isArray(staffList)
        ? staffList.filter(
            (s) =>
              (s.role === "STAFF" ||
                (s.authorities && s.authorities[0]?.authority === "STAFF")) &&
              (s.enabled === true || s.status === "ACTIVE")
          ).length
        : 0;
      setOverviewData({
        totalTestsPerformed,
        staffReportsPending: totalTestsUnperformed,
        totalCustomers: staffAvailable,
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
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Total Tests Performed"
                  value={overviewData.totalTestsPerformed}
                  prefix={<DashboardOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Total Tests Unperformed"
                  value={overviewData.staffReportsPending}
                  prefix={<FileDoneOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Staff Available"
                  value={overviewData.totalCustomers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ManagerOverviewPage;
