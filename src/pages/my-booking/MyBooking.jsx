import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Typography,
  Tag,
  Input,
  Row,
  Col,
  Card,
  Space,
  Button,
  Empty,
  Modal,
  Descriptions,
  Select,
  Dropdown,
  Menu,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  ExperimentOutlined,
  DownloadOutlined,
  CommentOutlined,
  StopOutlined,
  ArrowLeftOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import BookingDetailModal from "./BookingDetailModal";
import { FaArrowLeft } from "react-icons/fa";
import FeedbackModal from "./FeedbackModal";
import ViewFeedbackModal from "./ViewFeedbackModal";
import { checkMultipleBookingsFeedback } from "../../services/feedbackService";
import DnaResultModal from "./DnaResultModal";
import { getDnaResultByBooking } from "../../services/dnaResultService";

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const MyBooking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 6 });
  const [feedbackStatus, setFeedbackStatus] = useState({});
  
  // State for feedback modals
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showViewFeedbackModal, setShowViewFeedbackModal] = useState(false);
  const [selectedFeedbackBookingId, setSelectedFeedbackBookingId] = useState(null);

  // State for DNA result modal
  const [showDnaResultModal, setShowDnaResultModal] = useState(false);
  const [dnaResultData, setDnaResultData] = useState(null);
  const [resultAvailableMap, setResultAvailableMap] = useState({});

  const statusList = [
    "Awaiting Confirmation", 
    "Payment Confirmed", 
    "Booking Confirmed", 
    "Awaiting Sample", 
    "In Progress", 
    "Completed", 
    "Cancelled"
  ];

  const paymentMethodList = [
  "Cash",
  "VNPAY",
  ];

  const serviceTypes = [
  { value: "Legal", label: "Legal" },
  { value: "Non-Legal", label: "Non-Legal" }
  ];

  // Statuses that cannot be canceled
  const nonCancelableStatuses = [
    "Booking confirmed",
    "Awaiting Sample",
    "In Progress",
    "Ready",
    "Completed",
    "Cancel",
    "Cancelled"
  ];

  // Helper function to determine if a service is legal or non-legal based on service ID
  const getServiceType = (serviceID) => {
    if (serviceID?.startsWith('SL')) {
      return 'Legal';
    } else if (serviceID?.startsWith('SNL')) {
      return 'Non-Legal';
    }
    return '';
  };

  const serviceMap = {
  SL001: "DNA Testing for Birth Registration",
  SL002: "DNA Testing for Immigration Cases",
  SL003: "DNA Testing for Inheritance or Asset Division",
  SNL001: "Paternity Testing",
  SNL002: "Maternity Testing",
  SNL003: "Non-Invasive Relationship Testing (NIPT)",
  SNL004: "Sibling Testing",
  SNL005: "Grandparent Testing",
  };

  const user = useSelector((state) => state.user.currentUser);
  const { customerID } = useSelector(state => state.user);

  useEffect(() => {
    fetchMyBookings();
  }, [user?.id]);

  // Check feedback status when bookings change
  useEffect(() => {
    checkFeedbackStatus();
  }, [bookings]);

  // Kiểm tra trạng thái available của kết quả cho các booking Completed
  useEffect(() => {
    const checkResults = async () => {
      const completed = bookings.filter(b => b.status === "Completed");
      const map = {};
      await Promise.all(completed.map(async (b) => {
        const result = await getDnaResultByBooking(b.bookingId);
        map[b.bookingId] = result && result.available;
      }));
      setResultAvailableMap(map);
    };
    if (bookings.length > 0) checkResults();
  }, [bookings]);

  const fetchMyBookings = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
        const res = await api.get(`/booking/my-bookings/${customerID}`);
        // Ensure we always set an array
        const data = res.data;
        if (Array.isArray(data)) {
          setBookings(data);
        } else if (data && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else {
          setBookings([]);
        }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to fetch your bookings.");
      setBookings([]); // Ensure bookings is always an array even on error
    } finally {
      setLoading(false);
    }
  };

  // Check feedback status for completed bookings
  const checkFeedbackStatus = async () => {
    const completedBookings = bookings.filter(booking => booking.status === "Completed");
    
    if (completedBookings.length === 0) return;
    
    const bookingIds = completedBookings.map(booking => booking.bookingId);
    
    try {
      const response = await checkMultipleBookingsFeedback(bookingIds);
      setFeedbackStatus(response);
    } catch (error) {
      console.error("Error checking feedback status:", error);
    }
  };

  const handleViewDetail = (record) => {
    console.log("Selected booking detail:", JSON.stringify(record, null, 2));
    setSelectedBooking({
      ...record,
      collectionMethod: {
        name: record.collectionMethod || "At Facility"
      }
    });
    setShowModal(true);
  };

  const handleCancelBooking = (record) => {
    confirm({
      title: 'Are you sure you want to cancel this booking?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          setLoading(true);
          await api.delete(`/customer/bookings/${record.bookingId}/cancel`);
          toast.success('Booking cancelled successfully');
          fetchMyBookings(); // Refresh the list after cancellation
        } catch (error) {
          console.error("Error cancelling booking:", error);
          toast.error(error.response?.data?.message || 'Failed to cancel booking');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleDownloadResult = async (record) => {
    try {
      const res = await api.get(`/booking/export-pdf/${record.bookingId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Result_DNA_${record.bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      //toast.error("Download failed. Please try again!");
    }
  };

  const handleFeedbackButtonClick = (bookingId, hasFeedback) => {
    setSelectedFeedbackBookingId(bookingId);
    
    if (hasFeedback) {
      setShowViewFeedbackModal(true);
    } else {
      setShowFeedbackModal(true);
    }
  };

  // Sửa hàm này để xử lý đúng thông tin từ FeedbackModal
  const handleFeedbackModalClose = (success = false, viewFeedback = false) => {
    console.log("FeedbackModal closed with success:", success, "viewFeedback:", viewFeedback);
    
    if (success) {
      // Nếu feedback đã được gửi thành công, cập nhật trạng thái ngay lập tức
      console.log("Updating feedback status for bookingId:", selectedFeedbackBookingId);
      setFeedbackStatus(prev => ({
        ...prev,
        [selectedFeedbackBookingId]: true
      }));
    }
    
    setShowFeedbackModal(false);
    
    if (success && viewFeedback) {
      // Nếu cần chuyển sang xem feedback
      setTimeout(() => {
        setShowViewFeedbackModal(true);
      }, 300);
    }
  };

  const handleViewFeedbackModalClose = () => {
    setShowViewFeedbackModal(false);
  };

  // Hàm lấy kết quả DNA cho 1 booking
  const fetchDnaResult = async (bookingId) => {
    const result = await getDnaResultByBooking(bookingId);
    if (result && result.available) {
      setDnaResultData(result);
      setShowDnaResultModal(true);
    } else {
      setDnaResultData(null);
      setShowDnaResultModal(false);
      toast.info("Result is not available");
    }
  };

  const getStatusTag = (status) => {
    let color = "default";
    let icon = <ClockCircleOutlined />;
    if (status === "Waiting confirmed" || status === "Awaiting Confirmation") color = "gold";
    else if (status === "Booking confirmed" || status === "Booking Confirmed") {
      color = "blue";
      icon = <CheckCircleOutlined />;
    } else if (status === "Awaiting Sample") {
      color = "purple";
      icon = <LoadingOutlined />;
    } else if (status === "In Progress") {
      color = "cyan";
      icon = <LoadingOutlined />;
    } else if (status === "Ready") {
      color = "lime";
      icon = <CheckCircleOutlined />;
    } else if (status === "Pending Payment" || status === "Payment Confirmed") {
      color = "orange";
      icon = <ExclamationCircleOutlined />;
    } else if (status === "Completed") {
      color = "green";
      icon = <CheckCircleOutlined />;
    } else if (status === "Cancel" || status === "Cancelled") {
      color = "red";
      icon = <ExclamationCircleOutlined />;
    }
    return (
      <Tag icon={icon} color={color} style={{ fontWeight: 500 }}>
        {status}
      </Tag>
    );
  };

  const columns = [
  {
    title: "No.",
    key: "index",
    render: (_, __, index) => {
      // Calculate the sequential number based on pagination
      return (pagination.current - 1) * pagination.pageSize + index + 1;
    },
  },
  {
    title: "Service Type",
    dataIndex: "serviceID",
    key: "serviceType",
    render: (serviceID) => getServiceType(serviceID),
  },
  {
    title: "Service Name",
    dataIndex: "serviceID",
    key: "serviceName",
    render: (serviceID) => serviceMap[serviceID] || "N/A",
  },
  {
    title: "Appointment Date",
    dataIndex: "appointmentTime",
    key: "appointmentTime",
    render: (appointmentTime) => {
      if (Array.isArray(appointmentTime) && appointmentTime.length === 3) {
        const [year, month, day] = appointmentTime;
        return `${day.toString().padStart(2, "0")}/${month
          .toString()
          .padStart(2, "0")}/${year}`;
      }
      return "N/A";
    },
  },
  {
    title: "Time Slot",
    dataIndex: "timeRange",
    key: "timeRange",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: getStatusTag,
  },
  {
    title: "Payment Method",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
  },
  {
    title: "Total Cost",
    dataIndex: "totalCost",
    key: "totalCost",
    render: (cost) =>
      cost != null
        ? cost.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " VND"
        : "",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => {
      // Check if this booking has feedback
      const hasFeedback = feedbackStatus[record.bookingId] === true;
      const canViewResult = record.status === "Completed" && resultAvailableMap[record.bookingId];
      const menu = (
        <Menu>
          <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            View
          </Menu.Item>
          {canViewResult && (
            <Menu.Item key="view-result" icon={<ExperimentOutlined />} onClick={() => fetchDnaResult(record.bookingId)}>
              View Result
            </Menu.Item>
          )}
          {record.status === "Completed" && (
            <>
              <Menu.Item key="download" icon={<DownloadOutlined />} onClick={() => handleDownloadResult(record)}>
                Download Result
              </Menu.Item>
              <Menu.Item key="feedback" icon={hasFeedback ? <EyeOutlined /> : <CommentOutlined />} onClick={() => handleFeedbackButtonClick(record.bookingId, hasFeedback)}>
                {hasFeedback ? 'View Feedback' : 'Feedback'}
              </Menu.Item>
            </>
          )}
          {!nonCancelableStatuses.includes(record.status) && (
            <Menu.Item key="cancel" icon={<StopOutlined />} danger onClick={() => handleCancelBooking(record)}>
              Cancel
            </Menu.Item>
          )}
        </Menu>
      );
      return (
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button type="primary">Actions</Button>
        </Dropdown>
      );
    },
  },
];

  const filteredBookings = Array.isArray(bookings) ? bookings.filter((booking) => {
    // Convert search text to lowercase for case-insensitive search
    const searchTextLower = searchText.toLowerCase();
    
    // Format appointment date for search if it exists
    let formattedAppointmentDate = "";
    if (Array.isArray(booking.appointmentTime) && booking.appointmentTime.length === 3) {
      const [year, month, day] = booking.appointmentTime;
      formattedAppointmentDate = `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
    }
    
    // Format total cost for search if it exists
    let formattedCost = "";
    if (booking.totalCost != null) {
      formattedCost = booking.totalCost.toLocaleString("vi-VN", { maximumFractionDigits: 0 });
    }
    
    // Check if search text matches any field (all lowercase for case-insensitive comparison)
    const matchesSearch = searchTextLower === '' || // Empty search matches all
      booking.bookingId?.toString().toLowerCase().includes(searchTextLower) ||
      booking.serviceID?.toLowerCase().includes(searchTextLower) ||
      getServiceType(booking.serviceID).toLowerCase().includes(searchTextLower) ||
      (serviceMap[booking.serviceID] || "").toLowerCase().includes(searchTextLower) ||
      booking.status?.toLowerCase().includes(searchTextLower) ||
      (booking.paymentMethod || "").toLowerCase().includes(searchTextLower) ||
      formattedAppointmentDate.toLowerCase().includes(searchTextLower) ||
      (booking.timeRange || "").toLowerCase().includes(searchTextLower) ||
      formattedCost.toLowerCase().includes(searchTextLower) ||
      (booking.firstPerson?.fullname || "").toLowerCase().includes(searchTextLower) ||
      (booking.secondPerson?.fullname || "").toLowerCase().includes(searchTextLower);
    
    // Apply filters
    const serviceType = getServiceType(booking.serviceID);
    const matchesServiceType = serviceTypeFilter ? serviceType === serviceTypeFilter : true;
    const matchesStatus = statusFilter ? booking.status === statusFilter : true;
    const matchesPaymentMethod = paymentMethodFilter 
      ? booking.paymentMethod?.toLowerCase() === paymentMethodFilter.toLowerCase() 
      : true;
    
    return matchesSearch && matchesServiceType && matchesStatus && matchesPaymentMethod;
  }).sort((a, b) => b.bookingId - a.bookingId) : [];

  const uniqueServices = Array.isArray(bookings) ? [...new Set(bookings.map((b) => b.serviceID))] : [];
  
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0046ad 0%, #0057d9 50%, #1677ff 100%)',
        padding: '1.5rem',
        color: 'white'
      }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-white hover:text-blue-200 transition-colors mr-4"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
          </div>
          
          {/* Logo với link về trang chủ */}
          <div 
            onClick={() => navigate('/')} 
            className="cursor-pointer flex items-center"
            style={{ marginRight: '20px' }}
          >
            <img 
              src="/images/logo.png" 
              alt="DNA Testing Logo" 
              style={{ height: '40px' }}
              className="hover:opacity-90 transition-opacity"
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold">DNA Testing Booking</h1>
        <p className="text-blue-100">My Booking</p>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={6}>
              <Input
                placeholder="Search bookings..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                size="large"
              />
            </Col>
            <Col xs={12} md={4}>
              <Select
                placeholder="Service Type"
                value={serviceTypeFilter || undefined}
                onChange={(val) => setServiceTypeFilter(val)}
                allowClear
                style={{ width: "100%" }}
                size="large"
              >
                {serviceTypes.map((type) => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} md={4}>
              <Select
                placeholder="Payment Method"
                value={paymentMethodFilter || undefined}
                onChange={(val) => setPaymentMethodFilter(val)}
                allowClear
                style={{ width: "100%" }}
                size="large"
              >
                {paymentMethodList.map((method) => (
                  <Option key={method} value={method}>{method}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} md={4}>
              <Select
                placeholder="Filter by status"
                allowClear
                value={statusFilter || undefined}
                onChange={(value) => setStatusFilter(value)}
                style={{ width: "100%" }}
                size="large"
              >
                {statusList.map((status) => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchMyBookings}
                type="primary"
                loading={loading}
                size="large"
              >
                Refresh
              </Button>
            </Col>
          </Row>
        </Card>

        <Card>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <LoadingOutlined style={{ fontSize: 24 }} />
              <p>Loading your bookings...</p>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredBookings}
              rowKey="bookingId"
              loading={loading}
              bordered
              scroll={{ x: true }}
              locale={{ emptyText: <Empty description="No bookings found" /> }}
              pagination={pagination}
              onChange={handleTableChange}
            />
          )}
        </Card>

        <BookingDetailModal
          open={showModal}
          onClose={() => setShowModal(false)}
          bookingDetail={selectedBooking}
        />

        {/* Feedback Modal */}
        <FeedbackModal
          visible={showFeedbackModal}
          onClose={handleFeedbackModalClose}
          bookingId={selectedFeedbackBookingId}
        />

        {/* View Feedback Modal */}
        <ViewFeedbackModal
          visible={showViewFeedbackModal}
          onClose={handleViewFeedbackModalClose}
          bookingId={selectedFeedbackBookingId}
        />

        {/* DNA Result Modal */}
        <DnaResultModal
          visible={showDnaResultModal}
          onClose={() => setShowDnaResultModal(false)}
          resultData={dnaResultData}
        />
      </div>
    </div>
  );
};

export default MyBooking;
