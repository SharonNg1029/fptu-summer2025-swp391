import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectManagerID } from "../../../redux/features/userSlice";
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
  Statistic,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  EditOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ViewReports = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [bookingAssigned, setBookingAssigned] = useState([]);
  const [staffList, setStaffList] = useState([]);
  // Set initial tab from query string if present
  const getInitialTab = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab && ["assign", "approve", "all"].includes(tab)) return tab;
    }
    return "assign";
  };
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [staffFilter, setStaffFilter] = useState("");
  // Đã xóa lọc theo ngày, không cần dateRange
  const managerID = useSelector(selectManagerID);

  // Assign Staff Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);

  // Pagination states
  const [allPagination, setAllPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [assignPagination, setAssignPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // Pagination for Approve tab
  const [approvePagination, setApprovePagination] = useState({
    current: 1,
    pageSize: 10,
  });
  // --- Approve Report Functions ---
  const [approveLoading, setApproveLoading] = useState(false);
  const [approvingReport, setApprovingReport] = useState(null);

  const handleApproveReport = async (record) => {
    setApproveLoading(true);
    // Defensive: try both reportID and id
    const reportId = record.reportID || record.id;
    if (!reportId) {
      toast.error("Cannot approve: missing reportID.");
      setApproveLoading(false);
      setApprovingReport(null);
      return;
    }
    setApprovingReport(reportId);
    try {
      // Gửi đúng kiểu dữ liệu cho backend: isApproved: true (boolean) theo DTO, truyền qua body (nếu backend yêu cầu)
      await api.patch(`/manager/${reportId}/report`, { isApproved: true });
      // Refetch both reports and bookingAssigned immediately after approve
      await fetchAllReports();
      // Luôn hiển thị toast thành công nếu không có lỗi, không kiểm tra phản hồi nữa
      toast.success(`Report #${record.reportID} approved successfully!`);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to approve report: " + error.message);
      }
    } finally {
      setApproveLoading(false);
      setApprovingReport(null);
    }
  };
  // --- Approve Tab Columns ---
  const approveColumns = [
    {
      title: "Report ID",
      dataIndex: "reportID",
      key: "reportID",
      width: 100,
    },
    {
      title: "Staff ID",
      dataIndex: "staffID",
      key: "staffID",
      width: 120,
      render: (id) => id || <Tag color="volcano">Unassigned</Tag>,
    },
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      key: "bookingID",
      width: 100,
    },
    {
      title: "Appointment Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (time) => time || "-",
      width: 150,
    },
    {
      title: "Appointment Date",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
      width: 120,
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
      width: 100,
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (note) => note || "-",
      ellipsis: true,
      width: 180,
    },
    {
      title: "Approved",
      dataIndex: "isApproved",
      key: "isApproved",
      render: (isApproved) =>
        isApproved === true ? (
          <Tag color="green">Approved</Tag>
        ) : (
          <Tag color="orange">Unapproved</Tag>
        ),
      width: 100,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      align: "center",
      responsive: ["md"],
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          loading={approveLoading && approvingReport === record.id}
          disabled={record.isApproved}
          onClick={() => handleApproveReport(record)}
          size="small">
          Approve
        </Button>
      ),
    },
  ];

  // --- Data Fetching Functions ---

  // Fetch all reports (for Approve/All tabs)
  const fetchAllReports = useCallback(async () => {
    if (!managerID) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/manager/report/${managerID}`);
      const fetchedData = response.data?.data || response.data || [];
      const normalized = fetchedData.map((item) => ({
        id: item.reportID,
        reportID: item.reportID,
        bookingId: item.bookingID,
        bookingID: item.bookingID,
        appointmentTime: item.appointmentTime,
        appointmentDate: item.appointmentDate,
        customerName: item.customerName,
        note: item.note,
        status: item.status,
        assignedId: item.assignedID,
        assignedID: item.assignedID,
        managerID: item.managerID,
        staffID: item.staffID,
        staffId: item.staffID,
        staffName: item.staffID,
        createdAt: item.createdAt,
        // Chuyển đổi isApproved: 0 -> false, 1 -> true, còn lại giữ nguyên (fix: parseInt để tránh lỗi kiểu string)
        isApproved:
          parseInt(item.isApproved) === 1
            ? true
            : parseInt(item.isApproved) === 0
            ? false
            : item.isApproved,
      }));
      setReports(normalized);
      // Lấy danh sách staff từ API riêng (nếu có), nếu không thì lấy từ tất cả các report và bookingAssigned
      let allStaff = [];
      try {
        const staffRes = await api.get("/manager/all-staff");
        // Giả sử API trả về mảng staff có id và name
        if (Array.isArray(staffRes.data)) {
          allStaff = staffRes.data.map((s) => ({
            id: s.staffID || s.id,
            name: s.name || s.staffName || s.staffID || s.id,
          }));
        } else if (Array.isArray(staffRes.data?.data)) {
          allStaff = staffRes.data.data.map((s) => ({
            id: s.staffID || s.id,
            name: s.name || s.staffName || s.staffID || s.id,
          }));
        }
      } catch {
        // Nếu không có API riêng, fallback lấy từ report và bookingAssigned
        const staffFromReports = normalized
          .filter((r) => r.staffID)
          .map((r) => ({ id: r.staffID, name: r.staffID }));
        allStaff = staffFromReports;
      }
      // Loại bỏ trùng lặp staff theo id
      const uniqueStaff = Array.from(
        new Map(allStaff.filter((s) => s.id).map((s) => [s.id, s])).values()
      );
      setStaffList(uniqueStaff);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to fetch all reports: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [managerID]);

  // Fetch bookingAssigned for Assign tab
  const fetchBookingAssigned = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/manager/booking-assigned");
      const data = response.data?.data || response.data || [];
      // Chuẩn hóa dữ liệu bookingAssigned
      const normalized = data.map((item) => ({
        id: item.id || item.bookingID || item.bookingId,
        reportID: item.reportID,
        bookingID: item.bookingID,
        bookingId: item.bookingID,
        appointmentTime: item.appointmentTime,
        appointmentDate: item.appointmentDate, // <-- Ensure appointmentDate is included
        status: item.status,
        assignedId: item.assignedID,
        assignedID: item.assignedID,
        staffID: item.staffID,
        staffName: item.staffID,
      }));
      setBookingAssigned(normalized);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to fetch booking assigned: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllReports();
    fetchBookingAssigned();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managerID]);

  // --- Staff Assignment Functions ---

  const showAssignModal = (record) => {
    setSelectedBooking(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
    setSelectedStaff(null);
  };

  const handleAssignStaff = async () => {
    // Defensive: try both assignedID and assignedId (API/DB may use either)
    const assignId = selectedBooking?.assignedId || selectedBooking?.assignedID;
    if (!selectedBooking || !assignId) {
      toast.error("Invalid booking: missing assignedId.");
      return;
    }
    if (!selectedStaff) {
      toast.warn("Please select a staff member.");
      return;
    }
    setAssignLoading(true);
    try {
      await api.patch(`/manager/assign-staff/${assignId}`, {
        staffID: selectedStaff,
        managerID: managerID,
      });
      toast.success(
        `Successfully assigned ${selectedStaff} to report ${
          selectedBooking?.reportID || selectedBooking?.id
        }`
      );
      setIsModalVisible(false);
      setSelectedBooking(null);
      setSelectedStaff(null);
      // Refresh all reports and bookingAssigned after assign
      fetchAllReports();
      fetchBookingAssigned();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        (typeof error.response.data === "string" || error.response.data.message)
      ) {
        // Nếu response.data là string thì show trực tiếp, nếu có message thì show message
        toast.error(
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data.message
        );
      } else {
        toast.error("Failed to assign staff: " + error.message);
      }
    } finally {
      setAssignLoading(false);
    }
  };

  // --- PDF Export Functions ---

  const handleExportPDF = (data, title, filename) => {
    try {
      if (!jsPDF || !jsPDF.prototype.autoTable) {
        toast.error("jsPDF autoTable plugin is not available.");
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(title, 14, 20);

      const tableColumns = [
        "Report ID",
        "Staff Name",
        "Booking ID",
        "Appointment Time",
        "Status",
        "Note",
      ];

      const tableRows = data.map((row) => [
        row.id || "-",
        row.staffName || "N/A",
        row.bookingId || "-",
        row.appointmentTime
          ? dayjs(row.appointmentTime).format("HH:mm DD/MM/YYYY")
          : "-",
        row.status || "-",
        row.note || "-",
      ]);

      doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 30,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 119, 255] },
      });

      doc.save(filename);
      toast.success("PDF exported successfully!");
    } catch (error) {
      toast.error("Failed to export PDF: " + error.message);
    }
  };

  // --- Table Column Definitions ---

  const baseReportColumns = [
    {
      title: "Report ID",
      dataIndex: "reportID",
      key: "reportID",
      sorter: (a, b) =>
        (a.reportID || "")
          .toString()
          .localeCompare((b.reportID || "").toString()),
      width: 100,
    },
    {
      title: "Staff ID",
      dataIndex: "staffID",
      key: "staffID",
      sorter: (a, b) => (a.staffID || "").localeCompare(b.staffID || ""),
      render: (id) => id || <Tag color="volcano">Unassigned</Tag>,
      width: 120,
    },
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      key: "bookingID",
      render: (bookingID) => bookingID || "-",
      width: 100,
    },
    {
      title: "Appointment Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (time) => time || "-",
      width: 150,
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
      width: 100,
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (note) => note || "-",
      ellipsis: true,
    },
  ];

  const allReportColumns = [
    ...baseReportColumns,
    {
      title: "Appointment Date",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
      width: 120,
    },
    {
      title: "Approved",
      dataIndex: "isApproved",
      key: "isApproved",
      render: (isApproved) =>
        isApproved === true ? (
          <Tag color="green">Approved</Tag>
        ) : (
          <Tag color="orange">Unapproved</Tag>
        ),
      width: 100,
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      width: 120,
    },
  ];

  const assignBookingColumns = [
    {
      title: "Assigned ID",
      dataIndex: "assignedID",
      key: "assignedID",
      width: 100,
      render: (id) => id || "-",
    },
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      key: "bookingID",
      width: 100,
      render: (id) => id || "-",
    },
    {
      title: "Appointment Date",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
      width: 120,
    },
    {
      title: "Appointment Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      width: 140,
      render: (time) => time || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        let color = "blue";
        if (status === "Delay") color = "orange";
        else if (status === "Pending") color = "blue";
        else if (status === "Completed") color = "green";
        else if (status === "Cancel") color = "red";
        else if (status === "Awaiting confirm") color = "gold";
        return <Tag color={color}>{status || "-"}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      align: "center",
      responsive: ["md"],
      width: 120,
      render: (_, record) => (
        <Button
          icon={<UserAddOutlined />}
          onClick={() => showAssignModal(record)}
          type="primary"
          size="small">
          Assign Staff
        </Button>
      ),
    },
  ];

  // --- Tab Items ---
  const tabItems = [
    {
      key: "assign",
      label: (
        <span>
          <UserAddOutlined style={{ marginRight: 8 }} />
          Assign Staff
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
            }}>
            <Title level={3} style={{ margin: 0 }}>
              Reports Awaiting Assignment (
              {reports.filter((r) => r.status === "Pending").length})
            </Title>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchAllReports}
              loading={loading}>
              Refresh
            </Button>
          </div>
          <Card>
            <Table
              loading={loading}
              columns={assignBookingColumns}
              dataSource={bookingAssigned.filter(
                (b) => b.status === "Awaiting confirm"
              )}
              rowKey={(record) =>
                record.assignedID ||
                record.id ||
                record.bookingID ||
                Math.random().toString()
              }
              pagination={{
                ...assignPagination,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20, 50, 100],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} bookings`,
                onShowSizeChange: (current, size) =>
                  setAssignPagination({ current: 1, pageSize: size }),
                onChange: (page, pageSize) =>
                  setAssignPagination({ current: page, pageSize: pageSize }),
              }}
              locale={{
                emptyText: "Hiện tại chưa có booking nào cần phân công",
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </>
      ),
    },
    {
      key: "approve",
      label: (
        <span>
          <CheckCircleOutlined style={{ marginRight: 8 }} />
          Approve Reports
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
            }}>
            <Title level={3} style={{ margin: 0 }}>
              Reports Awaiting Approval (
              {
                reports.filter(
                  (r) =>
                    r.isApproved === false ||
                    r.isApproved === 0 ||
                    r.isApproved === null ||
                    typeof r.isApproved === "undefined"
                ).length
              }
              )
            </Title>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchAllReports}
              loading={loading}>
              Refresh
            </Button>
          </div>
          <Card>
            <Table
              loading={loading}
              columns={approveColumns}
              dataSource={reports.filter(
                (r) =>
                  r.isApproved === false ||
                  r.isApproved === 0 ||
                  r.isApproved === null ||
                  typeof r.isApproved === "undefined"
              )}
              rowKey={(record) =>
                record.id || record.bookingId || Math.random().toString()
              }
              pagination={{
                ...approvePagination,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20, 50, 100],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} reports`,
                onShowSizeChange: (current, size) =>
                  setApprovePagination({ current: 1, pageSize: size }),
                onChange: (page, pageSize) =>
                  setApprovePagination({ current: page, pageSize: pageSize }),
              }}
              locale={{
                emptyText: "Hiện tại chưa có report nào cần duyệt",
              }}
              scroll={{ x: 900 }}
            />
          </Card>
        </>
      ),
    },
    {
      key: "all",
      label: (
        <span>
          <FileTextOutlined style={{ marginRight: 8 }} />
          All Reports
        </span>
      ),
      children: (
        <>
          {/* Filter Controls */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <Input
                placeholder="Search by Report ID, Booking ID, Staff ID"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="Filter by Status"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                style={{ width: "100%" }}
                allowClear={true}>
                <Option value="Pending">Pending</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Delay">Delay</Option>
                <Option value="Cancel">Cancel</Option>
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="Filter by Staff"
                value={staffFilter}
                onChange={(value) => setStaffFilter(value)}
                style={{ width: "100%" }}
                allowClear={true}>
                {staffList
                  .filter(
                    (staff) => staff.id !== null && staff.id !== undefined
                  )
                  .map((staff) => (
                    <Option key={staff.id} value={staff.id}>
                      {staff.name}
                    </Option>
                  ))}
              </Select>
            </Col>
          </Row>
          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}>
            <Title level={3} style={{ margin: 0 }}>
              All Staff Reports ({reports.length})
            </Title>
            <Space>
              <Button
                icon={<DownloadOutlined />}
                onClick={() =>
                  handleExportPDF(
                    reports,
                    "All Staff Reports",
                    "all_reports.pdf"
                  )
                }
                style={{
                  background: "#1677ff",
                  color: "#fff",
                  border: "none",
                }}>
                Export PDF
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchAllReports}
                loading={loading}>
                Refresh
              </Button>
            </Space>
          </div>
          <Card>
            <Table
              loading={loading}
              columns={allReportColumns}
              dataSource={reports
                .filter((r) => {
                  let statusOk = true;
                  let staffOk = true;
                  let searchOk = true;
                  if (statusFilter) statusOk = r.status === statusFilter;
                  if (staffFilter) staffOk = r.staffID === staffFilter;
                  if (searchText) {
                    const search = searchText.trim().toLowerCase();
                    searchOk =
                      (r.reportID &&
                        r.reportID.toString().toLowerCase().includes(search)) ||
                      (r.bookingID &&
                        r.bookingID
                          .toString()
                          .toLowerCase()
                          .includes(search)) ||
                      (r.staffName &&
                        r.staffName
                          .toString()
                          .toLowerCase()
                          .includes(search)) ||
                      (r.staffID &&
                        r.staffID.toString().toLowerCase().includes(search));
                  }
                  return statusOk && staffOk && searchOk;
                })
                // Sắp xếp theo ngày tạo mới nhất đến cũ nhất
                .sort((a, b) => {
                  const dateA = a.createdAt
                    ? new Date(a.createdAt)
                    : new Date(0);
                  const dateB = b.createdAt
                    ? new Date(b.createdAt)
                    : new Date(0);
                  return dateB - dateA;
                })}
              rowKey={(record) =>
                record.id || record.bookingId || Math.random().toString()
              }
              pagination={{
                ...allPagination,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20, 50, 100],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} reports`,
                onShowSizeChange: (current, size) =>
                  setAllPagination({ current: 1, pageSize: size }),
                onChange: (page, pageSize) =>
                  setAllPagination({ current: page, pageSize: pageSize }),
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
        Staff Reports Management
      </Title>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        items={tabItems}
      />

      {/* Assign Staff Modal */}

      <Modal
        title={
          <span style={{ fontSize: 24, fontWeight: 600 }}>
            Assign Staff to Report
          </span>
        }
        open={isModalVisible}
        onOk={handleAssignStaff}
        onCancel={handleCancel}
        confirmLoading={assignLoading}
        centered
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={assignLoading}
            onClick={handleAssignStaff}>
            Assign
          </Button>,
        ]}
        styles={{ body: { textAlign: "left" } }}>
        <div>
          <div>
            <strong>Assigned ID:</strong>{" "}
            {selectedBooking?.assignedID || selectedBooking?.assignedId}
          </div>
          <div>
            <strong>Booking ID:</strong> {selectedBooking?.bookingId}
          </div>
          <Form layout="vertical" style={{ marginTop: 16, width: "100%" }}>
            <Form.Item label="Select Staff Member" required>
              <Select
                showSearch
                placeholder="Select a staff member"
                value={selectedStaff}
                onChange={(value) => setSelectedStaff(value)}
                style={{ width: "100%" }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }>
                {staffList.map((staff) => (
                  <Option key={staff.id} value={staff.id}>
                    {staff.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default ViewReports;
