import React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Table,
  Card,
  Row,
  Col,
  Tag,
  Space,
  Input,
  Select,
  Button,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title } = Typography;
const { Option } = Select;

// Helper to format date from array or string
// Format array [YYYY,MM,DD] to dd/MM/yyyy
const formatDateArray = (arr) => {
  if (!Array.isArray(arr) || arr.length < 3) return "-";
  const [year, month, day] = arr;
  return `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${year}`;
};

// Format time range string (e.g. "13:15-14:15") or array [h,m] to HH:mm
const formatTime = (val) => {
  if (!val) return "-";
  if (typeof val === "string") {
    // If string is a time range (e.g. "13:15-14:15"), show as is
    if (/^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/.test(val)) return val;
    // If string is a single time (e.g. "13:15"), show as is
    if (/^\d{1,2}:\d{2}$/.test(val)) return val;
    return val;
  }
  if (Array.isArray(val) && val.length >= 2) {
    const [hour, minute] = val;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  }
  return "-";
};

// Fallback for lastUpdate (array or string)
const formatDateTime = (date) => {
  if (!date) return "N/A";
  if (Array.isArray(date) && date.length >= 3) {
    const [year, month, day, hour = 0, minute = 0] = date;
    const dateObj = new Date(year, month - 1, day, hour, minute);
    return dateObj.toLocaleString();
  }
  // Fallback for string dates
  return new Date(date).toLocaleString();
};

