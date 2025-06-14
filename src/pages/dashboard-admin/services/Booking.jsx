import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Card,
  Space,
  Button,
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

const { Title } = Typography;
const { Option } = Select;

const columns = [
  { title: "Kit ID", dataIndex: "kitID", key: "kitID" },
  { title: "Booking ID", dataIndex: "bookingID", key: "bookingID" },
  { title: "Customer ID", dataIndex: "customerID", key: "customerID" },
  { title: "Service ID", dataIndex: "serviceID", key: "serviceID" },
  { title: "Booking Type", dataIndex: "bookingType", key: "bookingType" },
  { title: "Payment Method", dataIndex: "paymentMethod", key: "paymentMethod" },
  { title: "Sample Method", dataIndex: "sampleMethod", key: "sampleMethod" },
  {
    title: "Request Date",
    dataIndex: "request_date",
    key: "request_date",
    render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      let color = "blue";
      let display = status;
      switch (status) {
        case "Pending Payment":
          color = "orange";
          display = "Pending Payment";
          break;

        case "Paid":
          color = "gold";
          display = "Paid";
          break;

        case "Awaiting Sample":
          color = "purple";
          display = "Awaiting Sample";
          break;

        case "In Progress":
          color = "cyan";
          display = "In Progress";
          break;

        case "Completed":
          color = "green";
          display = "Completed";
          break;
        default:
          color = "blue";
          display = status;
      }
      return (
        <Tag
          color={color}
          style={{ border: `1px solid ${color}`, background: "#fff", color }}>
          {display}
        </Tag>
      );
    },
  },
  {
    title: "Mediation Method",
    dataIndex: "mediationMethod",
    key: "mediationMethod",
  },
  {
    title: "Cost (VNĐ)",
    dataIndex: "cost",
    key: "cost",
    render: (cost) =>
      cost != null
        ? cost.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " VNĐ"
        : "",
  },
  {
    title: "Additional Cost (VNĐ)",
    dataIndex: "additionalCost",
    key: "additionalCost",
    render: (cost) =>
      cost != null
        ? cost.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " VNĐ"
        : "",
  },
  { title: "Note", dataIndex: "note", key: "note" },
];

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await api.get("/booking/bookings");
        setBookings(res.data?.data || res.data || []);
      } catch {
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Filtered bookings
  const filteredBookings = bookings.filter((booking) => {
    // Map status from Vietnamese to English for filtering
    let statusEn = booking.status;
    switch (booking.status) {
      case "Chờ thanh toán":
        statusEn = "Pending Payment";
        break;
      case "Đã thanh toán":
        statusEn = "Paid";
        break;
      case "Đang chờ mẫu":
        statusEn = "Awaiting Sample";
        break;
      case "Đang xét nghiệm":
        statusEn = "In Progress";
        break;
      case "Hoàn tất":
        statusEn = "Completed";
        break;
      default:
        statusEn = booking.status;
    }
    const matchesSearch =
      booking.bookingID?.toString().includes(searchText) ||
      booking.customerID?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.serviceID?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.kitID?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.bookingType?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.paymentMethod?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.sampleMethod?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.note?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || statusEn === statusFilter;
    const matchesType = !typeFilter || booking.bookingType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div>
      <Title level={3}>Tracking Booking</Title>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={8}>
            <Input
              placeholder="Search by Booking ID, Customer ID, Service ID, Kit ID, Type, ..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={6} lg={8}>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              allowClear>
              <Option value="Pending Payment">Pending Payment</Option>
              <Option value="Paid">Paid</Option>
              <Option value="Awaiting Sample">Awaiting Sample</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6} lg={8}>
            <Select
              placeholder="Filter by booking type"
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: "100%" }}
              allowClear>
              {/* Lấy danh sách loại bookingType duy nhất */}
              {[...new Set(bookings.map((b) => b.bookingType))]
                .filter(Boolean)
                .map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
            </Select>
          </Col>
        </Row>
      </Card>
      <Card>
        <Table
          columns={columns}
          dataSource={filteredBookings}
          rowKey="bookingID"
          loading={loading}
          bordered
          scroll={{ x: true }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} bookings`,
          }}
        />
      </Card>
    </div>
  );
};

export default Booking;
