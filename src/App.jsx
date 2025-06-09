import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/home-page";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import Dashboard from "./components/dashboard";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { persistor, store } from "./app/store";
import NonLegalServices from "./pages/home-page/services/non-legalDNA/NonLegalDNA";
import OverviewPage from "./pages/dashboard-admin/overview";
import ManageProduct from "./pages/dashboard-admin/product";
import ManageUser from "./pages/dashboard-admin/user";
import ServicesOverview from "./pages/home-page/services";
import LegalServices from "./pages/home-page/services/legalDNA/LegalDNA";
import Guide from "./pages/home-page/guide";
import Pricing from "./pages/home-page/pricing";
import Blog from "./pages/home-page/blog";
import VerifyOTP from "./components/verify-otp/VerifyOTP";
import HomeContent from "./components/home-content/HomeContent";

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
          path: "service",
          element: <ServicesOverview />,
        },
        {
          path: "service/legal",
          element: <LegalServices />,
        },
        {
          path: "service/non-legal",
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
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        {
          path: "overview",
          element: <OverviewPage />,
        },
        {
          path: "product",
          element: <ManageProduct />,
        },
        {
          path: "user",
          element: <ManageUser />,
        },
      ],
    },
    {
      path: "/verify",
      element: <VerifyOTP />,
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
