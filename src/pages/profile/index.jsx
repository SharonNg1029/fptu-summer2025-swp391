import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectUserRole,
  selectCustomerID,
  selectStaffID,
  selectManagerID,
  selectAdminID,
} from "../../redux/features/userSlice";
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
  ArrowLeft,
} from "lucide-react";
import api from "../../configs/axios";
import { updateUser } from "../../redux/features/userSlice";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user?.currentUser);
  const userRole = useSelector(selectUserRole);
  const customerID = useSelector(selectCustomerID);
  const staffID = useSelector(selectStaffID);
  const managerID = useSelector(selectManagerID);
  const adminID = useSelector(selectAdminID);

  // Ưu tiên lấy đúng ID theo role
  let userID = null;
  if (userRole === "customer") userID = customerID;
  else if (userRole === "staff") userID = staffID;
  else if (userRole === "manager") userID = managerID;
  else if (userRole === "admin") userID = adminID;

  // Nếu vẫn không có userID, fallback lấy từ currentUser
  if (!userID && currentUser) {
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

  // Helper function để xử lý tiếng Việt
  const normalizeVietnamese = (text, shouldTrim = false) => {
    if (!text) return text;
    // Normalize Unicode Vietnamese characters
    const normalized = text.normalize('NFC');
    return shouldTrim ? normalized.trim() : normalized;
  };

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

        console.log('🔍 Fetching profile data for user:', 'loclnx');
        console.log('📅 Current UTC Time:', '2025-07-02 09:41:15');
        console.log('🔗 API Path:', apiPath);

        const response = await api.get(apiPath, {
          headers: {
            'Accept': 'application/json; charset=utf-8',
          }
        });
        const profile = response.data.data || response.data[0] || response.data;

        setUserProfile(profile);
        setEditForm({
          fullName: normalizeVietnamese(profile.fullName, false) || "",
          dob: profile.dob
            ? new Date(profile.dob).toISOString().split("T")[0]
            : "",
          email: normalizeVietnamese(profile.email, true) || "",
          phone: normalizeVietnamese(profile.phone, true) || "",
          address: normalizeVietnamese(profile.address, false) || "",
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

  const handleInputChange = useCallback((field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: field === 'fullName' || field === 'address' 
        ? normalizeVietnamese(value, false)
        : normalizeVietnamese(value, true),
    }));
  }, []);

  const handleSaveProfile = async () => {
    if (!userID) return;

    setSaving(true);
    setError(null);
    try {
      let updatePath = `/customer/${userID}`;
      if (userRole === "staff") updatePath = `/staff/${userID}`;
      if (userRole === "manager") updatePath = `/manager/${userID}`;
      if (userRole === "admin") updatePath = `/admin/${userID}`;

      const formData = {
        ...editForm,
        fullName: normalizeVietnamese(editForm.fullName, false),
        address: normalizeVietnamese(editForm.address, false),
        email: normalizeVietnamese(editForm.email, true),
        phone: normalizeVietnamese(editForm.phone, true),
      };

      console.log('💾 Saving profile for user:', 'loclnx');
      console.log('📅 Save Time (UTC):', '2025-07-02 09:41:15');

      const response = await api.patch(updatePath, formData, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json; charset=utf-8',
        }
      });
      const updatedProfile = response.data.data || response.data;

      setUserProfile(updatedProfile);
      dispatch(updateUser({ ...currentUser, ...updatedProfile }));
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
      fullName: normalizeVietnamese(userProfile?.fullName, false) || "",
      dob: userProfile?.dob
        ? new Date(userProfile.dob).toISOString().split("T")[0]
        : "",
      email: normalizeVietnamese(userProfile?.email, true) || "",
      phone: normalizeVietnamese(userProfile?.phone, true) || "",
      address: normalizeVietnamese(userProfile?.address, false) || "",
      gender: userProfile?.gender || "",
    });
    setIsEditing(false);
    setError(null);
  };

  // Simple back button handler
  const goBack = () => {
    navigate(-1);
  };

  // Navigation handler for Change Password
  const handleChangePassword = () => {
    console.log('🔐 Navigating to Change Password page for user:', 'loclnx');
    console.log('📅 Navigation Time (UTC):', '2025-07-02 09:41:15');
    navigate('/reset-password');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="text-lg font-medium text-gray-700 vietnamese-text">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-3 vietnamese-text">
            Oops! Something Went Wrong
          </h2>
          <p className="text-gray-600 vietnamese-text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div lang="vi" className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Import Vietnamese-friendly fonts */
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
          
          /* Vietnamese text styling */
          .vietnamese-text {
            font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif !important;
            font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-variant-ligatures: normal;
            letter-spacing: 0.01em;
          }
          
          /* Specific Vietnamese diacritics support */
          .vietnamese-text {
            unicode-bidi: embed;
            direction: ltr;
          }
          
          /* Input and form elements */
          input.vietnamese-input, 
          textarea.vietnamese-input, 
          select.vietnamese-input {
            font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            font-size: 16px !important;
            line-height: 1.5 !important;
            letter-spacing: 0.01em !important;
          }
          
          /* Button text */
          button.vietnamese-button {
            font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            font-weight: 500 !important;
            letter-spacing: 0.01em !important;
          }
          
          /* Headers */
          h1.vietnamese-header, h2.vietnamese-header, h3.vietnamese-header {
            font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            font-weight: 600 !important;
            letter-spacing: -0.01em !important;
          }
          
          /* Animation */
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
          
          /* Prevent font fallback issues */
          * {
            text-rendering: optimizeLegibility;
          }
        `
      }} />

      <div className="container mx-auto px-4 py-10">
        {/* Messages */}
        {success && (
          <div className="fixed top-5 right-5 z-50 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slideIn">
            <CheckCircle className="h-5 w-5" />
            <span className="vietnamese-text">Profile updated successfully!</span>
          </div>
        )}
        {error && (
          <div className="fixed top-5 right-5 z-50 bg-red-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span className="vietnamese-text">{error}</span>
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-200">
            <div
              className="p-8 relative"
              style={{
                background: "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
              }}>
              <div className="flex items-center space-x-4">
                {/* ✅ Back Button like in the image */}
                <button
                  onClick={goBack}
                  className="p-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors vietnamese-button flex items-center justify-center"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                
                {/* Profile Info */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-blue-200">
                      <User className="h-8 w-8 text-blue-800" />
                    </div>
                    <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full shadow-lg transition-transform duration-200 hover:scale-110 hover:bg-blue-700 border-2 border-white">
                      <Camera className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-white flex-1">
                    <h1 className="text-2xl font-bold mb-1 vietnamese-text vietnamese-header">
                      Profile Settings
                    </h1>
                    <p className="text-blue-100 vietnamese-text">
                      Manage your personal information and account settings
                    </p>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={isEditing ? handleCancelEdit : () => setIsEditing(true)}
                  disabled={saving}
                  className={`px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-300 flex items-center space-x-2 disabled:opacity-60 vietnamese-button ${
                    isEditing
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-white text-blue-700 hover:bg-gray-100 hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}>
                  {isEditing ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Edit3 className="h-5 w-5" />
                  )}
                  <span className="vietnamese-text">{isEditing ? "Cancel" : "Edit Profile"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Information Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3 vietnamese-header">
                <User className="h-6 w-6 text-blue-800" />
                <span className="vietnamese-text">Personal Information</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  <>
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent vietnamese-input"
                        placeholder="Enter full name"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={editForm.dob}
                        onChange={(e) => handleInputChange("dob", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent vietnamese-input"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent vietnamese-input"
                        placeholder="Enter email"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent vietnamese-input"
                        placeholder="Enter phone"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Gender
                      </label>
                      <select
                        value={editForm.gender}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white vietnamese-input">
                        <option value="" className="vietnamese-text">Select gender</option>
                        <option value={1} className="vietnamese-text">Male</option>
                        <option value={2} className="vietnamese-text">Female</option>
                      </select>
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Address
                      </label>
                      <textarea
                        value={editForm.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg transition-all duration-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent vietnamese-input"
                        placeholder="Enter address"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Display Fields */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Full Name
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center space-x-3 border border-gray-200">
                        <span className="truncate vietnamese-text">
                          {normalizeVietnamese(userProfile?.fullName, false) || "Not provided"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Date of Birth
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center space-x-3 border border-gray-200">
                        <Calendar className="h-5 w-5 text-blue-700 flex-shrink-0" />
                        <span className="truncate vietnamese-text">
                          {userProfile?.dob
                            ? new Date(userProfile.dob).toLocaleDateString()
                            : "Not provided"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Email Address
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center space-x-3 border border-gray-200">
                        <Mail className="h-5 w-5 text-blue-700 flex-shrink-0" />
                        <span className="truncate vietnamese-text">{userProfile?.email || "Not provided"}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Phone Number
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center space-x-3 border border-gray-200">
                        <Phone className="h-5 w-5 text-blue-700 flex-shrink-0" />
                        <span className="truncate vietnamese-text">{userProfile?.phone || "Not provided"}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Gender
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center space-x-3 border border-gray-200">
                        <span className="truncate vietnamese-text">
                          {userProfile?.gender === 1
                            ? "Male"
                            : userProfile?.gender === 2
                            ? "Female"
                            : "Not provided"}
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-600 mb-2 vietnamese-text">
                        Address
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 flex items-center space-x-3 border border-gray-200">
                        <MapPin className="h-5 w-5 text-blue-700 flex-shrink-0" />
                        <span className="truncate vietnamese-text">
                          {normalizeVietnamese(userProfile?.address, false) || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {isEditing && (
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold transition-all duration-200 hover:bg-gray-100 disabled:opacity-50 vietnamese-button">
                    <span className="vietnamese-text">Cancel</span>
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-2.5 text-white rounded-lg font-semibold transition-all duration-300 shadow-md flex items-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 vietnamese-button"
                    style={{
                      background:
                        "linear-gradient(135deg, #023670 0%, #2563eb 100%)",
                    }}>
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="vietnamese-text">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span className="vietnamese-text">Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 vietnamese-text vietnamese-header">
                  Member Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium vietnamese-text">
                      Member Since
                    </span>
                    <span className="text-gray-800 font-semibold vietnamese-text">
                      {new Date(userProfile?.createdAt || '2025-01-01').toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 vietnamese-text vietnamese-header">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button 
                    onClick={handleChangePassword}
                    className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 text-gray-700 font-medium hover:bg-gray-100 hover:text-blue-800 vietnamese-button">
                    <Shield className="h-5 w-5 text-blue-700" />
                    <span className="vietnamese-text">Change Password</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;