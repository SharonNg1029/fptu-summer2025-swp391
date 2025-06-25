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
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title } = Typography;
const { Option } = Select;

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
      let color = "default";
      let icon = <ClockCircleOutlined />;
      if (status === "Waiting confirmed") {
        color = "gold";
        icon = <ClockCircleOutlined />;
      }
      if (status === "Booking confirmed") {
        color = "blue";
        icon = <CheckCircleOutlined />;
      }
      if (status === "Awaiting Sample") {
        color = "purple";
        icon = <LoadingOutlined />;
      }
      if (status === "In Progress") {
        color = "cyan";
        icon = <LoadingOutlined />;
      }
      if (status === "Ready") {
        color = "lime";
        icon = <CheckCircleOutlined />;
      }
      if (status === "Pending Payment") {
        color = "orange";
        icon = <ExclamationCircleOutlined />;
      }
      if (status === "Completed") {
        color = "green";
        icon = <CheckCircleOutlined />;
      }
      if (status === "Cancel") {
        color = "red";
        icon = <ExclamationCircleOutlined />;
      }
      return (
        <Tag icon={icon} color={color}>
          {status}
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
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Định nghĩa hàm fetchBookings để có thể gọi lại khi bấm Refresh
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

  // Filtered bookings
  const filteredBookings = bookings.filter((booking) => {
    // Only allow filter and display for the specified statuses
    if (!statusList.includes(booking.status)) return false;
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
    // Case-insensitive status filter
    const matchesStatus =
      !statusFilter ||
      (statusEn && statusEn.toLowerCase() === statusFilter.toLowerCase());
    const matchesType = !typeFilter || booking.bookingType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      if (typeof autoTable !== "function") {
        toast.error(
          "Export PDF failed: autoTable is not a function. Please check your import or install jspdf-autotable."
        );
        return;
      }
      // Lấy dữ liệu từ filteredBookings
      const tableColumn = [
        "Kit ID",
        "Booking ID",
        "Customer ID",
        "Service ID",
        "Booking Type",
        "Payment Method",
        "Sample Method",
        "Request Date",
        "Status",
        "Mediation Method",
        "Cost (VNĐ)",
        "Additional Cost (VNĐ)",
        "Note",
      ];
      const tableRows = filteredBookings.map((b) => [
        b.kitID,
        b.bookingID,
        b.customerID,
        b.serviceID,
        b.bookingType,
        b.paymentMethod,
        b.sampleMethod,
        b.request_date ? new Date(b.request_date).toLocaleDateString() : "N/A",
        b.status,
        b.mediationMethod,
        b.cost != null
          ? b.cost.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) +
            " VNĐ"
          : "",
        b.additionalCost != null
          ? b.additionalCost.toLocaleString("vi-VN", {
              maximumFractionDigits: 0,
            }) + " VNĐ"
          : "",
        b.note,
      ]);
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        styles: { font: "helvetica", fontSize: 9 },
        headStyles: { fillColor: [22, 160, 133] },
        margin: { top: 20 },
      });
      doc.save("booking-list.pdf");
      toast.success("PDF exported successfully!");
    } catch (err) {
      toast.error("PDF export failed: " + (err?.message || err));
      console.error("Export PDF error:", err);
    }
  };

  return (
    <div>
      <Title level={3}>Tracking Booking</Title>
      <Card style={{ marginBottom: 16 }}>
        <Row
          gutter={[16, 16]}
          align="middle"
          justify="start"
          style={{ flexWrap: "wrap" }}>
          <Col
            xs={24}
            sm={8}
            lg={6}
            style={{ minWidth: 220, paddingRight: 8, marginBottom: 8 }}>
            <Input
              placeholder="Search by Booking ID, Customer ID, Service ID, Kit ID, Type, ..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col
            xs={24}
            sm={6}
            lg={5}
            style={{ minWidth: 180, paddingRight: 8, marginBottom: 8 }}>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              allowClear
              size="large">
              {statusList.map((status) => (
                <Option value={status} key={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Col>
          <Col
            xs={24}
            sm={6}
            lg={5}
            style={{ minWidth: 180, paddingRight: 8, marginBottom: 8 }}>
            <Select
              placeholder="Filter by booking type"
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: "100%" }}
              allowClear
              size="large">
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
          <Col
            xs={24}
            sm={12}
            lg={8}
            style={{
              minWidth: 260,
              marginBottom: 8,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}>
            <Space size={12} style={{ width: "auto" }}>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExportPDF}
                type="default"
                style={{ borderRadius: 6, minWidth: 120 }}
                size="large">
                Export PDF
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchBookings}
                type="primary"
                style={{ borderRadius: 6, minWidth: 120 }}
                size="large"
                loading={loading}>
                Refresh
              </Button>
            </Space>
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
            pageSize: pageSize,
            current: currentPage,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50", "100"],
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} bookings`,
            showLessItems: true,
            onShowSizeChange: (current, size) => {
              setPageSize(size);
              setCurrentPage(1);
            },
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size !== pageSize) setPageSize(size);
            },
          }}
        />
      </Card>
    </div>
  );
};

export default Booking;
