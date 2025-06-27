import { useState, useEffect } from "react";
import { FiMenu, FiX, FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LogOut from "../authen-form/LogOut";
import { toast } from "react-toastify";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  
  const location = useLocation();
  

  const userState = useSelector((state) => state.user);
  const user = userState?.currentUser;
  const isAuthenticated = userState?.isAuthenticated;

  const userDisplayName =
    user?.fullName ||
    user?.name ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "User";

  const navItems = [
    { id: 1, label: "Home", href: "/" },
    {
      id: 2,
      label: "Services",
      href: "/services",
      hasDropdown: true,
      dropdownItems: [
        { id: 21, label: "Non-Legal DNA Testing", href: "/services/non-legal" },
        { id: 22, label: "Legal DNA Testing", href: "/services/legal" },
      ],
    },
    { id: 3, label: "Guide", href: "/guide" },
    { id: 4, label: "Pricing", href: "/pricing" },
    { id: 5, label: "Blog", href: "/blog" },
    { id: 6, label: "Contact", href: "/contact" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  let hoverTimeout;

  const handleServicesMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setShowServicesDropdown(true);
  };

  const handleServicesMouseLeave = () => {
    hoverTimeout = setTimeout(() => {
      setShowServicesDropdown(false);
    }, 150);
  };

  const handleServicesClick = () => {
    setShowServicesDropdown(false);
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const isActivePage = (href) => {
    const currentPath = location.pathname;
    if (href === "/") return currentPath === "/";
    if (href === "/services") return currentPath.startsWith("/services");
    return currentPath === href;
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, []);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  const getLinkStyles = (href) => {
    const isActive = isActivePage(href);
    return {
      fontSize: "1.125rem",
      fontWeight: "500",
      textTransform: "capitalize",
      whiteSpace: "nowrap",
      textDecoration: "none",
      padding: "8px 12px",
      margin: "0 8px",
      color: isActive ? "#023670" : isDarkMode ? "#ffffff" : "#1f2937",
      transition: "color 0.2s ease-in-out",
      borderRadius: "4px",
      backgroundColor: isActive ? "#e0f2fe" : "transparent",
      display: "inline-block",
      position: "relative",
    };
  };

  const getMobileLinkStyles = (href) => {
    const isActive = isActivePage(href);
    return {
      backgroundColor: isActive ? "#023670" : "transparent",
      color: isActive ? "#ffffff" : "",
      textDecoration: "none",
    };
  };

  // Callback khi logout thành công/lỗi/hủy
  const handleLogoutSuccess = () => {

    setShowLogoutConfirm(false);
    setShowDropdown(false);
    setIsOpen(false);
    // Không dispatch(logout()) ở đây vì LogOut đã clearUser và chuyển trang rồi
  };
  const handleLogoutError = (error) => {
    setShowLogoutConfirm(false);
    setShowDropdown(false);
    setIsOpen(false);
    // Có thể hiện thông báo lỗi ở đây nếu muốn
  };
  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  // Để scroll top khi click nav
  const handleLinkClick = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 shadow-md ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        }`}>
        <div className="px-4">
          <div className="flex items-center h-16">
            {/* Logo */}
            <div className="w-1/3 flex justify-start">
              <Link to="/" onClick={handleLinkClick}>
                <img
                  src="./images/logo.png"
                  alt="Logo"
                  className="h-12 w-auto cursor-pointer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/32";
                  }}
                />
              </Link>
            </div>

            {/* Navigation */}
            <nav className="w-1/3 hidden md:flex justify-center">
              <div
                className="flex items-center"
                style={{ marginRight: "8px", gap: "35px" }}>
                {navItems.map((item) => {
                  if (item.hasDropdown) {
                    const isActive = isActivePage(item.href);
                    return (
                      <div
                        key={item.id}
                        className="relative services-dropdown"
                        onMouseEnter={handleServicesMouseEnter}
                        onMouseLeave={handleServicesMouseLeave}
                        style={{ margin: "0 8px" }}>
                        <Link
                          to={item.href}
                          onClick={handleServicesClick}
                          style={{ ...getLinkStyles(item.href), margin: "0" }}
                          className="nav-link"
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.target.style.color = "#3b82f6";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = isActive
                              ? "#023670"
                              : isDarkMode
                              ? "#ffffff"
                              : "#1f2937";
                          }}>
                          {item.label}
                        </Link>

                        {showServicesDropdown && (
                          <div
                            className="absolute top-full left-0 pt-2 w-64 z-50"
                            onMouseEnter={handleServicesMouseEnter}
                            onMouseLeave={handleServicesMouseLeave}>
                            <div className="relative">
                              <div
                                className="absolute left-4 -top-2 w-0 h-0"
                                style={{
                                  borderLeft: "9px solid transparent",
                                  borderRight: "9px solid transparent",
                                  borderBottom: `9px solid ${
                                    isDarkMode ? "#6b7280" : "#d1d5db"
                                  }`,
                                  zIndex: 1,
                                }}
                              />
                              <div
                                className="absolute left-4 -top-1 w-0 h-0"
                                style={{
                                  borderLeft: "8px solid transparent",
                                  borderRight: "8px solid transparent",
                                  borderBottom: `8px solid ${
                                    isDarkMode ? "#374151" : "#ffffff"
                                  }`,
                                  zIndex: 2,
                                  marginLeft: "1px",
                                }}
                              />
                              <div
                                className="rounded-md shadow-lg py-2 bg-white dark:bg-gray-800"
                                style={{
                                  border: `2px solid ${
                                    isDarkMode ? "#6b7280" : "#d1d5db"
                                  }`,
                                }}>
                                {item.dropdownItems.map((dropdownItem) => {
                                  const isDropdownActive =
                                    location.pathname === dropdownItem.href;
                                  return (
                                    <Link
                                      key={dropdownItem.id}
                                      to={dropdownItem.href}
                                      className={`block px-4 py-3 text-sm transition-colors duration-200 ${
                                        isDropdownActive
                                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                      }`}
                                      style={{ textDecoration: "none" }}
                                      onClick={() => {
                                        setShowServicesDropdown(false);
                                        if (hoverTimeout)
                                          clearTimeout(hoverTimeout);
                                        handleLinkClick();
                                      }}>
                                      <div className="font-medium">
                                        {dropdownItem.label}
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      className="nav-link"
                      data-nav={item.label.toLowerCase()}
                      onClick={handleLinkClick}
                      style={getLinkStyles(item.href)}
                      onMouseEnter={(e) => {
                        if (!isActivePage(item.href)) {
                          e.target.style.color = "#3b82f6";
                        }
                      }}
                      onMouseLeave={(e) => {
                        const isActive = isActivePage(item.href);
                        e.target.style.color = isActive
                          ? "#023670"
                          : isDarkMode
                          ? "#ffffff"
                          : "#1f2937";
                      }}>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Buttons */}
            <div className="w-1/3 flex items-center justify-end space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label={
                  isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }>
                {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {user && isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity duration-200">
                    <img
                      src={
                        user?.avatar ||
                        "https://i.pinimg.com/1200x/59/95/a7/5995a77843eb9f5752a0004b1c1250fb.jpg"
                      }
                      alt={userDisplayName}
                      className="h-12 w-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/48x48/6B7280/FFFFFF?text=U";
                      }}
                    />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                        <div className="font-medium text-gray-700 dark:text-gray-200">
                          {userDisplayName}
                        </div>
                        {user?.email && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {user.email}
                          </div>
                        )}
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        style={{ textDecoration: "none" }}
                        onClick={() => {
                          setShowDropdown(false);
                          handleLinkClick();
                        }}>
                        Profile
                      </Link>
                      {/* Nút logout đổi thành mở confirm */}
                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <FiLogOut
                          size={16}
                          className="mr-2 text-red-500"
                          style={{ marginRight: "8px" }}
                        />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Link
                    to="/login"
                    onClick={handleLinkClick}
                    className="px-4 py-2 text-lg font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                    style={{
                      backgroundColor: "#023670",
                      borderColor: "#023670",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#01294d")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#023670")
                    }>
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={handleLinkClick}
                    className="px-4 py-2 text-lg font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                    style={{
                      backgroundColor: "#023670",
                      borderColor: "#023670",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#01294d")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#023670")
                    }>
                    Sign Up
                  </Link>
                </div>
              )}

              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 ${
              isOpen ? "block" : "hidden"
            }`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 dark:bg-gray-800 rounded-lg mt-2">
              {navItems.map((item) => {
                if (item.hasDropdown) {
                  return (
                    <div key={item.id}>
                      <Link
                        to={item.href}
                        onClick={() => {
                          setIsOpen(false);
                          handleLinkClick();
                        }}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 capitalize"
                        style={{
                          ...getMobileLinkStyles(item.href),
                          textDecoration: "none",
                        }}>
                        {item.label}
                      </Link>
                      {item.dropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.id}
                          to={dropdownItem.href}
                          onClick={() => {
                            setIsOpen(false);
                            handleLinkClick();
                          }}
                          className="block w-full text-left pl-6 pr-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                          style={{
                            ...getMobileLinkStyles(dropdownItem.href),
                            textDecoration: "none",
                          }}>
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={() => {
                      setIsOpen(false);
                      handleLinkClick();
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 capitalize"
                    style={{
                      ...getMobileLinkStyles(item.href),
                      textDecoration: "none",
                    }}>
                    {item.label}
                  </Link>
                );
              })}

              {user && isAuthenticated ? (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="font-medium text-gray-700 dark:text-gray-200">
                      {userDisplayName}
                    </div>
                    {user?.email && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {user.email}
                      </div>
                    )}
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => {
                      setIsOpen(false);
                      handleLinkClick();
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    style={{ textDecoration: "none" }}>
                    Profile
                  </Link>
                  {/* Nút logout đổi thành mở confirm */}
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <Link
                    to="/login"
                    onClick={() => {
                      setIsOpen(false);
                      handleLinkClick();
                    }}
                    className="w-full px-3 py-2 text-base font-medium text-white rounded-md transition-colors duration-200 block text-center"
                    style={{
                      backgroundColor: "#023670",
                      textDecoration: "none",
                    }}>
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => {
                      setIsOpen(false);
                      handleLinkClick();
                    }}
                    className="w-full px-3 py-2 text-base font-medium text-white rounded-md transition-colors duration-200 block text-center"
                    style={{
                      backgroundColor: "#023670",
                      textDecoration: "none",
                    }}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Đặt LogOut ở ngoài, điều khiển qua state */}
      <LogOut
        trigger="modal"
        open={showLogoutConfirm}
        buttonType="default"
        buttonText="Logout"
        showIcon={true}
        showConfirmation={true}
        
        onLogoutSuccess={handleLogoutSuccess}
        onLogoutError={handleLogoutError}
        onCancel={handleLogoutCancel}
      />

      <style>{`
        .nav-link {
          text-decoration: none !important;
          cursor: pointer !important;
          outline: none !important;
          display: inline-block !important;
          position: relative !important;
        }
        .nav-link:hover {
          color: #3b82f6 !important;
          text-decoration: none !important;
        }
        .nav-link:focus {
          outline: none !important;
          text-decoration: none !important;
        }
        .nav-link:active {
          outline: none !important;
          text-decoration: none !important;
        }
        .nav-link:visited {
          text-decoration: none !important;
        }
      `}</style>
    </>
  );
};

export default Header;