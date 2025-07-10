import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
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
  Modal,
} from "antd";
import {
  SendOutlined,
  HistoryOutlined,
  ReloadOutlined,
  DownloadOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
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
  // Modal state for editing report (must be inside component)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workReports, setWorkReports] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [activeTab, setActiveTab] = useState("today");

  // Helper: get date string (YYYY-MM-DD) from appointmentDate or appointmentTime
  const getReportDate = (report) => {
    if (report.appointmentDate) {
      if (typeof report.appointmentDate === "string") {
        return report.appointmentDate.slice(0, 10);
      }
      if (report.appointmentDate instanceof Date) {
        return report.appointmentDate.toISOString().slice(0, 10);
      }
    }
    if (report.appointmentTime) {
      const match = report.appointmentTime.match(/(\d{4}-\d{2}-\d{2})/);
      if (match) return match[1];
    }
    return null;
  };

  // Lấy ngày hôm nay (YYYY-MM-DD)
  const today = new Date().toISOString().slice(0, 10);

  // Lọc báo cáo trong ngày - chỉ lấy những báo cáo có status là Pending và appointment date = hôm nay
  const todayReports = workReports.filter((r) => {
    const reportDate = getReportDate(r);
    return reportDate === today && r.status === "Pending";
  });

  // Lọc báo cáo trong tương lai - chỉ lấy những báo cáo có status là Pending và appointment date > hôm nay
  const futureReports = workReports
    .filter((r) => {
      const reportDate = getReportDate(r);
      return (
        reportDate &&
        new Date(reportDate).getTime() > new Date(today).getTime() &&
        r.status === "Pending"
      );
    })
    .sort((a, b) => {
      // So sánh ngày gần nhất ở trên, nếu trùng ngày thì so sánh giờ gần nhất ở trên
      const dateA = getReportDate(a);
      const dateB = getReportDate(b);
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      const timeA = a.appointmentTime || "";
      const timeB = b.appointmentTime || "";
      const dA = new Date(dateA);
      const dB = new Date(dateB);
      if (dA.getTime() !== dB.getTime()) {
        return dA.getTime() - dB.getTime(); // gần nhất ở trên
      }
      // Nếu cùng ngày, so sánh giờ (giả sử appointmentTime dạng "HH:mm - HH:mm" hoặc "HH:mm")
      const extractStartTime = (t) => {
        if (!t) return 0;
        const match = t.match(/(\d{1,2}):(\d{2})/);
        if (match) {
          return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
        }
        return 0;
      };
      const tA = extractStartTime(timeA);
      const tB = extractStartTime(timeB);
      return tA - tB; // giờ gần nhất ở trên
    });

  // Lọc báo cáo đã hoàn thành - lấy những báo cáo có status khác Pending
  const completedWorkReports = workReports.filter(
    (r) => r.status && r.status !== "Pending"
  );

  // Pagination state for Sent Reports
  const [completedReportsPagination, setCompletedReportsPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // Pagination state for Future Reports
  const [futureReportsPagination, setFutureReportsPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // Lấy staffID từ redux
  const staffID = useSelector(
    (state) => state.user?.staffID || state.user?.id || ""
  );

  // Lấy danh sách báo cáo hôm nay cho staff
  const fetchWorkReports = useCallback(async () => {
    if (!staffID) {
      toast.error("Can not find staffID!");
      setWorkReports([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/staff/my-report/${staffID}`);
      const rawData = response.data?.data || response.data || [];
      // Chuẩn hóa dữ liệu: appointmentDate luôn là string YYYY-MM-DD
      const normalized = rawData.map((item) => {
        let appointmentDate = item.appointmentDate;
        if (Array.isArray(appointmentDate) && appointmentDate.length >= 3) {
          // [YYYY, MM, DD] => 'YYYY-MM-DD'
          const y = appointmentDate[0];
          const m = String(appointmentDate[1]).padStart(2, "0");
          const d = String(appointmentDate[2]).padStart(2, "0");
          appointmentDate = `${y}-${m}-${d}`;
        }
        return {
          ...item,
          appointmentDate,
        };
      });
      setWorkReports(normalized);
    } catch (error) {
      toast.error(
        "Failed to fetch work reports: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error fetching work reports:", error);
    } finally {
      setLoading(false);
    }
  }, [staffID]);

  useEffect(() => {
    fetchWorkReports();
  }, [fetchWorkReports]);

  // Cập nhật trạng thái/note từng báo cáo (PATCH)
  const handleSave = async (record) => {
    try {
      setLoading(true);
      const payload = {
        status: record.status,
        note: record.note || "",
      };

      console.log("Sending payload:", payload);
      console.log("Report ID:", record.reportID);

      await api.patch(`/staff/my-report/${record.reportID}`, payload);
      toast.success("Update successfully!");
      fetchWorkReports();
    } catch (error) {
      toast.error(
        "Update failed: " + (error.response?.data?.message || error.message)
      );
      console.error("Update error:", error);
    } finally {
      setLoading(false);
      setEditingKey("");
    }
  };

  // Table columns với editable cell
  const EditableCell = ({ editing, dataIndex, children, ...restProps }) => {
    let inputNode;
    if (dataIndex === "status") {
      inputNode = (
        <Select
          style={{ minWidth: 100 }}
          onChange={(value) => {
            console.log("Status changed to:", value);
          }}>
          <Option value="Pending">Pending</Option>
          <Option value="Completed">Completed</Option>
          <Option value="Delay">Delay</Option>
          <Option value="Cancel">Cancel</Option>
        </Select>
      );
    } else if (dataIndex === "note") {
      inputNode = (
        <Input
          onChange={(e) => {
            console.log("Note changed to:", e.target.value);
          }}
        />
      );
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
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const [form] = Form.useForm();
  const isEditing = (record) => record.reportID === editingKey;
  const edit = (record) => {
    // Open modal and set editing record only, do not change editingKey or table state
    setEditingRecord(record);
    setIsEditModalVisible(true);
    form.setFieldsValue({
      status: record.status || "",
      note: record.note || "",
    });
    // Do NOT setEditingKey here
  };
  // Remove unused cancel function

  // Remove unused save function

  const mergedColumns = [
    {
      title: "Report ID",
      dataIndex: "reportID",
      key: "reportID",
    },
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      key: "bookingID",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (name) => name || "-",
    },
    {
      title: "Appointment Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (time) => time || "-",
    },
    {
      title: "Appointment Date",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date, record) => {
        // Nếu là mảng [YYYY, MM, DD] thì format lại
        if (Array.isArray(date) && date.length >= 3) {
          const y = date[0];
          const m = String(date[1]).padStart(2, "0");
          const d = String(date[2]).padStart(2, "0");
          return `${y}-${m}-${d}`;
        }
        if (typeof date === "string" && date) return date;
        if (record.appointmentTime) {
          const match = record.appointmentTime.match(/(\d{4}-\d{2}-\d{2})/);
          return match ? match[1] : "-";
        }
        return "-";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      editable: true,
      render: (status) => {
        let color = "default";
        let icon = null;
        if (status === "Completed") {
          color = "green";
          icon = <CheckCircleOutlined />;
        } else if (status === "Pending") {
          color = "blue";
          icon = <ClockCircleOutlined />;
        } else if (status === "Delay") {
          color = "orange";
          icon = <ClockCircleOutlined />;
        } else if (status === "Cancel") {
          color = "red";
          icon = <CloseCircleOutlined />;
        }
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
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
        return record.isSent ? null : (
          <Button
            key="submit"
            type="primary"
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
            style={{
              padding: "0 16px",
              height: 28,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            icon={<EditOutlined />}>
            Edit
          </Button>
        );
      },
    },
  ];

  const columns = mergedColumns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => {
        // Remove inputType to avoid React warning
        return {
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        };
      },
    };
  });

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();

      // Add professional header with background
      doc.setFillColor(41, 128, 185); // Professional blue
      doc.rect(0, 0, doc.internal.pageSize.width, 35, "F");

      // Add title with enhanced styling
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255); // White text
      doc.text("Staff Work Reports", 14, 20);

      // Add subtitle
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Completed Reports Summary", 14, 28);

      // Add date with different styling
      doc.setFontSize(10);
      doc.setTextColor(200, 200, 200); // Light gray text
      const currentDate = new Date().toLocaleDateString();
      doc.text(
        `Generated on: ${currentDate}`,
        doc.internal.pageSize.width - 55,
        20
      );

      // Add report count
      doc.text(
        `Total Reports: ${completedWorkReports.length}`,
        doc.internal.pageSize.width - 55,
        28
      );

      // Reset text color for content
      doc.setTextColor(51, 51, 51);

      // Check if autoTable is available
      if (doc.autoTable) {
        const columns = ["ID", "Booking", "Customer", "Time", "Status", "Note"];
        const rows = completedWorkReports.map((row) => [
          row.reportID || "-",
          row.bookingID || "-",
          (row.customerName || "-").substring(0, 20),
          (row.appointmentTime || "-").substring(0, 15),
          row.status || "-",
          (row.note || "-").substring(0, 25),
        ]);

        doc.autoTable({
          head: [columns],
          body: rows,
          startY: 45,
          styles: {
            fontSize: 9,
            cellPadding: 4,
            overflow: "linebreak",
            halign: "left",
            lineColor: [200, 200, 200],
            lineWidth: 0.3,
            textColor: [51, 51, 51], // Dark gray text for better readability
          },
          headStyles: {
            fillColor: [41, 128, 185], // Professional blue background
            textColor: [255, 255, 255], // White text
            fontStyle: "bold",
            fontSize: 10,
            halign: "center",
            cellPadding: 5,
            lineColor: [255, 255, 255],
            lineWidth: 0.5,
          },
          alternateRowStyles: {
            fillColor: [248, 249, 250], // Light gray for alternating rows
          },
          columnStyles: {
            0: { halign: "center", cellWidth: 25 }, // ID column
            1: { halign: "center", cellWidth: 25 }, // Booking column
            2: { halign: "left", cellWidth: 35 }, // Customer column
            3: { halign: "center", cellWidth: 30 }, // Time column
            4: { halign: "center", cellWidth: 25 }, // Status column
            5: { halign: "left", cellWidth: 40 }, // Note column
          },
          tableLineColor: [200, 200, 200],
          tableLineWidth: 0.5,
          margin: { left: 14, right: 14 },
          theme: "grid", // Add grid theme for better structure
        });
      } else {
        // Fallback: Enhanced text-based table with background styling
        let yPosition = 50;

        // Create header background rectangle
        doc.setFillColor(41, 128, 185); // Professional blue background
        doc.rect(14, yPosition - 8, 176, 12, "F"); // Filled rectangle for header

        // Header text
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255); // White text for header

        doc.text("ID", 20, yPosition);
        doc.text("Booking", 35, yPosition);
        doc.text("Customer", 65, yPosition);
        doc.text("Time", 105, yPosition);
        doc.text("Status", 135, yPosition);
        doc.text("Note", 165, yPosition);

        yPosition += 10;

        // Reset text color for data rows
        doc.setTextColor(51, 51, 51); // Dark gray text
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");

        // Data rows with alternating background colors
        completedWorkReports.forEach((row, index) => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;

            // Repeat styled header on new page
            doc.setFillColor(41, 128, 185);
            doc.rect(14, yPosition - 8, 176, 12, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);

            doc.text("ID", 20, yPosition);
            doc.text("Booking", 35, yPosition);
            doc.text("Customer", 65, yPosition);
            doc.text("Time", 105, yPosition);
            doc.text("Status", 135, yPosition);
            doc.text("Note", 165, yPosition);

            yPosition += 10;
            doc.setTextColor(51, 51, 51);
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
          }

          // Alternating row background
          if (index % 2 === 0) {
            doc.setFillColor(248, 249, 250); // Light gray for even rows
            doc.rect(14, yPosition - 6, 176, 8, "F");
          }

          doc.text((row.reportID || "-").toString(), 20, yPosition);
          doc.text((row.bookingID || "-").toString(), 35, yPosition);
          doc.text((row.customerName || "-").substring(0, 15), 65, yPosition);
          doc.text(
            (row.appointmentTime || "-").substring(0, 12),
            105,
            yPosition
          );
          doc.text((row.status || "-").toString(), 135, yPosition);
          doc.text((row.note || "-").substring(0, 20), 165, yPosition);

          yPosition += 8;
        });
      }

      // Add professional footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Footer background
        doc.setFillColor(245, 245, 245);
        doc.rect(
          0,
          doc.internal.pageSize.height - 20,
          doc.internal.pageSize.width,
          20,
          "F"
        );

        // Footer text
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Page ${i} of ${totalPages}`,
          14,
          doc.internal.pageSize.height - 8
        );
        doc.text(
          `Generated: ${new Date().toLocaleDateString()} | Total Reports: ${
            completedWorkReports.length
          }`,
          doc.internal.pageSize.width - 100,
          doc.internal.pageSize.height - 8
        );
      }

      doc.save("completed_reports.pdf");
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF: " + error.message);
    }
  };

  // Cột cho bảng Future Schedule (ẩn Note, Assigned ID, Manager ID, Approved)
  const futureReportColumns = [
    {
      title: "Report ID",
      dataIndex: "reportID",
      key: "reportID",
      sorter: (a, b) =>
        (a.reportID || "")
          .toString()
          .localeCompare((b.reportID || "").toString()),
    },
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      key: "bookingID",
      render: (bookingID) => bookingID || "-",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (name) => name || "-",
    },
    {
      title: "Appointment Date",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date, record) => {
        if (date) return date;
        if (record.appointmentTime) {
          const match = record.appointmentTime.match(/(\d{4}-\d{2}-\d{2})/);
          return match ? match[1] : "-";
        }
        return "-";
      },
    },
    {
      title: "Appointment Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (time) => time || "-",
    },

    // Approved column is hidden as requested
  ];

  // Columns for Completed Reports table (similar to mergedColumns but without Actions column)
  const workReportColumns = [
    {
      title: "Report ID",
      dataIndex: "reportID",
      key: "reportID",
    },
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      key: "bookingID",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (name) => name || "-",
    },
    {
      title: "Appointment Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (time) => time || "-",
    },
    {
      title: "Appointment Date",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date, record) => {
        if (Array.isArray(date) && date.length >= 3) {
          const y = date[0];
          const m = String(date[1]).padStart(2, "0");
          const d = String(date[2]).padStart(2, "0");
          return `${y}-${m}-${d}`;
        }
        if (typeof date === "string" && date) return date;
        if (record.appointmentTime) {
          const match = record.appointmentTime.match(/(\d{4}-\d{2}-\d{2})/);
          return match ? match[1] : "-";
        }
        return "-";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let icon = null;
        if (status === "Completed") {
          color = "green";
          icon = <CheckCircleOutlined />;
        } else if (status === "Pending") {
          color = "blue";
          icon = <ClockCircleOutlined />;
        } else if (status === "Delay") {
          color = "orange";
          icon = <ClockCircleOutlined />;
        } else if (status === "Cancel") {
          color = "red";
          icon = <CloseCircleOutlined />;
        }
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
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
              type="primary">
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
                rowKey="reportID"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  pageSizeOptions: [5, 10, 20, 50, 100],
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} reports`,
                  onShowSizeChange: () => {
                    // No state for current page in today tab, so just reload page
                  },
                }}
              />
            </Form>
          </Card>
          {/* Submit Report button removed */}
        </>
      ),
    },
    {
      key: "future",
      label: (
        <span>
          <CalendarOutlined style={{ marginRight: 8 }} />
          Future Schedule
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
              Future Schedule ({futureReports.length})
            </Title>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchWorkReports}
              loading={loading}
              type="primary">
              Refresh Reports
            </Button>
          </div>
          <Card>
            <Table
              loading={loading}
              columns={futureReportColumns}
              dataSource={futureReports}
              rowKey="reportID"
              pagination={{
                ...futureReportsPagination,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20, 50, 100],
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} reports`,
                onShowSizeChange: (current, size) => {
                  setFutureReportsPagination({ current: 1, pageSize: size });
                },
                onChange: (page, pageSize) => {
                  setFutureReportsPagination({ current: page, pageSize });
                },
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </>
      ),
    },
    {
      key: "sent",
      label: (
        <span>
          <HistoryOutlined style={{ marginRight: 8 }} />
          Completed Reports
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
              Completed Reports ({completedWorkReports.length})
            </Title>
            <Space>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExportPDF}
                className="custom-btn-export">
                Export PDF
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchWorkReports}
                loading={loading}
                type="primary">
                Refresh Reports
              </Button>
            </Space>
          </div>
          <Card>
            <Table
              loading={loading}
              columns={workReportColumns}
              dataSource={completedWorkReports}
              rowKey="reportID"
              pagination={{
                ...completedReportsPagination,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20, 50, 100],
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} reports`,
                onShowSizeChange: (current, size) => {
                  setCompletedReportsPagination({ current: 1, pageSize: size });
                },
                onChange: (page, pageSize) => {
                  setCompletedReportsPagination({ current: page, pageSize });
                },
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </>
      ),
    },
  ];

  // Modal handlers moved here so they are accessible INSIDE the component
  const handleEditModalOk = async () => {
    if (!editingRecord) return;
    try {
      const row = await form.validateFields();
      // Merge with current editingRecord
      const updatedItem = { ...editingRecord, ...row };
      await handleSave(updatedItem);
      setIsEditModalVisible(false);
      setEditingRecord(null);
      setEditingKey(""); // Reset editingKey after save
    } catch {
      // Validation error, do nothing
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setEditingRecord(null);
    // Do NOT reset editingKey here
  };

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
      {/* Edit Report Modal */}
      {isEditModalVisible && (
        <Modal
          title={
            <span style={{ fontSize: 24, fontWeight: 600 }}>Edit Report</span>
          }
          open={isEditModalVisible}
          onOk={handleEditModalOk}
          onCancel={handleEditModalCancel}
          confirmLoading={loading}
          centered
          footer={[
            <Button key="back" onClick={handleEditModalCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleEditModalOk}>
              Save
            </Button>,
          ]}
          styles={{ body: { textAlign: "left" } }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 12,
              minWidth: 320,
            }}>
            <div>
              <strong>Report ID:</strong> {editingRecord?.reportID}
            </div>
            <div>
              <strong>Booking ID:</strong> {editingRecord?.bookingID}
            </div>
            <Form
              form={form}
              layout="vertical"
              style={{ marginTop: 16, width: "100%" }}>
              <Form.Item label="Status" name="status" required>
                <Select placeholder="Select status">
                  <Option value="Pending">Pending</Option>
                  <Option value="Completed">Completed</Option>
                  <Option value="Delay">Delay</Option>
                  <Option value="Cancel">Cancel</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Note" name="note">
                <Input placeholder="Enter note" />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
};

export default StaffReporting;
