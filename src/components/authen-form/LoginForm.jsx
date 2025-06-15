import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import api, { saveAuthData } from "../../configs/axios";
import { toast } from "react-toastify";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./login.css";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";

function LoginForm() {
  const GOOGLE_CLIENT_ID =
    "26142191146-7u8f63rgtupdv8v6kv8ug307j55hjfob.apps.googleusercontent.com";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      const userData = response.data;

      if (!userData || !userData.role) {
        toast.error("Google login failed: Invalid response from server.");
        return;
      }

      // Chuẩn bị user data với cấu trúc đơn giản
      const enhancedUserData = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName || userData.name,
        role: userData.role,
        avatar: userData.avatar || userData.picture,
        phone: userData.phone,
        isEmailVerified: userData.isEmailVerified || true, // Google accounts are verified
        lastLogin: new Date().toISOString(),
        loginMethod: "google",
      };

      // Dispatch login action với user data
      dispatch(login(enhancedUserData));

      // Sử dụng saveAuthData từ axios.js
      saveAuthData({
        token: userData.token,
        refreshToken: userData.refreshToken,
        user: enhancedUserData,
      });

      toast.success("Google login successful!");

      // Navigation logic based on role
      const { role } = userData;
      if (role === "CUSTOMER" || role === "Customer") {
        navigate("/");
      } else if (role === "ADMIN" || role === "Admin") {
        navigate("/dashboard");
      } else if (role === "MANAGER" || role === "Manager") {
        navigate("/manager-dashboard");
      } else if (role === "STAFF" || role === "Staff") {
        navigate("/staff-dashboard");
      } else {
        navigate("/");
      }
    } catch (e) {
      console.error("Google login error:", e);
      const msg =
        e.response?.data?.message ||
        e.response?.data ||
        e.message ||
        "Google login failed!";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  const handleGoogleError = (error) => {
    console.error("Google login error:", error);
    // Handle different error cases and show appropriate messages
    let errorMessage = "Google login failed! Please try again.";

    if (error) {
      switch (error.error) {
        case "popup_closed_by_user":
errorMessage = "Login popup was closed. Please try again.";
          break;
        case "access_denied":
          errorMessage = "Access denied. Please grant permission to continue.";
          break;
        case "immediate_failed":
          errorMessage = "Automatic login failed. Please sign in manually.";
          break;
        case "popup_blocked_by_browser":
          errorMessage =
            "Popup blocked by browser. Please allow popups and try again.";
          break;
        default:
          errorMessage =
            error.details ||
            error.error ||
            "Google login failed! Please try again.";
      }
    }

    toast.error(errorMessage);
  };

  async function handleNormalLogin(values) {
  try {
    const response = await api.post("/auth/login", values);
    console.log("🔍 Login response:", response);

    // Kiểm tra response.data và response.data.data
    const userData = response.data?.data || response.data;

    if (!userData || !userData.token) {
      toast.error("Login failed: Invalid response from server.");
      return;
    }

    console.log("🔍 Original userData:", userData);
    console.log("🔍 Form values:", values);

    // ✅ CẬP NHẬT: Đảm bảo có username và fullName
    const enhancedUserData = {
      id: userData.id,
      username: userData.username || values.username, // ✅ Lấy từ form nếu API không có
      email: userData.email,
      fullName: userData.fullName || userData.name || userData.username || values.username || "loclnx", // ✅ Fallback chain
      role: userData.role,
      avatar: userData.avatar,
      phone: userData.phone,
      isEmailVerified: userData.isEmailVerified || false,
      lastLogin: new Date().toISOString(),
      loginMethod: "normal",
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    console.log("🚀 Enhanced user data:", enhancedUserData);

    // Dispatch login action với user data
    dispatch(login(enhancedUserData));

    // Sử dụng saveAuthData từ axios.js
    saveAuthData({
      token: userData.token,
      refreshToken: userData.refreshToken,
      user: enhancedUserData,
    });

    toast.success("Login successful!");

    // Navigation logic based on role
    const { role } = userData;
    if (role === "CUSTOMER" || role === "Customer") {
      navigate("/");
    } else if (role === "ADMIN" || role === "Admin") {
      navigate("/dashboard");
    } else if (role === "MANAGER" || role === "Manager") {
      navigate("/manager-dashboard");
    } else if (role === "STAFF" || role === "Staff") {
      navigate("/staff-dashboard");
    } else {
      navigate("/");
    }
  } catch (e) {
    console.error("Login error:", e);
    const msg =
      e.response?.data?.message ||
      e.response?.data ||
      e.message ||
      "Login failed!";
    toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
}

  const handleNormalLoginError = (errorInfo) => {
    console.error("Form validation failed:", errorInfo);

    // Check if there are validation errors and log them to the console to help with debugging
if (errorInfo?.errorFields?.length > 0) {
      console.error(
        "Validation errors:",
        errorInfo.errorFields.map((field) => ({
          field: field.name,
          errors: field.errors,
        }))
      );

      // Display the first error message in a toast notification
      const firstError = errorInfo.errorFields[0];
      const fieldName = Array.isArray(firstError.name)
        ? firstError.name.join(".")
        : firstError.name;
      const errorMessage = firstError.errors[0];

      toast.error(`${fieldName}: ${errorMessage}`);
    } else {
      toast.error("Please check your input and try again.");
    }
  };

  return (
    <div className="container">
      <div className="login-form">
        <Link to="/">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="login-logo"
            style={{
              maxWidth: "105px",
              marginBottom: "14px",
              objectFit: "contain",
              background: "transparent",
            }}
          />
        </Link>
        <h1 className="login-title">Sign In</h1>
        <p className="login-subtitle">Sign in to your account</p>

        <Form
          name="login"
          layout="vertical"
          style={{ width: "100%" }}
          initialValues={{ remember: false }}
          onFinish={handleNormalLogin}
          onFinishFailed={handleNormalLoginError}
          autoComplete="off">
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
            ]}>
            <Input
              placeholder="Enter your username"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
            ]}>
            <Input.Password
              placeholder="Enter your password"
              prefix={<LockOutlined />}
              autoComplete="current-password"
            />
          </Form.Item>

          <div style={{ textAlign: "right", marginBottom: 12 }}>
            <Button
              type="link"
              className="forgot-password-link"
              style={{ padding: 0 }}
              onClick={() => navigate("/verify")}>
              Forgotten password?
            </Button>
          </div>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-btn">
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <div className="google-login-section">
            <p className="google-login-label">Or sign in with Google</p>
<GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
            />
          </div>
        </GoogleOAuthProvider>

        <p className="helper-text">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;