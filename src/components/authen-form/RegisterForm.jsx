import React, { useState, useEffect, useRef } from "react";
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
import { login } from "../../redux/features/userSlice";
import { useDispatch } from "react-redux";
import * as yup from 'yup';
import { CheckCircle, XCircle } from "lucide-react";

// ✅ Yup validation schema với vanilla JavaScript date validation
const validationSchema = yup.object().shape({
  fullname: yup
    .string()
    .required('Full name is required')
    .trim()
    .min(2, 'Full name must be at least 2 characters'),

  username: yup
    .string()
    .required('Username is required')
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),

  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim(),

  password: yup
    .string()
    .required('Password is required'), // Bỏ .min() để không bị lỗi lặp

  // ✅ Phone validation - bắt đầu bằng 0 và đủ 10 số
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^0\d{9}$/, 'Phone number must start with 0 and have exactly 10 digits')
    .test('phone-format', 'Phone number must start with 0 and contain exactly 10 digits', (value) => {
      if (!value) return false;
      const cleanPhone = value.replace(/\s+/g, '').replace(/[^\d]/g, '');
      return cleanPhone.length === 10 && cleanPhone.startsWith('0');
    }),

  // ✅ DOB validation - sử dụng vanilla JavaScript
  dob: yup
    .mixed()
    .required('Date of birth is required')
    .test('dob-valid', 'Please select a valid date', (value) => {
      if (!value) return false;
      return true; // Basic validation
    })
    .test('dob-not-future', 'Date of birth cannot be in the future', (value) => {
      if (!value) return false;
      
      try {
        let dateToCheck;
        
        // Handle different input types
        if (value && typeof value === 'object' && value.format) {
          // Antd DatePicker moment object
          dateToCheck = new Date(value.format('YYYY-MM-DD'));
        } else if (value instanceof Date) {
          // Date object
          dateToCheck = value;
        } else if (typeof value === 'string') {
          // String
          dateToCheck = new Date(value);
        } else {
          return false;
        }

        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        
        return dateToCheck <= today;
      } catch (error) {
        console.error('DOB validation error:', error);
        return false;
      }
    })
    .test('dob-reasonable', 'Please enter a valid date of birth', (value) => {
      if (!value) return false;
      
      try {
        let dateToCheck;
        
        if (value && typeof value === 'object' && value.format) {
          dateToCheck = new Date(value.format('YYYY-MM-DD'));
        } else if (value instanceof Date) {
          dateToCheck = value;
        } else if (typeof value === 'string') {
          dateToCheck = new Date(value);
        } else {
          return false;
        }

        const today = new Date();
        const hundredYearsAgo = new Date();
        hundredYearsAgo.setFullYear(today.getFullYear() - 100);
        
        return dateToCheck > hundredYearsAgo && dateToCheck <= today;
      } catch (error) {
        console.error('DOB reasonable validation error:', error);
        return false;
      }
    })
    .test('dob-minimum-age', 'You must be at least 18 years old to register', (value) => {
      if (!value) return false;
      
      try {
        let dateToCheck;
        
        if (value && typeof value === 'object' && value.format) {
          dateToCheck = new Date(value.format('YYYY-MM-DD'));
        } else if (value instanceof Date) {
          dateToCheck = value;
        } else if (typeof value === 'string') {
          dateToCheck = new Date(value);
        } else {
          return false;
        }

        const today = new Date();
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(today.getFullYear() - 18);
        
        return dateToCheck <= eighteenYearsAgo;
      } catch (error) {
        console.error('DOB minimum age validation error:', error);
        return false;
      }
    }),

  address: yup
    .string()
    .required('Address is required')
    .trim()
    .min(5, 'Address must be at least 5 characters'),

  gender: yup
    .number()
    .required('Gender is required')
    .oneOf([0, 1], 'Please select a valid gender'),

  agreement: yup
    .boolean()
    .oneOf([true], 'You must agree to the Terms and Privacy Policy')
});

