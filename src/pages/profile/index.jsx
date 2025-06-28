import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import api from "../../configs/axios";
import { updateUser } from "../../redux/features/userSlice";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.currentUser);

  // Logic để lấy userID và userRole không đổi
  let userID = null;
  let userRole = null;
  if (currentUser) {
    userRole =
      currentUser.role ||
      currentUser?.customer?.role ||
      currentUser?.staff?.role ||
      currentUser?.manager?.role ||
      currentUser?.admin?.role;
    if (userRole === "customer") {
      userID =
        currentUser?.customer?.customerID ||
        currentUser?.customerID ||
        currentUser?.customer?.customerId ||
        currentUser?.customerId;
    } else if (userRole === "staff") {
      userID =
        currentUser?.staff?.staffID ||
        currentUser?.staffID ||
        currentUser?.staff?.staffId ||
        currentUser?.staffId;
    } else if (userRole === "manager") {
      userID =
        currentUser?.manager?.managerID ||
        currentUser?.managerID ||
        currentUser?.manager?.managerId ||
        currentUser?.managerId;
    } else if (userRole === "admin") {
      userID =
        currentUser?.admin?.adminID ||
        currentUser?.adminID ||
        currentUser?.admin?.adminId ||
        currentUser?.adminId;
    }
    if (!userID) {
      userID =
        currentUser?.customerID ||
        currentUser?.customerId ||
        currentUser?.staffID ||
        currentUser?.staffId ||
        currentUser?.managerID ||
        currentUser?.managerId ||
        currentUser?.adminID ||
        currentUser?.adminId;
    }
  }
  if (!userID && currentUser) {
    setTimeout(() => {
      toast.error(
        "Can not find User ID in your account. Please sign in again or contact support."
      );
    }, 100);
  }

  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userID) {
        setError("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        let apiPath = `/customer/my-info/${userID}`;
        if (userRole === "staff") apiPath = `/staff/my-info/${userID}`;
        if (userRole === "manager") apiPath = `/manager/my-info/${userID}`;
        if (userRole === "admin") apiPath = `/admin/my-info/${userID}`;

        const response = await api.get(apiPath);
        const profile = response.data.data || response.data[0] || response.data;

        setUserProfile(profile);
        setEditForm({
          fullName: profile.fullName || "",
          dob: profile.dob
            ? new Date(profile.dob).toISOString().split("T")[0]
            : "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
          gender: profile.gender || "",
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load profile data.");
        toast.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userID, userRole]);

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!userID) return;

    setSaving(true);
    setError(null);
    try {
      // API path để cập nhật nên được xác định theo vai trò
      let updatePath = `/customer/${userID}`;
      if (userRole === "staff") updatePath = `/staff/${userID}`;
      if (userRole === "manager") updatePath = `/manager/${userID}`;
      if (userRole === "admin") updatePath = `/admin/${userID}`;

      const response = await api.patch(updatePath, editForm);
      const updatedProfile = response.data.data || response.data;

      setUserProfile(updatedProfile);
      dispatch(updateUser({ ...currentUser, ...updatedProfile })); // Cập nhật redux state
      setIsEditing(false);
      setSuccess(true);
      toast.success("Profile updated successfully!");

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update profile.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      fullName: userProfile?.fullName || "",
      dob: userProfile?.dob
        ? new Date(userProfile.dob).toISOString().split("T")[0]
        : "",
      email: userProfile?.email || "",
      phone: userProfile?.phone || "",
      address: userProfile?.address || "",
      gender: userProfile?.gender || "",
    });
    setIsEditing(false);
    setError(null);
  };

  // --- Render Components ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="text-lg font-medium text-gray-700">
            Loading Your Profile...
          </span>
        </div>
      </div>
    );
  }

  if (error && !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Oops! Something Went Wrong
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const ProfileHeader = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-200">
      <div
        className="p-8 relative"
        style={{
          background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
        }}>
        <div className="relative flex flex-col sm:flex-row items-center sm:space-x-6">
          <div className="relative mb-4 sm:mb-0">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-blue-200">
              <User className="h-12 w-12 text-blue-800" />
            </div>
            <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full shadow-lg transition-transform duration-200 hover:scale-110 hover:bg-blue-700 border-2 border-white">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="text-white text-center sm:text-left">
            <h1 className="text-3xl font-bold mb-1">
              {userProfile?.fullName || "User Profile"}
            </h1>
            <div className="flex flex-wrap justify-center sm:justify-start items-center space-x-4 text-blue-100">
              <div className="flex items-center space-x-1.5">
                <Shield className="h-4 w-4" />
                <span className="capitalize">
                  {userProfile?.role || "Customer"}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="h-4 w-4" />
                <span>
                  Member since{" "}
                  {new Date(userProfile?.createdAt || Date.now()).getFullYear()}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-auto">
            <button
              onClick={isEditing ? handleCancelEdit : () => setIsEditing(true)}
              disabled={saving}
              className={`px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-300 flex items-center space-x-2 disabled:opacity-60 ${
                isEditing
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-white text-blue-700 hover:bg-gray-100 hover:shadow-xl transform hover:-translate-y-0.5"
              }`}>
              {isEditing ? (
                <X className="h-5 w-5" />
              ) : (
                <Edit3 className="h-5 w-5" />
              )}
              <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const FormInput = ({
    id,
    label,
    value,
    onChange,
    type = "text",
    placeholder,
  }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-600 mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={placeholder}
      />
    </div>
  );

  const FormSelect = ({ id, label, value, onChange, children }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-600 mb-2">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
        {children}
      </select>
    </div>
  );

  const FormTextarea = ({
    id,
    label,
    value,
    onChange,
    placeholder,
    rows = 3,
  }) => (
    <div className="md:col-span-2">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-600 mb-2">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg transition-all duration-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={placeholder}
      />
    </div>
  );

  const DisplayField = ({ label, value, icon: Icon }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-2">
        {label}
      </label>
      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center space-x-3 border border-gray-200">
        {Icon && <Icon className="h-5 w-5 text-blue-700 flex-shrink-0" />}
        <span className="truncate">{value || "Not provided"}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-10">
        {/* --- Messages --- */}
        {success && (
          <div className="fixed top-5 right-5 z-50 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slideIn">
            <CheckCircle className="h-5 w-5" />
            <span>Profile updated successfully!</span>
          </div>
        )}
        {error && (
          <div className="fixed top-5 right-5 z-50 bg-red-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          <ProfileHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- Main Information Card --- */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                <User className="h-6 w-6 text-blue-800" />
                <span>Personal Information</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  <>
                    <FormInput
                      id="fullName"
                      label="Full Name"
                      value={editForm.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      placeholder="Enter full name"
                    />
                    <FormInput
                      id="dob"
                      label="Date of Birth"
                      type="date"
                      value={editForm.dob}
                      onChange={(e) => handleInputChange("dob", e.target.value)}
                    />
                    <FormInput
                      id="email"
                      label="Email Address"
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter email"
                    />
                    <FormInput
                      id="phone"
                      label="Phone Number"
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Enter phone"
                    />
                    <FormSelect
                      id="gender"
                      label="Gender"
                      value={editForm.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }>
                      <option value="">Select gender</option>
                      <option value={1}>Male</option>
                      <option value={2}>Female</option>
                    </FormSelect>
                    <FormTextarea
                      id="address"
                      label="Address"
                      value={editForm.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="Enter address"
                    />
                  </>
                ) : (
                  <>
                    <DisplayField
                      label="Full Name"
                      value={userProfile?.fullName}
                    />
                    <DisplayField
                      label="Date of Birth"
                      value={
                        userProfile?.dob
                          ? new Date(userProfile.dob).toLocaleDateString()
                          : "Not provided"
                      }
                      icon={Calendar}
                    />
                    <DisplayField
                      label="Email Address"
                      value={userProfile?.email}
                      icon={Mail}
                    />
                    <DisplayField
                      label="Phone Number"
                      value={userProfile?.phone}
                      icon={Phone}
                    />
                    <DisplayField
                      label="Gender"
                      value={
                        userProfile?.gender === 1
                          ? "Male"
                          : userProfile?.gender === 2
                          ? "Female"
                          : "Not provided"
                      }
                    />
                    <div className="md:col-span-2">
                      <DisplayField
                        label="Address"
                        value={userProfile?.address}
                        icon={MapPin}
                      />
                    </div>
                  </>
                )}
              </div>
              {isEditing && (
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold transition-all duration-200 hover:bg-gray-100 disabled:opacity-50">
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-2.5 text-white rounded-lg font-semibold transition-all duration-300 shadow-md flex items-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                    }}>
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* --- Sidebar Cards --- */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Account Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Role</span>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-semibold capitalize text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                      }}>
                      {userProfile?.role || "Customer"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">
                      Member Since
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {new Date(
                        userProfile?.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 text-gray-700 font-medium hover:bg-gray-100 hover:text-blue-800">
                    <Shield className="h-5 w-5 text-blue-700" />
                    <span>Change Password</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 text-gray-700 font-medium hover:bg-gray-100 hover:text-blue-800">
                    <Mail className="h-5 w-5 text-blue-700" />
                    <span>Email Preferences</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 text-gray-700 font-medium hover:bg-gray-100 hover:text-blue-800">
                    <User className="h-5 w-5 text-blue-700" />
                    <span>Privacy Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
            `}</style>
    </div>
  );
};

export default ProfilePage;
