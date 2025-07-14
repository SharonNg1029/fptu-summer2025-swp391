import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Card, Tabs } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Table,
  Button,
  Space,
  Input,
  Typography,
  Tag,
  Modal,
  Form,
  Select,
  Row,
  Col,
  Descriptions,
  DatePicker,
} from "antd";
import {
  EditOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../../configs/axios"; // Import axios instance

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const OrderProcessing = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("in-progress");

  // Search and filter states for completed tab
  const [completedSearchText, setCompletedSearchText] = useState("");
  const [completedPageSize, setCompletedPageSize] = useState(10);
  const [completedCurrentPage, setCompletedCurrentPage] = useState(1);

  // Lấy staffID từ Redux store
  const currentUser = useSelector((state) => state.user?.currentUser);
  const staffID = currentUser?.staff?.staffID || currentUser?.staffID;

  const [form] = Form.useForm();

  const fetchOrders = useCallback(async () => {
    if (!staffID) {
      toast.error("Staff ID not found. Please log in again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/staff/my-assignment/${staffID}`);
      let rawData = [];
      if (Array.isArray(response.data)) {
        rawData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        rawData = response.data.data;
      }
      // Chuẩn hóa date từ array về moment object
      const normalized = rawData.map((order) => ({
        ...order,
        date:
          order.appointmentDate &&
          Array.isArray(order.appointmentDate) &&
          order.appointmentDate.length === 3
            ? moment({
                year: order.appointmentDate[0],
                month: order.appointmentDate[1] - 1,
                day: order.appointmentDate[2],
              })
            : Array.isArray(order.date) && order.date.length === 3
            ? moment({
                year: order.date[0],
                month: order.date[1] - 1,
                day: order.date[2],
              })
            : order.date
            ? moment(order.date)
            : null,
        timeRange: order.appointmentTime
          ? Array.isArray(order.appointmentTime) &&
            order.appointmentTime.length === 3
            ? `${order.appointmentTime[1]}-${order.appointmentTime[2]}` // fallback nếu là array, cần backend trả string
            : order.appointmentTime
          : order.timeRange || "",
      }));
      setOrders(normalized);
      // Reset phân trang về trang đầu tiên mỗi lần fetch
      setCurrentPage(1);
      setCompletedCurrentPage(1);
      if (rawData.length === 0) {
        toast.info("No assignments found for this staff member.");
      }
    } catch (error) {
      toast.error(
        "Failed to fetch assignments: " +
          (error.response?.data?.message || error.message)
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [staffID]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleEdit = (record) => {
    setEditingOrder(record);
    form.setFieldsValue({
      status: record.status,
    });
    setIsModalVisible(true);
  };

  const handleUpdateOrder = async (values) => {
    setLoading(true);
    try {
      const { date, timeRange, status } = values;
      // Convert timeRange to use dash (no spaces) as per Swagger
      let formattedTimeRange = timeRange
        ? timeRange.replace(/\s*-\s*/, "-")
        : undefined;
      // Build payload as per Swagger
      const payload = {
        status: status,
        appointmentTime: date ? date.format("YYYY-MM-DD") : undefined,
        timeRange: formattedTimeRange,
      };
      await api.patch(
        `/staff/updateBooking/${editingOrder.bookingID}`,
        payload
      );

      toast.success("Booking updated successfully!");
      setIsModalVisible(false);
      setEditingOrder(null);
      form.resetFields();
      await fetchOrders(); // Đảm bảo table luôn lấy dữ liệu mới nhất
    } catch (error) {
      toast.error(
        "Failed to update booking: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error updating booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = (isCompleted = false) => {
    try {
      const doc = new jsPDF();
      const title = isCompleted
        ? "Completed Assignments Report"
        : "In Progress Assignments Report";
      const dataToExport = isCompleted
        ? completedFilteredOrders
        : inProgressFilteredOrders;

      doc.setFontSize(18);
      doc.text(title, 14, 22);

      doc.setFontSize(12);
      doc.text(`Generated on: ${moment().format("DD/MM/YYYY HH:mm")}`, 14, 32);

      const tableColumns = [
        "Booking ID",
        "Customer Name",
        "Service",
        "Kit",
        "Status",
        "Appointment Date",
        "Appointment Time",
      ];

      const tableRows = dataToExport.map((order) => [
        order.bookingID || "N/A",
        order.customerName || "N/A",
        order.service || "N/A",
        order.kitID === "K001"
          ? "PowerPlex Fusion"
          : order.kitID === "K002"
          ? "Global Filer"
          : order.kitID || "N/A",
        order.status || "N/A",
        order.date ? moment(order.date).format("DD/MM/YYYY") : "Not scheduled",
        order.timeRange || "Not scheduled",
      ]);

      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
          fontSize: 9,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 40, left: 14, right: 14 },
      });

      const fileName = `${
        isCompleted ? "completed" : "in-progress"
      }-assignments-${moment().format("YYYY-MM-DD-HHmm")}.pdf`;
      doc.save(fileName);

      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF: " + error.message);
    }
  };

  // Filter orders for in-progress tab (exclude "Completed" status)
  const inProgressFilteredOrders = orders
    .filter((order) => {
      // Exclude completed orders
      if (order.status === "Completed") return false;

      const matchesSearch =
        (order.bookingID
          ? order.bookingID.toString().toLowerCase()
          : ""
        ).includes(searchText.toLowerCase()) ||
        (order.customerName ? order.customerName.toLowerCase() : "").includes(
          searchText.toLowerCase()
        ) ||
        (order.service ? order.service.toLowerCase() : "").includes(
          searchText.toLowerCase()
        ) ||
        (order.kitID ? order.kitID.toLowerCase() : "").includes(
          searchText.toLowerCase()
        );

      const matchesStatus = !statusFilter || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = a.date ? moment(a.date) : moment(0);
      const dateB = b.date ? moment(b.date) : moment(0);
      if (dateA.isSame(dateB, "day")) {
        const getStartHour = (timeRange) => {
          if (!timeRange) return 0;
          const match = timeRange.match(/(\d{1,2}):(\d{2})/);
          if (match)
            return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
          return 0;
        };
        return getStartHour(b.timeRange) - getStartHour(a.timeRange);
      }
      return dateB.diff(dateA);
    });

  // Filter orders for completed tab (only "Completed" status)
  const completedFilteredOrders = orders
    .filter((order) => {
      // Only show completed orders
      if (order.status !== "Completed") return false;

      const matchesSearch =
        (order.bookingID
          ? order.bookingID.toString().toLowerCase()
          : ""
        ).includes(completedSearchText.toLowerCase()) ||
        (order.customerName ? order.customerName.toLowerCase() : "").includes(
          completedSearchText.toLowerCase()
        ) ||
        (order.service ? order.service.toLowerCase() : "").includes(
          completedSearchText.toLowerCase()
        ) ||
        (order.kitID ? order.kitID.toLowerCase() : "").includes(
          completedSearchText.toLowerCase()
        );

      return matchesSearch;
    })
    .sort((a, b) => {
      const dateA = a.date ? moment(a.date) : moment(0);
      const dateB = b.date ? moment(b.date) : moment(0);
      if (dateA.isSame(dateB, "day")) {
        const getStartHour = (timeRange) => {
          if (!timeRange) return 0;
          const match = timeRange.match(/(\d{1,2}):(\d{2})/);
          if (match)
            return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
          return 0;
        };
        return getStartHour(b.timeRange) - getStartHour(a.timeRange);
      }
      return dateB.diff(dateA);
    });

  const getStatusTag = (status) => {
    let color = "default";
    let icon = <ClockCircleOutlined />;

    switch (status) {
      case "Awaiting Confirmation":
        color = "orange";
        icon = <ClockCircleOutlined />;
        break;
      case "Payment Confirmed":
        color = "blue";
        icon = <CheckCircleOutlined />;
        break;
      case "Booking Confirmed":
        color = "green";
        icon = <CheckCircleOutlined />;
        break;
      case "Awaiting Sample":
        color = "purple";
        icon = <LoadingOutlined />;
        break;
      case "In Progress":
        color = "cyan";
        icon = <LoadingOutlined />;
        break;
      case "Completed":
        color = "green";
        icon = <CheckCircleOutlined />;
        break;
      case "Cancelled":
        color = "red";
        icon = <ExclamationCircleOutlined />;
        break;
      default:
        color = "default";
        icon = <ClockCircleOutlined />;
    }

    return (
      <Tag icon={icon} color={color}>
        {status || "Unknown"}
      </Tag>
    );
  };

  // Columns for in-progress tab (with edit functionality)
  const inProgressColumns = [
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      key: "bookingID",
      width: 110,
      sorter: (a, b) => (a.bookingID || "").localeCompare(b.bookingID || ""),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) =>
        (a.customerName || "").localeCompare(b.customerName || ""),
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Kit",
      dataIndex: "kitID",
      key: "kitID",
      render: (kitID) => {
        if (kitID === "K001") return "PowerPlex Fusion";
        if (kitID === "K002") return "Global Filer";
        return kitID || "N/A";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 200,
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Awaiting Confirmation", value: "Awaiting Confirmation" },
        { text: "Payment Confirmed", value: "Payment Confirmed" },
        { text: "Booking Confirmed", value: "Booking Confirmed" },
        { text: "Awaiting Sample", value: "Awaiting Sample" },
        { text: "In Progress", value: "In Progress" },
        { text: "Cancelled", value: "Cancelled" },
      ],
      onFilter: (value, record) => record.status && record.status === value,
    },
    {
      title: "Appointment Date",
      dataIndex: "date",
      key: "date",
      render: (date) => {
        if (!date) return "Not scheduled";
        return moment(date).format("DD/MM/YYYY");
      },
      sorter: (a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return moment(a.date).unix() - moment(b.date).unix();
      },
    },
    {
      title: "Appointment Time",
      dataIndex: "timeRange",
      key: "timeRange",
      render: (timeRange) => {
        return timeRange || "Not scheduled";
      },
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      align: "center",
      responsive: ["md"],
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  // Columns for completed tab (view only, no actions)
  const completedColumns = [
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      key: "bookingID",
      width: 110,
      sorter: (a, b) => (a.bookingID || "").localeCompare(b.bookingID || ""),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) =>
        (a.customerName || "").localeCompare(b.customerName || ""),
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Kit",
      dataIndex: "kitID",
      key: "kitID",
      render: (kitID) => {
        if (kitID === "K001") return "PowerPlex Fusion";
        if (kitID === "K002") return "Global Filer";
        return kitID || "N/A";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Appointment Date",
      dataIndex: "date",
      key: "date",
      render: (date) => {
        if (!date) return "Not scheduled";
        return moment(date).format("DD/MM/YYYY");
      },
      sorter: (a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return moment(a.date).unix() - moment(b.date).unix();
      },
    },
    {
      title: "Appointment Time",
      dataIndex: "timeRange",
      key: "timeRange",
      render: (timeRange) => {
        return timeRange || "Not scheduled";
      },
    },
  ];

  return (
    <div style={{ padding: "0 24px" }}>
      <Title level={2} style={{ margin: 0, marginBottom: 24 }}>
        Manage Assigned Progress
      </Title>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        style={{ marginBottom: 24 }}
        tabBarStyle={{ marginBottom: 32 }}
        items={[
          {
            key: "in-progress",
            label: (
              <span>
                <PlayCircleOutlined style={{ marginRight: 8 }} />
                In Progress
              </span>
            ),
            children: (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                    flexWrap: "wrap",
                    gap: 16,
                  }}>
                  <Title level={3} style={{ margin: 0 }}>
                    Active Assignments ({inProgressFilteredOrders.length})
                  </Title>
                  <Space>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => handleExportPDF(false)}
                      type="default">
                      Export PDF
                    </Button>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={fetchOrders}
                      loading={loading}
                      type="primary">
                      Refresh
                    </Button>
                  </Space>
                </div>

                <Card style={{ marginBottom: 16 }}>
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} lg={10}>
                      <Input
                        placeholder="Search by Booking ID, Customer, Service, Kit..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                      />
                    </Col>
                    <Col xs={24} sm={6} lg={7}>
                      <Select
                        placeholder="Filter by status"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: "100%" }}
                        allowClear
                        showSearch
                        optionFilterProp="children">
                        <Option value="">All Statuses</Option>
                        <Option value="Awaiting Confirmation">
                          Awaiting Confirmation
                        </Option>
                        <Option value="Payment Confirmed">
                          Payment Confirmed
                        </Option>
                        <Option value="Booking Confirmed">
                          Booking Confirmed
                        </Option>
                        <Option value="Awaiting Sample">Awaiting Sample</Option>
                        <Option value="In Progress">In Progress</Option>
                        <Option value="Cancelled">Cancelled</Option>
                      </Select>
                    </Col>
                  </Row>
                </Card>

                <Table
                  loading={loading}
                  columns={inProgressColumns}
                  dataSource={inProgressFilteredOrders}
                  rowKey="bookingID"
                  pagination={{
                    pageSize: pageSize,
                    current: currentPage,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} assignments`,
                    pageSizeOptions: ["5", "10", "20", "50", "100"],
                    showLessItems: false,
                    onShowSizeChange: (current, size) => {
                      setPageSize(size);
                      setCurrentPage(1);
                    },
                    onChange: (page, size) => {
                      setCurrentPage(page);
                      if (size !== pageSize) setPageSize(size);
                    },
                  }}
                  scroll={{ x: 1000 }}
                />
              </>
            ),
          },
          {
            key: "completed",
            label: (
              <span>
                <CheckCircleOutlined style={{ marginRight: 8 }} />
                Completed
              </span>
            ),
            children: (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                    flexWrap: "wrap",
                    gap: 16,
                  }}>
                  <Title level={3} style={{ margin: 0 }}>
                    Completed Assignments ({completedFilteredOrders.length})
                  </Title>
                  <Space>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => handleExportPDF(true)}
                      type="default">
                      Export PDF
                    </Button>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={fetchOrders}
                      loading={loading}
                      type="primary">
                      Refresh
                    </Button>
                  </Space>
                </div>

                <Card style={{ marginBottom: 16 }}>
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} lg={10}>
                      <Input
                        placeholder="Search by Booking ID, Customer, Service, Kit..."
                        prefix={<SearchOutlined />}
                        value={completedSearchText}
                        onChange={(e) => setCompletedSearchText(e.target.value)}
                        allowClear
                      />
                    </Col>
                  </Row>
                </Card>

                <Table
                  loading={loading}
                  columns={completedColumns}
                  dataSource={completedFilteredOrders}
                  rowKey="bookingID"
                  pagination={{
                    pageSize: completedPageSize,
                    current: completedCurrentPage,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} completed assignments`,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    showLessItems: false,
                    onShowSizeChange: (current, size) => {
                      setCompletedPageSize(size);
                      setCompletedCurrentPage(1);
                    },
                    onChange: (page, size) => {
                      setCompletedCurrentPage(page);
                      if (size !== completedPageSize)
                        setCompletedPageSize(size);
                    },
                  }}
                  scroll={{ x: 1000 }}
                />
              </>
            ),
          },
        ]}
      />
      <Modal
        title="Edit Assignment"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingOrder(null);
          form.resetFields();
        }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleUpdateOrder(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        confirmLoading={loading}
        okText="Update"
        cancelText="Cancel"
        destroyOnClose>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: editingOrder?.status,
          }}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status!" }]}>
            <Select placeholder="Select status">
              <Option value="Awaiting Confirmation">
                Awaiting Confirmation
              </Option>
              <Option value="Payment Confirmed">Payment Confirmed</Option>
              <Option value="Booking Confirmed">Booking Confirmed</Option>
              <Option value="Awaiting Sample">Awaiting Sample</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Appointment Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="timeRange" label="Appointment Time">
            <Select placeholder="Select time range">
              <Option value="8:15 - 9:15">8:15 - 9:15</Option>
              <Option value="9:30 - 10:30">9:30 - 10:30</Option>
              <Option value="10:45 - 11:45">10:45 - 11:45</Option>
              <Option value="13:15 - 14:15">13:15 - 14:15</Option>
              <Option value="14:30 - 15:30">14:30 - 15:30</Option>
              <Option value="15:45 - 16:45">15:45 - 16:45</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default OrderProcessing;
