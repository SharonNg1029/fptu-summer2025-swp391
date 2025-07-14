// PDF export dependencies

import React, { useState, useEffect, useCallback } from "react";
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
  InputNumber,
  DatePicker,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import moment from "moment";
import api from "../../../configs/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title, Text } = Typography;
const { Option } = Select;
const ResultManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  // Export Completed Results to PDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({ orientation: "landscape" });
      doc.setFontSize(16);
      doc.text("Completed Results", 14, 14);

      // Table columns and rows
      const columns = [
        "Result ID",
        "Booking ID",
        "Relationship",
        "Matching %",
        "Conclusion",
        "Update At",
        "Available",
      ];

      const rows = resultsDone.map(function (item) {
        return [
          item.resultID || "",
          item.bookingID || "",
          item.relationship || "",
          typeof item.matchingPercentage === "number"
            ? item.matchingPercentage.toFixed(2) + "%"
            : "N/A",
          item.conclusion || "",
          item.updateAt
            ? moment(item.updateAt).format("DD/MM/YYYY HH:mm")
            : "N/A",
          item.available ? "Available" : "Unavailable",
        ];
      });

      // Use autoTable method from jspdf-autotable
      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 22,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
        margin: { left: 14, right: 14 },
        tableWidth: "auto",
      });

      doc.save("Completed_Results.pdf");
      toast.success("Exported Completed Results to PDF!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF: " + error.message);
    }
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState("");
  const [activeTab, setActiveTab] = useState("need");

  // Get staffID from Redux store
  const currentUser = useSelector((state) => state.user?.currentUser);
  const staffID = currentUser?.staff?.staffID || currentUser?.staffID;

  const [form] = Form.useForm();

  const fetchResults = useCallback(async () => {
    if (!staffID) {
      toast.error("Staff ID not found. Please log in again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/staff/my-all-result/${staffID}`);
      let data = response.data;
      // Handle if data is wrapped in { data: [...] }
      if (data && Array.isArray(data.data)) {
        data = data.data;
      }
      // Convert updateAt, createAt, deadline arrays to JS Date objects if needed, and normalize all fields
      const normalized = Array.isArray(data)
        ? data.map((item) => {
            // Helper to convert [YYYY, MM, DD, ...] to Date
            const convertArrayToDate = (arr) => {
              if (!Array.isArray(arr) || arr.length < 3) return null;
              return new Date(
                arr[0],
                arr[1] - 1,
                arr[2],
                arr[3] || 0,
                arr[4] || 0,
                arr[5] || 0,
                arr[6] || 0
              );
            };
            return {
              resultID: item.resultID ?? null,
              bookingID: item.bookingID ?? null,
              relationship: item.relationship ?? "",
              conclusion: item.conclusion ?? "",
              confidencePercentage:
                typeof item.confidencePercentage === "number"
                  ? item.confidencePercentage
                  : item.confidencePercentage
                  ? Number(item.confidencePercentage)
                  : 0,
              pdfPath: item.pdfPath ?? null,
              matchingPercentage:
                item.matchingPercentage !== undefined &&
                item.matchingPercentage !== null &&
                item.matchingPercentage !== ""
                  ? Number(item.matchingPercentage)
                  : null,
              deadline: Array.isArray(item.deadline)
                ? convertArrayToDate(item.deadline)
                : item.deadline
                ? new Date(item.deadline)
                : null,
              updateAt: Array.isArray(item.updateAt)
                ? convertArrayToDate(item.updateAt)
                : item.updateAt
                ? new Date(item.updateAt)
                : null,
              createAt: Array.isArray(item.createAt)
                ? convertArrayToDate(item.createAt)
                : item.createAt
                ? new Date(item.createAt)
                : null,
              staffID: item.staffID ?? "",
              available:
                typeof item.available === "boolean"
                  ? item.available
                  : Boolean(item.available),
            };
          })
        : [];
      setResults(normalized);
      if (normalized.length === 0) {
        toast.info("No results found for this staff member.");
      }
    } catch (error) {
      toast.error(
        "Failed to fetch results: " +
          (error.response?.data?.message || error.message)
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [staffID]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleEdit = (record) => {
    setEditingResult(record);
    form.setFieldsValue({
      relationship: record.relationship,
      conclusion: record.conclusion,
      confidencePercentage: record.confidencePercentage,
    });
    setIsModalVisible(true);
  };

  async function handleUpdateResult(values) {
    if (!editingResult) return;

    setActionLoading("update");
    try {
      const payload = {
        bookingID: editingResult.bookingID,
        relationship: values.relationship,
        conclusion: values.conclusion,
        matchingPercentage: values.matchingPercentage, // Send as number
        confidencePercentage: 99.99, // Always send 99.99
        pdfPath: editingResult.pdfPath,
        updateAt: new Date().toISOString(),
        createAt: editingResult.createAt,
        staffID: editingResult.staffID,
        available: editingResult.available,
      };

      await api.patch(
        `/staff/update-result/${editingResult.resultID}`,
        payload
      );
      // const data = response.data;

      toast.success("Result updated successfully!");
      setIsModalVisible(false);
      setEditingResult(null);
      form.resetFields();
      fetchResults();
    } catch (error) {
      toast.error(
        "Failed to update result: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setActionLoading("");
    }
  }

  async function handleSetAvailable(record) {
    setActionLoading(record.resultID);
    try {
      const payload = {
        available: 1,
      };

      await api.patch(`/staff/is-available/${record.resultID}`, payload);

      toast.success("Result marked as available!");
      fetchResults();
    } catch (error) {
      toast.error(
        "Failed to update availability: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setActionLoading("");
    }
  }

  // Split results into two groups for tabs
  const filteredResults = results
    .filter((result) => {
      // Ensure all fields are string before calling toLowerCase
      const resultIDStr =
        result.resultID !== undefined && result.resultID !== null
          ? result.resultID.toString().toLowerCase()
          : "";
      const bookingIDStr =
        result.bookingID !== undefined && result.bookingID !== null
          ? result.bookingID.toString().toLowerCase()
          : "";
      const customerNameStr =
        typeof result.customerName === "string"
          ? result.customerName.toLowerCase()
          : "";
      const relationshipStr =
        typeof result.relationship === "string"
          ? result.relationship.toLowerCase()
          : "";
      const conclusionStr =
        typeof result.conclusion === "string"
          ? result.conclusion.toLowerCase()
          : "";

      const matchesSearch =
        resultIDStr.includes(searchText.toLowerCase()) ||
        bookingIDStr.includes(searchText.toLowerCase()) ||
        customerNameStr.includes(searchText.toLowerCase()) ||
        relationshipStr.includes(searchText.toLowerCase()) ||
        conclusionStr.includes(searchText.toLowerCase());

      // Fix: filter by conclusion (Match/Not Match/Inconclusive)
      let matchesConclusion = true;
      if (
        statusFilter === "Match" ||
        statusFilter === "Not Match" ||
        statusFilter === "Inconclusive"
      ) {
        matchesConclusion = result.conclusion === statusFilter;
      }

      return matchesSearch && matchesConclusion;
    })
    .sort((a, b) => {
      const dateA = moment(a.updateAt);
      const dateB = moment(b.updateAt);
      return dateB.diff(dateA);
    });

  // Results need to be completed (not available)
  const resultsNeedToComplete = filteredResults.filter((r) => !r.available);
  // Results done (available)
  const resultsDone = filteredResults.filter((r) => r.available);

  // Columns for both tables, but remove Action column for Processed Results
  // Add Due Date column for Unprocessed Results
  const dueDateColumn = {
    title: "Due Date",
    dataIndex: "deadline",
    key: "deadline",
    render: (deadline) => {
      if (!deadline) return "N/A";
      // deadline is localDate, e.g. "2025-07-11"
      return moment(deadline).format("DD/MM/YYYY");
    },
    sorter: (a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return moment(a.deadline).unix() - moment(b.deadline).unix();
    },
  };

  const baseColumns = [
    {
      title: "Result ID",
      dataIndex: "resultID",
      width: 100,
      key: "resultID",
      sorter: (a, b) => (a.resultID || 0) - (b.resultID || 0),
    },
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      width: 110,
      key: "bookingID",
      sorter: (a, b) => (a.bookingID || 0) - (b.bookingID || 0),
    },
    {
      title: "Relationship",
      dataIndex: "relationship",
      key: "relationship",
    },
    {
      title: "Matching Percent",
      dataIndex: "matchingPercentage",
      key: "matchingPercentage",
      render: (value, record) => {
        if (typeof value !== "number" || isNaN(value)) return <span>N/A</span>;
        let color = "default";
        // Style theo relationship
        const rel = record.relationship;
        if (rel === "Father - Child" || rel === "Mother - Child") {
          color = value === 50 ? "green" : value === 0.5 ? "red" : "orange";
        } else if (rel === "Sibling - Sibling") {
          if (value === 50) color = "green";
          else if (value === 17.5) color = "orange";
          else if (value === 0.5) color = "red";
          else color = "default";
        } else if (rel === "Grandparent - Grandchild") {
          if (value === 25) color = "green";
          else if (value === 12.5) color = "orange";
          else if (value === 2.5) color = "red";
          else color = "default";
        } else {
          // fallback
          color = value >= 95 ? "green" : value < 5 ? "red" : "orange";
        }
        return <Tag color={color}>{Number(value).toFixed(2)}%</Tag>;
      },
      sorter: (a, b) =>
        (a.matchingPercentage || 0) - (b.matchingPercentage || 0),
    },
    {
      title: "Conclusion",
      dataIndex: "conclusion",
      key: "conclusion",
      render: (conclusion) => (
        <span
          style={{ maxWidth: 150, fontWeight: 700, display: "inline-block" }}>
          {conclusion}
        </span>
      ),
    },
    {
      title: "Update At",
      dataIndex: "updateAt",
      key: "updateAt",
      render: (updateAt) => {
        if (!updateAt) return "N/A";
        // If updateAt is an array, convert to date
        let date = updateAt;
        if (Array.isArray(updateAt)) {
          date = moment(updateAt).toDate();
        }
        return moment(date).format("DD/MM/YYYY HH:mm");
      },
      sorter: (a, b) => {
        if (!a.updateAt && !b.updateAt) return 0;
        if (!a.updateAt) return 1;
        if (!b.updateAt) return -1;
        return moment(a.updateAt).unix() - moment(b.updateAt).unix();
      },
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "available",
      render: (available) => (
        <Tag
          icon={available ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          color={available ? "green" : "orange"}>
          {available ? "Available" : "Unavailable"}
        </Tag>
      ),
      filters: [
        { text: "Available", value: "available" },
        { text: "Unavailable", value: "unavailable" },
      ],
      onFilter: (value, record) =>
        (value === "available" && record.available) ||
        (value === "unavailable" && !record.available),
    },
  ];

  // Action column for unprocessed results only
  const actionColumn = {
    title: "Actions",
    key: "actions",
    fixed: "right",
    align: "center",
    responsive: ["md"],
    width: 200,
    render: (_, record) => (
      <Space>
        <Button
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          size="small"
          type="default">
          Update
        </Button>
        <Popconfirm
          title={
            <>
              <span style={{ fontWeight: 600, fontSize: 16 }}>
                Are you sure?
              </span>
              <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>
                Once a result is <b style={{ color: "#52c41a" }}>available</b>,
                it cannot be edited.
              </div>
            </>
          }
          placement="top"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleSetAvailable(record)}
          disabled={
            record.available ||
            !record.relationship ||
            record.matchingPercentage === undefined ||
            record.matchingPercentage === null ||
            !record.conclusion
          }>
          <Button
            icon={<CheckCircleOutlined />}
            size="small"
            type="primary"
            style={
              record.available
                ? {
                    backgroundColor: "#fff",
                    color: "#52c41a",
                    borderColor: "#52c41a",
                  }
                : {}
            }
            disabled={
              record.available ||
              !record.relationship ||
              record.matchingPercentage === undefined ||
              record.matchingPercentage === null ||
              !record.conclusion
            }
            loading={actionLoading === record.resultID}>
            Available
          </Button>
        </Popconfirm>
      </Space>
    ),
  };

  return (
    <div style={{ padding: "0 24px" }}>
      <Title level={2} style={{ margin: 0, marginBottom: 24 }}>
        Managing Tests Result
      </Title>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        style={{ marginBottom: 24 }}
        tabBarStyle={{ marginBottom: 32 }}
        items={[
          {
            key: "need",
            label: (
              <span>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                Unprocessed Results
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
                    Results To Be Completed ({resultsNeedToComplete.length})
                  </Title>
                  <Space>
                    {/* Export PDF button ONLY for Processed Results tab */}
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={fetchResults}
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
                        placeholder="Search by Result ID, Booking ID, Customer, Relationship..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                      />
                    </Col>
                    <Col xs={24} sm={6} lg={7}>
                      <Select
                        placeholder="Filter by conclusion"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: "100%" }}
                        allowClear>
                        <Option value="">All Conclusions</Option>
                        <Option value="Match">Match</Option>
                        <Option value="Not Match">Not Match</Option>
                        <Option value="Inconclusive">Inconclusive</Option>
                      </Select>
                    </Col>
                  </Row>
                </Card>
                <Table
                  loading={loading}
                  columns={[
                    ...baseColumns.slice(0, 5),
                    dueDateColumn,
                    ...baseColumns.slice(5),
                    actionColumn,
                  ]}
                  dataSource={resultsNeedToComplete.map((item) => ({
                    ...item,
                    key: item.resultID || item.bookingID || Math.random(),
                  }))}
                  rowKey="key"
                  pagination={{
                    pageSize: pageSize,
                    current: currentPage,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} results`,
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
            key: "done",
            label: (
              <span>
                <CheckCircleOutlined style={{ marginRight: 8 }} />
                Processed Results
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
                    Completed Results ({resultsDone.length})
                  </Title>
                  <Space>
                    <Button
                      icon={<DownloadOutlined />}
                      type="default"
                      onClick={handleExportPDF}>
                      Export PDF
                    </Button>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={fetchResults}
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
                        placeholder="Search by Result ID, Booking ID, Customer, Relationship..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                      />
                    </Col>
                    <Col xs={24} sm={6} lg={7}>
                      <Select
                        placeholder="Filter by conclusion"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: "100%" }}
                        allowClear>
                        <Option value="">All Conclusions</Option>
                        <Option value="Match">Match</Option>
                        <Option value="Not Match">Not Match</Option>
                        <Option value="Inconclusive">Inconclusive</Option>
                      </Select>
                    </Col>
                  </Row>
                </Card>
                <Table
                  loading={loading}
                  columns={baseColumns}
                  dataSource={resultsDone
                    .filter((item) => {
                      if (!statusFilter) return true;
                      if (statusFilter === "Match")
                        return item.conclusion === "Match";
                      if (statusFilter === "Not Match")
                        return item.conclusion === "Not Match";
                      if (statusFilter === "Inconclusive")
                        return item.conclusion === "Inconclusive";
                      return true;
                    })
                    .map((item) => ({
                      ...item,
                      key: item.resultID || item.bookingID || Math.random(),
                    }))}
                  rowKey="key"
                  pagination={{
                    pageSize: pageSize,
                    current: currentPage,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} results`,
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
        ]}
      />

      <Modal
        title="Update Test Result"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingResult(null);
          form.resetFields();
        }}
        footer={null}
        width={700}>
        {editingResult && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateResult}
            initialValues={{
              relationship: editingResult.relationship,
              conclusion: editingResult.conclusion,
              confidencePercentage: editingResult.confidencePercentage,
            }}>
            <Descriptions
              bordered
              column={2}
              size="small"
              style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Result ID">
                {editingResult.resultID}
              </Descriptions.Item>
              <Descriptions.Item label="Booking ID">
                {editingResult.bookingID}
              </Descriptions.Item>
              <Descriptions.Item label="Current Status" span={2}>
                <Tag
                  color={editingResult.available ? "green" : "orange"}
                  icon={
                    editingResult.available ? (
                      <CheckCircleOutlined />
                    ) : (
                      <ClockCircleOutlined />
                    )
                  }>
                  {editingResult.available ? "AVAILABLE" : "UNAVAILABLE"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {/* Step 1: Chọn Relationship */}
            <Form.Item
              name="relationship"
              label="Relationship"
              rules={[
                { required: true, message: "Please enter relationship" },
              ]}>
              <Select
                placeholder="Select relationship"
                onChange={() => {
                  form.setFieldsValue({
                    matchingPercentage: undefined,
                    conclusion: undefined,
                  });
                }}>
                <Option value="Father - Child">Father - Child</Option>
                <Option value="Mother - Child">Mother - Child</Option>
                <Option value="Sibling - Sibling">Sibling - Sibling</Option>
                <Option value="Grandparent - Grandchild">
                  Grandparent - Grandchild
                </Option>
              </Select>
            </Form.Item>

            {/* Step 2: Hiển thị các selection Matching Percentage nếu đã chọn Relationship */}
            <Form.Item
              shouldUpdate={(prev, curr) =>
                prev.relationship !== curr.relationship
              }
              noStyle>
              {({ getFieldValue }) => {
                const rel = getFieldValue("relationship");
                if (!rel) return null;
                return (
                  <Form.Item
                    name="matchingPercentage"
                    label="Matching Percentage"
                    rules={[
                      {
                        required: true,
                        message: "Please select matching percentage",
                      },
                    ]}>
                    <Select
                      placeholder="Select matching percentage"
                      onChange={(val) => {
                        // Step 3: Chọn Matching Percentage, tự động set Conclusion
                        let conclusion = undefined;
                        if (
                          rel === "Father - Child" ||
                          rel === "Mother - Child"
                        ) {
                          if (val === 50) conclusion = "Match";
                          else if (val === 0.5) conclusion = "Not Match";
                        } else if (rel === "Sibling - Sibling") {
                          if (val === 50) conclusion = "Match";
                          else if (val === 17.5) conclusion = "Inconclusive";
                          else if (val === 0.5) conclusion = "Not Match";
                        } else if (rel === "Grandparent - Grandchild") {
                          if (val === 25) conclusion = "Match";
                          else if (val === 12.5) conclusion = "Inconclusive";
                          else if (val === 2.5) conclusion = "Not Match";
                        }
                        form.setFieldsValue({ conclusion });
                      }}>
                      {rel === "Father - Child" || rel === "Mother - Child" ? (
                        <>
                          <Option value={50}>50% (Biological relation)</Option>
                          <Option value={0.5}>0-1% (No relation)</Option>
                        </>
                      ) : rel === "Sibling - Sibling" ? (
                        <>
                          <Option value={50}>50% (Biological relation)</Option>
                          <Option value={17.5}>
                            10-25% (Distantly related)
                          </Option>
                          <Option value={0.5}>0-1% (No relation)</Option>
                        </>
                      ) : rel === "Grandparent - Grandchild" ? (
                        <>
                          <Option value={25}>25% (Biological relation)</Option>
                          <Option value={12.5}>
                            10-15% (Distantly related)
                          </Option>
                          <Option value={2.5}>0-5% (No relation)</Option>
                        </>
                      ) : null}
                    </Select>
                  </Form.Item>
                );
              }}
            </Form.Item>

            {/* Step 4: Hiển thị Conclusion dựa trên thông tin đã chọn */}
            <Form.Item
              shouldUpdate={(prev, curr) =>
                prev.relationship !== curr.relationship ||
                prev.matchingPercentage !== curr.matchingPercentage
              }
              noStyle>
              {({ getFieldValue }) => {
                const rel = getFieldValue("relationship");
                const match = getFieldValue("matchingPercentage");
                if (!rel || match === undefined) return null;
                let conclusionOption = null;
                if (rel === "Father - Child" || rel === "Mother - Child") {
                  if (match === 50)
                    conclusionOption = (
                      <Option value="Match">
                        <b>Match</b>
                      </Option>
                    );
                  else if (match === 0.5)
                    conclusionOption = (
                      <Option value="Not Match">
                        <b>Not Match</b>
                      </Option>
                    );
                } else if (rel === "Sibling - Sibling") {
                  if (match === 50)
                    conclusionOption = (
                      <Option value="Match">
                        <b>Match</b>
                      </Option>
                    );
                  else if (match === 17.5)
                    conclusionOption = (
                      <Option value="Inconclusive">
                        <b>Inconclusive</b>
                      </Option>
                    );
                  else if (match === 0.5)
                    conclusionOption = (
                      <Option value="Not Match">
                        <b>Not Match</b>
                      </Option>
                    );
                } else if (rel === "Grandparent - Grandchild") {
                  if (match === 25)
                    conclusionOption = (
                      <Option value="Match">
                        <b>Match</b>
                      </Option>
                    );
                  else if (match === 12.5)
                    conclusionOption = (
                      <Option value="Inconclusive">
                        <b>Inconclusive</b>
                      </Option>
                    );
                  else if (match === 2.5)
                    conclusionOption = (
                      <Option value="Not Match">
                        <b>Not Match</b>
                      </Option>
                    );
                }
                return (
                  <Form.Item
                    name="conclusion"
                    label="Conclusion"
                    rules={[
                      { required: true, message: "Please select conclusion" },
                    ]}>
                    <Select placeholder="Select conclusion" disabled>
                      {conclusionOption}
                    </Select>
                  </Form.Item>
                );
              }}
            </Form.Item>

            {/* Confidence Percentage is always 99.99, so no selection */}
            <Form.Item
              label="Confidence Percentage"
              style={{ marginBottom: 0 }}>
              <span>99.99%</span>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={actionLoading === "update"}>
                  Update Result
                </Button>
                <Button
                  onClick={() => {
                    setIsModalVisible(false);
                    setEditingResult(null);
                    form.resetFields();
                  }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default ResultManagementPage;
