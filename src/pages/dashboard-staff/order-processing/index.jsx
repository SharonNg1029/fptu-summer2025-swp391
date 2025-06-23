import React from "react";
import { useState, useEffect, useCallback } from "react";
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
  DatePicker,
  Upload,
  Row,
  Col,
  Descriptions,
} from "antd";
import {
  EditOutlined,
  UploadOutlined,
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ContainerOutlined,
  LoadingOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "../../../configs/axios"; // Import axios instance

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const OrderProcessing = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Lấy staffID từ Redux store
  const currentUser = useSelector((state) => state.user?.currentUser);
  const staffID =
    currentUser?.id || currentUser?.staffId || currentUser?.userId;

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
      setOrders(response.data || []);
    } catch (error) {
      toast.error(
        "Failed to fetch assignments: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error fetching assignments:", error);
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
      ...record,
      sampleCollectionDate: record.sampleCollectionDate
        ? moment(record.sampleCollectionDate)
        : null,
      sampleCollected: record.sampleCollected,
    });
    setIsModalVisible(true);
  };
  const handleUpdateOrder = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        sampleCollectionDate: values.sampleCollectionDate
          ? values.sampleCollectionDate.toISOString()
          : null,
        status: values.progress, // Update status based on progress
      };
      await api.patch(`/staff/updateBooking/${editingOrder.id}`, payload);

      toast.success("Booking updated successfully!");
      setIsModalVisible(false);
      setEditingOrder(null);
      form.resetFields();
      fetchOrders(); // Refresh the list
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

  const handleExportPDF = () => {
    try {
      // Check if jsPDF and autoTable are available
      if (typeof jsPDF === "undefined") {
        toast.error("PDF export library not available. Please install jsPDF.");
        return;
      }

      const doc = new jsPDF();

      // Check if autoTable plugin is available
      if (typeof doc.autoTable !== "function") {
        toast.error(
          "PDF table plugin not available. Please install jspdf-autotable."
        );
        return;
      }

      // Add title
      doc.setFontSize(18);
      doc.text("Assignment Processing Report", 14, 22);

      // Add date
      doc.setFontSize(12);
      doc.text(`Generated on: ${moment().format("DD/MM/YYYY HH:mm")}`, 14, 32);

      // Prepare table data
      const tableColumns = [
        "Order ID",
        "Customer Name",
        "Service",
        "Appointment Time",
        "Status",
        "Progress",
      ];

      const tableRows = filteredOrders.map((order) => [
        order.id || "N/A",
        order.customerName || "N/A",
        order.service || "N/A",
        order.appointmentDate
          ? moment(order.appointmentDate).format("DD/MM/YYYY HH:mm")
          : "Not scheduled",
        order.status || "N/A",
        order.progress || "N/A",
      ]);

      // Generate PDF table
      doc.autoTable({
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
      const fileName = `assignment-report-${moment().format(
        "YYYY-MM-DD-HHmm"
      )}.pdf`;
      doc.save(fileName);

      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF: " + error.message);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id?.toLowerCase().includes(searchText.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
      order.service?.toLowerCase().includes(searchText.toLowerCase()) ||
      order.progress?.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = statusFilter === "" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => (a.id || "").localeCompare(b.id || ""),
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
      title: "Appointment Time",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date) => {
        if (!date) return "Not scheduled";
        return moment(date).format("DD/MM/YYYY HH:mm");
      },
      sorter: (a, b) => {
        if (!a.appointmentDate && !b.appointmentDate) return 0;
        if (!a.appointmentDate) return 1;
        if (!b.appointmentDate) return -1;
        return (
          moment(a.appointmentDate).unix() - moment(b.appointmentDate).unix()
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "Waiting confirmed") color = "orange";
        if (status === "Booking confirmed") color = "blue";
        if (status === "Awaiting Sample") color = "cyan";
        if (status === "In Progress") color = "purple";
        if (status === "Ready") color = "geekblue";
        if (status === "Pending Payment") color = "gold";
        if (status === "Completed") color = "green";
        if (status === "Cancel") color = "red";
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
      filters: [
        { text: "Waiting confirmed", value: "Waiting confirmed" },
        { text: "Booking confirmed", value: "Booking confirmed" },
        { text: "Awaiting Sample", value: "Awaiting Sample" },
        { text: "In Progress", value: "In Progress" },
        { text: "Ready", value: "Ready" },
        { text: "Pending Payment", value: "Pending Payment" },
        { text: "Completed", value: "Completed" },
        { text: "Cancel", value: "Cancel" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress) => {
        let icon = <ClockCircleOutlined />;
        let color = "blue";
        if (progress === "Awaiting Sample") {
          icon = <ContainerOutlined />;
          color = "cyan";
        }
        if (progress === "In Progress") {
          icon = <LoadingOutlined />;
          color = "purple";
        }
        if (progress === "Ready") {
          icon = <CheckCircleOutlined />;
          color = "geekblue";
        }
        if (progress === "Completed") {
          icon = <CheckCircleOutlined />;
          color = "green";
        }
        return (
          <Tag icon={icon} color={color}>
            {progress}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
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
        {" "}
        <Title level={2} style={{ margin: 0 }}>
          Assignment Processing
        </Title>{" "}
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportPDF}
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
              placeholder="Search by Order ID, Customer, Service..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={6} lg={7}>
            {" "}
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              allowClear>
              <Option value="">All Statuses</Option>
              <Option value="Waiting confirmed">Waiting confirmed</Option>
              <Option value="Booking confirmed">Booking confirmed</Option>
              <Option value="Awaiting Sample">Awaiting Sample</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Ready">Ready</Option>
              <Option value="Pending Payment">Pending Payment</Option>
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
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} assignments`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>{" "}
      <Modal
        title="Edit Assignment Details"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingOrder(null);
          form.resetFields();
        }}
        footer={null}
        width={700}>
        {editingOrder && (
          <Form form={form} layout="vertical" onFinish={handleUpdateOrder}>
            <Descriptions
              bordered
              column={2}
              size="small"
              style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Order ID">
                {editingOrder.id}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name">
                {editingOrder.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Service" span={2}>
                {editingOrder.service}
              </Descriptions.Item>
            </Descriptions>{" "}
            <Form.Item
              name="progress"
              label="Order Progress"
              rules={[
                { required: true, message: "Please select order progress" },
              ]}>
              <Select placeholder="Select current progress">
                <Option value="Waiting confirmed">Waiting confirmed</Option>
                <Option value="Booking confirmed">Booking confirmed</Option>
                <Option value="Awaiting Sample">Awaiting Sample</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Ready">Ready</Option>
                <Option value="Pending Payment">Pending Payment</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Cancel">Cancel</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="sampleCollected"
              label="Sample Collected"
              valuePropName="checked">
              <Select>
                <Option value={true}>Yes</Option>
                <Option value={false}>No</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="sampleCollectionDate"
              label="Sample Collection Date">
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item name="testResult" label="Test Result">
              <TextArea
                rows={4}
                placeholder="Enter test results or upload a file"
              />
            </Form.Item>
            {/* Optional: File Upload for Test Results */}
            <Form.Item name="resultFile" label="Upload Test Result File">
              <Upload
                name="file"
                action="/upload.do" // Replace with your actual upload endpoint
                listType="text"
                maxCount={1}
                beforeUpload={() => false} // Prevent auto-upload
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="notes" label="Notes">
              <TextArea rows={3} placeholder="Add any relevant notes" />
            </Form.Item>{" "}
            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Booking
                </Button>
                <Button
                  onClick={() => {
                    setIsModalVisible(false);
                    setEditingOrder(null);
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

export default OrderProcessing;
