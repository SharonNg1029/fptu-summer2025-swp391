import { useState, useEffect } from "react";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const navItems = [
    { id: 1, label: "Home", href: "/" },
    {
      id: 3,
      label: "Services",
      href: "/services",
      hasDropdown: true,
      dropdownItems: [
        { id: 31, label: "Non-Legal DNA Testing", href: "/services/non-legal" },
        { id: 32, label: "Legal DNA Testing", href: "/services/legal" },
      ],
    },
    { id: 4, label: "Guide", href: "/guide" },
    { id: 5, label: "Pricing", href: "/pricing" },
    { id: 6, label: "Blog", href: "/blog" },
    { id: 7, label: "Contact", href: "#contact", isContact: true },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
  };

  // ✅ Improved Services dropdown handlers với delay
  let hoverTimeout;

  const handleServicesMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setShowServicesDropdown(true);
  };

  const handleServicesMouseLeave = () => {
    hoverTimeout = setTimeout(() => {
      setShowServicesDropdown(false);
    }, 150);
  };

  const handleServicesClick = (e, href) => {
    e.preventDefault();
    setShowServicesDropdown(false);
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    navigate(href);
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🔥 CONTACT CLICKED!");

    const scrollToContact = () => {
      const contactElement = document.getElementById("contact");
      console.log("🎯 Contact element:", contactElement);

      if (contactElement) {
        const headerHeight = 80;
        const elementPosition = contactElement.offsetTop;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        console.log("✅ Scrolled!");
      } else {
        console.warn("❌ No contact element!");
      }
    };

    if (location.pathname !== "/") {
      console.log("🔄 Navigating to home...");
      navigate("/");
      setTimeout(scrollToContact, 300);
    } else {
      console.log("🏠 On home, scrolling...");
      scrollToContact();
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, []);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 shadow-md ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="px-4">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="w-1/3 flex justify-start">
            <img
              src="./images/logo.png"
              alt="Logo"
              className="h-12 w-auto cursor-pointer"
              onClick={() => {
                console.log("🏠 Logo clicked - Going home!");
                navigate("/");
                // ✅ SCROLL TO TOP WHEN GOING HOME
                setTimeout(() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }, 100);
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/32";
              }}
            />
          </div>

          {/* Navigation */}
          <nav className="w-1/3 hidden md:flex justify-center">
            <div className="flex space-x-16">
              {navItems.map((item) => {
                // ✅ Contact button
                if (item.isContact) {
                  return (
                    <button
                      key={item.id}
                      onClick={handleContactClick}
                      onMouseDown={(e) => {
                        console.log("🖱️ Contact mouse down!");
                        handleContactClick(e);
                      }}
                      className="contact-btn"
                      style={{
                        background: "none !important",
                        border: "none !important",
                        padding: "0 !important",
                        margin: "0 !important",
                        fontSize: "1.125rem",
                        fontWeight: "500",
                        color: isDarkMode ? "#ffffff" : "#1f2937",
                        textTransform: "capitalize",
                        whiteSpace: "nowrap",
                        cursor: "pointer !important",
                        pointerEvents: "auto !important",
                        outline: "none !important",
                        textDecoration: "none !important",
                        display: "inline-block",
                        position: "relative",
                        zIndex: "999",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "#3b82f6";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = isDarkMode
                          ? "#ffffff"
                          : "#1f2937";
                      }}
                    >
                      {item.label}
                    </button>
                  );
                }

                // ✅ Services với triangle pointer + border
                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.id}
                      className="relative services-dropdown"
                      onMouseEnter={handleServicesMouseEnter}
                      onMouseLeave={handleServicesMouseLeave}
                    >
                      <button
                        onClick={(e) => handleServicesClick(e, item.href)}
                        className="text-lg font-medium hover:text-blue-500 transition-colors duration-200 capitalize whitespace-nowrap cursor-pointer"
                      >
                        {item.label}
                      </button>

                      {/* ✅ Services Dropdown với Triangle Pointer + Border */}
                      {showServicesDropdown && (
                        <div
                          className="absolute top-full left-0 pt-2 w-64 z-50"
                          onMouseEnter={handleServicesMouseEnter}
                          onMouseLeave={handleServicesMouseLeave}
                        >
                          {/* ✅ Triangle Pointer với Border */}
                          <div className="relative">
                            {/* Outer triangle (border) */}
                            <div
                              className="absolute left-4 -top-2 w-0 h-0"
                              style={{
                                borderLeft: "9px solid transparent",
                                borderRight: "9px solid transparent",
                                borderBottom: `9px solid ${
                                  isDarkMode ? "#6b7280" : "#d1d5db"
                                }`, // Border color
                                zIndex: 1,
                              }}
                            ></div>

                            {/* Inner triangle (background) */}
                            <div
                              className="absolute left-4 -top-1 w-0 h-0"
                              style={{
                                borderLeft: "8px solid transparent",
                                borderRight: "8px solid transparent",
                                borderBottom: `8px solid ${
                                  isDarkMode ? "#374151" : "#ffffff"
                                }`, // Background color
                                zIndex: 2,
                                marginLeft: "1px", // Center alignment
                              }}
                            ></div>

                            {/* ✅ Dropdown content với border */}
                            <div
                              className="rounded-md shadow-lg py-2 bg-white dark:bg-gray-800"
                              style={{
                                border: `2px solid ${
                                  isDarkMode ? "#6b7280" : "#d1d5db"
                                }`, // ✅ Main border
                              }}
                            >
                              {item.dropdownItems.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.id}
                                  to={dropdownItem.href}
                                  className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                  onClick={() => {
                                    setShowServicesDropdown(false);
                                    if (hoverTimeout) {
                                      clearTimeout(hoverTimeout);
                                    }
                                  }}
                                >
                                  <div className="font-medium">
                                    {dropdownItem.label}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {dropdownItem.id === 31
                                      ? "For peace of mind and personal knowledge"
                                      : "Court admissible with chain of custody"}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // ✅ Regular nav items
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className="text-lg font-medium hover:text-blue-500 transition-colors duration-200 capitalize whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Buttons */}
          <div className="w-1/3 flex items-center justify-end space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* User Authenticated */}
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity duration-200"
                >
                  <img
                    src="https://i.pinimg.com/1200x/59/95/a7/5995a77843eb9f5752a0004b1c1250fb.jpg"
                    alt={user?.fullName || "User Avatar"}
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
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-lg font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                  style={{
                    backgroundColor: "#223A66",
                    borderColor: "#223A66",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#1a2e52")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#223A66")
                  }
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 text-lg font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                  style={{
                    backgroundColor: "#223A66",
                    borderColor: "#223A66",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#1a2e52")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#223A66")
                  }
                >
                  Register
                </button>
              </div>
            )}

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 dark:bg-gray-800 rounded-lg mt-2">
            {navItems.map((item) => {
              // ✅ Mobile Contact
              if (item.isContact) {
                return (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      handleContactClick(e);
                      setIsOpen(false);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 capitalize"
                  >
                    {item.label}
                  </button>
                );
              }

              // ✅ Mobile Services
              if (item.hasDropdown) {
                return (
                  <div key={item.id}>
                    <Link
                      to={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 capitalize"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>

                    {item.dropdownItems.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.id}
                        to={dropdownItem.href}
                        className="block pl-6 pr-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
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
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 capitalize"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Auth buttons */}
            {!user && (
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-base font-medium text-white rounded-md transition-colors duration-200"
                  style={{ backgroundColor: "#223A66" }}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-base font-medium text-white rounded-md transition-colors duration-200"
                  style={{ backgroundColor: "#223A66" }}
                >
                  Register
                </button>
              </div>
            )}

            {user && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ CSS Styles */}
      <style jsx>{`
        .contact-btn {
          background: none !important;
          border: none !important;
          cursor: pointer !important;
          pointer-events: auto !important;
          outline: none !important;
        }
        .contact-btn:hover {
          color: #3b82f6 !important;
        }
      `}</style>
    </header>
  );
};

export default Header;
