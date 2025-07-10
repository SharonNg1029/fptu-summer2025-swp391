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
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import BookingDetailModal from "./BookingDetailModal";

const { Title, Text } = Typography;
const { Option } = Select;

const MyBooking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [serviceFilter, setServiceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const statusList = [
  "Waiting confirmed",
  "Booking confirmed",
  "Awaiting Sample",
  "In Progress",
  "Ready",
  "Pending Payment",
  "Completed",
  "Cancel",
  ];

  const serviceMap = {
  SNL001: "Paternity DNA Test",
  SNL002: "Bloodline DNA Test",
  SNL003: "Maternity DNA Test",
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
    setSelectedBooking(record);
    setShowModal(true);
  };

  const handleDownloadResult = async (record) => {
  try {
    const res = await api.get(`/booking/export-pdf/${record.bookingId}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `KetQua_DNA_${record.bookingId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    //toast.error("Tải kết quả thất bại. Vui lòng thử lại!");
  }
};

  const handleNavigateToFeedback = (bookingId) => {
    navigate(`/feedback?bookingId=${bookingId}`);
  };

  const getStatusTag = (status) => {
    let color = "default";
    let icon = <ClockCircleOutlined />;
    if (status === "Waiting confirmed") color = "gold";
    else if (status === "Booking confirmed") {
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
    } else if (status === "Pending Payment") {
      color = "orange";
      icon = <ExclamationCircleOutlined />;
    } else if (status === "Completed") {
      color = "green";
      icon = <CheckCircleOutlined />;
    } else if (status === "Cancel") {
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
  { title: "Booking ID", dataIndex: "bookingId", key: "bookingId" },
  {
    title: "Service ID",
    dataIndex: "serviceID",
    key: "serviceID",
    render: (text) => text || "N/A",
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
        ? cost.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " VNĐ"
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
            Tải kết quả
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
    </Space>
  ),
},
];


  const filteredBookings = Array.isArray(bookings) ? bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingId?.toString().includes(searchText) ||
      booking.serviceID?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.status?.toLowerCase().includes(searchText.toLowerCase());
    const matchesService = serviceFilter ? booking.serviceID === serviceFilter : true;
    const matchesStatus = statusFilter ? booking.status === statusFilter : true;
    return matchesSearch && matchesService && matchesStatus;
  }) : [];

  const uniqueServices = Array.isArray(bookings) ? [...new Set(bookings.map((b) => b.serviceID))] : [];

  return (
    <div>
      <div className="bg-blue-600 text-white p-6">
        <h1 className="text-2xl font-bold">DNA Testing Booking</h1>
        <p className="text-blue-100">My Booking</p>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Search bookings..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="Filter by service"
              value={serviceFilter || undefined}
              onChange={(val) => setServiceFilter(val)}
              allowClear
              style={{ width: "100%" }}
              size="large"
            >
              {uniqueServices.map((s) => (
                <Option key={s} value={s}>{s}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} md={6}>
            <Select
            placeholder="Filter by status"
            allowClear
            onChange={(value) => setStatusFilter(value)}
            style={{ minWidth: 180 }}
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
            pagination={{ pageSize: 6 }}
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
  );
};

export default MyBooking;
