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

  // State for username (for autofill)
  const [savedUsername, setSavedUsername] = React.useState("");
  const [form] = Form.useForm();

  React.useEffect(() => {
    // On mount, check localStorage for saved username
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    if (rememberedUsername) {
      setSavedUsername(rememberedUsername);
      form.setFieldsValue({ username: rememberedUsername });
    }
  }, [form]);

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

      // Kiểm tra log để debug
      console.log("Google login response:", userData);
      
      // Phân tích để xác định nguồn avatar
      let avatarSource = null;
      // Nếu có avatar từ database (không phải URL Google) thì ưu tiên dùng
      if (userData.avatar && !userData.avatar.includes('googleusercontent.com')) {
        avatarSource = userData.avatar;
        console.log("Using DB avatar:", avatarSource);
      } 
      // Nếu không có avatar từ DB hoặc avatar là từ Google, kiểm tra xem có nên dùng avatar từ Google không
      else if (userData.useGoogleAvatar !== false && userData.picture) {
        avatarSource = userData.picture;
        console.log("Using Google avatar:", avatarSource);
      }
      // Fallback nếu không có avatar
      else {
        avatarSource = userData.avatar || null;
        console.log("Using fallback avatar:", avatarSource);
      }

      // Lấy đúng field fullName từ backend (ưu tiên fullName, fallback fullname, name, username)
      const enhancedUserData = {
        id: userData.id || userData.userId || `user_${Date.now()}`,
        username: userData.username || userData.email || "google_user",
        email: userData.email || "",
        fullName:
          userData.fullName ||
          userData.fullname ||
          userData.name ||

           userData.username ||
          "Google User",
        role: userData.role || "Customer",
        avatar: avatarSource,

        customerID: userData.customerId || userData.customerID || "",
        staffID: userData.staffId || userData.staffID || "",
        managerID: userData.managerId || userData.managerID || "",
        adminID: userData.adminId || userData.adminID || "",

        token:
          userData.token || userData.accessToken || `mock_token_${Date.now()}`,
        phone: userData.phone || "",
        isEmailVerified: userData.isEmailVerified || userData.enabled || true,

        lastLogin: new Date().toISOString(),
        loginMethod: "google",
        createdAt:
          userData.createAt || userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString(),
      };

      dispatch(login(enhancedUserData));

      const authData = {
        token:
          userData.token || userData.accessToken || `mock_token_${Date.now()}`,
        refreshToken: userData.refreshToken || userData.refresh_token,
        user: enhancedUserData,
      };

      saveAuthData(authData);

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
      console.log("Attempting login with:", values);
      const response = await api.post("/auth/login", values);
      const userData = response.data;

      // Lấy đúng field fullName từ backend (ưu tiên fullName, fallback fullname, username)
      const enhancedUserData = {
        id: userData.id || userData.userId || `user_${Date.now()}`,
        username: userData.username || values.username || "loclnx",
        email: userData.email || values.email || "",
        fullName:
          userData.fullName || userData.fullname || userData.username || "loc",
        role: userData.role || "Customer",
        customerID: userData.customerId || userData.customerID || "",
        staffID: userData.staffId || userData.staffID || "",
        managerID: userData.managerId || userData.managerID || "",
        adminID: userData.adminId || userData.adminID || "",
        token:
          userData.token || userData.accessToken || `mock_token_${Date.now()}`,
        avatar: userData.avatar || "",
        phone: userData.phone || "",
        isEmailVerified: userData.enabled || userData.isEmailVerified || false,
        lastLogin: new Date().toISOString(),
        loginMethod: "normal",
        createdAt:
          userData.createAt || userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString(),
      };

      dispatch(login(enhancedUserData));

      const authData = {
        token:
          userData.token || userData.accessToken || `mock_token_${Date.now()}`,
        refreshToken: userData.refreshToken || userData.refresh_token,
        user: enhancedUserData,
      };

      saveAuthData(authData);

      // Handle remember me: save or remove username
      if (values.remember) {
        localStorage.setItem("rememberedUsername", values.username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      toast.success("Login successful!");

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
      console.error("Error response:", e.response);
      console.error("Error response data:", e.response?.data);
      console.error("Error response status:", e.response?.status);

      let msg = "Login failed!";

      if (e.response) {
        // Ưu tiên kiểm tra status code trước
        if (e.response.status === 401) {
          msg = "Incorrect username or password";
        } else if (e.response.status === 400) {
          msg = "Invalid request. Please check your input.";
        } else if (e.response.status >= 500) {
          msg = "Server error. Please try again later.";
        } else if (e.response.data) {
          if (typeof e.response.data === "string") {
            msg = e.response.data;
          } else if (e.response.data.message) {
            msg = e.response.data.message;
          } else if (e.response.data.error) {
            msg = e.response.data.error;
          } else {
            msg = JSON.stringify(e.response.data);
          }
        }
      } else if (e.request) {
        // Network error
        msg = "Network error. Please check your connection.";
      } else if (e.message) {
        msg = e.message;
      }

      console.log("Final error message:", msg);
      toast.error(msg);
    }
  }

  const handleNormalLoginError = (errorInfo) => {
    console.error("Form validation failed:", errorInfo);

    if (errorInfo?.errorFields?.length > 0) {
      console.error(
        "Validation errors:",
        errorInfo.errorFields.map((field) => ({
          field: field.name,
          errors: field.errors,
        }))
      );
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
          form={form}
          name="login"
          layout="vertical"
          style={{ width: "100%" }}
          initialValues={{ remember: false, username: savedUsername }}
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
              autoComplete="username"
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
