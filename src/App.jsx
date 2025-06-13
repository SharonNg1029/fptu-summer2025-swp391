import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/home-page";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import DashboardAdmin from "./components/dashboard-admin"; // Updated import
import StaffDashboard from "./components/dashboard-staff"; // New import
import ManagerDashboard from "./components/dashboard-manager"; // New import
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { persistor, store } from "./app/store";
import NonLegalServices from "./pages/home-page/services/non-legalDNA/NonLegalDNA";
import OverviewPage from "./pages/dashboard-admin/overview";
import ServicesOverview from "./pages/home-page/services";
import LegalServices from "./pages/home-page/services/legalDNA/LegalDNA";
import HomeContent from "./components/home-content/HomeContent";
import Guide from "./pages/home-page/guide";
import Pricing from "./pages/home-page/pricing";
import Blog from "./pages/home-page/blog";
import VerifyPage from "./components/verify-otp/VerifyPage";
import AccountManagement from "./pages/dashboard-admin/account-management";
import ContentManagement from "./pages/dashboard-admin/content-managment";
import Inventory from "./pages/dashboard-manager/inventory";
import SystemLogs from "./pages/dashboard-admin/system-logs";
import Booking from "./pages/dashboard-admin/services/Booking";
import ServiceManagementPage from "./pages/dashboard-admin/services/ServiceManagement";
import StaffOverviewPage from "./pages/dashboard-staff/overview";
import OrderProcessingPage from "./pages/dashboard-staff/order-processing"; // Combined page
import StaffReportingPage from "./pages/dashboard-staff/reporting"; // Combined page
import ManagerOverviewPage from "./pages/dashboard-manager/overview";
import CustomerFeedbackPage from "./pages/dashboard-manager/customer-feedback";
import StaffReportsApprovalPage from "./pages/dashboard-manager/staff-reports-approval";
import TestingProcessMonitoringPage from "./pages/dashboard-manager/testing-process-monitoring"; // New import

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />, // Layout với Header, Outlet, Footer
      children: [
        {
          index: true, // Route mặc định cho "/"
          element: <HomeContent />,
        },
        {
          path: "services",
          element: <ServicesOverview />,
        },
        {
          path: "services/legal",
          element: <LegalServices />,
        },
        {
          path: "services/non-legal",
          element: <NonLegalServices />,
        },
        {
          path: "guide",
          element: <Guide />,
        },
        {
          path: "pricing",
          element: <Pricing />,
        },
        {
          path: "blog",
          element: <Blog />,
        },
      ],
    },
    // Các route độc lập không cần Header/Footer
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/dashboard", // Admin Dashboard
      element: <DashboardAdmin />,
      children: [
        { index: true, element: <OverviewPage /> }, // Trang Overview mặc định
        {
          path: "overview",
          element: <OverviewPage />,
        },
        {
          path: "services",
          children: [
            { path: "booking", element: <Booking /> },
            { path: "service-management", element: <ServiceManagementPage /> },
            { index: true, element: <ServiceManagementPage /> },
          ],
        },
        {
          path: "accounts",
          element: <AccountManagement />,
        },
        {
          path: "blog", // Blog Post Management
          element: <ContentManagement />,
        },
        {
          path: "logs", // System Logs
          element: <SystemLogs />,
        },
      ],
    },
    {
      path: "/staff-dashboard", // Staff Dashboard
      element: <StaffDashboard />,
      children: [
        { index: true, element: <StaffOverviewPage /> },
        { path: "overview", element: <StaffOverviewPage /> },
        { path: "order-processing", element: <OrderProcessingPage /> }, // Combined
        { path: "staff-reporting", element: <StaffReportingPage /> }, // Combined
        // { path: "customer-contact", element: <CustomerContactPage /> }, // Still separate
      ],
    },
    {
      path: "/manager-dashboard", // Manager Dashboard
      element: <ManagerDashboard />,
      children: [
        { index: true, element: <ManagerOverviewPage /> },
        { path: "overview", element: <ManagerOverviewPage /> },
        {
          path: "testing-process-monitoring",
          element: <TestingProcessMonitoringPage />,
        },
        { path: "customer-feedback", element: <CustomerFeedbackPage /> },
        { path: "inventory", element: <Inventory /> },
        {
          path: "staff-reports-approval",
          element: <StaffReportsApprovalPage />,
        },
      ],
    },
    {
      path: "/verify",
      element: <VerifyPage />,
    },
  ]);

  return (
    <Provider store={store}>
      {/* Wrap the RouterProvider with Provider to make the store available to all components */}
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}

export default App;
