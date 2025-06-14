// Description: Inventory Management Dashboard for Admins
import React from "react";
import { useState, useEffect } from "react";
import {
  Tabs,
  Table,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Tag,
  Typography,
  Progress,
  Alert,
  Modal,
  Form,
  InputNumber,
  Upload,
  Tooltip,
  Descriptions,
  Divider,
} from "antd";
import {
  InboxOutlined,
  PlusOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  HistoryOutlined,
  BarChartOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  SaveOutlined,
  DeleteOutlined,
  UploadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Dragger } = Upload;
const { TabPane } = Tabs;

const Inventory = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Inventory data
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [inventoryStats, setInventoryStats] = useState({
    totalKits: 0,
    availableKits: 0,
    lowStockKits: 0,
    outOfStockKits: 0,
  });

  // Search and filter states
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateRange, setDateRange] = useState(null);

  // Modal states
  const [isAddStockModalVisible, setIsAddStockModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isTransactionDetailModalVisible, setIsTransactionDetailModalVisible] =
    useState(false);
  const [selectedKit, setSelectedKit] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Form states
  const [form] = Form.useForm();

  // Fetch inventory data
  const fetchInventory = async () => {
    try {
      setLoading(true);
      // Sử dụng API mới lấy tất cả kit
      const response = await api.get("/admin/kitInventory/all");
      const inventoryData = response.data?.data || response.data || [];
      setInventory(inventoryData);

      // Tính toán lại stats dựa trên các trường mới
      const totalKits = inventoryData.reduce(
        (sum, kit) => sum + (kit.quantity || 0),
        0
      );
      // Đếm tổng số kit sold từ tất cả các kit
      const totalKitSold = inventoryData.reduce(
        (sum, kit) => sum + (kit.isSelled || 0),
        0
      );
      const availableKits = inventoryData.filter(
        (kit) => kit.available === true
      ).length;
      const lowStockKits = inventoryData.filter(
        (kit) => kit.available === true && (kit.quantity || 0) <= 10
      ).length;
      const outOfStockKits = inventoryData.filter(
        (kit) => kit.available === false || (kit.quantity || 0) === 0
      ).length;

      setInventoryStats({
        totalKits,
        totalKitSold, // thêm trường này để hiển thị
        availableKits,
        lowStockKits,
        outOfStockKits,
      });
    } catch (error) {
      toast.error(
        "Failed to fetch inventory: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions data
  const fetchTransactions = async () => {
    try {
      const response = await api.get("/admin/inventory/transactions");
      console.log("Transactions response:", response);

      const transactionsData = response.data?.data || response.data || [];
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error(
        "Failed to fetch transactions: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Fetch data
  useEffect(() => {
    fetchInventory();
    fetchTransactions();
  }, []);

  // Handle add stock
  const handleAddStock = async (values) => {
    try {
      await api.post(`/admin/inventory/${selectedKit.id}/add-stock`, {
        quantity: values.quantity,
        notes: values.notes,
      });

      toast.success(`Added ${values.quantity} units to ${selectedKit.name}`);
      setIsAddStockModalVisible(false);
      form.resetFields();
      setSelectedKit(null);
      fetchInventory(); // Refresh the list
      fetchTransactions(); // Refresh transactions
    } catch (error) {
      console.error("Error adding stock:", error);
      toast.error(
        "Failed to add stock: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Handle single item form submission
  const handleSingleSubmit = async (values) => {
    try {
      setLoading(true);
      const kitData = {
        name: values.name,
        isAvailable: values.isAvailable,
        quantity: values.quantity,
        unitPrice: values.unitPrice,
        location: values.location,
        supplier: values.supplier,
        expiryDate: values.expiryDate?.format("YYYY-MM-DD") || null,
        batchNumber: values.batchNumber,
        notes: values.notes,
      };

      await api.post("/admin/inventory", kitData);
      toast.success("Inventory item added successfully!");
      form.resetFields();
      fetchInventory(); // Refresh the list
      fetchTransactions(); // Refresh transactions
    } catch (error) {
      console.error("Error adding inventory item:", error);
      toast.error(
        "Failed to add inventory item: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter functions
  const filteredInventory = inventory.filter((kit) => {
    const matchesSearch =
      kit.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      kit.code?.toLowerCase().includes(searchText.toLowerCase()) ||
      kit.id?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
      kit.supplier?.toLowerCase().includes(searchText.toLowerCase());

    const matchesName = statusFilter === "" || kit.name === statusFilter;

    return matchesSearch && matchesName;
  });

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.kitCode?.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.kitName?.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.id?.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.performedBy?.toLowerCase().includes(searchText.toLowerCase());

    const matchesType = typeFilter === "" || transaction.type === typeFilter;

    const matchesDateRange =
      !dateRange ||
      !dateRange[0] ||
      !dateRange[1] ||
      (new Date(transaction.date) >= dateRange[0].startOf("day").toDate() &&
        new Date(transaction.date) <= dateRange[1].endOf("day").toDate());

    return matchesSearch && matchesType && matchesDateRange;
  });

  // Table columns
  const inventoryColumns = [
    {
      title: "Kit ID",
      dataIndex: "kitID",
      key: "kitID",
      sorter: (a, b) =>
        (a.kitID || "").toString().localeCompare((b.kitID || "").toString()),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "available",
      render: (available) => (
        <Tag color={available ? "green" : "red"}>
          {available ? "Available" : "Unavailable"}
        </Tag>
      ),
      filters: [
        { text: "Available", value: true },
        { text: "Unavailable", value: false },
      ],
      onFilter: (value, record) => record.available === value,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => quantity || 0,
      sorter: (a, b) => (a.quantity || 0) - (b.quantity || 0),
    },
    {
      title: "Kit Sold",
      dataIndex: "isSelled",
      key: "isSelled",
      render: (isSelled) => <span>{isSelled || 0}</span>,
    },
    // Actions column removed
  ];

  // Kit Transactions columns (đã chỉnh sửa cho hợp lý)
  const transactionColumns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionID",
      key: "transactionID",
      sorter: (a, b) =>
        (a.transactionID || "").localeCompare(b.transactionID || ""),
    },
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      key: "bookingID",
      sorter: (a, b) => (a.bookingID || "").localeCompare(b.bookingID || ""),
    },
    {
      title: "Kit ID",
      dataIndex: "kitID",
      key: "kitID",
      sorter: (a, b) =>
        (a.kitID || "").toString().localeCompare((b.kitID || "").toString()),
    },
    {
      title: "Kit Sold",
      dataIndex: "isSelled",
      key: "isSelled",
      render: (isSelled) => (
        <Tag color={isSelled === 1 ? "green" : "red"}>
          {isSelled === 1 ? "Sold" : "Not Sold"}
        </Tag>
      ),
    },
    // Actions column removed
  ];

  // Calculate transaction stats
  const transactionStats = {
    totalTransactions: transactions.length,
    stockIn: transactions.filter((t) => t.type === "Stock In").length,
    stockOut: transactions.filter((t) => t.type === "Stock Out").length,
    transfers: transactions.filter((t) => t.type === "Transfer").length,
    adjustments: transactions.filter((t) => t.type === "Adjustment").length,
    totalValue: transactions.reduce(
      (sum, t) => sum + Math.abs(t.totalValue || 0),
      0
    ),
  };

  // Derived: Low stock kit names
  const lowStockKitNames = inventory
    .filter((kit) => kit.available === true && (kit.quantity || 0) <= 10)
    .map((kit) => kit.name)
    .filter(Boolean);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}>
        <Title level={2}>Test Kit Inventory Management</Title>
        <Space>
          <Button icon={<FileExcelOutlined />}>Export</Button>
          <Button icon={<PrinterOutlined />}>Print</Button>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => {
              fetchInventory();
              fetchTransactions();
            }}
            loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      {/* Alerts */}
      {inventoryStats.lowStockKits > 0 && (
        <Alert
          message="Low Stock Alert"
          description={`${inventoryStats.lowStockKits} kit types are running low on stock. Please restock soon.`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" type="primary">
              View Details
            </Button>
          }
        />
      )}

      {inventoryStats.outOfStockKits > 0 && (
        <Alert
          message="Out of Stock Alert"
          description={`${inventoryStats.outOfStockKits} kit types are out of stock. Please restock immediately.`}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" danger>
              View Details
            </Button>
          }
        />
      )}

      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        {/* Stock Overview Tab */}
        <TabPane
          tab={
            <span>
              <InboxOutlined />
              Stock Overview
            </span>
          }
          key="overview">
          {/* Stats Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Total Kits"
                  value={inventoryStats.totalKits}
                  prefix={<InboxOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Kit Sold"
                  value={inventoryStats.totalKitSold}
                  prefix={<BarChartOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Low Stock Items"
                  value={
                    lowStockKitNames.length > 0
                      ? lowStockKitNames.join(", ")
                      : "None"
                  }
                  prefix={<WarningOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} lg={8}>
                <Input
                  placeholder="Search by name, code, ID..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={6} lg={4}>
                <Select
                  placeholder="Filter by kit name"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: "100%" }}
                  allowClear>
                  <Option value="PowerPlex Fusion">PowerPlex Fusion</Option>
                  <Option value="Global Filer">Global Filer</Option>
                </Select>
              </Col>
            </Row>
          </Card>

          {/* Inventory Table */}
          <Card>
            <Table
              loading={loading}
              columns={inventoryColumns}
              dataSource={filteredInventory}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              expandable={{
                expandedRowRender: (record) => (
                  <div>
                    <Row gutter={[16, 16]}>
                      <Col span={8}>
                        <Text strong>Unit Price:</Text> $
                        {(record.unitPrice || 0).toFixed(2)}
                      </Col>
                      <Col span={8}>
                        <Text strong>Location:</Text> {record.location || "N/A"}
                      </Col>
                      <Col span={8}>
                        <Text strong>Supplier:</Text> {record.supplier || "N/A"}
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
                      <Col span={8}>
                        <Text strong>Last Restocked:</Text>{" "}
                        {record.lastRestocked || "N/A"}
                      </Col>
                      <Col span={8}>
                        <Text strong>Expiry Date:</Text>{" "}
                        {record.expiryDate || "N/A"}
                      </Col>
                      <Col span={8}>
                        <Text strong>Batch Number:</Text>{" "}
                        {record.batchNumber || "N/A"}
                      </Col>
                    </Row>
                  </div>
                ),
              }}
            />
          </Card>
        </TabPane>

        {/* Add Inventory Tab */}
        <TabPane
          tab={
            <span>
              <PlusOutlined />
              Add Inventory
            </span>
          }
          key="add">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}>
            <Title level={3}>Add Inventory</Title>
          </div>

          {/* Single Item Form */}
          <Card title="Add Single Inventory Item">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSingleSubmit}
              initialValues={{ quantity: 1 }}>
              <Form.Item
                name="name"
                label="Kit Name"
                rules={[{ required: true, message: "Please select kit name" }]}>
                <Select placeholder="Select kit name">
                  <Option value="PowerPlex Fusion">PowerPlex Fusion</Option>
                  <Option value="Global Filer">Global Filer</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: "Please enter quantity" }]}>
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}>
                  Add Inventory Item
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* Kit Transactions Tab */}
        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              Kit Transactions
            </span>
          }
          key="transactions">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}>
            <Title level={3}>Kit Transactions</Title>
            <Space>
              <Button icon={<DownloadOutlined />}>Export</Button>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchTransactions}
                loading={loading}>
                Refresh
              </Button>
            </Space>
          </div>

          {/* Transaction Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Total Transactions"
                  value={transactionStats.totalTransactions}
                  prefix={<HistoryOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Stock In"
                  value={transactionStats.stockIn}
                  prefix={<ArrowUpOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Stock Out"
                  value={transactionStats.stockOut}
                  prefix={<ArrowDownOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Transaction Filters */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8}>
                <Input
                  placeholder="Search transactions..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={6}>
                <Select
                  placeholder="Filter by type"
                  value={typeFilter}
                  onChange={setTypeFilter}
                  style={{ width: "100%" }}
                  allowClear>
                  <Option value="Stock In">Stock In</Option>
                  <Option value="Stock Out">Stock Out</Option>
                  <Option value="Transfer">Transfer</Option>
                  <Option value="Adjustment">Adjustment</Option>
                </Select>
              </Col>
              <Col xs={24} sm={10}>
                <RangePicker
                  style={{ width: "100%" }}
                  onChange={(dates) => setDateRange(dates)}
                  placeholder={["Start Date", "End Date"]}
                />
              </Col>
            </Row>
          </Card>

          {/* Transactions Table */}
          <Card>
            <Table
              loading={loading}
              columns={transactionColumns}
              dataSource={filteredTransactions}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} transactions`,
              }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Add Stock Modal */}
      <Modal
        title="Add Stock"
        open={isAddStockModalVisible}
        onCancel={() => {
          setIsAddStockModalVisible(false);
          form.resetFields();
          setSelectedKit(null);
        }}
        footer={null}>
        {selectedKit && (
          <Form form={form} layout="vertical" onFinish={handleAddStock}>
            <Form.Item label="Kit Information">
              <Card size="small">
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Text strong>ID:</Text> {selectedKit.id}
                  </Col>
                  <Col span={12}>
                    <Text strong>Code:</Text> {selectedKit.code}
                  </Col>
                  <Col span={24}>
                    <Text strong>Name:</Text> {selectedKit.name}
                  </Col>
                  <Col span={12}>
                    <Text strong>Current Stock:</Text>{" "}
                    {selectedKit.quantity || 0}
                  </Col>
                  <Col span={12}>
                    <Text strong>Threshold:</Text> {selectedKit.threshold || 0}
                  </Col>
                </Row>
              </Card>
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Quantity to Add"
              rules={[
                { required: true, message: "Please enter quantity" },
                {
                  type: "number",
                  min: 1,
                  message: "Quantity must be at least 1",
                },
              ]}>
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="notes" label="Notes">
              <TextArea
                rows={3}
                placeholder="Optional notes about this stock addition"
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Add Stock
                </Button>
                <Button
                  onClick={() => {
                    setIsAddStockModalVisible(false);
                    form.resetFields();
                    setSelectedKit(null);
                  }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Kit Details Modal */}
      <Modal
        title="Kit Details"
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedKit(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsDetailModalVisible(false);
              setSelectedKit(null);
            }}>
            Close
          </Button>,
        ]}
        width={700}>
        {selectedKit && (
          <Descriptions title="Kit Information" bordered column={2}>
            <Descriptions.Item label="Kit ID">
              {selectedKit.id}
            </Descriptions.Item>
            <Descriptions.Item label="Kit Code">
              {selectedKit.code}
            </Descriptions.Item>
            <Descriptions.Item label="Kit Name" span={2}>
              {selectedKit.name}
            </Descriptions.Item>
            <Descriptions.Item label="Current Quantity">
              {selectedKit.quantity || 0}
            </Descriptions.Item>
            <Descriptions.Item label="Threshold">
              {selectedKit.threshold || 0}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedKit.status === "In Stock" ||
                  (selectedKit.quantity || 0) > (selectedKit.threshold || 0)
                    ? "green"
                    : selectedKit.status === "Low Stock" ||
                      (selectedKit.quantity || 0) <=
                        (selectedKit.threshold || 0)
                    ? "orange"
                    : "red"
                }>
                {selectedKit.status ||
                  ((selectedKit.quantity || 0) === 0
                    ? "Out of Stock"
                    : (selectedKit.quantity || 0) <=
                      (selectedKit.threshold || 0)
                    ? "Low Stock"
                    : "In Stock")}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Unit Price">
              ${(selectedKit.unitPrice || 0).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Total Value">
              $
              {(
                (selectedKit.quantity || 0) * (selectedKit.unitPrice || 0)
              ).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {selectedKit.location || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Supplier">
              {selectedKit.supplier || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Batch Number">
              {selectedKit.batchNumber || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Last Restocked">
              {selectedKit.lastRestocked || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Expiry Date">
              {selectedKit.expiryDate || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Transaction Details Modal */}
      <Modal
        title="Transaction Details"
        open={isTransactionDetailModalVisible}
        onCancel={() => {
          setIsTransactionDetailModalVisible(false);
          setSelectedTransaction(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsTransactionDetailModalVisible(false);
              setSelectedTransaction(null);
            }}>
            Close
          </Button>,
        ]}
        width={700}>
        {selectedTransaction && (
          <Descriptions title="Transaction Information" bordered column={2}>
            <Descriptions.Item label="Transaction ID">
              {selectedTransaction.id}
            </Descriptions.Item>
            <Descriptions.Item label="Date & Time">
              {selectedTransaction.date
                ? new Date(selectedTransaction.date).toLocaleString()
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag
                color={
                  selectedTransaction.type === "Stock In"
                    ? "green"
                    : selectedTransaction.type === "Stock Out"
                    ? "red"
                    : selectedTransaction.type === "Transfer"
                    ? "purple"
                    : "orange"
                }>
                {selectedTransaction.type}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedTransaction.status === "Completed"
                    ? "green"
                    : "orange"
                }>
                {selectedTransaction.status || "Completed"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Kit Code">
              {selectedTransaction.kitCode}
            </Descriptions.Item>
            <Descriptions.Item label="Kit Name">
              {selectedTransaction.kitName}
            </Descriptions.Item>
            <Descriptions.Item label="Quantity">
              {selectedTransaction.quantity || 0}
            </Descriptions.Item>
            <Descriptions.Item label="Unit Price">
              ${(selectedTransaction.unitPrice || 0).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Total Value">
              ${(selectedTransaction.totalValue || 0).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Performed By">
              {selectedTransaction.performedBy || "N/A"}
            </Descriptions.Item>

            {selectedTransaction.location && (
              <Descriptions.Item label="Location">
                {selectedTransaction.location}
              </Descriptions.Item>
            )}
            {selectedTransaction.fromLocation && (
              <Descriptions.Item label="From Location">
                {selectedTransaction.fromLocation}
              </Descriptions.Item>
            )}
            {selectedTransaction.toLocation && (
              <Descriptions.Item label="To Location">
                {selectedTransaction.toLocation}
              </Descriptions.Item>
            )}
            {selectedTransaction.supplier && (
              <Descriptions.Item label="Supplier">
                {selectedTransaction.supplier}
              </Descriptions.Item>
            )}
            {selectedTransaction.batchNumber && (
              <Descriptions.Item label="Batch Number">
                {selectedTransaction.batchNumber}
              </Descriptions.Item>
            )}
            {selectedTransaction.orderNumber && (
              <Descriptions.Item label="Order Number">
                {selectedTransaction.orderNumber}
              </Descriptions.Item>
            )}
            {selectedTransaction.customerName && (
              <Descriptions.Item label="Customer">
                {selectedTransaction.customerName}
              </Descriptions.Item>
            )}
            {selectedTransaction.reason && (
              <Descriptions.Item label="Reason">
                {selectedTransaction.reason}
              </Descriptions.Item>
            )}
            {selectedTransaction.notes && (
              <Descriptions.Item label="Notes" span={2}>
                {selectedTransaction.notes}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Inventory;
