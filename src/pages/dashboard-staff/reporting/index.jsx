import React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Tabs,
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
} from "antd";
import {
  SendOutlined,
  HistoryOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios"; // Import axios instance
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const { Title } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const StaffReporting = () => {
  const [loading, setLoading] = useState(true);
  const [workReports, setWorkReports] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("today");

  // Lấy ngày hôm nay (YYYY-MM-DD)
  const today = new Date().toISOString().slice(0, 10);

  // Lọc báo cáo trong ngày
  const todayReports = workReports.filter(
    (r) => (r.appointmentTime || "").slice(0, 10) === today
  );

  // Kiểm tra đã gửi chưa (giả sử có trường isSent hoặc tự xác định)
  const allSent = todayReports.every((r) => r.isSent);

  // Lọc báo cáo đã gửi
  const sentReports = workReports.filter((r) => r.isSent);

  // Pagination state for Sent Reports
  const [sentPagination, setSentPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // Lấy danh sách báo cáo
  const fetchWorkReports = async () => {
    setLoading(true);
    try {
      const response = await api.get("/staff/reports");
      setWorkReports(response.data?.data || response.data || []);
    } catch (error) {
      toast.error(
        "Failed to fetch work reports: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error fetching work reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkReports();
  }, []);

  // Cập nhật trạng thái/note từng báo cáo
  const handleSave = async (record) => {
    try {
      setLoading(true);
      await api.put(`/staff/reports/${record.id}`, {
        status: record.status,
        note: record.note,
      });
      toast.success("Update successfully!");
      fetchWorkReports();
    } catch (error) {
      toast.error(
        "Update failed: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
      setEditingKey("");
    }
  };

  // Gửi báo cáo trong ngày
  const handleSubmitReports = useCallback(async () => {
    try {
      setLoading(true);
      await api.post("/staff/reports/submit", { date: today });
      toast.success("Reports submitted successfully!");
      setIsSubmitted(true);
      fetchWorkReports();
    } catch (error) {
      toast.error(
        "Failed to submit reports: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  }, [today]);

  // Tự động gửi sau 18:30 nếu chưa gửi
  useEffect(() => {
    const now = new Date();
    if (!allSent && !isSubmitted) {
      const autoSend = () => handleSubmitReports();
      const eighteenThirty = new Date();
      eighteenThirty.setHours(18, 30, 0, 0);
      if (now > eighteenThirty) {
        autoSend();
      } else {
        const timeout = eighteenThirty - now;
        const timer = setTimeout(autoSend, timeout);
        return () => clearTimeout(timer);
      }
    }
  }, [allSent, isSubmitted, workReports, handleSubmitReports]);

  // Table columns với editable cell
  const EditableCell = ({ editing, dataIndex, children, ...restProps }) => {
    let inputNode;
    if (dataIndex === "status") {
      inputNode = (
        <Select style={{ minWidth: 100 }}>
          <Option value="Pending">Pending</Option>
          <Option value="Approved">Approved</Option>
          <Option value="Rejected">Rejected</Option>
          <Option value="Resolved">Resolved</Option>
        </Select>
      );
    } else if (dataIndex === "note") {
      inputNode = <Input />;
    } else {
      inputNode = <Input disabled />;
    }
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[{ required: false }]}>
            {" "}
            {inputNode}{" "}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const [form] = Form.useForm();
  const isEditing = (record) => record.id === editingKey;
  const edit = (record) => {
    form.setFieldsValue({ status: "", note: "", ...record });
    setEditingKey(record.id);
  };
  const cancel = () => setEditingKey("");

  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const newData = [...workReports];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        handleSave({ ...item, ...row });
      }
    } catch {
      // ignore
    }
  };

  const mergedColumns = [
    {
      title: "Report ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
    },
    {
      title: "Appointment Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (time) => time || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      editable: true,
      render: (text, record) =>
        record.isSent ? <Tag color="blue">Đã gửi</Tag> : text,
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      editable: true,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => {
        const editable = isEditing(record);
        return record.isSent ? null : editable ? (
          <span>
            <a onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              Save
            </a>
            <a onClick={cancel}>Cancel</a>
          </span>
        ) : (
          <a disabled={editingKey !== ""} onClick={() => edit(record)}>
            Edit
          </a>
        );
      },
    },
  ];

  const columns = mergedColumns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "status" ? "select" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleExportPDF = () => {
    try {
      if (!jsPDF || !jsPDF.prototype.autoTable) {
        toast.error(
          "jsPDF autoTable plugin is not available. Please check your dependencies."
        );
        return;
      }
      const doc = new jsPDF();
      const columns = workReportColumns.map((col) => col.title);
      const rows = workReports.map((row) => [
        row.id,
        row.bookingId || "-",
        row.appointmentTime || "-",
        row.status,
        row.note || "-",
      ]);
      doc.autoTable({ head: [columns], body: rows });
      doc.save("work_reports.pdf");
      toast.success("PDF exported successfully!");
    } catch (error) {
      toast.error("Failed to export PDF: " + error.message);
    }
  };

  const workReportColumns = [
    {
      title: "Report ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => (a.id || "").localeCompare(b.id || ""),
    },
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      render: (bookingId) => bookingId || "-",
    },
    {
      title: "Appointment Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (time) => time || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "Approved" || status === "Resolved") color = "green";
        if (status === "Pending") color = "orange";
        if (status === "Rejected") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (note) => note || "-",
    },
  ];

  // Tabs items array for new antd Tabs API
  const tabItems = [
    {
      key: "today",
      label: (
        <span>
          <HistoryOutlined style={{ marginRight: 8 }} />
          Today's Reports
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
              Today's Work Reports ({todayReports.length})
            </Title>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchWorkReports}
              loading={loading}
              style={{
                background: "#1677ff",
                color: "#fff",
                border: "none",
              }}>
              Refresh Reports
            </Button>
          </div>
          <Card>
            <Form form={form} component={false}>
              <Table
                loading={loading}
                components={{ body: { cell: EditableCell } }}
                columns={columns}
                dataSource={todayReports}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} reports`,
                }}
              />
            </Form>
          </Card>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 16,
            }}>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmitReports}
              disabled={allSent || isSubmitted}>
              Submit Reports for Today
            </Button>
          </div>
        </>
      ),
    },
    {
      key: "sent",
      label: (
        <span>
          <HistoryOutlined style={{ marginRight: 8 }} />
          Sent Reports
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
              Sent Reports ({sentReports.length})
            </Title>
            <Space>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExportPDF}
                style={{
                  background: "#1677ff",
                  color: "#fff",
                  border: "none",
                }}>
                Export PDF
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchWorkReports}
                loading={loading}>
                Refresh Reports
              </Button>
            </Space>
          </div>
          <Card>
            <Table
              loading={loading}
              columns={workReportColumns}
              dataSource={sentReports}
              rowKey="id"
              pagination={{
                ...sentPagination,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50, 100],
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} reports`,
              }}
              onChange={(paginationConfig) => {
                setSentPagination({
                  current: paginationConfig.current,
                  pageSize: paginationConfig.pageSize,
                });
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 24px" }}>
      <Title level={2} style={{ margin: 0, marginBottom: 24 }}>
        My Work & Reporting
      </Title>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        style={{ marginBottom: 24 }}
        tabBarStyle={{ marginBottom: 32 }}
        items={tabItems}
      />
      <ToastContainer />
    </div>
  );
};

export default StaffReporting;
