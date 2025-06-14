import React from "react";
import { useState, useEffect, useCallback } from "react";
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
  Tooltip,
  Switch,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic,
  Descriptions,
} from "antd";
import toast from "react-hot-toast";

const { Title, Text } = Typography;
const { Option } = Select;

import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HistoryOutlined,
  TeamOutlined,
  UserAddOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";

/**
 * ACCOUNT MANAGEMENT COMPONENT
 *
 * This component provides comprehensive account management functionality including:
 * - CRUD operations for user accounts
 * - Role-based access control (ADMIN, MANAGER, STAFF, CUSTOMER)
 * - Account status management (ACTIVE/INACTIVE)
 * - Advanced search and filtering
 * - Statistics dashboard
 * - Protection features for data integrity
 *
 * API ENDPOINTS:
 * - GET /admin/account - List all accounts
 * - PATCH /admin/account/{id} - Update account
 * - DELETE /admin/account/{id} - Delete account
 * - POST /admin/register - Create new account (username, password, email, phone, role, fullname)
 * - GET /admin/dashboard/customers - Get customer statistics
 */
const AccountManagement = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRecordModalVisible, setIsRecordModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingAccounts, setDeletingAccounts] = useState(new Set());
  const [accountsWithActiveOrders, setAccountsWithActiveOrders] = useState(
    new Set()
  );
  const [customerStats, setCustomerStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    customersWithOrders: 0,
  });

  // Ant Design form instance
  const [form] = Form.useForm();

  // Pagination state for Table
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  /**
   * Check if a customer account has active orders
   * This prevents deletion of accounts with pending orders
   */
  const checkActiveOrders = async (accountId) => {
    try {
      const response = await api.get(`/admin/orders/active/${accountId}`);
      return response.data?.hasActiveOrders || false;
    } catch (error) {
      console.error("Error checking active orders:", error);
      // If we can't check, assume no active orders to allow deletion
      return false;
    }
  };

  /**
   * Fetch active orders status for all customer accounts
   * This helps determine which accounts can be safely deleted
   */
  const fetchActiveOrdersStatus = useCallback(async (accountsData) => {
    try {
      const customerAccounts = accountsData.filter(
        (acc) => acc.role === "CUSTOMER"
      );
      const activeOrdersPromises = customerAccounts.map(async (account) => {
        try {
          const hasActiveOrders = await checkActiveOrders(account.id);
          return { accountId: account.id, hasActiveOrders };
        } catch (error) {
          console.error(
            `Error checking active orders for account ${account.id}:`,
            error
          );
          return { accountId: account.id, hasActiveOrders: false };
        }
      });

      const results = await Promise.all(activeOrdersPromises);
      const accountsWithOrders = new Set(
        results
          .filter((result) => result.hasActiveOrders)
          .map((result) => result.accountId)
      );
      setAccountsWithActiveOrders(accountsWithOrders);
    } catch (error) {
      console.error("Error fetching active orders status:", error);
    }
  }, []);

  /**
   * Fetch customer statistics from the dashboard API
   * Provides overview metrics for the admin dashboard
   */
  const fetchCustomerStats = useCallback(async () => {
    try {
      const response = await api.get("/admin/dashboard/customers");
      const stats = response.data?.data || response.data || {};
      setCustomerStats({
        totalCustomers: stats.totalCustomers || 0,
        activeCustomers: stats.activeCustomers || 0,
        customersWithOrders: stats.customersWithOrders || 0,
      });
    } catch (error) {
      console.error("Error fetching customer statistics:", error);
      // Don't show error toast for stats, just log it
    }
  }, []);

  /**
   * Fetch all accounts from the API
   * Main data loading function that also triggers related data fetching
   */
  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/account");
      console.log("Accounts response:", response);

      // Map API fields to UI fields
      const accountsData = (response.data?.data || response.data || []).map(
        (acc) => ({
          id: acc.accountID,
          username: acc.username,
          email: acc.email,
          phone: acc.phone,
          // Lấy role từ authorities nếu có, fallback về acc.role nếu không có
          role:
            acc.authorities && acc.authorities.length > 0
              ? acc.authorities[0].authority
              : acc.role,
          status: acc.enabled ? "ACTIVE" : "INACTIVE",
          createdAt: acc.createAt,
          // Các trường khác nếu cần
          ...acc,
        })
      );
      setAccounts(accountsData);

      // Fetch related data
      await fetchActiveOrdersStatus(accountsData);
      await fetchCustomerStats();
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error(
        "Failed to fetch accounts: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  }, [fetchActiveOrdersStatus, fetchCustomerStats]);

  // Load data on component mount
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  /**
   * Determine if an account can be safely deleted
   * Implements business rules for account deletion
   */
  const canDeleteAccount = (account) => {
    // Cannot delete if it's the last admin
    if (account.role === "ADMIN") {
      const adminCount = accounts.filter((acc) => acc.role === "ADMIN").length;
      if (adminCount <= 1) {
        return {
          canDelete: false,
          reason: "Cannot delete the last admin account",
        };
      }
    }

    // Cannot delete if currently being deleted
    if (deletingAccounts.has(account.id)) {
      return {
        canDelete: false,
        reason: "Account is currently being deleted",
      };
    }

    // Cannot delete if customer has active orders
    if (
      account.role === "CUSTOMER" &&
      accountsWithActiveOrders.has(account.id)
    ) {
      return {
        canDelete: false,
        reason: "Account has active orders that need to be completed first",
      };
    }

    return { canDelete: true, reason: null };
  };

  /**
   * Refresh all data - helper function for consistent data reloading
   */
  const refreshAllData = useCallback(async () => {
    await fetchAccounts();
  }, [fetchAccounts]);

  /**
   * Handle account editing
   * Populates the form with existing account data
   */
  const handleEdit = (record) => {
    setEditingAccount(record);
    form.setFieldsValue({
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      role: record.role,
      status: record.status === "ACTIVE",
      // Không set password khi edit
    });
    setIsModalVisible(true);
  };

  /**
   * Handle account deletion with comprehensive validation
   * Implements business rules and provides user feedback
   */
  const handleDelete = async (id) => {
    try {
      const accountToDelete = accounts.find((acc) => acc.id === id);

      // Validation: Prevent deletion of the last admin account
      if (accountToDelete && accountToDelete.role === "ADMIN") {
        const adminCount = accounts.filter(
          (acc) => acc.role === "ADMIN"
        ).length;
        if (adminCount <= 1) {
          toast.error("Cannot delete the last admin account");
          return;
        }
      }

      // Check if customer account has active orders
      if (accountToDelete && accountToDelete.role === "CUSTOMER") {
        const hasActiveOrders = await checkActiveOrders(id);
        if (hasActiveOrders) {
          toast.error(
            `Cannot delete account "${accountToDelete.username}": Account has active orders that need to be completed first`
          );
          return;
        }
      }

      // Track deletion status for UI feedback
      setDeletingAccounts((prev) => new Set(prev).add(id));

      // Make API call to delete account
      await api.delete(`/admin/account/${id}`);

      toast.success(
        `Account "${accountToDelete?.username || id}" deleted successfully`
      );

      // Clean up active orders tracking
      if (accountToDelete && accountToDelete.role === "CUSTOMER") {
        setAccountsWithActiveOrders((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }

      // Refresh data
      await refreshAllData();
    } catch (error) {
      console.error("Error deleting account:", error);

      // Enhanced error handling with specific messages
      let errorMessage = "Failed to delete account";
      if (error.response?.status === 403) {
        errorMessage = "You don't have permission to delete this account";
      } else if (error.response?.status === 404) {
        errorMessage = "Account not found or already deleted";
      } else if (error.response?.status === 409) {
        errorMessage = "Cannot delete account: Account has associated data";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = `Failed to delete account: ${error.message}`;
      }

      toast.error(errorMessage);
    } finally {
      // Remove from deletion tracking
      setDeletingAccounts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  /**
   * Handle account status toggle (Active/Inactive)
   * Updates account status via API
   */
  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await api.put(`/admin/account/${id}/status`, { status: newStatus });
      toast.success(
        `Account ${
          newStatus === "ACTIVE" ? "activated" : "deactivated"
        } successfully`
      );
      refreshAllData();
    } catch (error) {
      console.error("Error updating account status:", error);
      toast.error(
        "Failed to update account status: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  /**
   * Handle form submission for create/update operations
   * Uses Ant Design form validation and API calls
   */
  const handleFormSubmit = async (values) => {
    try {
      if (editingAccount) {
        // Update existing account
        const accountData = {
          fullName: values.fullName?.trim(),
          email: values.email?.trim(),
          phone: values.phone?.trim(),
          role: values.role,
          enabled: values.status, // Sửa lại đúng tên trường backend
        };

        // Include password only if provided
        if (values.password && values.password.trim()) {
          accountData.password = values.password.trim();
        }

        await api.patch(`/admin/account/${editingAccount.id}`, accountData);
        toast.success("Account updated successfully");
      } else {
        // Create new account with all required fields
        const accountData = {
          username: values.username?.trim(),
          password: values.password?.trim(),
          email: values.email?.trim(),
          phone: values.phone?.trim(),
          role: values.role,
          fullname: values.fullName?.trim(), // Note: API expects 'fullname' not 'fullName'
        };

        await api.post("/admin/register", accountData);
        toast.success("Account created successfully");
      }

      // Close modal and reset form
      setIsModalVisible(false);
      form.resetFields();
      setEditingAccount(null);

      // Refresh data
      await refreshAllData();
    } catch (error) {
      console.error("Error saving account:", error);

      // Enhanced error messages
      let errorMessage = "Failed to save account";
      if (error.response?.status === 409) {
        errorMessage = "Account with this email or username already exists";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid account data provided";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    }
  };

  /**
   * Filter accounts based on search criteria
   * Supports searching by multiple fields and filtering by role/status
   */
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      account.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      account.phone?.includes(searchText) ||
      account.fullName?.toLowerCase().includes(searchText.toLowerCase());

    const matchesRole =
      roleFilter === "" || roleFilter === "All" || account.role === roleFilter;
    const matchesStatus =
      statusFilter === "" || account.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  /**
   * Calculate statistics for dashboard cards
   * Combines API data with local calculations
   */
  const stats = {
    total: accounts.length,
    active: accounts.filter((acc) => acc.status === "ACTIVE").length,
    inactive: accounts.filter((acc) => acc.status === "INACTIVE").length,
    // Sửa lại customers và staff lấy từ API nếu có, fallback local
    customers:
      customerStats.totalCustomers ||
      accounts.filter((acc) => acc.role === "CUSTOMER").length,
    staff: accounts.filter((acc) =>
      ["STAFF", "MANAGER", "ADMIN"].includes(acc.role)
    ).length,
    customersWithActiveOrders: accountsWithActiveOrders.size,
    // Use API data if available, fallback to local calculation
    totalCustomersFromAPI:
      customerStats.totalCustomers ||
      accounts.filter((acc) => acc.role === "CUSTOMER").length,
    activeCustomersFromAPI:
      customerStats.activeCustomers ||
      accounts.filter(
        (acc) => acc.role === "CUSTOMER" && acc.status === "ACTIVE"
      ).length,
  };

  /**
   * Table column configuration
   * Defines how data is displayed in the accounts table
   */
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: 70,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <Space>
          <MailOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => (
        <Space>
          <PhoneOutlined />
          {text || "N/A"}
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const colors = {
          ADMIN: "red",
          MANAGER: "purple",
          STAFF: "green",
          CUSTOMER: "blue",
        };
        return <Tag color={colors[role] || "blue"}>{role}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const color = status === "ACTIVE" ? "green" : "red";
        const hasActiveOrders =
          record.role === "CUSTOMER" && accountsWithActiveOrders.has(record.id);

        return (
          <Space direction="vertical" size="small">
            <Tag color={color}>{status}</Tag>
            {hasActiveOrders && (
              <Tag color="orange" icon="📋">
                Has Active Orders
              </Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          {/* Edit Button */}
          <Tooltip title="Edit Account">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          {/* Status Toggle Button */}
          <Tooltip
            title={record.status === "ACTIVE" ? "Deactivate" : "Activate"}>
            <Button
              type={record.status === "ACTIVE" ? "default" : "primary"}
              icon={
                record.status === "ACTIVE" ? (
                  <LockOutlined />
                ) : (
                  <UnlockOutlined />
                )
              }
              size="small"
              onClick={() => handleStatusToggle(record.id, record.status)}
            />
          </Tooltip>

          {/* Customer Records Button */}
          {record.role === "CUSTOMER" && (
            <Tooltip title="View Records">
              <Button
                type="default"
                icon={<HistoryOutlined />}
                size="small"
                onClick={() => {
                  setSelectedUser(record);
                  setIsRecordModalVisible(true);
                }}
              />
            </Tooltip>
          )}

          {/* Delete Button with Confirmation */}
          <Popconfirm
            title={
              <div>
                <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                  Delete Account Confirmation
                </div>
                <div style={{ fontSize: "14px" }}>
                  Are you sure you want to delete this account?
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginTop: 4 }}>
                  <strong>Username:</strong> {record.username}
                  <br />
                  <strong>Role:</strong> {record.role}
                  <br />
                  {record.role === "CUSTOMER" && (
                    <div style={{ color: "#faad14", marginTop: 4 }}>
                      <strong>⚠️ Warning:</strong> System will check for active
                      orders before deletion.
                    </div>
                  )}
                  <span
                    style={{
                      color: "#ff4d4f",
                      marginTop: 4,
                      display: "block",
                    }}>
                    This action cannot be undone.
                  </span>
                </div>
              </div>
            }
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, size: "small" }}
            cancelButtonProps={{ size: "small" }}
            placement="left"
            icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}>
            <Tooltip
              title={
                !canDeleteAccount(record).canDelete
                  ? canDeleteAccount(record).reason
                  : "Delete Account"
              }>
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                loading={deletingAccounts.has(record.id)}
                disabled={!canDeleteAccount(record).canDelete}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 24px" }}>
      {/* Header Section */}
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
          Account Management
        </Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={refreshAllData}
            loading={loading}>
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            size="large"
            onClick={() => {
              setEditingAccount(null);
              form.resetFields();
              setIsModalVisible(true);
            }}>
            Create New Account
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Accounts"
              value={stats.total}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Accounts"
              value={stats.active}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Customers"
              value={stats.customers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Staff Members"
              value={stats.staff}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Customers With Active Orders"
              value={stats.customersWithActiveOrders}
              prefix="📋"
              valueStyle={{ color: "#fa8c16" }}
              suffix={`/ ${stats.customers}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Inactive Accounts"
              value={stats.inactive}
              prefix={<LockOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{ backgroundColor: "#f6ffed", border: "1px solid #b7eb8f" }}>
            <Statistic
              title="Protection Status"
              value="Active"
              prefix="🛡️"
              valueStyle={{ color: "#389e0d" }}
              formatter={() => (
                <div style={{ fontSize: "14px" }}>
                  <div style={{ fontWeight: "bold", color: "#389e0d" }}>
                    Orders Protected
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Accounts with active orders cannot be deleted
                  </div>
                </div>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Filter Section */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={10}>
            <Input
              placeholder="Search by name, email, phone, username..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={6} lg={7}>
            <Select
              placeholder="Filter by role"
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: "100%" }}
              allowClear>
              <Option value="All">All Roles</Option>
              <Option value="ADMIN">Admin</Option>
              <Option value="MANAGER">Manager</Option>
              <Option value="STAFF">Staff</Option>
              <Option value="CUSTOMER">Customer</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6} lg={7}>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              allowClear>
              <Option value="ACTIVE">Active</Option>
              <Option value="INACTIVE">Inactive</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Accounts Table */}
      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredAccounts}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} accounts`,
            pageSizeOptions: [10, 20, 50, 100],
          }}
          onChange={(paginationConfig) => {
            setPagination({
              current: paginationConfig.current,
              pageSize: paginationConfig.pageSize,
            });
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit Account Modal */}
      <Modal
        title={editingAccount ? "Edit Account" : "Create New Account"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingAccount(null);
        }}
        footer={null}
        width={700}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{ status: true }}>
          {/* Full Name and Username Row (Username only for new accounts) */}
          <Row gutter={16}>
            <Col span={editingAccount ? 24 : 12}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={
                  editingAccount
                    ? []
                    : [
                        { required: true, message: "Please enter full name" },
                        {
                          min: 2,
                          message: "Full name must be at least 2 characters",
                        },
                      ]
                }>
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter full name"
                />
              </Form.Item>
            </Col>
            {!editingAccount && (
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    { required: true, message: "Please enter username" },
                    {
                      min: 3,
                      message: "Username must be at least 3 characters",
                    },
                    {
                      pattern: /^[a-zA-Z0-9_]+$/,
                      message:
                        "Username can only contain letters, numbers, and underscores",
                    },
                  ]}>
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter username"
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          {/* Editing Account Info Display */}
          {editingAccount && (
            <div
              style={{
                marginBottom: 16,
                padding: 16,
                backgroundColor: "#f0f2f5",
                borderRadius: 6,
              }}>
              <Text strong>Editing Account: </Text>
              <Text>
                {editingAccount.username}
                {editingAccount.fullName ? ` (${editingAccount.fullName})` : ""}
              </Text>
            </div>
          )}

          {/* Email and Phone Row */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter email" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}>
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter email address"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter phone number" },
                  {
                    pattern: /^\d{10,11}$/,
                    message: "Please enter a valid phone number (10-11 digits)",
                  },
                ]}>
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Enter phone number"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Password Field */}
          <Form.Item
            name="password"
            label={editingAccount ? "New Password (Optional)" : "Password"}
            rules={
              editingAccount
                ? [
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                  ]
                : [
                    { required: true, message: "Please enter password" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                  ]
            }
            help={
              editingAccount
                ? "Leave empty to keep current password"
                : undefined
            }>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={
                editingAccount
                  ? "Enter new password (optional)"
                  : "Enter password"
              }
            />
          </Form.Item>

          {/* Role and Status Row */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select a role" }]}>
                <Select placeholder="Select user role">
                  <Option value="ADMIN">Admin</Option>
                  <Option value="MANAGER">Manager</Option>
                  <Option value="STAFF">Staff</Option>
                  <Option value="CUSTOMER">Customer</Option>
                </Select>
              </Form.Item>
            </Col>
            {/* Only show status toggle when editing an account */}
            {editingAccount && (
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Account Status"
                  valuePropName="checked">
                  <Switch
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          {/* Form Actions */}
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space>
              <Button type="primary" htmlType="submit" size="large">
                {editingAccount ? "Update Account" : "Create Account"}
              </Button>
              <Button
                size="large"
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                  setEditingAccount(null);
                }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Customer Record Details Modal */}
      <Modal
        title="Customer Record Details"
        open={isRecordModalVisible}
        onCancel={() => {
          setIsRecordModalVisible(false);
          setSelectedUser(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsRecordModalVisible(false);
              setSelectedUser(null);
            }}>
            Close
          </Button>,
        ]}
        width={800}>
        {selectedUser && (
          <Descriptions title="Customer Information" bordered column={2}>
            <Descriptions.Item label="Customer ID">
              CUST{selectedUser.id.toString().padStart(3, "0")}
            </Descriptions.Item>
            <Descriptions.Item label="Full Name">
              {selectedUser.fullName || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selectedUser.phone || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Total Tests">
              {selectedUser.totalTests || 0}
            </Descriptions.Item>
            <Descriptions.Item label="Total Spent">
              ${(selectedUser.totalSpent || 0).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Last Login">
              {selectedUser.lastLogin || "Never"}
            </Descriptions.Item>
            <Descriptions.Item label="Account Created">
              {selectedUser.createdAt
                ? new Date(selectedUser.createdAt).toLocaleDateString()
                : "N/A"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default AccountManagement;
