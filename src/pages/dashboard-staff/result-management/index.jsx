import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Card } from "antd";
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
} from "@ant-design/icons";
import moment from "moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../../configs/axios";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ResultManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState("");

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
      // Convert updateAt and createAt arrays to JS Date objects if needed
      const normalized = Array.isArray(data)
        ? data.map((item) => {
            // Helper to convert [YYYY, MM, DD, HH, mm, ss, ms] to Date
            const convertArrayToDate = (arr) => {
              if (!Array.isArray(arr) || arr.length < 6) return arr;
              // Month in JS Date is 0-based
              return new Date(
                arr[0],
                arr[1] - 1,
                arr[2],
                arr[3],
                arr[4],
                arr[5],
                arr[6] || 0
              );
            };
            return {
              ...item,
              updateAt: Array.isArray(item.updateAt)
                ? convertArrayToDate(item.updateAt)
                : item.updateAt,
              createAt: Array.isArray(item.createAt)
                ? convertArrayToDate(item.createAt)
                : item.createAt,
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
        bookingID: record.bookingID,
        relationship: record.relationship,
        conclusion: record.conclusion,
        confidencePercentage: 99.99, // Always set to 99.99 when marking available
        pdfPath: record.pdfPath,
        updateAt: new Date().toISOString(),
        createAt: record.createAt,
        staffID: record.staffID,
        available: true,
      };

      await api.patch(`/staff/update-result/${record.resultID}`, payload);

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

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text("Test Results Report", 14, 22);

      // Add date
      doc.setFontSize(12);
      doc.text(`Generated on: ${moment().format("DD/MM/YYYY HH:mm")}`, 14, 32);

      // Prepare table data
      const tableColumns = [
        "Result ID",
        "Booking ID",
        "Customer Name",
        "Service",
        "Relationship",
        "Conclusion",
        "Confidence %",
        "Available",
        "Update Date",
      ];

      const tableRows = filteredResults.map((result) => [
        result.resultID || "N/A",
        result.bookingID?.toString() || "N/A",
        result.customerName || "N/A",
        result.service || "N/A",
        result.relationship || "N/A",
        result.conclusion || "N/A",
        result.confidencePercentage?.toFixed(2) + "%" || "N/A",
        result.available ? "Yes" : "No",
        result.updateAt
          ? moment(result.updateAt).format("DD/MM/YYYY HH:mm")
          : "N/A",
      ]);

      // Generate PDF table using autoTable
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

      // Save the PDF
      const fileName = `test-results-report-${moment().format(
        "YYYY-MM-DD-HHmm"
      )}.pdf`;
      doc.save(fileName);

      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF: " + error.message);
    }
  };

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

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "available" && result.available) ||
        (statusFilter === "unavailable" && !result.available);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = moment(a.updateAt);
      const dateB = moment(b.updateAt);
      return dateB.diff(dateA);
    });

  const columns = [
    {
      title: "Result ID",
      dataIndex: "resultID",
      key: "resultID",
      sorter: (a, b) => (a.resultID || 0) - (b.resultID || 0),
    },
    {
      title: "Booking ID",
      dataIndex: "bookingID",
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
        if (value === undefined || value === null) return <span>N/A</span>;
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
        return <Tag color={color}>{value.toFixed(2)}%</Tag>;
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
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      align: "center",
      responsive: ["md"],
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
            type="primary">
            Update
          </Button>
          <Button
            icon={<CheckCircleOutlined />}
            onClick={() => handleSetAvailable(record)}
            size="small"
            type="default"
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
              !record.conclusion ||
              (record.confidencePercentage !== 99.99 &&
                record.confidencePercentage !== 0.01)
            }
            loading={actionLoading === record.resultID}>
            Available
          </Button>
        </Space>
      ),
    },
  ];

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
          Managing Tests Result
        </Title>
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportPDF}
            type="default">
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
              placeholder="Filter by availability"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              allowClear>
              <Option value="">All Results</Option>
              <Option value="available">Available</Option>
              <Option value="unavailable">Unavailable</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredResults.map((item) => ({
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
      </Card>

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
