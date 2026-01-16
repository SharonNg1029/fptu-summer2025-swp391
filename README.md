![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-6.3.5-purple)
![License](https://img.shields.io/badge/license-MIT-green)

# Genetix DNA Testing Platform - Frontend

> **Software Development Project (SWP391)**  
> FPT University Ho Chi Minh Campus  
> Class: SE1856 - Group 3

## Giới thiệu

Genetix là dự án học thuật mô phỏng nền tảng dịch vụ xét nghiệm DNA. Hệ thống cho phép người dùng đăng ký, quản lý và theo dõi quy trình xét nghiệm DNA phục vụ các mục đích dân sự và hành chính.

Repository này chứa mã nguồn **Frontend** của dự án, được xây dựng bằng React và Vite.

**Lưu ý:** Đây là sản phẩm phục vụ môn học tại trường đại học, **không phải** là nền tảng thương mại thực tế.

---

## Tính năng chính

* **Đăng ký & Đăng nhập:** Xác thực qua mật khẩu hoặc Google OAuth, xác minh OTP qua email.
* **Đặt lịch xét nghiệm DNA:**
    * Gói xét nghiệm dân sự (cá nhân, gia đình).
    * Gói xét nghiệm hành chính (pháp lý).
    * Quy trình trạng thái: Awaiting Confirmation → Pending Payment → Booking Confirmed → Awaiting Sample → In Progress → Completed.
* **Thanh toán:** Tích hợp cổng thanh toán giả lập hoặc VNPay (Môi trường Test).
* **Quản lý kết quả:** Xem kết quả trực tuyến, xuất báo cáo PDF, tra cứu lịch sử.
* **Blog & Kiến thức:** Hệ thống CMS đơn giản cho bài viết.
* **Hệ thống quản trị (Dashboard):** Dành cho Admin, Manager và Staff để quản lý người dùng, đơn hàng, kho kit và logs.

---

## Công nghệ sử dụng

### Frameworks & Libraries
* **Core:** React 18.3.1, Vite 6.3.5
* **UI/Styling:** Tailwind CSS 4.1.8, Ant Design 5.25.3
* **State Management:** Redux Toolkit
* **Routing & Networking:** React Router DOM, Axios
* **Forms:** Formik, Yup

### Utilities
* **PDF & Charts:** jsPDF, pdfmake, recharts, @ant-design/plots
* **Auth:** Google OAuth (`@react-oauth/google`)

### Backend Reference
Dự án sử dụng RESTful API được phát triển bằng Spring Boot.
Source code Backend: [https://github.com/baothanh4/swp391](https://github.com/baothanh4/swp391)

---

## Cài đặt và triển khai

### Yêu cầu
* Node.js >= 18
* npm >= 9

### Các bước cài đặt

1.  **Clone dự án**
    ```bash
    git clone [https://github.com/SharonNg1029/SWP391.git](https://github.com/SharonNg1029/SWP391.git)
    cd SWP391
    ```

2.  **Cài đặt dependencies**
    ```bash
    npm install
    ```

3.  **Cấu hình biến môi trường**
    Sao chép file `.env.example` thành `.env` và cập nhật các thông số:

    ```bash
    cp .env.example .env
    ```

    Nội dung file `.env` cần cấu hình:
    ```env
    # URL của Backend API
    VITE_API_BASE_URL=[http://103.90.227.214:8080/api](http://103.90.227.214:8080/api)

    # URL Proxy Target (Optional)
    VITE_API_PROXY_TARGET=[http://103.90.227.214:8080](http://103.90.227.214:8080)

    # Google OAuth Client ID (Lấy từ Google Cloud Console)
    VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
    ```

4.  **Chạy ứng dụng (Development)**
    ```bash
    npm run dev
    ```
    Truy cập tại: `http://localhost:5173`

---

## Cấu trúc thư mục


```
fptu-summer2025-swp391/
├── public/ # Static assets
├── src/
│ ├── app/ # Redux store configuration
│ ├── assets/ # Images, fonts, static resources
│ ├── components/ # Reusable UI components
│ ├── pages/ # Page-level components (routes)
│ ├── configs/ # Axios & application configuration
│ ├── redux/ # Global state management
│ ├── utils/ # Utility & helper functions
│ ├── App.jsx # Main application component
│ ├── main.jsx # React entry point
│ └── index.css # Global styles (Tailwind CSS)
│
├── .env.example # Environment template
├── .gitignore # Git ignore rules
├── index.html # HTML entry point
├── package.json # Dependencies & scripts
├── vite.config.js # Vite configuration
└── README.md # Project documentation
```

### Các thư mục quan trọng:

- **`components/`**: Các component tái sử dụng, không phụ thuộc route
- **`pages/`**: Các component được gắn với routes cụ thể
- **`configs/`**: Cấu hình Axios, API endpoints, auth helpers
- **`redux/`**: Quản lý state toàn cục (user info, authentication)
- **`app/`**: Redux store configuration


---

## Tài khoản kiểm thử (Demo Accounts)

Sử dụng các tài khoản sau để kiểm tra phân quyền hệ thống:

| Role | Username | Password | Quyền hạn chính |
| :--- | :--- | :--- | :--- |
| **Admin** | `ngannguyen` | `ngannguyen` | Quản trị toàn hệ thống, logs, accounts. |
| **Manager** | `hogiabao` | `bao` | Quản lý kho, báo cáo, phản hồi khách hàng. |
| **Staff** | `nganle` | `ngan` | Xử lý đơn hàng, cập nhật kết quả xét nghiệm. |
| **Customer** | `xuanloc` | `loc` | Đặt lịch, thanh toán, xem kết quả. |

---

## Liên hệ

Mọi thắc mắc liên quan đến source code hoặc dự án, vui lòng liên hệ đến: [genetixcontactsp@gmail.com](mailto:genetixcontactsp@gmail.com) hoặc [saoaz1029@gmail.com](mailto:saoaz1029@gmail.com).

**© 2025 FPT University HCM - SE1856 - Group 3**
**© 2025 Genetix DNA Platform - FPT University HCM**