const TestingProcessMonitoringPage = () => {
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/manager/booking-assigned");
      // Chuẩn hóa dữ liệu theo mẫu API mới
      let data = response.data;
      // Nếu response có dạng { data: [...] } thì lấy data.data
      if (data && Array.isArray(data.data)) {
        data = data.data;
      } else if (!Array.isArray(data)) {
        // Nếu không phải mảng, trả về mảng rỗng
        data = [];
      }
      setTests(
        data.map((item) => ({
          assignedID: item.assignedID,
          bookingID: item.bookingID,
          customerName: item.customerName,
          staffName: item.staffName,
          lastUpdate: item.lastUpdate,
          serviceType: item.serviceType,
          status: item.status,
          // appointmentTime là string, không cần fallback
          appointmentTime: item.appointmentTime || null,
          // appointmentDate là array, nếu không có thì null
          appointmentDate: item.appointmentDate || null,
        }))
      );
    } catch (error) {
      toast.error(
        "Failed to fetch testing process data: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error fetching testing process data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const filteredTests = tests
    .filter((test) => {
      // Defensive: always check for undefined/null before calling toLowerCase
      const search = (searchText || "").toLowerCase();
      const assignedID = test.assignedID
        ? test.assignedID.toString().toLowerCase()
        : "";
      const customerName = test.customerName
        ? test.customerName.toLowerCase()
        : "";
      const serviceType = test.serviceType
        ? test.serviceType.toLowerCase()
        : "";
      const staffName = test.staffName ? test.staffName.toLowerCase() : "";

      const matchesSearch =
        assignedID.includes(search) ||
        customerName.includes(search) ||
        serviceType.includes(search) ||
        staffName.includes(search);

      // Defensive: check status and statusFilter before toLowerCase
      const matchesStatus =
        !statusFilter ||
        (test.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    // Sắp xếp theo lastUpdate mới nhất đến cũ nhất
    .sort((a, b) => {
      // lastUpdate có thể là array [y,m,d,h,m] hoặc string
      const getDate = (val) => {
        if (Array.isArray(val) && val.length >= 3) {
          // [year, month, day, hour, minute]
          return new Date(val[0], val[1] - 1, val[2], val[3] || 0, val[4] || 0);
        }
        if (val) return new Date(val);
        return new Date(0);
      };
      return getDate(b.lastUpdate) - getDate(a.lastUpdate);
    });

  const columns = [
    {
      title: "Test ID",
      dataIndex: "assignedID",
      key: "assignedID",
      sorter: (a, b) => (a.assignedID || "").localeCompare(b.assignedID || ""),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) =>
        (a.customerName || "").localeCompare(b.customerName || ""),
    },
    {
      title: "Assigned Staff",
      dataIndex: "staffName",
      key: "staffName",
    },
    {
      title: "Service",
      dataIndex: "serviceType",
      key: "serviceType",
    },
    {
      title: "Appointment Date",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date) => formatDateArray(date),
    },
    {
      title: "Appointment Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (appointmentTime) => formatTime(appointmentTime),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let icon = <ClockCircleOutlined />;
        if (status === "Awaiting confirm") {
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
        if (status === "Pending payment") {
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
      filters: [
        { text: "Awaiting confirm", value: "Awaiting confirm" },
        { text: "Booking confirmed", value: "Booking confirmed" },
        { text: "Awaiting Sample", value: "Awaiting Sample" },
        { text: "In Progress", value: "In Progress" },
        { text: "Ready", value: "Ready" },
        { text: "Pending payment", value: "Pending payment" },
        { text: "Completed", value: "Completed" },
        { text: "Cancel", value: "Cancel" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Last Update Status",
      dataIndex: "lastUpdate",
      key: "lastUpdate",
      render: (lastUpdate) => formatDateTime(lastUpdate),
      sorter: (a, b) => {
        const getDate = (val) => {
          if (Array.isArray(val) && val.length >= 3) {
            return new Date(
              val[0],
              val[1] - 1,
              val[2],
              val[3] || 0,
              val[4] || 0
            );
          }
          if (val) return new Date(val);
          return new Date(0);
        };
        return getDate(a.lastUpdate) - getDate(b.lastUpdate);
      },
    },
  ];

  const handleExportPDF = () => {
    try {
      if (typeof autoTable !== "function") {
        toast.error("Export failed: jsPDF autoTable plugin is not available.");
        return;
      }
      const doc = new jsPDF();
      const tableColumn = [
        "Test ID",
        "Customer Name",
        "Assigned Staff",
        "Appointment Time",
        "Service Type",
        "Status",
        "Last Update Status",
      ];
      const tableRows = filteredTests.map((test) => [
        test.assignedID,
        test.customerName,
        test.staffName,
        formatTime(test.appointmentTime),
        test.serviceType,
        test.status,
        formatDateTime(test.lastUpdate),
      ]);
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        styles: { font: "helvetica", fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] },
        margin: { top: 20 },
      });
      doc.save("testing-process-monitoring.pdf");
      toast.success("Exported PDF successfully!");
    } catch (error) {
      toast.error("Failed to export PDF: " + error.message);
    }
  };

  // State for page size
  const [pageSize, setPageSize] = useState(10);

  return (
    <div style={{ padding: "0 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}>
        <Title level={2} style={{ margin: 0 }}>
          Testing Process Monitoring
        </Title>
        <ToastContainer />
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportPDF}
            type="default">
            Export PDF
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchTests}
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
              placeholder="Search by Test ID, Customer, Staff..."
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
              onChange={(value) => setStatusFilter(value)}
              style={{ width: "100%" }}
              allowClear={true}>
              <Option value="">All Statuses</Option>
              <Option value="Awaiting confirm">Awaiting confirm</Option>
              <Option value="Booking confirmed">Booking confirmed</Option>
              <Option value="Awaiting Sample">Awaiting Sample</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Ready">Ready</Option>
              <Option value="Pending payment">Pending payment</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Cancel">Cancel</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredTests}
          rowKey="assignedID"
          pagination={{
            pageSize: pageSize,
            pageSizeOptions: [5, 10, 20, 50, 100],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} tests`,
            onShowSizeChange: (current, size) => setPageSize(size),
            onChange: (page, size) => {
              if (size !== pageSize) setPageSize(size);
            },
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default TestingProcessMonitoringPage;
