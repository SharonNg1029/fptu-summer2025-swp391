import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Typography,
  Form,
  Select,
  DatePicker,
  Card,
  Tag,
  Modal,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios"; // Giả định bạn dùng chung file config axios
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ViewReports = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [staffList] = useState([]); // State để lưu danh sách nhân viên
  const [filterForm] = Form.useForm();

  // Các tùy chọn trạng thái cho manager
  const reportStatusOptions = ["Completed", "Delay", "Cancel"];

  // Hàm gọi API để lấy tất cả báo cáo của nhân viên
  const fetchAllReports = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      // API endpoint của Manager để xem tất cả report, có thể kèm theo query params để filter
      const response = await api.get("/manager/all-reports", {
        params: filters,
      });
      setReports(response.data?.data || response.data || []);
    } catch (error) {
      toast.error(
        "Failed to fetch reports: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  // Xử lý khi form filter được submit
  const handleFilterSubmit = (values) => {
    const filters = {
      ...values,
      // Format lại date range nếu cần
      startDate: values.dateRange
        ? values.dateRange[0].format("YYYY-MM-DD")
        : undefined,
      endDate: values.dateRange
        ? values.dateRange[1].format("YYYY-MM-DD")
        : undefined,
    };
    delete filters.dateRange; // Xóa key không cần thiết
    fetchAllReports(filters);
  };

  // Xử lý reset filter
  const handleFilterReset = () => {
    filterForm.resetFields();
    fetchAllReports();
  };

  // Xử lý xuất file PDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const tableColumns = [
        "Report ID",
        "Staff Name",
        "Appointment Time",
        "Status",
        "Note",
      ];
      const tableRows = reports.map((row) => [
        row.id,
        row.staffName || "N/A", // Giả sử data có trường staffName
        row.appointmentTime || "-",
        row.status,
        row.note || "-",
      ]);
      doc.autoTable({ head: [tableColumns], body: tableRows });
      doc.save("staff_reports.pdf");
      toast.success("PDF exported successfully!");
    } catch (error) {
      toast.error("Failed to export PDF: " + error.message);
    }
  };

  const managerReportColumns = [
    {
      title: "Report ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Staff Name",
      dataIndex: "staffName", // Giả định API trả về có 'staffName'
      key: "staffName",
      sorter: (a, b) => (a.staffName || "").localeCompare(b.staffName || ""),
    },
    {
      title: "Appointment Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "Completed") color = "green";
        if (status === "Delay") color = "orange";
        if (status === "Cancel") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
  ];

  return (
    <div style={{ padding: "0 24px" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Staff Work Reports
      </Title>

      <Card style={{ marginBottom: 24 }}>
        <Form form={filterForm} layout="vertical" onFinish={handleFilterSubmit}>
          <Space wrap align="end" style={{ width: "100%" }}>
            <Form.Item
              label="Filter by Staff"
              name="staffId"
              style={{ minWidth: 200 }}>
              <Select placeholder="Select a staff member">
                {staffList.map((staff) => (
                  <Option key={staff.id} value={staff.id}>
                    {staff.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Filter by Date" name="dateRange">
              <RangePicker />
            </Form.Item>
            <Form.Item
              label="Filter by Status"
              name="status"
              style={{ minWidth: 150 }}>
              <Select placeholder="Select a status">
                {reportStatusOptions.map((status) => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}>
                  Search
                </Button>
                <Button onClick={handleFilterReset}>Reset</Button>
              </Space>
            </Form.Item>
          </Space>
        </Form>
      </Card>

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 16,
          }}>
          <Space>
            <Button icon={<DownloadOutlined />} onClick={handleExportPDF}>
              Export PDF
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchAllReports()}
              loading={loading}
              style={{
                backgroundColor: "#1677ff",
                color: "white",
                border: "none",
              }}>
              Refresh
            </Button>
          </Space>
        </div>
        <Table
          loading={loading}
          columns={managerReportColumns}
          dataSource={reports}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      <ToastContainer />
    </div>
  );
};

export default ViewReports;
