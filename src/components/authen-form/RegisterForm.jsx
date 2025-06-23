import React, { useState, useEffect } from "react";
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
import api from "../../configs/axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

// Custom OTP Verification Component - UPDATED
const OTPVerification = ({ email, onVerify, onClose }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút = 300 giây
  const [canResend, setCanResend] = useState(false);

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Format thời gian hiển thị (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code");
      return;
    }

    setLoading(true);
    try {
      // Tự động gán email vào request
      await api.post("auth/verify-otp", { email, otp });
      toast.success("Account registration successful!");
      onVerify();
      onClose();
    } catch (error) {
      console.error(error);
      if (error.response?.status === 400) {
        toast.error("OTP code has expired. Please request a new one.");
        setCanResend(true);
        setTimeLeft(0);
      } else {
        toast.error("Invalid OTP code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      // Tự động gán email vào request resend
      await api.post("auth/resend-otp", { email });
      toast.success("New OTP code has been sent to your email");
      setOtp("");
      setTimeLeft(300); // Reset về 5 phút
      setCanResend(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  return (
    <div className="otp-verification-container">
      <div className="otp-verification-title">Email Verification</div>

      <div className="otp-verification-subtitle">
        We've sent a 6-digit verification code to your email.
        <br />
{/* ẨN EMAIL - chỉ hiển thị thông báo chung */}
        <span style={{ color: "#1890ff", fontWeight: "bold" }}>
          Please check your inbox and enter the code below.
        </span>
      </div>

      {/* HIỂN THỊ THỜI GIAN CÒN LẠI */}
      <div
        className="otp-timer"
        style={{
          textAlign: "center",
          marginBottom: "15px",
          padding: "8px",
          backgroundColor: timeLeft > 60 ? "#f6ffed" : "#fff1f0",
          border: `1px solid ${timeLeft > 60 ? "#b7eb8f" : "#ffccc7"}`,
          borderRadius: "6px",
          fontSize: "14px",
        }}
      >
        {timeLeft > 0 ? (
          <>
            <span style={{ color: timeLeft > 60 ? "#52c41a" : "#ff4d4f" }}>
              Code expires in: <strong>{formatTime(timeLeft)}</strong>
            </span>
          </>
        ) : (
          <span style={{ color: "#ff4d4f" }}>
            ⚠️ OTP code has expired. Please request a new one.
          </span>
        )}
      </div>

      <input
        className="otp-input"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        onKeyPress={handleKeyPress}
        maxLength={6}
        disabled={timeLeft === 0} // Disable khi hết thời gian
      />

      <div>
        <button
          className="otp-verify-button"
          onClick={handleVerify}
          disabled={!otp || otp.length !== 6 || loading || timeLeft === 0}
        >
          {loading && <span className="otp-button-loading"></span>}
          {timeLeft === 0 ? "Code Expired" : "Verify OTP"}
        </button>
      </div>

      <div className="otp-actions">
        <button
          className="otp-resend-button"
          onClick={handleResend}
          disabled={resendLoading || (!canResend && timeLeft > 0)}
        >
          {resendLoading && <span className="otp-button-loading"></span>}
          {timeLeft > 0 && !canResend
            ? `Resend in ${formatTime(timeLeft)}`
            : "Resend OTP"}
        </button>

        <button className="otp-cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>

      {/* THÔNG BÁO THÊM */}
      <div
        style={{
          marginTop: "15px",
          fontSize: "12px",
          color: "#8c8c8c",
          textAlign: "center",
          lineHeight: "1.4",
        }}
      >
        💡 Didn't receive the code? Check your spam folder or click "Resend OTP"
      </div>
    </div>
  );
};

function RegisterForm() {
  const navigate = useNavigate();

  // State cho OTP
  const [currentToastId, setCurrentToastId] = useState(null);

  // Google Client ID
  const GOOGLE_CLIENT_ID = "26142191146-7u8f63rgtupdv8v6kv8ug307j55hjfob.apps.googleusercontent.com";

  // Google Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post("/auth/google", {
credential: credentialResponse.credential,
      });
      const { role } = response.data;
      toast.success("Google registration successful!");

      if (role === "Customer") {
        navigate("/");
      } else if (["Staff", "Manager", "Admin"].includes(role)) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data || "Google registration failed! Please try again.");
    }
  };

  // Google Error Handler
  const handleGoogleError = () => {
    toast.error("Google registration failed! Please try again.");
  };

  // Function hiển thị OTP Verification
  const showOTPVerification = (email) => {
    if (currentToastId) {
      toast.dismiss(currentToastId);
    }

    const toastId = toast(
      <OTPVerification
        email={email} // TỰ ĐỘNG TRUYỀN EMAIL TỪ FORM ĐĂNG KÝ
        onVerify={() => {
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }}
        onResend={() => {
          // OTP resend is handled within the component
        }}
        onClose={() => {
          toast.dismiss(toastId);
          setCurrentToastId(null);
        }}
      />,
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        closeButton: false,
        className: "Toastify__toast--otp",
      }
    );

    setCurrentToastId(toastId);
  };

  const onFinish = async (values) => {
    if (values.dob && values.dob.format) {
    values.dob = values.dob.format("YYYY-MM-DD");
  }
    console.log("Success:", values);
    try {
      await api.post("auth/register", values);
      toast.success(
        "Registration successful! Please check your email for OTP verification."
      );

      setTimeout(() => {
        showOTPVerification(values.email);
      }, 1500);
    } catch (e) {
      console.log(e);

      const errorMessage =
        e.response?.data?.message ||
        e.response?.data ||
        "Registration failed. Please try again.";
      const statusCode = e.response?.status;

      // Kiểm tra nếu là case OTP đã gửi thành công
      if (
        errorMessage.includes("OTP has been sent") ||
        errorMessage.includes("confirm to active")
      ) {
        toast.success(
          "Registration successful! OTP has been sent to your email."
        );

        setTimeout(() => {
          showOTPVerification(values.email);
        }, 1500);
        return;
      }

      // Xử lý lỗi khác...
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
    console.log("Failed:", errorInfo);

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

          {/* ===== THÊM GOOGLE SIGN UP ===== */}
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
          {/* ===== KẾT THÚC GOOGLE SIGN UP ===== */}

          <p className="helper-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </ConfigProvider>
  );
}
export default RegisterForm;
