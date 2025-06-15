import { useState, useEffect } from "react";
import { FiMenu, FiX, FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUserFullName } from "../../redux/features/userSlice";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const userState = useSelector((state) => state.user);
  const user = userState?.currentUser;
  const isAuthenticated = userState?.isAuthenticated;

  // ✅ SỬ DỤNG SELECTOR
  const userDisplayName = useSelector(selectUserFullName);

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

  const handleLogout = async () => {
    try {
      dispatch(logout());
      setShowDropdown(false);
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    navigate(href);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

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

  const handleServicesClick = (e, href) => {
    e.preventDefault();
    setShowServicesDropdown(false);
    if (hoverTimeout) clearTimeout(hoverTimeout);
    navigate(href);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const scrollToContact = () => {
      const contactElement = document.getElementById("contact");
      if (contactElement) {
        const headerHeight = 80;
        const elementPosition = contactElement.offsetTop;
        const offsetPosition = elementPosition - headerHeight;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToContact, 300);
    } else {
      scrollToContact();
    }
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

  const getButtonStyles = () => ({
    fontSize: "1.125rem",
    fontWeight: "500",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: "8px 12px",
    margin: "0 8px",
    outline: "none",
    color: isDarkMode ? "#ffffff" : "#1f2937",
    transition: "color 0.2s ease-in-out",
    borderRadius: "4px",
  });

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
                navigate("/");
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
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
            <div className="flex items-center" style={{marginRight: "8px", gap: "35px"}}>
              {navItems.map((item) => {
                if (item.isContact) {
                  return (
                    <button
                      key={item.id}
                      onClick={handleContactClick}
                      style={getButtonStyles()}
                      onMouseEnter={(e) => e.target.style.color = "#3b82f6"}
                      onMouseLeave={(e) => e.target.style.color = isDarkMode ? "#ffffff" : "#1f2937"}
                    >
                      {item.label}
                    </button>
                  );
                }

                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.id}
                      className="relative services-dropdown"
                      onMouseEnter={handleServicesMouseEnter}
                      onMouseLeave={handleServicesMouseLeave}
                      style={{ margin: "0 8px" }}
                    >
                      <button
                        onClick={(e) => handleServicesClick(e, item.href)}
                        style={{ ...getButtonStyles(), margin: "0" }}
                        onMouseEnter={(e) => e.target.style.color = "#3b82f6"}
                        onMouseLeave={(e) => e.target.style.color = isDarkMode ? "#ffffff" : "#1f2937"}
                      >
                        {item.label}
                      </button>

                      {showServicesDropdown && (
                        <div
                          className="absolute top-full left-0 pt-2 w-64 z-50"
                          onMouseEnter={handleServicesMouseEnter}
                          onMouseLeave={handleServicesMouseLeave}
                        >
                          <div className="relative">
                            <div
                              className="absolute left-4 -top-2 w-0 h-0"
                              style={{
                                borderLeft: "9px solid transparent",
                                borderRight: "9px solid transparent",
                                borderBottom: `9px solid ${isDarkMode ? "#6b7280" : "#d1d5db"}`,
                                zIndex: 1,
                              }}
                            />
                            <div
                              className="absolute left-4 -top-1 w-0 h-0"
                              style={{
                                borderLeft: "8px solid transparent",
                                borderRight: "8px solid transparent",
                                borderBottom: `8px solid ${isDarkMode ? "#374151" : "#ffffff"}`,
                                zIndex: 2,
                                marginLeft: "1px",
                              }}
                            />
                            <div
                              className="rounded-md shadow-lg py-2 bg-white dark:bg-gray-800"
                              style={{
                                border: `2px solid ${isDarkMode ? "#6b7280" : "#d1d5db"}`,
                              }}
                            >
                              {item.dropdownItems.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.id}
                                  to={dropdownItem.href}
                                  className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                  onClick={() => {
                                    setShowServicesDropdown(false);
                                    if (hoverTimeout) clearTimeout(hoverTimeout);
                                    setTimeout(() => {
                                      window.scrollTo({ top: 0, behavior: "smooth" });
                                    }, 100);
                                  }}
                                >
                                  <div className="font-medium">{dropdownItem.label}</div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={(e) => handleNavClick(e, item.href)}
                    style={getButtonStyles()}
                    onMouseEnter={(e) => e.target.style.color = "#3b82f6"}
                    onMouseLeave={(e) => e.target.style.color = isDarkMode ? "#ffffff" : "#1f2937"}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Buttons */}
          <div className="w-1/3 flex items-center justify-end space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {user && isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity duration-200"
                >
                  <img
                    src={user?.avatar || "https://i.pinimg.com/1200x/59/95/a7/5995a77843eb9f5752a0004b1c1250fb.jpg"}
                    alt={userDisplayName}
                    className="h-12 w-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/48x48/6B7280/FFFFFF?text=U";
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
                      onClick={() => {
                        setShowDropdown(false);
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }, 100);
                      }}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
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
                <button
                  onClick={() => {
                    navigate("/login");
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 100);
                  }}
                  className="px-4 py-2 text-lg font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                  style={{ backgroundColor: "#023670", borderColor: "#023670" }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#01294d"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#023670"}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 100);
                  }}
                  className="px-4 py-2 text-lg font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                  style={{ backgroundColor: "#023670", borderColor: "#023670" }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#01294d"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#023670"}
                >
                  Sign Up
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
        <div className={`md:hidden transition-all duration-300 ${isOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 dark:bg-gray-800 rounded-lg mt-2">
            {navItems.map((item) => {
              if (item.isContact) {
                return (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      handleContactClick(e);
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 capitalize bg-transparent border-none cursor-pointer"
                  >
                    {item.label}
                  </button>
                );
              }

              if (item.hasDropdown) {
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        navigate(item.href);
                        setIsOpen(false);
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }, 100);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 capitalize bg-transparent border-none cursor-pointer"
                    >
                      {item.label}
                    </button>
                    {item.dropdownItems.map((dropdownItem) => (
                      <button
                        key={dropdownItem.id}
                        onClick={() => {
                          navigate(dropdownItem.href);
                          setIsOpen(false);
                          setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }, 100);
                        }}
                        className="block w-full text-left pl-6 pr-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                      >
                        {dropdownItem.label}
                      </button>
                    ))}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.href);
                    setIsOpen(false);
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 100);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 capitalize bg-transparent border-none cursor-pointer"
                >
                  {item.label}
                </button>
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
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 100);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                >
                  <FiLogOut 
                    size={16} 
                    className="mr-2 text-red-500" 
                    style={{ marginRight: "8px" }}
                  />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 100);
                  }}
                  className="w-full px-3 py-2 text-base font-medium text-white rounded-md transition-colors duration-200"
                  style={{ backgroundColor: "#023670" }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    setIsOpen(false);
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 100);
                  }}
                  className="w-full px-3 py-2 text-base font-medium text-white rounded-md transition-colors duration-200"
                  style={{ backgroundColor: "#023670" }}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;