import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  UserOutlined,
  DashboardOutlined,
  EyeOutlined,
  MessageOutlined,
  InboxOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  theme,
  Avatar,
  Typography,
  Breadcrumb,
  Button,
} from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import LogOut from "../authen-form/LogOut";
import axiosInstance from "../../configs/axios";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: children ? (
      label
    ) : (
      <Link to={`/manager-dashboard/${key}`}>{label}</Link>
    ),
  };
}

const items = [
  getItem("Dashboard", "overview", <DashboardOutlined />),
  getItem(
    "Testing Process Monitoring",
    "testing-process-monitoring",
    <EyeOutlined />
  ),
  getItem("Customer Feedback", "customer-feedback", <MessageOutlined />),
  getItem("Test Kit Inventory", "inventory", <InboxOutlined />),
  getItem(
    "Staff Reports Approval",
    "staff-reports-approval",
    <FileDoneOutlined />
  ),
];

const ManagerDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null); // eslint-disable-line no-unused-vars

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Update breadcrumbs based on current location
  useEffect(() => {
    const pathSnippets = location.pathname.split("/").filter((i) => i);
    const breadcrumbItems = pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return {
        title: snippet.charAt(0).toUpperCase() + snippet.slice(1),
        path: url,
      };
    });

    setBreadcrumbs(breadcrumbItems);
  }, [location]);

  // Lấy thông tin user khi load Dashboard (ví dụ sử dụng Bearer Token)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        await axiosInstance.get("/user/profile"); // endpoint ví dụ
        // Xử lý dữ liệu user nếu cần
      } catch (error) {
        console.error("Fail to get user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={260}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }}>
        <div
          style={{
            height: 64,
            margin: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
          }}>
          <img
            src="/images/logo.png"
            alt="Genetix Logo"
            style={{ height: 32, marginRight: collapsed ? 0 : 8 }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          {!collapsed && (
            <div>
              <Title
                level={4}
                style={{ margin: 0, color: "#fff", lineHeight: 1.2 }}>
                Genetix System
              </Title>
              <Text style={{ color: "#8c8c8c", fontSize: "12px" }}>
                DNA Testing
              </Text>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          defaultSelectedKeys={["overview"]}
          mode="inline"
          items={items}
          selectedKeys={[location.pathname.split("/").slice(1, 3).join("/")]}
        />
      </Sider>

      <Layout
        style={{ marginLeft: collapsed ? 80 : 260, transition: "all 0.2s" }}>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
            position: "sticky",
            top: 0,
            zIndex: 999,
            height: 64,
          }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Profile Button */}
            <Button
              type="text"
              onClick={() => navigate("/profile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 40,
                padding: "0 12px",
              }}>
              <Avatar
                style={{ backgroundColor: "#1890ff" }}
                icon={<UserOutlined />}
              />
              <span>My Profile</span>
            </Button>

            {/* Logout Button */}
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={() => {
                if (typeof LogOut.performLogout === "function") {
                  LogOut.performLogout();
                }
              }}
              style={{ height: 40 }}>
              Logout
            </Button>
          </div>
        </Header>

        <Content style={{ margin: "16px 16px 0", overflow: "initial" }}>
          <Breadcrumb style={{ marginBottom: 16 }}>
            <Breadcrumb.Item>
              <Link to="/manager-dashboard">Dashboard</Link>
            </Breadcrumb.Item>
            {breadcrumbs.slice(1).map((breadcrumb, index) => (
              <Breadcrumb.Item key={index}>
                <Link to={breadcrumb.path}>{breadcrumb.title}</Link>
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>

          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: "calc(100vh - 184px)",
            }}>
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: "center", padding: "12px 50px" }}>
          DNA Testing Service Management System ©{new Date().getFullYear()}
        </Footer>
      </Layout>

      {/* Hidden LogOut component for confirmation modal */}
      <LogOut
        trigger="function"
        showConfirmation={true}
        onLogoutSuccess={() => {
          console.log("Logout successful");
        }}
        onLogoutError={(error) => {
          console.error("Logout error:", error);
        }}
      />

      {/* Enhanced CSS for search dropdown and interactions */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .hide-on-small {
            display: none;
          }
        }
      `}</style>
    </Layout>
  );
};

export default ManagerDashboard;
