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
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import BookingDetailModal from "./BookingDetailModal";
import { FaArrowLeft } from "react-icons/fa";

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

  const handleNavigateToFeedback = (bookingId) => {
    navigate(`/feedback?bookingId=${bookingId}`);
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
  render: (_, record) => (
    <Space>
      <Button
        icon={<EyeOutlined />}
        onClick={() => handleViewDetail(record)}
      >
        View
      </Button>
      
      {record.status === "Completed" && (
        <>
          <Button
            icon={<DownloadOutlined />}
            type="primary"
            onClick={() => handleDownloadResult(record)}
          >
            Download Result
          </Button>
          
          <Button
            icon={<CommentOutlined />}
            type="default"
            style={{ backgroundColor: '#13c2c2', color: 'white' }}
            onClick={() => handleNavigateToFeedback(record.bookingId)}
          >
            Feedback
          </Button>
        </>
      )}
      
      {!nonCancelableStatuses.includes(record.status) && (
        <Button
          icon={<StopOutlined />}
          type="primary"
          danger
          onClick={() => handleCancelBooking(record)}
        >
          Cancel
        </Button>
      )}
    </Space>
  ),
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
        >
          {/* 👇 Paste nội dung các Card chi tiết tại đây 👇 */}
          {/* <Card>Thông tin dịch vụ...</Card>
              <Card>Thông tin người xét nghiệm...</Card>
              <Card>Chi phí chi tiết...</Card>
              <Card>Phương thức thanh toán...</Card> 
          */}
        </BookingDetailModal>
      </div>
    </div>
  );
};

export default MyBooking;