// ✅ Helper functions
const validateField = async (fieldName, value, allValues = {}) => {
  try {
    await validationSchema.validateAt(fieldName, { ...allValues, [fieldName]: value });
    return { isValid: true, message: '' };
  } catch (error) {
    return { isValid: false, message: error.message };
  }
};

const validateForm = async (values) => {
  try {
    await validationSchema.validate(values, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.inner.forEach((err) => {
      errors[err.path] = err.message;
    });
    return { isValid: false, errors };
  }
};

const formatPhoneNumber = (value) => {
  if (!value) return '';
  
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length > 0 && !numbers.startsWith('0')) {
    return '0' + numbers.slice(0, 9);
  }
  
  return numbers.slice(0, 10);
};
const RESEND_OTP_TIME = 60; // thời gian chờ resend OTP (giây)
// Custom OTP Verification Component
const OTPVerification = ({ email, onVerify, onClose }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(RESEND_OTP_TIME);
  const [canResend, setCanResend] = useState(false);

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

  // Khi otp thay đổi thì luôn bật lại nút Verify OTP
  useEffect(() => {
    setLoading(false);
  }, [otp]);

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
      await api.post("auth/resend-otp", { email });
      toast.success("New OTP code has been sent to your email");
      setOtp("");
      setTimeLeft(RESEND_OTP_TIME);
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
        <span style={{ color: "#1890ff", fontWeight: "bold" }}>
          Please check your inbox and enter the code below.
        </span>
      </div>

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
        onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        onFocus={() => setLoading(false)}
        onKeyPress={handleKeyPress}
        maxLength={6}
        disabled={loading}
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
          disabled={resendLoading || !canResend}
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

      <div
        style={{
          marginTop: "15px",
          fontSize: "12px",
          color: "#8c8c8c",
          textAlign: "center",
          lineHeight: "1.4",
        }}
      >
        💡 Didn't receive the code? Check your spam folder or click "Resend OTP" after 1 minutes
      </div>
    </div>
  );
};

