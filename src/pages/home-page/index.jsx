import { Footer, Header } from "antd/es/layout/layout";
import React from "react";
import { Outlet } from "react-router-dom";
import HomeHeader from "../../components/header/Header";
import HomeFooter from "../../components/footer/Footer";

function HomePage() {
  return (
    <>
      <HomeHeader />
      <Outlet /> {/* Đây là nơi các children routes sẽ được render */}
      <HomeFooter />
    </>
  );
}

export default HomePage;
