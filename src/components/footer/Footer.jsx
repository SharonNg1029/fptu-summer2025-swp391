import {
  FacebookFilled,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeFilled,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1f3a56] text-white py-10 px-5 pb-5 text-[15px] w-full box-border m-0 relative">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 max-w-[1600px] mx-auto p-0">
        {/* Logo + Mô tả */}
        <div className="text-left">
          <Link to="/">
            <img src="/images/logo.png" alt="Logo" className="h-[50px] mb-5" />
          </Link>
          <p className="mt-[30px] mb-3 leading-[1.6] text-[17px]">
          Genetix - Vietnam's Leading Trusted DNA Testing Center
          </p>
          <div className="flex gap-3 text-[30px] mt-[15px]">
            <FacebookFilled className="cursor-pointer hover:text-[#3fa9f5] transition-colors" />
            <TwitterOutlined className="cursor-pointer hover:text-[#3fa9f5] transition-colors" />
            <InstagramOutlined className="cursor-pointer hover:text-[#3fa9f5] transition-colors" />
            <YoutubeFilled className="cursor-pointer hover:text-[#3fa9f5] transition-colors" />
          </div>
        </div>

        {/* Liên kết nhanh */}
        <div className="text-left">
          <h4 className="font-[1000] mb-2 border-b-2 border-[#3fa9f5] inline-block pb-1">
          Quick Links
          </h4>
          <ul className="list-none p-0 mt-1">
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <Link to="/" className="hover:text-[#3fa9f5] transition-colors">Home</Link>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <Link to="/service" className="hover:text-[#3fa9f5] transition-colors">DNA Testing Services</Link>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <Link to="/guide" className="hover:text-[#3fa9f5] transition-colors">Guide</Link>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <Link to="/pricing" className="hover:text-[#3fa9f5] transition-colors">Pricing</Link>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <Link to="/blog" className="hover:text-[#3fa9f5] transition-colors">Knowledge Blog</Link>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <a href="mailto:genetix.noreply@gmail.com" className="hover:text-[#3fa9f5] transition-colors">Contact</a>
            </li>
          </ul>
        </div>

        {/* Dịch vụ */}
        <div className="text-left">
          <h4 className="font-[1000] mb-2 border-b-2 border-[#3fa9f5] inline-block pb-1">
          Our Services
          </h4>
          <ul className="list-none p-0 mt-1">
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <Link to="/service/non-legal" className="hover:text-[#3fa9f5] transition-colors">Non-Legal DNA Testing</Link>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <Link to="/service/legal" className="hover:text-[#3fa9f5] transition-colors">Legal DNA Testing</Link>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
             
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              
            </li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div className="text-left">
          <h4 className="font-[1000] mb-2 border-b-2 border-[#3fa9f5] inline-block pb-1">
          Contact Us
          </h4>
          <ul className="list-none p-0 mt-1">
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <EnvironmentOutlined className="mt-2" />7 D1 Street, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City, 700000
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <PhoneOutlined className="mt-2" /> <a href="tel:+84901452366" className="hover:text-[#3fa9f5] transition-colors">Hotline: +84 901 452 366</a>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <MailOutlined className="mt-2" /> <a href="mailto:genetix.noreply@gmail.com" className="hover:text-[#3fa9f5] transition-colors">genetix.noreply@gmail.com</a>
            </li>
            <li className="mb-[6px] flex items-start gap-2 cursor-pointer leading-[2] hover:text-[#3fa9f5] transition-colors">
              <ClockCircleOutlined className="mt-2" /> 
              <div className="flex flex-col">
                <span className="font-medium">Business Hours:</span>
                <span className="text-sm opacity-90">Mon–Sat: 8:00 AM – 5:30 PM</span>
                <span className="text-sm opacity-90">Sunday: 8:00 AM – 12:00 AM</span>
              </div>
            </li>     
          </ul>
        </div>
      </div>

      <div className="text-center mt-8 text-[#ccc] text-[17px]">
      © 2025 Genetix DNA Testing Center. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;