function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentToastId, setCurrentToastId] = useState(null);
  const [form] = Form.useForm();
  const [passwordValue, setPasswordValue] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordInputRef = useRef(null);

  // Password requirements check
  const passwordChecks = [
    {
      label: "At least 8 characters",
      test: (pw) => pw.length >= 8,
    },
    {
      label: "Uppercase letter (A-Z)",
      test: (pw) => /[A-Z]/.test(pw),
    },
    {
      label: "Lowercase letter (a-z)",
      test: (pw) => /[a-z]/.test(pw),
    },
    {
      label: "Number (0-9)",
      test: (pw) => /[0-9]/.test(pw),
    },
    {
      label: "Special character",
      test: (pw) => /[^A-Za-z0-9]/.test(pw),
    },
  ];

  // Check if all requirements are met
  const isPasswordStrong = passwordChecks.every((item) => item.test(passwordValue));

  // Thêm useEffect để handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (passwordInputRef.current && !passwordInputRef.current.contains(event.target)) {
        setIsPasswordFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const GOOGLE_CLIENT_ID = "26142191146-7u8f63rgtupdv8v6kv8ug307j55hjfob.apps.googleusercontent.com";

  // Real-time validation handlers
  const handleFieldValidation = async (fieldName, value) => {
    try {
      const result = await validateField(fieldName, value);
      if (!result.isValid) {
        toast.error(result.message);
        return false;
      }
      return true;
    } catch (error) {
      toast.error(`Validation error: ${error.message}`);
      return false;
    }
  };

  const handleFullNameBlur = (e) => {
    const value = e.target.value;
    if (value) {
      handleFieldValidation('fullname', value);
    }
  };

  const handleUsernameBlur = (e) => {
    const value = e.target.value;
    if (value) {
      handleFieldValidation('username', value);
    }
  };

  const handleEmailBlur = (e) => {
    const value = e.target.value;
    if (value) {
      handleFieldValidation('email', value);
    }
  };

  const handlePasswordBlur = (e) => {
    const value = e.target.value;
    if (value) {
      handleFieldValidation('password', value);
    }
  };

  const handlePhoneBlur = (e) => {
    const value = e.target.value;
    if (value) {
      handleFieldValidation('phone', value);
    }
  };

  const handleDobChange = (date) => {
    if (date) {
      handleFieldValidation('dob', date);
    }
  };

  const handleAddressBlur = (e) => {
    const value = e.target.value;
    if (value) {
      handleFieldValidation('address', value);
    }
  };

  const handleGenderChange = (value) => {
    if (value !== undefined && value !== null) {
      handleFieldValidation('gender', value);
    }
  };

  const handleAgreementChange = (e) => {
    const checked = e.target.checked;
    if (!checked) {
      toast.error("You must agree to the Terms and Privacy Policy");
    }
  };

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

  const handleGoogleError = () => {
    toast.error("Google registration failed! Please try again.");
  };

  const showOTPVerification = (email) => {
  if (currentToastId) {
    toast.dismiss(currentToastId);
  }

  const toastId = toast(
    <OTPVerification
      email={email}
      onVerify={() => {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }}
      onResend={async () => {
        try {
          await api.post("auth/resend-otp", { email });
          toast.success("New OTP code has been sent to your email");
        } catch (error) {
          toast.error("Failed to resend OTP. Please try again.");
        }
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
    setIsSubmitting(true);
    if (values.dob && values.dob.format) {
      values.dob = values.dob.format("YYYY-MM-DD");
    }

    console.log("Form values before validation:", values);

    const validation = await validateForm(values);
    if (!validation.isValid) {
      console.log("Yup validation errors:", validation.errors);
      const firstError = Object.values(validation.errors)[0];
      toast.error(firstError);
      // Xóa password khi validation thất bại
      setPasswordValue('');
      setIsPasswordFocused(false);
      form.setFieldsValue({ password: '' });
      setIsSubmitting(false);
      return;
    }

    console.log("Yup validation passed. Submitting...", values);

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

      const finalErrorMessage =
        statusCode === 409 || statusCode === 400
          ? errorMessage.toLowerCase().includes("email")
            ? "This email is already registered. Please use a different email address."
            : errorMessage.toLowerCase().includes("username")
            ? "This username is already taken. Please choose a different username."
            : errorMessage
          : errorMessage;

      toast.error(finalErrorMessage);
      setIsSubmitting(false);
      // Xóa password khi có lỗi
      setPasswordValue('');
      setIsPasswordFocused(false);
      form.setFieldsValue({ password: '' });
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
    
    // Xóa password khi form validation thất bại
    setPasswordValue('');
    setIsPasswordFocused(false);
    form.setFieldsValue({ password: '' });
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    e.target.value = formatted;
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
            form={form}
          >
            <div className="form-row">
              <div className="form-col">
                <Form.Item
                  label="Full Name"
                  name="fullname"
                  className="form-field"
                  rules={[
                    { required: true, message: "Required" },
                    {
                      validator: async (_, value) => {
                        if (!value) return Promise.resolve();
                        const result = await validateField('fullname', value);
                        if (!result.isValid) {
                          return Promise.reject(new Error(result.message));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input 
                    placeholder="Enter your full name" 
                    onBlur={handleFullNameBlur}
                  />
                </Form.Item>

                <Form.Item
                  label="Username"
                  name="username"
                  className="form-field"
                  rules={[
                    { required: true, message: "Required" },
                    {
                      validator: async (_, value) => {
                        if (!value) return Promise.resolve();
                        const result = await validateField('username', value);
                        if (!result.isValid) {
                          return Promise.reject(new Error(result.message));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input 
                    placeholder="Choose a username" 
                    onBlur={handleUsernameBlur}
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  className="form-field"
                  validateTrigger={['onBlur', 'onSubmit']}
                  validateFirst
                  help={form.getFieldError('password')[0] || null}
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.reject("Required");
                        if (value.length < 8) return Promise.resolve();
                        if (!/[A-Z]/.test(value)) return Promise.resolve();
                        if (!/[a-z]/.test(value)) return Promise.resolve();
                        if (!/[0-9]/.test(value)) return Promise.resolve();
                        if (!/[^A-Za-z0-9]/.test(value)) return Promise.resolve();
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <div ref={passwordInputRef}>
                    <Input.Password
                      placeholder="Create a password"
                      onBlur={() => setIsPasswordFocused(false)}
                      onFocus={() => setIsPasswordFocused(true)}
                      value={passwordValue}
                      onChange={e => setPasswordValue(e.target.value)}
                    />
                    <div 
                      className={`password-requirements-container ${isPasswordFocused ? 'show' : 'hide'}`}
                    >
                      {isPasswordFocused && (
                        <div className="p-3">
                          <div className="text-xs font-semibold text-gray-600 mb-2">Password Requirements</div>
                          <ul className="space-y-1">
                            {passwordChecks.map((item, idx) => {
                              const ok = item.test(passwordValue);
                              return (
                                <li key={item.label} className="flex items-center text-xs" style={{color: ok ? '#22c55e' : '#ef4444'}}>
                                  {ok ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                                  {item.label}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  className="form-field"
                  rules={[
                    { required: true, message: "Required" },
                    { type: "email", message: "Invalid email" },
                    {
                      validator: async (_, value) => {
                        if (!value) return Promise.resolve();
                        const result = await validateField('email', value);
                        if (!result.isValid) {
                          return Promise.reject(new Error(result.message));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input 
                    placeholder="Enter your email" 
                    onBlur={handleEmailBlur}
                  />
                </Form.Item>
              </div>

              <div className="form-col">
                <Form.Item
                  label="Phone"
                  name="phone"
                  className="form-field"
                  rules={[
                    { required: true, message: "Required" },
                    {
                      validator: async (_, value) => {
                        if (!value) return Promise.resolve();
                        const result = await validateField('phone', value);
                        if (!result.isValid) {
                          return Promise.reject(new Error(result.message));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input 
                    placeholder="Enter your phone number (0xxxxxxxxx)"
                    onChange={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                    maxLength={10}
                  />
                </Form.Item>

                <Form.Item
                  label="Date of Birth"
                  name="dob"
                  className="form-field"
                  rules={[
                    { required: true, message: "Required" },
                    {
                      validator: async (_, value) => {
                        if (!value) return Promise.resolve();
                        const result = await validateField('dob', value);
                        if (!result.isValid) {
                          return Promise.reject(new Error(result.message));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <DatePicker
                    placeholder="Enter date of birth"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    onChange={handleDobChange}
                    disabledDate={(current) => {
                      // ✅ Vanilla JavaScript date validation
                      if (!current) return false;
                      
                      const today = new Date();
                      const hundredYearsAgo = new Date();
                      hundredYearsAgo.setFullYear(today.getFullYear() - 100);
                      
                      // ✅ Minimum age 18 years
                      const eighteenYearsAgo = new Date();
                      eighteenYearsAgo.setFullYear(today.getFullYear() - 18);
                      
                      const currentDate = current.toDate();
                      
                      return currentDate > today || currentDate < hundredYearsAgo || currentDate > eighteenYearsAgo;
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Address"
                  name="address"
                  className="form-field"
                  rules={[
                    { required: true, message: "Required" },
                    {
                      validator: async (_, value) => {
                        if (!value) return Promise.resolve();
                        const result = await validateField('address', value);
                        if (!result.isValid) {
                          return Promise.reject(new Error(result.message));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input 
                    placeholder="Enter your address" 
                    onBlur={handleAddressBlur}
                  />
                </Form.Item>

                <Form.Item
                  label="Gender"
                  name="gender"
                  className="form-field"
                  rules={[
                    { required: true, message: "Required" },
                    {
                      validator: async (_, value) => {
                        if (value === undefined || value === null) return Promise.resolve();
                        const result = await validateField('gender', value);
                        if (!result.isValid) {
                          return Promise.reject(new Error(result.message));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Select 
                    placeholder="Select gender"
                    onChange={handleGenderChange}
                  >
                    <Select.Option value={1}>Male</Select.Option>
                    <Select.Option value={2}>Female</Select.Option>
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
              <Button 
                type="primary" 
                htmlType="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                loading={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
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
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </ConfigProvider>
  );
}
export default RegisterForm;