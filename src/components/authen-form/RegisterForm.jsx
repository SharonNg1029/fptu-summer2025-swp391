import React from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  ConfigProvider,
  DatePicker,
} from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import enUS from "antd/locale/en_US";
import api, { saveAuthData } from "../../configs/axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";

// Nếu bạn có component OTPVerification thì giữ nguyên, không cần sửa trong ví dụ này.

function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Google Client ID
  const GOOGLE_CLIENT_ID =
    "26142191146-7u8f63rgtupdv8v6kv8ug307j55hjfob.apps.googleusercontent.com";

  // Google Success Handler (đồng bộ với LoginForm)
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      const userData = response.data;

      if (!userData || !userData.role) {
        toast.error("Google registration failed: Invalid response from server.");
        return;
      }

      const enhancedUserData = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        fullName:
          userData.fullName ||
          userData.fullname ||
          userData.name ||
          userData.username,
        role: userData.role,
        avatar: userData.avatar || userData.picture,
        phone: userData.phone,
        isEmailVerified: userData.isEmailVerified || true,
        lastLogin: new Date().toISOString(),
        loginMethod: "google",
      };

      dispatch(login(enhancedUserData));
      saveAuthData({
        token: userData.token,
        refreshToken: userData.refreshToken,
        user: enhancedUserData,
      });

      toast.success("Google registration successful!");

      // Navigate về home cho mọi role
      navigate("/");
    } catch (e) {
      console.error("Google registration error:", e);
      const msg =
        e.response?.data?.message ||
        e.response?.data ||
        e.message ||
        "Google registration failed!";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  // Google Error Handler giữ nguyên
  const handleGoogleError = (error) => {
    console.error("Google registration error:", error);
    let errorMessage = "Google registration failed! Please try again.";
    if (error) {
      switch (error.error) {
        case "popup_closed_by_user":
          errorMessage = "Registration popup was closed. Please try again.";
          break;
        case "access_denied":
          errorMessage = "Access denied. Please grant permission to continue.";
          break;
        case "immediate_failed":
          errorMessage = "Automatic registration failed. Please sign in manually.";
          break;
        case "popup_blocked_by_browser":
          errorMessage =
            "Popup blocked by browser. Please allow popups and try again.";
          break;
        default:
          errorMessage =
            error.details ||
            error.error ||
            "Google registration failed! Please try again.";
      }
    }
    toast.error(errorMessage);
  };

  // Form đăng ký bình thường (giữ nguyên logic cũ của bạn)
  const onFinish = async (values) => {
    if (values.dob && values.dob.format) {
      values.dob = values.dob.format("YYYY-MM-DD");
    }
    try {
      await api.post("auth/register", values);
      toast.success(
        "Registration successful! Please check your email for OTP verification."
      );
      // Tùy bạn muốn làm gì tiếp (show OTP, về trang login, ...)
    } catch (e) {
      const errorMessage =
        e.response?.data?.message ||
        e.response?.data ||
        "Registration failed. Please try again.";
      const statusCode = e.response?.status;
      const finalErrorMessage =
        statusCode === 409 || statusCode === 400
          ? errorMessage.toLowerCase().includes("email")
            ? "This email is already registered. Please use a different email address."
            : errorMessage.toLowerCase().includes("username")
            ? "This username is already taken. Please choose a different username."
            : errorMessage
          : errorMessage;
      toast.error(finalErrorMessage);
    }
  };

  const onFinishFailed = (errorInfo) => {
    const termsError = errorInfo.errorFields.find((field) =>
      field.name.includes("agreement")
    );
    if (termsError) {
      toast.error("Please agree to the Terms and Privacy Policy to continue");
    }
  };

  return (
    <ConfigProvider locale={enUS}>
      <div className="register-container">
        <div className="register-form">
          <Link to="/">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="register-logo"
              style={{
                maxWidth: "105px",
                marginBottom: "14px",
                objectFit: "contain",
                background: "transparent",
              }}
            />
          </Link>
          <h1 className="register-title">Sign Up</h1>
          <p className="register-subtitle">Create your account</p>

          <Form
            name="register"
            layout="vertical"
            className="register-form-content"
            initialValues={{ agreement: false }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            size="small"
          >
            <div className="form-row">
              <div className="form-col">
                <Form.Item
                  label="Full Name"
                  name="fullname"
                  className="form-field"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input placeholder="Enter your full name" />
                </Form.Item>

                <Form.Item
                  label="Username"
                  name="username"
                  className="form-field"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input placeholder="Choose a username" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  className="form-field"
                  rules={[{ required: true, message: "Required" }]}
                  hasFeedback
                >
                  <Input.Password placeholder="Create a password" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  className="form-field"
                  rules={[
                    { required: true, message: "Required" },
                    { type: "email", message: "Invalid email" },
                  ]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>
              </div>

              <div className="form-col">
                <Form.Item
                  label="Phone"
                  name="phone"
                  className="form-field"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input placeholder="Enter your phone number" />
                </Form.Item>

                <Form.Item
                  label="Date of Birth"
                  name="dob"
                  className="form-field"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <DatePicker
                    placeholder="Select date of birth"
                    style={{ width: "100%" }}
                    format="YYYY/MM/DD"
                  />
                </Form.Item>

                <Form.Item
                  label="Address"
                  name="address"
                  className="form-field"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input placeholder="Enter your address" />
                </Form.Item>

                <Form.Item
                  label="Gender"
                  name="gender"
                  className="form-field"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Select placeholder="Select gender">
                    <Select.Option value={0}>Male</Select.Option>
                    <Select.Option value={1}>Female</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              className="remember-checkbox"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "You must agree to the Terms and Privacy Policy"
                          )
                        ),
                },
              ]}
            >
              <Checkbox>I agree to the Terms and Privacy Policy</Checkbox>
            </Form.Item>

            <Form.Item className="form-actions">
              <Button type="primary" htmlType="submit" block>
                Sign Up
              </Button>
            </Form.Item>
          </Form>

          {/* ===== GOOGLE SIGN UP ===== */}
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="google-login-section">
              <p className="google-login-label">Or sign up with Google</p>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signup_with"
              />
            </div>
          </GoogleOAuthProvider>
          {/* ===== END GOOGLE SIGN UP ===== */}

          <p className="helper-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default RegisterForm;