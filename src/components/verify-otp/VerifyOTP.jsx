import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Form,
  Card,
  Typography,
  Space,
  Divider,
  Row,
  Col,
  Alert,
} from "antd";
import {
  MailOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  BugOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function VerifyOTP({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [showTestButtons, setShowTestButtons] = useState(true);

  // Countdown timer OTP (5 minutes = 300 seconds)
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && otpSent && !otpVerified) {
      alert("OTP has expired. Please request a new one.");
      setOtpSent(false);
      setCanResend(true);
      setOtp("");
    }
  }, [timeLeft, otpSent, otpVerified]);

  // Format time showed (mm:ss)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Send OTP to user's email
  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setSendingOtp(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("OTP has been sent to your email!");
      setOtpSent(true);
      setTimeLeft(300); // 5 minutes = 300 seconds
      setCanResend(false);
      setOtp("");
    } catch (error) {
      alert("Failed to send OTP. Please try again.");
      console.error("Send OTP error:", error);
    } finally {
      setSendingOtp(false);
    }
  };

  // Handle verify OTP check OTP and allow user to reset password
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    if (timeLeft <= 0) {
      alert("OTP has expired. Please request a new one.");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("OTP verified successfully! You can now reset your password.");
      setOtpVerified(true);

      if (onSubmit) {
        onSubmit(email, otp);
      }
    } catch (error) {
      alert("OTP verification failed. Please check your OTP and try again.");
      console.error("Verify OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle save new password
  const handleSavePassword = async () => {
    if (!newPassword) {
      alert("Please enter your new password.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setSavingPassword(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Password updated successfully!");
      // Reset form to initial state
      resetForm();
    } catch (error) {
      alert("Failed to update password. Please try again.");
      console.error("Reset password error:", error);
    } finally {
      setSavingPassword(false);
    }
  };

  // Reset to resend OTP
  const handleResendOtp = () => {
    setOtpSent(false);
    setCanResend(true);
    setTimeLeft(0);
    setOtp("");
  };

  // Reset entire form
  const resetForm = () => {
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setOtpSent(false);
    setOtpVerified(false);
    setTimeLeft(0);
    setCanResend(true);
  };

  // TEST BUTTON FUNCTIONS
  const testButtons = {
    // Test State 1: Initial state (Email input only)
    testInitialState: () => {
      resetForm();
      alert("✅ Test: Initial State - Only email input visible");
    },

    // Test State 2: Email entered, OTP sent
    testOtpSentState: () => {
      setEmail("test@example.com");
      setOtpSent(true);
      setTimeLeft(300);
      setOtp("");
      setOtpVerified(false);
      alert(
        "✅ Test: OTP Sent State - Email disabled, OTP input visible, timer running"
      );
    },

    // Test State 3: OTP expired
    testOtpExpiredState: () => {
      setEmail("test@example.com");
      setOtpSent(true);
      setTimeLeft(0);
      setOtp("");
      setOtpVerified(false);
      alert("✅ Test: OTP Expired State - Can resend OTP");
    },

    // Test State 4: OTP verified, show password reset
    testOtpVerifiedState: () => {
      setEmail("test@example.com");
      setOtpSent(true);
      setOtp("123456");
      setOtpVerified(true);
      setTimeLeft(0);
      alert("✅ Test: OTP Verified State - Password reset form visible");
    },

    // Test State 5: Loading states
    testLoadingStates: () => {
      setEmail("test@example.com");
      setOtpSent(true);
      setOtp("123456");
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSendingOtp(true);
        setTimeout(() => {
          setSendingOtp(false);
          setSavingPassword(true);
          setTimeout(() => setSavingPassword(false), 1000);
        }, 1000);
      }, 1000);
      alert("✅ Test: Loading States - Watch different loading buttons");
    },

    // Test with pre-filled data
    testPreFilledData: () => {
      setEmail("user@example.com");
      setOtp("123456");
      setNewPassword("newpassword123");
      setConfirmPassword("newpassword123");
      setOtpSent(true);
      setOtpVerified(true);
      alert("✅ Test: Pre-filled Data - All fields filled for testing");
    },
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      {/* TEST BUTTONS SECTION */}
      {showTestButtons && (
        <Card
          style={{ marginBottom: "20px", border: "2px dashed #1890ff" }}
          title={
            <span>
              <BugOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
              Test Buttons - Conditional Rendering States
            </span>
          }
          extra={
            <Button size="small" onClick={() => setShowTestButtons(false)}>
              Hide Tests
            </Button>
          }
        >
          <Alert
            message="Development Mode"
            description="Use these buttons to test different conditional rendering states of the VerifyOTP component"
            type="info"
            showIcon
            style={{ marginBottom: "16px" }}
          />

          <Space wrap>
            <Button
              type="default"
              onClick={testButtons.testInitialState}
              size="small"
            >
              1. Initial State
            </Button>
            <Button
              type="default"
              onClick={testButtons.testOtpSentState}
              size="small"
            >
              2. OTP Sent
            </Button>
            <Button
              type="default"
              onClick={testButtons.testOtpExpiredState}
              size="small"
            >
              3. OTP Expired
            </Button>
            <Button
              type="default"
              onClick={testButtons.testOtpVerifiedState}
              size="small"
            >
              4. OTP Verified
            </Button>
            <Button
              type="default"
              onClick={testButtons.testLoadingStates}
              size="small"
            >
              5. Loading States
            </Button>
            <Button
              type="default"
              onClick={testButtons.testPreFilledData}
              size="small"
            >
              6. Pre-filled Data
            </Button>
          </Space>
        </Card>
      )}

      {!showTestButtons && (
        <Button
          type="link"
          icon={<BugOutlined />}
          onClick={() => setShowTestButtons(true)}
          style={{ marginBottom: "16px" }}
        >
          Show Test Buttons
        </Button>
      )}

      {/* MAIN VERIFY OTP COMPONENT */}
      <Card style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <SafetyOutlined
            style={{ fontSize: "48px", color: "#1890ff", marginBottom: "16px" }}
          />
          <Title level={2} style={{ margin: "0 0 8px 0" }}>
            {otpVerified ? "Reset Password" : "Email Verification"}
          </Title>
          <Text type="secondary">
            {otpVerified
              ? "Enter your new password"
              : "Enter your email to receive an OTP code"}
          </Text>
        </div>

        <div>
          {/* CONDITIONAL RENDERING 1: Email Input Section */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              Email Address <span style={{ color: "red" }}>*</span>
            </label>
            <Row gutter={8}>
              <Col flex="auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  prefix={<MailOutlined />}
                  size="large"
                  disabled={otpSent && timeLeft > 0}
                />
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={handleSendOtp}
                  loading={sendingOtp}
                  disabled={sendingOtp || (otpSent && timeLeft > 0)}
                  size="large"
                >
                  {sendingOtp ? "Sending..." : "Send OTP"}
                </Button>
              </Col>
            </Row>
          </div>

          {/* CONDITIONAL RENDERING 2: OTP Input Section - Only show when OTP is sent */}
          {otpSent && (
            <>
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#f6ffed",
                  border: "1px solid #b7eb8f",
                  borderRadius: "6px",
                  marginBottom: "16px",
                }}
              >
                <Text strong>
                  OTP has been sent to: <Text code>{email}</Text>
                </Text>

                {/* CONDITIONAL RENDERING 3: Timer - Only show when time is running and OTP not verified */}
                {timeLeft > 0 && !otpVerified && (
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <ClockCircleOutlined style={{ color: "#faad14" }} />
                    <Text type="warning" strong>
                      Time remaining: {formatTime(timeLeft)}
                    </Text>
                  </div>
                )}

                <div style={{ marginTop: "16px", marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    Enter OTP Code <span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    maxLength={6}
                    size="large"
                    disabled={timeLeft <= 0 || otpVerified}
                  />
                </div>

                {/* CONDITIONAL RENDERING 4: Verify Button - Only show when OTP not verified */}
                {!otpVerified && (
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Button
                      type="primary"
                      onClick={handleVerifyOtp}
                      loading={loading}
                      disabled={loading || timeLeft <= 0 || otp.length !== 6}
                      size="large"
                      block
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </Button>

                    {/* CONDITIONAL RENDERING 5: Resend Button - Only show when OTP expired */}
                    {timeLeft <= 0 && (
                      <Button
                        type="default"
                        onClick={handleResendOtp}
                        size="large"
                        block
                      >
                        Resend OTP
                      </Button>
                    )}
                  </Space>
                )}
              </div>
            </>
          )}

          {/* CONDITIONAL RENDERING 6: Password Reset Section - Only show when OTP is verified */}
          {otpVerified && (
            <>
              <Divider />

              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#fff2e8",
                  border: "1px solid #ffbb96",
                  borderRadius: "6px",
                }}
              >
                <Title
                  level={4}
                  style={{ margin: "0 0 16px 0", color: "#fa541c" }}
                >
                  🔒 Set New Password
                </Title>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    New Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <Input.Password
                    placeholder="Enter new password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    prefix={<LockOutlined />}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    size="large"
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    Confirm Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <Input.Password
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    prefix={<LockOutlined />}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    size="large"
                  />
                </div>

                <Button
                  type="primary"
                  onClick={handleSavePassword}
                  loading={savingPassword}
                  disabled={savingPassword || !newPassword || !confirmPassword}
                  size="large"
                  block
                  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                >
                  {savingPassword ? "Saving..." : "Save New Password"}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* CONDITIONAL RENDERING 7: Instructions - Different based on current state */}
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "#fafafa",
            borderRadius: "6px",
          }}
        >
          <Text type="secondary">
            {otpVerified ? (
              <>
                • Enter your new password (minimum 6 characters)
                <br />
                • Confirm your password by entering it again
                <br />• Click "Save New Password" to complete the reset
              </>
            ) : (
              <>
                • Enter your email address and click "Send OTP"
                <br />
                • Check your email for the 6-digit verification code
                <br />
                • Enter the OTP within 5 minutes
                <br />• Click "Verify OTP" to proceed
              </>
            )}
          </Text>
        </div>

        {/* Current State Indicator for Testing */}
        {showTestButtons && (
          <div
            style={{
              marginTop: "16px",
              padding: "8px",
              backgroundColor: "#e6f7ff",
              border: "1px solid #91d5ff",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            <strong>Current State:</strong>{" "}
            {otpVerified
              ? "Password Reset"
              : otpSent
              ? timeLeft > 0
                ? "OTP Sent (Active)"
                : "OTP Expired"
              : "Initial"}{" "}
            |<strong> Email:</strong> {email || "None"} |<strong> OTP:</strong>{" "}
            {otp || "None"} |<strong> Timer:</strong> {timeLeft}s
          </div>
        )}
      </Card>
    </div>
  );
}

export default VerifyOTP;
