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

const ProfilePage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.currentUser);
  // Lấy userID phù hợp theo role, bổ sung fallback và log chi tiết
  let userID = null;
  let userRole = null;
  if (currentUser) {
    console.log("[ProfilePage] currentUser:", currentUser);
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
    // Fallback: lấy bất kỳ ID nào có thể nếu role không xác định
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
      alert(
        "Can not find User ID in your account. Please sign in again or contact support.\nCheck console for details."
      );
    }, 100);
    console.warn("Can not find valid userID for role:", userRole, currentUser);
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

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userID) {
        setError("User ID not found");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Đường dẫn API tùy theo role
        let apiPath = "/customer/my-info/" + userID;
        if (userRole === "staff") apiPath = "/staff/my-info/" + userID;
        if (userRole === "manager") apiPath = "/manager/my-info/" + userID;
        if (userRole === "admin") apiPath = "/admin/my-info/" + userID;
        const response = await api.get(apiPath);
        console.log("API Response:", response.data); // Debug log
        let profile;
        if (Array.isArray(response.data)) {
          profile = response.data[0];
        } else {
          profile = response.data.data || response.data;
        }
        console.log("Processed profile:", profile); // Debug log
        setUserProfile(profile);
        setEditForm({
          fullName: profile.fullName || "",
          dob: profile.dob || "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
          gender: profile.gender || "",
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userID, userRole]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    if (!userID) return;

    try {
      setSaving(true);
      setError(null);

      const response = await api.patch(`/customer/${userID}`, editForm);

      // Xử lý response tương tự như fetch
      let updatedProfile;
      if (Array.isArray(response.data)) {
        updatedProfile = response.data[0];
      } else {
        updatedProfile = response.data.data || response.data;
      }

      setUserProfile(updatedProfile);
      dispatch(updateUser(updatedProfile));
      setIsEditing(false);
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditForm({
      fullName: userProfile?.fullName || "",
      dob: userProfile?.dob || "",
      email: userProfile?.email || "",
      phone: userProfile?.phone || "",
      address: userProfile?.address || "",
      gender: userProfile?.gender || "",
    });
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error && !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        {success && (
          <div
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transform transition-all duration-300 ease-out"
            style={{
              animation: "slideIn 0.3s ease-out",
            }}>
            <CheckCircle className="h-5 w-5" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div
              className="px-8 py-12 relative"
              style={{
                background:
                  "linear-gradient(135deg, #0b5dc8 0%, #003266 50%, #004290 100%)",
              }}>
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <User
                        className="h-12 w-12"
                        style={{ color: "#0b5dc8" }}
                      />
                    </div>
                    <button
                      className="absolute -bottom-2 -right-2 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      style={{ backgroundColor: "#2c6dfc" }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#0b5dc8")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#2c6dfc")
                      }>
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-white">
                    <h1 className="text-3xl font-bold mb-2">
                      {userProfile?.fullName ||
                        userProfile?.username ||
                        "User Profile"}
                    </h1>
                    <div className="flex items-center space-x-4 text-blue-100">
                      <div className="flex items-center space-x-1">
                        <Shield className="h-4 w-4" />
                        <span className="capitalize">
                          {userProfile?.role || "Customer"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          Member since{" "}
                          {new Date(
                            userProfile?.createdAt ||
                              userProfile?.createAt ||
                              Date.now()
                          ).getFullYear()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={saving}
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 hover:bg-gray-50 hover:shadow-xl transform hover:-translate-y-0.5">
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

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                  <User className="h-6 w-6" style={{ color: "#0b5dc8" }} />
                  <span>Personal Information</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.fullName || ""}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{
                          focusRingColor: "#0b5dc8",
                          "--tw-ring-color": "#0b5dc8",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#0b5dc8";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(11, 93, 200, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.boxShadow = "none";
                        }}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                        {userProfile?.fullName || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.dob || ""}
                        onChange={(e) =>
                          handleInputChange("dob", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent"
                        onFocus={(e) => {
                          e.target.style.borderColor = "#0b5dc8";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(11, 93, 200, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.boxShadow = "none";
                        }}
                        placeholder="Enter your date of birth"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                        {userProfile?.dob || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent"
                        onFocus={(e) => {
                          e.target.style.borderColor = "#0b5dc8";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(11, 93, 200, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.boxShadow = "none";
                        }}
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 flex items-center space-x-2">
                        <Mail
                          className="h-4 w-4"
                          style={{ color: "#0b5dc8" }}
                        />
                        <span>{userProfile?.email || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone || ""}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent"
                        onFocus={(e) => {
                          e.target.style.borderColor = "#0b5dc8";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(11, 93, 200, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.boxShadow = "none";
                        }}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 flex items-center space-x-2">
                        <Phone
                          className="h-4 w-4"
                          style={{ color: "#0b5dc8" }}
                        />
                        <span>{userProfile?.phone || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        value={editForm.gender || ""}
                        onChange={(e) =>
                          handleInputChange("gender", Number(e.target.value))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent"
                        onFocus={(e) => {
                          e.target.style.borderColor = "#0b5dc8";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(11, 93, 200, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.boxShadow = "none";
                        }}>
                        <option value="">Select gender</option>
                        <option value={1}>Male</option>
                        <option value={2}>Female</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                        {userProfile?.gender === 1
                          ? "Male"
                          : userProfile?.gender === 2
                          ? "Female"
                          : "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editForm.address || ""}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 resize-none focus:outline-none focus:ring-2 focus:border-transparent"
                        onFocus={(e) => {
                          e.target.style.borderColor = "#0b5dc8";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(11, 93, 200, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.boxShadow = "none";
                        }}
                        placeholder="Enter your address"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 flex items-start space-x-2">
                        <MapPin
                          className="h-4 w-4 mt-1 flex-shrink-0"
                          style={{ color: "#0b5dc8" }}
                        />
                        <span>{userProfile?.address || "Not provided"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Save/Cancel Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 hover:bg-gray-50 transform hover:-translate-y-0.5">
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-3 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center space-x-2 disabled:opacity-50 transform hover:-translate-y-0.5"
                      style={{
                        background:
                          "linear-gradient(135deg, #0b5dc8 0%, #2c6dfc 100%)",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background =
                          "linear-gradient(135deg, #003266 0%, #004290 100%)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background =
                          "linear-gradient(135deg, #0b5dc8 0%, #2c6dfc 100%)";
                      }}>
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-6">
              {/* Account Status */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Account Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Role</span>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-semibold capitalize text-white"
                      style={{ backgroundColor: "#0b5dc8" }}>
                      {userProfile?.role || "Customer"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="text-gray-800 font-medium flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(
                          userProfile?.createdAt ||
                            userProfile?.createAt ||
                            Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 hover:bg-gray-50 transform hover:-translate-y-0.5">
                    <Shield className="h-5 w-5" style={{ color: "#0b5dc8" }} />
                    <span className="text-gray-700">Change Password</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 hover:bg-gray-50 transform hover:-translate-y-0.5">
                    <Mail className="h-5 w-5" style={{ color: "#0b5dc8" }} />
                    <span className="text-gray-700">Email Preferences</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 hover:bg-gray-50 transform hover:-translate-y-0.5">
                    <User className="h-5 w-5" style={{ color: "#0b5dc8" }} />
                    <span className="text-gray-700">Privacy Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
