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
  const [activeTab, setActiveTab] = useState("today");

  // Lấy ngày hôm nay (YYYY-MM-DD)
  const today = new Date().toISOString().slice(0, 10);

  // Helper function to extract date from appointment time
  const extractDateFromAppointment = (appointmentTime) => {
    if (!appointmentTime) return null;
    // If appointmentTime is just time format like "8:15 - 9:15", we can't extract date
    // We'll need to check if it contains date information
    const dateMatch = appointmentTime.match(/(\d{4}-\d{2}-\d{2})/);
    return dateMatch ? dateMatch[1] : null;
  };

  // Lọc báo cáo trong ngày - chỉ lấy những báo cáo có status là Pending
  const todayReports = workReports.filter((r) => {
    const appointmentDate = extractDateFromAppointment(r.appointmentTime);
    return (
      (appointmentDate === today || !appointmentDate) && r.status === "Pending"
    );
  });

  // Lọc báo cáo trong tương lai - chỉ lấy những báo cáo có status là Pending
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const futureReports = workReports.filter((r) => {
    const appointmentDate = extractDateFromAppointment(r.appointmentTime);
    return appointmentDate >= tomorrow && r.status === "Pending";
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
    console.log("Editing record:", record);
    const initialValues = {
      status: record.status || "",
      note: record.note || "",
    };
    console.log("Setting form values:", initialValues);

    // Reset form first
    form.resetFields();

    // Set individual fields
    form.setFieldValue("status", record.status || "");
    form.setFieldValue("note", record.note || "");

    setEditingKey(record.reportID);

    // Verify form values after setting
    setTimeout(() => {
      const currentValues = form.getFieldsValue();
      console.log("Form values after setting:", currentValues);
    }, 100);
  };
  const cancel = () => setEditingKey("");

  const save = async (reportID) => {
    try {
      const row = await form.validateFields();
      console.log("Form data from validateFields:", row);

      // Lấy giá trị hiện tại của form
      const currentFormValues = form.getFieldsValue();
      console.log("Current form values:", currentFormValues);

      const newData = [...workReports];
      const index = newData.findIndex((item) => reportID === item.reportID);
      if (index > -1) {
        const item = newData[index];
        const updatedItem = { ...item, ...row };
        console.log("Original item:", item);
        console.log("Updated item:", updatedItem);

        // Hiển thị modal xác nhận
        Modal.confirm({
          title: (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#1890ff",
                }}>
                📝 Confirm Report Update
              </span>
            </div>
          ),
          content: (
            <div style={{ padding: "16px 0" }}>
              <p
                style={{
                  fontSize: "16px",
                  marginBottom: "20px",
                  color: "#262626",
                  fontWeight: "500",
                }}>
                Are you sure you want to update this report with the following
                information?
              </p>

              <div
                style={{
                  backgroundColor: "#f6f8fa",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #e1e4e8",
                }}>
                <div style={{ marginBottom: "12px" }}>
                  <span
                    style={{
                      color: "#586069",
                      fontSize: "14px",
                      fontWeight: "500",
                      display: "inline-block",
                      minWidth: "80px",
                    }}>
                    Report ID:
                  </span>
                  <span
                    style={{
                      color: "#1890ff",
                      fontSize: "14px",
                      fontWeight: "600",
                      marginLeft: "8px",
                    }}>
                    #{reportID}
                  </span>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <span
                    style={{
                      color: "#586069",
                      fontSize: "14px",
                      fontWeight: "500",
                      display: "inline-block",
                      minWidth: "80px",
                    }}>
                    Status:
                  </span>
                  <span
                    style={{
                      backgroundColor:
                        updatedItem.status === "Completed"
                          ? "#52c41a"
                          : updatedItem.status === "Pending"
                          ? "#1890ff"
                          : updatedItem.status === "Delay"
                          ? "#fa8c16"
                          : "#ff4d4f",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                      marginLeft: "8px",
                    }}>
                    {updatedItem.status}
                  </span>
                </div>

                <div>
                  <span
                    style={{
                      color: "#586069",
                      fontSize: "14px",
                      fontWeight: "500",
                      display: "inline-block",
                      minWidth: "80px",
                      verticalAlign: "top",
                    }}>
                    Note:
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      marginLeft: "8px",
                      fontStyle: updatedItem.note ? "normal" : "italic",
                      color: updatedItem.note ? "#24292e" : "#6a737d",
                    }}>
                    {updatedItem.note || "No notes provided"}
                  </span>
                </div>
              </div>
            </div>
          ),
          okText: (
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              ✅ Confirm Update
            </span>
          ),
          cancelText: (
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              ❌ Cancel
            </span>
          ),
          okButtonProps: {
            style: {
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
              fontWeight: "600",
              height: "40px",
              paddingLeft: "20px",
              paddingRight: "20px",
            },
          },
          cancelButtonProps: {
            style: {
              height: "40px",
              paddingLeft: "20px",
              paddingRight: "20px",
              fontWeight: "600",
            },
          },
          width: 520,
          centered: true,
          onOk: () => {
            newData.splice(index, 1, updatedItem);
            handleSave(updatedItem);
          },
          onCancel: () => {
            console.log("Report update cancelled");
          },
        });
      }
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

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
        const editable = isEditing(record);
        return record.isSent ? null : editable ? (
          <span>
            <a onClick={() => save(record.reportID)} style={{ marginRight: 8 }}>
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

  const workReportColumns = [
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
      render: (note) => note || "-",
    },
    {
      title: "Assigned ID",
      dataIndex: "assignedID",
      key: "assignedID",
      render: (assignedID) => assignedID || "-",
    },
    {
      title: "Manager ID",
      dataIndex: "managerID",
      key: "managerID",
      render: (managerID) => managerID || "-",
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
              loading={loading}>
              Refresh Reports
            </Button>
          </div>
          <Card>
            <Table
              loading={loading}
              columns={workReportColumns} // Reusing the same columns for simplicity
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
