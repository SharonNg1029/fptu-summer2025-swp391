import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Form, Input, Select, DatePicker, Radio, Button, message, Row, Col, Card, Typography, Space, Checkbox, Modal, Steps, Descriptions, Divider, Alert, Result, Tooltip } from 'antd';
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, PhoneOutlined, MailOutlined, IdcardOutlined, TeamOutlined, EnvironmentOutlined, CreditCardOutlined, QrcodeOutlined, CheckCircleOutlined, DownloadOutlined, FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';
import { legalServicesData, legalCollectionMethodsData } from '../home-page/services/legalDNA/data-legal/legalData';
import { nonLegalServicesData, nonLegalCollectionMethodsData } from '../home-page/services/non-legalDNA/data-non-legal/nonLegalData';
import { FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, FaIdCard, FaUsers, FaMapMarkerAlt, FaCreditCard, FaQrcode } from 'react-icons/fa';

const { Title, Text } = Typography;
const { Option } = Select;

const ConfirmBookingModal = ({ visible, onCancel, bookingData, onConfirm, paymentMethod: paymentMethodProp }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethodProp || 'cash');
  const [qrCodeData, setQrCodeData] = useState(null);
  const [paymentCode, setPaymentCode] = useState('');
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [showPDFOption, setShowPDFOption] = useState(false);
  const [isPDFConfirmStep, setIsPDFConfirmStep] = useState(false); // Thêm state mới
  const [finalBookingData, setFinalBookingData] = useState(null); // Lưu data tạm thời
  const [isProcessingSignature, setIsProcessingSignature] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const signatureRef = useRef();

  // Luôn gọi useEffect ở đầu component
  useEffect(() => {
    if (visible && paymentMethodProp) {
      setPaymentMethod(paymentMethodProp);
    }
  }, [visible, paymentMethodProp]);

  if (!bookingData) return null;

  // Helper: format currency
  const formatCurrency = (amount) => amount ? `${Number(amount).toLocaleString()} đ` : '0 đ';

  // Helper: get address
  const getCollectionAddress = () => {
    if (bookingData.collectionMethod?.name === 'At Home') {
      return bookingData.homeAddress || '—';
    }
    return '7 D1 Street, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City';
  };

  // Helper: get express service
  const getExpressService = () => bookingData.isExpressService ? 'Có' : 'Không';

  // Helper: get mediation method label
  const getMediationLabel = (method) => {
    if (method === 'postal-delivery') return 'Postal Delivery';
    if (method === 'staff-collection') return 'Staff Collection';
    if (method === 'walk-in') return 'Walk-in Service';
    if (method === 'express') return 'Express Service';
    return method;
  };

  // Helper: get payment label
  const getPaymentLabel = (method) => {
    if (method === 'cash') return 'Thanh toán tiền mặt khi nhận dịch vụ';
    if (method === 'bank-transfer') return 'Quét mã QR để thanh toán';
    return method;
  };

  // Helper: get cost breakdown
  const getCostBreakdown = () => {
    const { service, selectedMedicationMethod, isExpressService, selectedCollectionMethod } = bookingData;
    let serviceCost = service?.basePrice || 0;
    let collectionCost = selectedCollectionMethod?.price || 0;
    let mediationCost = 0;
    let expressCost = 0;
    
    // Sử dụng logic giống calculateTotalCost
    if (selectedMedicationMethod === 'staff-collection') {
      mediationCost = 500000;
    } else if (selectedMedicationMethod === 'postal-delivery') {
      mediationCost = 250000;
    }
    
    if (isExpressService) {
      expressCost = service?.expressPrice || 1500000;
    }
    
    return { serviceCost, collectionCost, mediationCost, expressCost };
  };

  // Payment code & QR
  const generatePaymentCode = () => `DNA${Date.now().toString().slice(-6)}`;
  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);

  // Step 1: Confirm info
  const handleEdit = () => {
    setCurrentStep(1);
    onCancel();
  };
  const handleConfirm = async () => {
    Modal.confirm({
      title: 'Bạn có chắc những thông tin này là đúng không?',
      okText: 'Có',
      cancelText: 'Không',
      centered: true, // Đưa modal ra giữa màn hình
      width: 480, // Tăng kích thước modal lên cho dễ nhìn
      style: { maxWidth: 600 }, // Giới hạn max width lớn hơn mặc định
      onOk: () => {
        const code = generatePaymentCode();
        setPaymentCode(code);
        
        // Luôn chuyển đến bước tiếp theo (step 2) cho cả hai phương thức thanh toán
        if (paymentMethod === 'bank-transfer') {
          // QR flow: hiển thị mã QR thanh toán (step 2)
          setQrCodeData(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT:${code}`);
        }
        setCurrentStep(2);
      }
    });
  };

  // Step 2: QR Payment
  const handleCheckPayment = () => {
    // Xác nhận thanh toán thành công, chuyển đến ký tên
    setIsPaymentConfirmed(true);
    setCurrentStep(3); // Chuyển đến bước ký tên (step 3) sau khi thanh toán QR
  };

  // Hàm kiểm tra chất lượng chữ ký (ít strict hơn)
  const validateSignatureQuality = (signatureData) => {
    // Chỉ kiểm tra cơ bản - chữ ký có dữ liệu không
    if (signatureData.length < 1000) {
      return false;
    }
    
    return true;
  };

  // Hàm lưu chữ ký lên server (tạm thời comment vì API chưa có)
  /*
  const saveSignatureToServer = async (signatureData, bookingCode) => {
    try {
      const response = await fetch('/api/signatures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signature: signatureData,
          bookingCode: bookingCode,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save signature');
      }
      
      const result = await response.json();
      return result.signatureId;
    } catch (error) {
      console.error('Error saving signature:', error);
      throw error;
    }
  };
  */

  // Step 3: Signature (cho cả cash và QR)
  const handleSignatureComplete = async () => {
    // Kiểm tra chữ ký có tồn tại và không trống
    if (!signatureRef.current) {
      message.error('Không tìm thấy vùng ký tên!');
      return;
    }
    
    if (signatureRef.current.isEmpty()) {
      message.error('Vui lòng ký tên trước khi tiếp tục!');
      return;
    }
    
    setIsProcessingSignature(true);
    
    try {
      const signatureData = signatureRef.current.toDataURL('image/png');
      
      // Kiểm tra chữ ký có dữ liệu hợp lệ
      if (!signatureData || signatureData.length < 100) {
        message.error('Chữ ký không hợp lệ. Vui lòng ký lại!');
        return;
      }
      
      // Kiểm tra chất lượng chữ ký (tùy chọn - có thể bỏ qua nếu quá strict)
      if (!validateSignatureQuality(signatureData)) {
        message.error('Chữ ký quá đơn giản hoặc không rõ ràng. Vui lòng ký lại!');
        return;
      }
      
      // Tạo signatureId local thay vì gọi server
      const signatureId = `sig_${paymentCode}_${Date.now()}`;
      
      const bookingDataWithSignature = {
        ...bookingData,
        paymentMethod,
        paymentCode,
        signature: signatureData,
        signatureId: signatureId, // ID local của chữ ký
        status: 'confirmed',
        signedAt: new Date().toISOString()
      };
      
      // Lưu data tạm thời và chuyển đến bước xác nhận PDF
      setFinalBookingData(bookingDataWithSignature);
      
      // Chuyển sang bước tiếp theo sau khi ký tên
      if (paymentMethod === 'cash') {
        // Với thanh toán tiền mặt, chuyển thẳng đến bước xác nhận PDF
        setIsPDFConfirmStep(true);
        setShowPDFOption(true);
      } else {
        // Với thanh toán QR, chuyển sang bước hoàn thành (step 4)
        setCurrentStep(4);
      }
      
      message.success('Ký tên thành công!');
      
    } catch (error) {
      console.error('Error processing signature:', error);
      message.error('Có lỗi xảy ra khi xử lý chữ ký. Vui lòng thử lại!');
    } finally {
      setIsProcessingSignature(false);
    }
  };

  // Hàm xử lý khi người dùng chọn tải PDF
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Kiểm tra chữ ký trước khi tạo PDF
      if (!finalBookingData?.signature && (!signatureRef.current || signatureRef.current.isEmpty())) {
        message.error('Không tìm thấy chữ ký. Vui lòng ký lại!');
        setIsGeneratingPDF(false);
        return;
      }
      
      // Hiển thị thông báo đang xử lý
      const processingMsg = message.loading('Đang tạo file PDF...', 0);
      
      try {
        // Tạo PDF trực tiếp với tham số shouldDownload là true để tải xuống
        await generatePDF(true);
        
        // Đóng thông báo đang xử lý
        processingMsg();
        
        // Lưu đơn hàng với thông tin PDF đã tạo
        const updatedBookingData = {
          ...finalBookingData,
          pdfGenerated: true,
          pdfGeneratedAt: new Date().toISOString()
        };
        
        // Lưu đơn hàng
        onConfirm(updatedBookingData);
        setCurrentStep(4);
        setIsPDFConfirmStep(false);
        
        // Thông báo thành công
        message.success('Tải file PDF thành công!');
      } catch (pdfError) {
        // Đóng thông báo đang xử lý
        processingMsg();
        console.error('Lỗi khi tạo PDF:', pdfError);
        message.error(`Không thể tạo PDF: ${pdfError.message}. Vui lòng thử lại!`);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      message.error('Có lỗi khi tạo PDF. Vui lòng thử lại!');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Hàm xử lý khi người dùng bỏ qua PDF
  const handleSkipPDF = () => {
    // Hiển thị thông báo đang xử lý
    const processingMsg = message.loading('Đang xử lý...', 0);
    
    // Tạo PDF nhưng không tải xuống
    generatePDF(false)
      .then(() => {
        // Lưu đơn hàng mà không tải PDF
        onConfirm(finalBookingData);
        setCurrentStep(4);
        setIsPDFConfirmStep(false);
        setShowPDFOption(false);
      })
      .catch(error => {
        console.error('Error generating PDF without download:', error);
        message.error('Có lỗi xảy ra, nhưng đơn hàng vẫn được lưu.');
        
        // Vẫn tiếp tục lưu đơn hàng ngay cả khi có lỗi
        onConfirm(finalBookingData);
        setCurrentStep(4);
        setIsPDFConfirmStep(false);
        setShowPDFOption(false);
      })
      .finally(() => {
        // Đóng thông báo đang xử lý
        processingMsg();
      });
  };

/*
// Tạo PDF dưới dạng Blob - Không cần thiết nữa, dùng generatePDF trực tiếp
const generatePDFBlob = async () => {
  // API chưa có, tạm thời comment
};

// Lưu PDF lên server - API chưa có
const savePDFToServer = async (pdfBlob, bookingCode) => {
  // API chưa có, tạm thời comment
};

// Tải file cho người dùng - Không cần thiết nữa
const downloadPDFFile = (blob, filename) => {
  // Không cần thiết nữa
};
*/

// Generate PDF function với jsPDF (An toàn và đơn giản)
const generatePDF = async (shouldDownload = true) => {
  let loadingMessage;
  try {
    console.log('=== BẮT ĐẦU TẠO PDF ===');
    // Hiển thị loading
    loadingMessage = message.loading('Đang tạo file PDF...', 0);
    
    // Kiểm tra dữ liệu cần thiết trước khi tạo PDF
    if (!bookingData) {
      throw new Error('Không có dữ liệu đặt lịch!');
    }

    try {
      // Đảm bảo thư viện pdfmake đã được tải
      console.log('Đang tải thư viện pdfmake...');
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfFonts = await import("pdfmake/build/vfs_fonts");
      const pdfMake = pdfMakeModule.default;
      pdfMake.vfs = pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;
      console.log('Đã tải thành công thư viện pdfmake');
    } catch (error) {
      console.error('Lỗi khi tải thư viện pdfmake:', error);
      throw new Error('Không thể tải thư viện PDF. Vui lòng thử lại!');
    }

    const { firstPerson, secondPerson, appointmentDate, totalCost } = bookingData;

    // Validation dữ liệu bắt buộc với thông báo cụ thể
    if (!firstPerson?.fullName || !secondPerson?.fullName) {
      throw new Error('Thiếu thông tin họ tên');
    }

    if (!appointmentDate) {
      throw new Error('Thiếu thông tin ngày hẹn');
    }

    if (!totalCost || totalCost <= 0) {
      throw new Error('Thông tin chi phí không hợp lệ');
    }

    // Kiểm tra chữ ký trước khi import thư viện
    let signatureImg = "";
    
    // Ưu tiên lấy từ finalBookingData (đã lưu)
    if (finalBookingData?.signature) {
      signatureImg = finalBookingData.signature;
      console.log('✓ Đã lấy chữ ký từ finalBookingData');
    } 
    // Fallback: lấy từ signatureRef hiện tại
    else if (signatureRef.current && !signatureRef.current.isEmpty()) {
      try {
        signatureImg = signatureRef.current.toDataURL("image/png");
        console.log('✓ Đã lấy chữ ký từ signatureRef');
      } catch (sigError) {
        console.error('Lỗi khi lấy chữ ký từ canvas:', sigError);
        throw new Error('Không thể lấy chữ ký từ canvas');
      }
    }
    
    // Kiểm tra chữ ký có dữ liệu hợp lệ
    if (!signatureImg || signatureImg.length < 100) {
      console.error('Lỗi: Chữ ký không hợp lệ');
      throw new Error('Chữ ký không hợp lệ hoặc quá ngắn');
    }

    console.log('Signature length:', signatureImg.length);

    // Thư viện pdfmake đã được tải ở trên

    // Format ngày an toàn
    const formatDate = (d) => {
      try {
        if (!d) return "";
        if (typeof d === "string" && d.includes('/')) return d;
        if (typeof d === "string") {
          const parts = d.split('-');
          if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
          }
          return d;
        }
        if (d && typeof d.format === 'function') return d.format('DD/MM/YYYY');
        if (d instanceof Date) return d.toLocaleDateString('vi-VN');
        return String(d);
      } catch (dateError) {
        console.warn('Lỗi format ngày:', dateError);
        return "";
      }
    };

    console.log('Bắt đầu tạo docDefinition...');
    
    // Lấy thông tin chi phí từ bookingData
    const { service, isExpressService } = bookingData;
    const { serviceCost, collectionCost, mediationCost, expressCost } = getCostBreakdown();
    
    // Tạo bảng chi phí động dựa trên các thành phần thực tế
    const costTableBody = [];
    
    // Phí dịch vụ - sử dụng giá trị đầy đủ, không chia đôi
    if (serviceCost > 0) {
      costTableBody.push([
        { text: 'Phí xét nghiệm dịch vụ', alignment: 'left' },
        { text: `${serviceCost.toLocaleString()} VND`, alignment: 'right' }
      ]);
    }
    
    // Phí thu mẫu
    if (collectionCost > 0) {
      costTableBody.push([
        { text: 'Phí thu mẫu', alignment: 'left' },
        { text: `${collectionCost.toLocaleString()} VND`, alignment: 'right' }
      ]);
    }
    
    // Phí vận chuyển/giao hàng
    if (mediationCost > 0) {
      const mediationMethodName = bookingData.selectedMedicationMethod === 'staff-collection' 
        ? 'Phí thu mẫu tại nhà' 
        : 'Phí gửi bưu điện';
      costTableBody.push([
        { text: mediationMethodName, alignment: 'left' },
        { text: `${mediationCost.toLocaleString()} VND`, alignment: 'right' }
      ]);
    }
    
    // Express service
    if (isExpressService && expressCost > 0) {
      costTableBody.push([
        { text: 'Express Service', alignment: 'left', color: '#fa8c16', bold: true },
        { text: `${expressCost.toLocaleString()} VND`, alignment: 'right', color: '#fa8c16', bold: true }
      ]);
    }
    
    // Tính tổng chi phí chính xác
    const calculatedTotal = serviceCost + collectionCost + mediationCost + expressCost;
    
    // Thêm dòng tổng cộng
    costTableBody.push(
      [
        { text: 'Cộng', bold: true, alignment: 'left' },
        { text: `${calculatedTotal.toLocaleString()} VND`, bold: true, alignment: 'right' }
      ],
      [
        { text: 'Tổng chi phí', bold: true, alignment: 'left' },
        { text: `${calculatedTotal.toLocaleString()} VND`, bold: true, alignment: 'right', color: '#e91e63' }
      ]
    );

    // ⭐ TẠO DOCDEFINITION GIỐNG HANDLEEXPORTPDF
    const docDefinition = {
      content: [
        {
          text: [
            { text: "Đơn yêu cầu xét nghiệm ADN\n", style: "header", alignment: "center" },
            { text: "Kính gửi: Cơ sở Y tế Genetix", alignment: "center" }
          ]
        },
        {
          columns: [
            {
              width: "*",
              text: [
                "Tôi tên là (viết hoa): ",
                { text: (firstPerson?.fullName || "").toUpperCase(), color: "#e91e63", bold: true },
                "    Giới tính: ",
                { text: firstPerson?.gender === "male" ? "Nam" : firstPerson?.gender === "female" ? "Nữ" : firstPerson?.gender || "", bold: true }
              ]
            }
          ]
        },
        {
      text: [
        "Địa chỉ: ",
        { 
          text: bookingData?.collectionMethod?.name === 'At Home' 
            ? (bookingData?.homeAddress || firstPerson?.address || "")
            : "7 D1 Street, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City", 
          color: "#e91e63", 
          bold: true 
        },
        "\n"
      ]
    },
        {
          text: [
            "Số CCCD/CMND: ",
            { text: firstPerson?.personalId || "Chưa cung cấp", color: "#e91e63", bold: true },
            "\n"
          ]
        },
        {
          text: [
            "Số điện thoại: ",
            { text: firstPerson?.phoneNumber || "", color: "#e91e63", bold: true },
            "    Email: ",
            { text: firstPerson?.email || "", color: "#e91e63", bold: true },
            "\n"
          ]
        },
        {
          text: "Đề nghị Genetix phân tích ADN và xác định mối quan hệ huyết thống cho những người cung cấp mẫu dưới đây:",
          margin: [0, 8, 0, 8]
        },
        {
          style: 'tableExample',
          table: {
            widths: [
              "auto", "*", "auto", "auto", "auto", "auto", "auto", "auto"
            ],
            body: [
              [
                { text: "STT", style: "tableHeader" },
                { text: "Họ và tên\n(kí hiệu mẫu)", style: "tableHeader" },
                { text: "Ngày sinh", style: "tableHeader" },
                { text: "Giới tính", style: "tableHeader" },
                { text: "Mối quan hệ", style: "tableHeader" },
                { text: "Loại mẫu", style: "tableHeader" },
                { text: "CCCD/CMND", style: "tableHeader" },
                { text: "Ngày thu mẫu", style: "tableHeader" }
              ],
              [
                "1",
                { text: (firstPerson?.fullName || "").toUpperCase(), color: "#e91e63", bold: true },
                { text: formatDate(firstPerson?.dateOfBirth), color: "#e91e63", bold: true },
                { text: firstPerson?.gender === "male" ? "Nam" : firstPerson?.gender === "female" ? "Nữ" : firstPerson?.gender || "", color: "#e91e63", bold: true },
                { text: firstPerson?.relationship || "", color: "#e91e63", bold: true },
                { text: firstPerson?.sampleType || "", color: "#e91e63", bold: true },
                { text: firstPerson?.personalId || "Chưa cung cấp", color: "#e91e63", bold: true },
                { text: formatDate(appointmentDate), color: "#2196f3", bold: true }
              ],
              [
                "2",
                { text: (secondPerson?.fullName || "").toUpperCase(), color: "#e91e63", bold: true },
                { text: formatDate(secondPerson?.dateOfBirth), color: "#e91e63", bold: true },
                { text: secondPerson?.gender === "male" ? "Nam" : secondPerson?.gender === "female" ? "Nữ" : secondPerson?.gender || "", color: "#e91e63", bold: true },
                { text: secondPerson?.relationship || "", color: "#e91e63", bold: true },
                { text: secondPerson?.sampleType || "", color: "#e91e63", bold: true },
                { text: secondPerson?.personalId || "", color: "#e91e63", bold: true },
                { text: formatDate(appointmentDate), color: "#2196f3", bold: true }
              ]
            ]
          },
          layout: {
            hLineWidth: function(i, node) { return 1; },
            vLineWidth: function(i, node) { return 1; },
            hLineColor: function(i, node) { return '#bdbdbd'; },
            vLineColor: function(i, node) { return '#bdbdbd'; },
            paddingLeft: function(i, node) { return 4; },
            paddingRight: function(i, node) { return 4; },
            paddingTop: function(i, node) { return 2; },
            paddingBottom: function(i, node) { return 2; }
          }
        },
        
        // ===== THÊM PHẦN CAM KẾT =====
        {
          text: "Tôi xin cam kết:",
          style: "commitmentHeader",
          bold: true,
          color: "#000000",
          margin: [0, 15, 0, 8]
        },
        {
          ol: [
            {
              text: "Tôi tự nguyện đề nghị xét nghiệm ADN và chấp nhận chi phí xét nghiệm.",
              margin: [0, 0, 0, 4]
            },
            {
              text: "Những thông tin tôi đã khai trên đây là đúng sự thật và không thay đổi.",
              margin: [0, 0, 0, 4]
            },
            {
              text: "Tôi không để người nhà, người quen đến phiền nhiễu, làm mất trật tự.",
              margin: [0, 0, 0, 4]
            },
            {
              text: "Những trường hợp sinh đôi, người ghép tủy, nhận máu, nếu không khai báo trung thực sẽ bị phạt gấp 2 lần lệ phí đã nộp.",
              margin: [0, 0, 0, 4]
            },
            {
              text: "Tôi đã đọc và chấp nhận các điều khoản của Viện tại trang 2 và trang 3 của đơn này và tôi đồng ý để Genetix thực hiện các phân tích ADN với các mẫu trên. Nếu vi phạm, tôi xin chịu hoàn toàn trách nhiệm trước pháp luật.",
              margin: [0, 0, 0, 4]
            }
          ],
          margin: [20, 0, 20, 15]
        },
        
        // ===== Bảng tổng chi phí =====
        {
          table: {
            widths: ['*', 'auto'],
            body: costTableBody
          },
          layout: {
            hLineWidth: function(i, node) {
              // Đường gạch đậm cho dòng "Cộng" và "Tổng chi phí"
              return (i === node.table.body.length - 2 || i === node.table.body.length - 1) ? 1.5 : 1;
            },
            vLineWidth: function(i, node) { return 0; },
            hLineColor: function(i, node) { return '#bdbdbd'; },
            paddingLeft: function(i, node) { return 4; },
            paddingRight: function(i, node) { return 4; },
            paddingTop: function(i, node) { return 3; },
            paddingBottom: function(i, node) { return 3; }
          },
          margin: [0, 10, 0, 0]
        },
        // ===== Phần ký tên, căn phải, có hình ảnh chữ ký =====
        {
          columns: [
            { 
              width: '*', 
              stack: []
            },
            {
              width: 220,
              stack: [
                { text: `Ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`, alignment: "center", italics: true, margin: [0, 0, 0, 20] },
                { text: "Người làm đơn", alignment: "center", italics: true },
                // Hình chữ ký (nếu có)
                signatureImg
                  ? { image: signatureImg, width: 120, alignment: "center", margin: [0, 10, 0, 0] }
                  : { text: "(Chưa ký)", alignment: "center", margin: [0, 20, 0, 0] },
                {
                  text: "(Ký và ghi rõ họ tên)\nNgười yêu cầu phân tích",
                  alignment: "center",
                  margin: [0, 10, 0, 0]
                }
              ]
            }
          ],
          margin: [0, 40, 0, 0]
        },
        
        // ===== TRANG 2: ĐIỀU KHOẢN DỊCH VỤ (PHẦN 1) =====
        { text: '', pageBreak: 'before' }, // Tạo trang mới
        {
          text: 'ĐIỀU KHOẢN DỊCH VỤ XÉT NGHIỆM ADN - GENETIX',
          style: 'termsHeader',
          alignment: 'center',
          margin: [0, 20, 0, 25]
        },
        {
          ol: [
            {
              text: 'Trung tâm cơ sở y tế xét nghiệm huyết thống DNA Genetix được Bộ Khoa Học và Công Nghệ cấp chứng nhận đăng ký hoạt động khoa học công nghệ số A-1889.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Người yêu cầu xét nghiệm phải là người không chịu sự quản thúc của pháp luật, có đầy đủ hành vi năng lực để thực hiện yêu cầu xét nghiệm cũng như tự chịu trách nhiệm về việc yêu cầu xét nghiệm của mình, sau đây gọi chung là "khách hàng".',
              margin: [0, 0, 0, 8]
            },
            {
              text: '\'Mẫu\', \'mẫu ADN\' hay "mẫu xét nghiệm quan hệ huyết thống cha-con, mẹ-con hoặc các mối quan hệ huyết thống khác" là các mẫu sinh học (máu, tế bào niêm mạc miệng, móng, tóc...) được lấy trực tiếp từ các bộ phận trên cơ thể của những người cần thực hiện phân tích mối quan hệ huyết thống và phải được lấy theo đúng quy trình thu mẫu của Viện.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Tất cả các mẫu xét nghiệm ADN phải được đựng riêng biệt vào các phong bì hay túi chứa mẫu và được ghi đầy đủ thông tin trùng khớp với thông tin trên Đơn yêu cầu xét nghiệm ADN. Viện sẽ sử dụng các thông tin này cho việc trả kết quả và không chịu trách nhiệm về độ chính xác của các thông tin mà "khách hàng" cung cấp. Các mẫu gửi đến Viện để xét nghiệm ADN không có đầy đủ thông tin ghi trên phong bì đựng mẫu và trên Đơn yêu cầu xét nghiệm ADN thì Viện có quyền hủy bỏ và không bảo lưu.',
              margin: [0, 0, 0, 8]
            },
            {
              text: '"Khách hàng" phải đảm bảo rằng các mẫu cần xét nghiệm ADN cung cấp cho Viện là hợp pháp (không có sự cưỡng chế hay sai phạm gì khi thu hoặc lấy mẫu); "Khách hàng" phải chấp nhận bồi thường cho bất kỳ tổn thất hoặc thiệt hại mà Viện phải chịu khi các mẫu có được không hợp pháp. Trừ trường hợp lấy mẫu bắt buộc khi có sự chỉ định của tòa án (trường hợp này phải tuân thủ theo đúng trình tự và thủ tục tố tụng của pháp luật, đồng thời được sự chấp thuận của Viện).',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Viện sẽ chỉ tiến hành xét nghiệm ADN khi "Đơn yêu cầu xét nghiệm ADN" có đầy đủ các thông tin cùng chữ ký của "khách hàng" yêu cầu xét nghiệm và nhận được thanh toán đủ số tiền chi phí tương ứng với yêu cầu dịch vụ xét nghiệm. Viện có quyền giữ lại các kết quả phân tích cho đến khi khách hàng thanh toán đủ tiền.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Khách hàng phải chịu mọi chi phí phát sinh trong quá trình chuyển phí xét nghiệm và mẫu tới Viện.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Khách hàng cam kết về thông tin khai trong tờ khai này là đúng sự thật và không được thay đổi. Những trường hợp sinh đôi, người ghép tủy, nhận máu, nếu không khai báo trung thực sẽ bị phạt gấp 2 lần lệ phí đã nộp.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Viện có trách nhiệm đảm bảo thời gian trả kết quả xét nghiệm theo đúng yêu cầu dịch vụ, nhưng không chấp nhận bất kỳ trách nhiệm nào về sự chậm trễ bị gây ra bởi một bên thứ ba.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Viện sẽ chỉ thông báo kết quả xét nghiệm cho người đã cung cấp các mẫu và hoàn thành biểu mẫu Đơn yêu cầu xét nghiệm ADN cùng chữ ký (hoặc đại diện hợp pháp). Kết quả xét nghiệm được trả cho khách hàng bằng các hình thức sau: Email, lấy trực tiếp hoặc xem kết quả trực tuyến.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Trường hợp kết luận trong kết quả xét nghiệm ADN của Viện được xác định là chưa chính xác bởi cơ quan hoặc đơn vị có thẩm quyền, Viện sẽ bồi thường gấp 3 lần số tiền mà khách hàng đã đóng đối với xét nghiệm đó. Các yêu cầu bồi thường sẽ không được chấp nhận khi đơn khiếu nại được gửi đến sau 06 tháng kể từ khi có kết quả.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Trường hợp xét nghiệm ADN tự nguyện – dân sự (mẫu do khách hàng tự cung cấp) kết quả xét nghiệm ADN chỉ có giá trị trên mẫu đó và không có giá trị pháp lý.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Mọi thắc mắc chỉ được giải quyết trong vòng 03 tháng kể từ ngày phát hành kết quả.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Kết quả xét nghiệm có thể sử dụng cho mục đích nghiên cứu khoa học.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Thông tin khách hàng được bảo mật, chỉ có người đứng tên xét nghiệm (hoặc người được ủy quyền) mới được trả kết quả. Chúng tôi cam kết không tiết lộ bất kỳ thông tin cá nhân cũng như kết quả của khách hàng cho bên thứ ba, trừ trường hợp có yêu cầu của cơ quan có thẩm quyền.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Kết quả xét nghiệm ADN có thể bị ảnh hưởng trong các trường hợp những người bố giả định có quan hệ huyết thống họ hàng.',
              margin: [0, 0, 0, 8]
            }
          ],
          margin: [20, 0, 20, 20]
        },
        // Thêm phần xác nhận đọc và đồng ý điều khoản
        {
          text: 'NGƯỜI YÊU CẦU PHÂN TÍCH ĐÃ ĐỌC KỸ VÀ ĐỒNG Ý VỚI CÁC ĐIỀU KHOẢN TRÊN',
          alignment: 'center',
          bold: true,
          margin: [0, 20, 0, 10]
        },
        {
          text: '(Ký và ghi rõ họ tên)',
          alignment: 'center',
          italics: true,
          margin: [0, 0, 0, 15]
        },
        // Thêm chữ ký vào phần xác nhận điều khoản
        {
          alignment: 'center',
          image: signatureImg,
          width: 150,
          margin: [0, 0, 0, 0]
        }
      ],
      styles: {
        header: { fontSize: 16, bold: true, margin: [0, 0, 0, 10] },
        termsHeader: { fontSize: 14, bold: true, color: '#1976d2' }, // Thêm style cho tiêu đề điều khoản
        tableHeader: { fillColor: "#1976d2", color: "white", bold: true, alignment: "center" },
        tableExample: { margin: [0, 5, 0, 15] },
        legalHeader: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
        pageNumber: { fontSize: 9, italics: true }
      },
      defaultStyle: { font: "Roboto", fontSize: 10, lineHeight: 1.3 }, // Giảm font size cho điều khoản
      
      // Thêm số trang ở góc phải phía dưới
      footer: function(currentPage, pageCount) {
        return {
          text: currentPage.toString() + '/' + pageCount,
          alignment: 'right',
          style: 'pageNumber',
          margin: [0, 0, 40, 10]
        };
      }
    };
    
    // Thêm trang 4 cho legal DNA testing
    console.log('Service Type:', bookingData.serviceType);
    if (bookingData.serviceType === 'legal') {
      console.log('Adding legal DNA testing page to PDF');
      // Lấy ngày hiện tại cho biên bản
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      
      // Địa chỉ lấy mẫu
      const sampleAddress = bookingData?.collectionMethod?.name === 'At Home' 
        ? (bookingData?.homeAddress || "")
        : "7 D1 Street, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City";
      
      // Thêm trang biên bản lấy mẫu xét nghiệm cho legal DNA testing
      docDefinition.content.push(
        { text: '', pageBreak: 'before' }, // Tạo trang mới
        {
          text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
          style: 'legalHeader',
          alignment: 'center'
        },
        {
          text: 'Độc lập – Tự do – Hạnh phúc',
          style: 'legalHeader',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: 'BIÊN BẢN LẤY MẪU XÉT NGHIỆM',
          style: 'legalHeader',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: [
            `Hôm nay, ngày ${day} tháng ${month} năm ${year}, tại `,
            { text: sampleAddress, bold: true }
          ],
          margin: [0, 0, 0, 10]
        },
        {
          text: 'Chúng tôi gồm có:',
          margin: [0, 0, 0, 10]
        },
        {
          text: 'Trung tâm cơ sở y tế dịch vụ xét nghiệm huyết thống ADN GENETIX',
          margin: [0, 0, 0, 10]
        },
        {
          text: [
            'Người yêu cầu xét nghiệm: ',
            { text: firstPerson?.fullName || "", bold: true },
            '   Địa chỉ thu mẫu: ',
            { text: sampleAddress, bold: true }
          ],
          margin: [0, 0, 0, 10]
        },
        {
          text: 'Chúng tôi tiến hành lấy mẫu của những người đề nghị xét nghiệm ADN. Các mẫu của từng người được lấy riêng rẽ như sau:',
          margin: [0, 0, 0, 20]
        },
        // Thông tin người thứ nhất
        {
          text: [
            'Họ và tên: ',
            { text: firstPerson?.fullName || "", bold: true },
            '                Ngày sinh: ',
            { text: formatDate(firstPerson?.dateOfBirth) || "", bold: true }
          ],
          margin: [0, 0, 0, 5]
        },
        {
          text: [
            'CCCD: ',
            { text: firstPerson?.personalId || "", bold: true },
            '            Loại mẫu: ',
            { text: firstPerson?.sampleType || "", bold: true }
          ],
          margin: [0, 0, 0, 5]
        },
        {
          text: [
            'Mối quan hệ: ',
            { text: firstPerson?.relationship || "", bold: true }
          ],
          margin: [0, 0, 0, 20]
        },
        // Thông tin người thứ hai
        {
          text: [
            'Họ và tên: ',
            { text: secondPerson?.fullName || "", bold: true },
            '               Ngày sinh: ',
            { text: formatDate(secondPerson?.dateOfBirth) || "", bold: true }
          ],
          margin: [0, 0, 0, 5]
        },
        {
          text: [
            'CCCD (nếu có): ',
            { text: secondPerson?.personalId || "", bold: true },
            '            Loại mẫu: ',
            { text: secondPerson?.sampleType || "", bold: true }
          ],
          margin: [0, 0, 0, 5]
        },
        {
          text: [
            'Mối quan hệ: ',
            { text: secondPerson?.relationship || "", bold: true }
          ],
          margin: [0, 0, 0, 40]
        },
                 // Phần ký tên
         {
           columns: [
             {
               width: '*',
               stack: [
                 { text: 'Viện xét nghiệm ADN Genetix\n', alignment: 'center', bold: true },
                 { 
                   svg: '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="none" stroke="#cc0000" stroke-width="8" stroke-opacity="0.9"/><text x="50%" y="50%" font-size="36" text-anchor="middle" dominant-baseline="middle" fill="#cc0000" font-weight="bold">GENETIX</text><text x="50%" y="25%" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="#cc0000" font-weight="bold" transform="rotate(-45, 100, 100)">Bloodline DNA Testing Centre</text><text x="50%" y="75%" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="#cc0000" font-weight="bold" transform="rotate(45, 100, 100)">Bloodline DNA Testing Centre</text><path d="M30,100 L45,100 M155,100 L170,100" stroke="#cc0000" stroke-width="3"/><path d="M100,30 L100,45 M100,155 L100,170" stroke="#cc0000" stroke-width="3"/><text x="25%" y="30%" font-size="12" text-anchor="middle" fill="#cc0000" font-weight="bold">★</text><text x="75%" y="30%" font-size="12" text-anchor="middle" fill="#cc0000" font-weight="bold">★</text></svg>',
                   width: 100,
                   alignment: 'center',
                   margin: [0, 5, 0, 5]
                 }
               ]
             },
             {
               width: '*',
               stack: [
                 { text: 'Người yêu cầu xét nghiệm\n', alignment: 'center', bold: true },
                 // Thêm chữ ký vào biên bản
                 signatureImg
                   ? { image: signatureImg, width: 100, alignment: "center", margin: [0, 10, 0, 5] }
                   : { text: "(Chưa ký)", alignment: "center", margin: [0, 10, 0, 5] },
                 { text: '(Ký và ghi rõ họ tên)', alignment: 'center', italics: true }
               ]
             }
           ],
           margin: [0, 0, 0, 20]
         }
      );
    }

    console.log('Bắt đầu tạo PDF...');
    
    try {
      // ⭐ TẠO VÀ DOWNLOAD PDF
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfMake = pdfMakeModule.default;
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      
      // Tạo một Promise để đảm bảo PDF được tạo hoàn toàn trước khi tải xuống
      await new Promise((resolve, reject) => {
        pdfDocGenerator.getBuffer((buffer) => {
          // Nếu có buffer, PDF đã được tạo thành công
          if (buffer) {
            console.log('PDF đã được tạo thành công, kích thước:', buffer.length);
            resolve();
          } else {
            reject(new Error('Không thể tạo buffer PDF'));
          }
        });
      });
      
      // Nếu shouldDownload là true thì tải xuống, ngược lại chỉ tạo PDF mà không tải xuống
      if (shouldDownload) {
        // Tải xuống file PDF
        pdfDocGenerator.download(`DonYeuCauXetNghiemADN_${paymentCode || 'DNA'}.pdf`);
        message.success('Tải file PDF thành công!');
      } else {
        // Tạo PDF nhưng không tải xuống, có thể trả về đối tượng PDF để sử dụng sau này
        message.success('Đã tạo file PDF thành công!');
      }
      
      if (loadingMessage) loadingMessage();
      console.log('✓ PDF đã được tạo thành công');
      
      return pdfDocGenerator; // Trả về đối tượng PDF để có thể sử dụng sau này
    } catch (pdfError) {
      console.error('Lỗi khi tạo hoặc tải xuống PDF:', pdfError);
      throw new Error(`Không thể tạo hoặc tải xuống PDF: ${pdfError.message}`);
    }
    
  } catch (error) {
    console.error('=== LỖI TẠO PDF ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    
    // Đảm bảo đóng loading message
    if (loadingMessage) loadingMessage();
    
    // Thông báo lỗi chi tiết hơn dựa trên loại lỗi
    if (error.message?.includes('vfs') || error.message?.includes('fonts')) {
      message.error('Lỗi tải fonts PDF. Đang thử lại với fonts mặc định...');
    } else if (error.message?.includes('Timeout')) {
      message.error('Quá thời gian tải thư viện PDF. Vui lòng kiểm tra kết nối mạng!');
    } else if (error.message?.includes('import') || error.message?.includes('loading') || error.message?.includes('thư viện')) {
      message.error('Lỗi tải thư viện PDF. Vui lòng refresh trang và thử lại!');
    } else if (error.message?.includes('chữ ký') || error.message?.includes('signature') || error.message?.includes('canvas')) {
      message.error('Lỗi xử lý chữ ký. Vui lòng ký lại!');
    } else if (error.message?.includes('Thiếu thông tin')) {
      message.error(`Thiếu thông tin cần thiết: ${error.message}`);
    } else {
      message.error(`Có lỗi xảy ra khi tạo file PDF: ${error.message}. Vui lòng thử lại!`);
    }
    
    return null;
  }
};

  // Step 4: Success
  const handleClose = () => {
    setCurrentStep(1);
    setPaymentMethod('cash');
    setQrCodeData(null);
    setPaymentCode('');
    setIsPaymentConfirmed(false);
    setShowPDFOption(false);
    // Reset các state mới
    setIsPDFConfirmStep(false);
    setFinalBookingData(null);
    setIsProcessingSignature(false);
    setIsGeneratingPDF(false);
    if (signatureRef.current && signatureRef.current.clear) signatureRef.current.clear();
    onCancel();
  };

  // Render info summary
  const kitTypes = [
    { value: 'K001', label: 'PowerPlex Fusion', price: 0 },
    { value: 'K002', label: 'Global Filer', price: 0 }
  ];

  const renderSummary = () => {
    const { serviceType, service, collectionMethod, medicationMethod, appointmentDate, timeSlot, isExpressService, totalCost, firstPerson, secondPerson, homeAddress, selectedKitType, bookingTime } = bookingData;
    const { serviceCost, mediationCost, expressCost } = getCostBreakdown();
    
    return (
      <div>
        {/* Header Warning */}
        <Alert
          message={<span style={{ fontWeight: 600 }}>⚠️ Thông tin không thể thay đổi sau khi đặt thành công, vui lòng kiểm tra kỹ!</span>}
          type="warning"
          showIcon
          style={{ 
            marginBottom: 24, 
            borderRadius: 8,
            border: '1px solid #faad14',
            backgroundColor: '#fffbe6'
          }}
        />

        {/* Service Information Card */}
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                backgroundColor: '#1890ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <UserOutlined style={{ color: 'white', fontSize: 16 }} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#1890ff' }}>Thông tin dịch vụ</span>
            </div>
          }
          style={{ 
            marginBottom: 20, 
            borderRadius: 12, 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e8f4fd'
          }}
          headStyle={{ 
            backgroundColor: '#f8fcff', 
            borderBottom: '1px solid #e8f4fd',
            borderRadius: '12px 12px 0 0'
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>LOẠI DỊCH VỤ</Text>
                <Text strong style={{ fontSize: 14, color: '#1890ff' }}>
                  {serviceType === 'legal' ? '🏛️ Legal DNA Testing' : '🧬 Non-Legal DNA Testing'}
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>TÊN DỊCH VỤ</Text>
                <Text strong style={{ fontSize: 14 }}>{service?.name}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>PHƯƠNG THỨC THU THẬP</Text>
                <Text strong style={{ fontSize: 14 }}>
                  {collectionMethod?.name === 'At Home' ? '🏠 ' : '🏥 '}{collectionMethod?.name}
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>KIT XÉT NGHIỆM</Text>
                <Text strong style={{ fontSize: 14 }}>
                  {selectedKitType ? (kitTypes.find(k => k.value === selectedKitType)?.label) : '—'}
                </Text>
              </div>
            </Col>
          </Row>
          
          <Divider style={{ margin: '16px 0' }} />
          
          {/* Address & Transport */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div style={{ padding: '12px 16px', backgroundColor: '#f6ffed', borderRadius: 8, border: '1px solid #b7eb8f' }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>📍 ĐỊA CHỈ THU THẬP</Text>
                <Text strong style={{ fontSize: 14, color: '#52c41a' }}>
                  {collectionMethod?.name === 'At Home' ? homeAddress || '—' : '7 D1 Street, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City'}
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>PHƯƠNG THỨC VẬN CHUYỂN</Text>
                <Text strong style={{ fontSize: 14 }}>{getMediationLabel(medicationMethod)}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: '12px 16px', backgroundColor: isExpressService ? '#fff2e8' : '#fafafa', borderRadius: 8, border: `1px solid ${isExpressService ? '#ffbb96' : '#f0f0f0'}` }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>EXPRESS SERVICE</Text>
                <Text strong style={{ fontSize: 14, color: isExpressService ? '#fa8c16' : '#666' }}>
                  {isExpressService ? '⚡ Có' : '❌ Không'}
                </Text>
              </div>
            </Col>
          </Row>
          
          {/* Appointment */}
          {appointmentDate && (
            <>
              <Divider style={{ margin: '16px 0' }} />
              <div style={{ padding: '16px', backgroundColor: '#e6f7ff', borderRadius: 8, border: '1px solid #91d5ff' }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>📅 LỊCH HẸN</Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CalendarOutlined style={{ color: '#1890ff', fontSize: 16 }} />
                    <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                      {moment(appointmentDate).format('DD/MM/YYYY (dddd)')}
                    </Text>
                  </div>
                  {timeSlot && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      backgroundColor: '#f6ffed',
                      padding: '6px 12px',
                      borderRadius: 20,
                      border: '1px solid #b7eb8f'
                    }}>
                      <ClockCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                      <Text strong style={{ color: '#52c41a', fontSize: 14 }}>{timeSlot}</Text>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Customer Information Card */}
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                backgroundColor: '#52c41a', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <TeamOutlined style={{ color: 'white', fontSize: 16 }} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#52c41a' }}>Thông tin người xét nghiệm</span>
            </div>
          }
          style={{ 
            marginBottom: 20, 
            borderRadius: 12, 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #f6ffed'
          }}
          headStyle={{ 
            backgroundColor: '#f6ffed', 
            borderBottom: '1px solid #d9f7be',
            borderRadius: '12px 12px 0 0'
          }}
        >
          <Row gutter={[16, 16]}>
            {/* Person 1 */}
            <Col span={12}>
              <div style={{ 
                padding: 16, 
                backgroundColor: '#fff', 
                borderRadius: 8, 
                border: '2px solid #1890ff',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: -10,
                  left: 12,
                  backgroundColor: '#1890ff',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  👤 NGƯỜI ĐẠI DIỆN
                </div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>HỌ VÀ TÊN</Text>
                    <br/>
                    <Text strong style={{ fontSize: 14 }}>{firstPerson?.fullName}</Text>
                  </div>
                  <Row gutter={8}>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>NGÀY SINH</Text>
                      <br/>
                      <Text style={{ fontSize: 13 }}>{firstPerson?.dateOfBirth?.format ? firstPerson.dateOfBirth.format('DD/MM/YYYY') : firstPerson?.dateOfBirth}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>GIỚI TÍNH</Text>
                      <br/>
                      <Text style={{ fontSize: 13 }}>{firstPerson?.gender}</Text>
                    </Col>
                  </Row>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>SỐ ĐIỆN THOẠI</Text>
                    <br/>
                    <Text style={{ fontSize: 13 }}>{firstPerson?.phoneNumber}</Text>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>EMAIL</Text>
                    <br/>
                    <Text style={{ fontSize: 13 }}>{firstPerson?.email}</Text>
                  </div>
                  <Row gutter={8} style={{ marginTop: 8 }}>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>MỐI QUAN HỆ</Text>
                      <br/>
                      <Text style={{ fontSize: 13 }}>{firstPerson?.relationship}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>LOẠI MẪU</Text>
                      <br/>
                      <Text style={{ fontSize: 13 }}>{firstPerson?.sampleType}</Text>
                    </Col>
                  </Row>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>SỐ CCCD/CMND</Text>
                    <br/>
                    <Text style={{ fontSize: 13 }}>{firstPerson?.personalId}</Text>
                  </div>
                </div>
              </div>
            </Col>
            
            {/* Person 2 */}
            <Col span={12}>
              <div style={{ 
                padding: 16, 
                backgroundColor: '#fff', 
                borderRadius: 8, 
                border: '2px solid #52c41a',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: -10,
                  left: 12,
                  backgroundColor: '#52c41a',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  👥 NGƯỜI THỨ HAI
                </div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>HỌ VÀ TÊN</Text>
                    <br/>
                    <Text strong style={{ fontSize: 14 }}>{secondPerson?.fullName}</Text>
                  </div>
                  <Row gutter={8}>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>NGÀY SINH</Text>
                      <br/>
                      <Text style={{ fontSize: 13 }}>{secondPerson?.dateOfBirth?.format ? secondPerson.dateOfBirth.format('DD/MM/YYYY') : secondPerson?.dateOfBirth}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>GIỚI TÍNH</Text>
                      <br/>
                      <Text style={{ fontSize: 13 }}>{secondPerson?.gender}</Text>
                    </Col>
                  </Row>
                  <Row gutter={8} style={{ marginTop: 8 }}>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>MỐI QUAN HỆ</Text>
                      <br/>
                      <Text style={{ fontSize: 13 }}>{secondPerson?.relationship}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>LOẠI MẪU</Text>
                      <br/>
                      <Text style={{ fontSize: 13 }}>{secondPerson?.sampleType}</Text>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Cost Breakdown Card */}
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                backgroundColor: '#fa8c16', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <CreditCardOutlined style={{ color: 'white', fontSize: 16 }} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#fa8c16' }}>Chi phí chi tiết</span>
            </div>
          }
          style={{ 
            marginBottom: 20, 
            borderRadius: 12, 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #fff2e8'
          }}
          headStyle={{ 
            backgroundColor: '#fff2e8', 
            borderBottom: '1px solid #ffbb96',
            borderRadius: '12px 12px 0 0'
          }}
        >
          <div style={{ padding: '8px 0' }}>
            <Row justify="space-between" style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#fafafa', borderRadius: 6 }}>
              <Text>💰 Service Cost</Text>
              <Text strong>{formatCurrency(serviceCost)}</Text>
            </Row>
            <Row justify="space-between" style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#fafafa', borderRadius: 6 }}>
              <Text>🚚 Mediation Method Cost</Text>
              <Text strong>{formatCurrency(mediationCost)}</Text>
            </Row>
            {isExpressService && (
              <Row justify="space-between" style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#fff2e8', borderRadius: 6 }}>
                <Text>⚡ Express Service Cost</Text>
                <Text strong style={{ color: '#fa8c16' }}>{formatCurrency(expressCost)}</Text>
              </Row>
            )}
            <Divider style={{ margin: '12px 0' }} />
            <Row justify="space-between" style={{ 
              padding: '12px 16px', 
              backgroundColor: '#e6f7ff', 
              borderRadius: 8, 
              border: '2px solid #1890ff' 
            }}>
              <Text strong style={{ fontSize: 16, color: '#1890ff' }}>💎 TỔNG CHI PHÍ</Text>
              <Text strong style={{ fontSize: 18, color: '#1890ff' }}>{formatCurrency(totalCost)}</Text>
            </Row>
          </div>
        </Card>

        {/* Payment Method Card */}
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                backgroundColor: paymentMethod === 'cash' ? '#52c41a' : '#1890ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {paymentMethod === 'cash' ? 
                  <CreditCardOutlined style={{ color: 'white', fontSize: 16 }} /> : 
                  <QrcodeOutlined style={{ color: 'white', fontSize: 16 }} />
                }
              </div>
              <span style={{ fontSize: 18, fontWeight: 600, color: paymentMethod === 'cash' ? '#52c41a' : '#1890ff' }}>Phương thức thanh toán</span>
            </div>
          }
          style={{ 
            borderRadius: 12, 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: `1px solid ${paymentMethod === 'cash' ? '#f6ffed' : '#e6f7ff'}`
          }}
          headStyle={{ 
            backgroundColor: paymentMethod === 'cash' ? '#f6ffed' : '#e6f7ff', 
            borderBottom: `1px solid ${paymentMethod === 'cash' ? '#d9f7be' : '#91d5ff'}`,
            borderRadius: '12px 12px 0 0'
          }}
        >
          <div style={{ 
            padding: '16px', 
            backgroundColor: paymentMethod === 'cash' ? '#f6ffed' : '#e6f7ff', 
            borderRadius: 8, 
            border: `2px solid ${paymentMethod === 'cash' ? '#52c41a' : '#1890ff'}`,
            textAlign: 'center'
          }}>
            {paymentMethod === 'cash' ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <CreditCardOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                <Text strong style={{ fontSize: 16, color: '#52c41a' }}>💵 Thanh toán tiền mặt khi nhận dịch vụ</Text>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <QrcodeOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                <Text strong style={{ fontSize: 16, color: '#1890ff' }}>📱 Quét mã QR để thanh toán</Text>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  // Render QR code
  const renderQRCode = () => (
    <div className="text-center">
      <div className="mb-4">Vui lòng quét mã QR để thanh toán:</div>
      <img src={qrCodeData} alt="QR Code" className="mx-auto mb-4" style={{ width: 200, height: 200 }} />
      <div className="mb-2">Mã thanh toán: <b>{paymentCode}</b></div>
      <div className="mb-4 text-sm text-gray-500">Sau khi thanh toán, nhấn "Xác nhận đã thanh toán" để tiếp tục.</div>
    </div>
  );

  // Render signature form với SignatureCanvas thật
  const renderSignature = () => (
    <div style={{ 
      textAlign: 'center', 
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px'
    }}>
      <Title level={3} style={{ 
        marginBottom: '30px', 
        color: '#1890ff',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        ✍️ Vui lòng ký tên để xác nhận
      </Title>
      
      <div style={{ 
        border: '3px dashed #1890ff', 
        borderRadius: '12px', 
        padding: '30px', 
        marginBottom: '24px', 
        backgroundColor: '#f8fcff',
        boxShadow: '0 4px 12px rgba(24, 144, 255, 0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{
            width: 700,
            height: 300,
            className: 'signature-canvas',
            style: { 
              border: '2px solid #e6f7ff', 
              borderRadius: '8px', 
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }
          }}
        />
      </div>
      
      <Space size="large" style={{ marginBottom: '20px' }}>
        <Button 
          type="default" 
          size="large"
          onClick={() => signatureRef.current?.clear()}
          disabled={isProcessingSignature}
          style={{ 
            height: '44px',
            padding: '0 24px',
            fontSize: '16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🗑️ Xóa chữ ký
        </Button>
      </Space>
      
      {isProcessingSignature && (
        <div style={{ 
          color: '#1890ff', 
          fontSize: '14px',
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <span>⏳ Đang xử lý chữ ký...</span>
        </div>
      )}
      
      <div style={{ 
        color: '#666', 
        fontSize: '16px', 
        lineHeight: '1.5',
        maxWidth: '600px',
        textAlign: 'center',
        backgroundColor: '#f6ffed',
        padding: '16px 24px',
        borderRadius: '8px',
        border: '1px solid #d9f7be'
      }}>
        💡 Vẽ chữ ký của bạn trong khung trên bằng chuột hoặc ngón tay.<br/>
        Chữ ký sẽ được sử dụng để xác nhận đơn đăng ký của bạn.
      </div>
    </div>
  );

    // Hàm tái tạo và tải PDF
const regenerateAndDownloadPDF = async (bookingCode) => {
  try {
    setIsGeneratingPDF(true);
    
    // Hiển thị thông báo đang xử lý
    const processingMsg = message.loading('Đang tạo lại file PDF...', 0);
    
    try {
      // Tái tạo PDF với dữ liệu hiện tại và tham số shouldDownload là true để tải xuống
      await generatePDF(true);
      
      // Đóng thông báo đang xử lý
      processingMsg();
      
      // Thông báo thành công
      message.success('Tải lại file PDF thành công!');
    } catch (pdfError) {
      // Đóng thông báo đang xử lý
      processingMsg();
      console.error('Lỗi khi tạo lại PDF:', pdfError);
      message.error(`Không thể tạo lại PDF: ${pdfError.message}. Vui lòng thử lại!`);
    }
  } catch (error) {
    console.error('Error regenerating PDF:', error);
    message.error('Không thể tải lại PDF. Vui lòng thử lại!');
  } finally {
    setIsGeneratingPDF(false);
  }
};

  // Render success với option xuất PDF
  const renderSuccess = () => {
    const getSuccessMessage = () => {
      const { collectionMethod, appointmentDate, timeSlot } = bookingData;
      const location = collectionMethod?.name === 'At Home' ? 'ở nhà' : 'ở cơ sở y tế';
      const appointmentInfo = appointmentDate && timeSlot ? 
        `đúng lịch hẹn ${moment(appointmentDate).format('DD/MM/YYYY')} lúc ${timeSlot}` : 
        'đúng lịch hẹn đã đặt';
      
      if (paymentMethod === 'cash') {
        return `Đặt lịch thành công! Vui lòng có mặt ${location} ${appointmentInfo} và thanh toán khi nhận dịch vụ.`;
      } else {
        return `Đặt lịch thành công! Vui lòng có mặt ${location} ${appointmentInfo}.`;
      }
    };

    return (
      <div className="text-center">
        <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
        <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>Đặt lịch thành công!</Title>
        <div style={{ marginBottom: '16px', fontSize: '16px' }}>
          {getSuccessMessage()}
        </div>
        <div style={{ marginBottom: '8px' }}>Mã đặt lịch: <b>{paymentCode}</b></div>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
          Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
        </div>
        
        {/* PDF Export Option */}
        {showPDFOption && (
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f6ffed', 
            border: '1px solid #b7eb8f', 
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <FileTextOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
            <div style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 'bold' }}>
              Xuất đơn đăng ký xét nghiệm DNA
            </div>
            <div style={{ marginBottom: '16px', color: '#666' }}>
              Bạn có muốn tải xuống file PDF đơn đăng ký không?
            </div>
            <Space>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                onClick={handleDownloadPDF}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Tải xuống PDF
              </Button>
              <Button onClick={handleSkipPDF}>
                Bỏ qua
              </Button>
            </Space>
          </div>
        )}
        
        {/* Thêm option tải lại PDF */}
        <div style={{ 
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #bae7ff'
        }}>
          <Text style={{ display: 'block', marginBottom: '12px' }}>
            📄 Bạn có thể tải lại file PDF bất cứ lúc nào
          </Text>
          <Button 
            type="link" 
            icon={<DownloadOutlined />}
            onClick={() => regenerateAndDownloadPDF(paymentCode)}
            loading={isGeneratingPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Đang tạo PDF...' : 'Tải lại PDF'}
          </Button>
        </div>
      </div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    // Nếu đang ở bước xác nhận PDF
    if (isPDFConfirmStep) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: '24px' }} />
          <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
            Ký tên thành công!
          </Title>
          <Text style={{ fontSize: '16px', color: '#666', display: 'block', marginBottom: '32px' }}>
            Bạn có muốn tải xuống file PDF đơn đăng ký trước khi hoàn tất đặt lịch không?
          </Text>
          
          {/* PDF Export Option */}
          <div style={{ 
            padding: '24px', 
            backgroundColor: '#f6ffed', 
            border: '1px solid #b7eb8f', 
            borderRadius: '12px',
            marginBottom: '24px',
            maxWidth: '500px',
            margin: '0 auto 24px auto'
          }}>
            <FileTextOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '12px' }} />
            <div style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
              Xuất đơn đăng ký xét nghiệm DNA
            </div>
            <div style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
              File PDF sẽ chứa đầy đủ thông tin đăng ký và chữ ký của bạn
            </div>
            <Space size="large">
              <Button 
                type="primary" 
                size="large"
                icon={<DownloadOutlined />}
                onClick={handleDownloadPDF}
                loading={isGeneratingPDF}
                disabled={isGeneratingPDF}
                style={{ 
                  backgroundColor: '#52c41a', 
                  borderColor: '#52c41a',
                  height: '48px',
                  padding: '0 32px',
                  fontSize: '16px'
                }}
              >
                {isGeneratingPDF ? 'Đang tạo PDF...' : 'Tải xuống PDF'}
              </Button>
              <Button 
                size="large"
                onClick={handleSkipPDF}
                disabled={isGeneratingPDF}
                style={{
                  height: '48px',
                  padding: '0 32px',
                  fontSize: '16px'
                }}
              >
                Bỏ qua, hoàn tất đặt lịch
              </Button>
            </Space>
          </div>
          
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 Bạn có thể tải file PDF sau trong phần lịch sử đặt lịch
          </Text>
        </div>
      );
    }
    
    switch (currentStep) {
      case 1:
        return renderSummary();
      case 2:
        // Step 2: QR Payment cho bank-transfer, Signature cho cash
        return paymentMethod === 'cash' ? renderSignature() : renderQRCode();
      case 3:
        // Step 3: Signature cho bank-transfer sau khi thanh toán
        return renderSignature();
      case 4:
        return renderSuccess();
      default:
        return null;
    }
  };

  // Render footer
  const renderFooter = () => {
    // Ẩn footer khi đang ở bước xác nhận PDF
    if (isPDFConfirmStep) {
      return null;
    }
    
    switch (currentStep) {
      case 1:
        return [
          <Button key="edit" onClick={handleEdit}>Edit</Button>,
          <Button key="confirm" type="primary" onClick={handleConfirm}>Xác nhận</Button>
        ];
      case 2:
        if (paymentMethod === 'cash') {
          // Cash flow: ở step ký tên
          return [
            <Button key="back" onClick={() => setCurrentStep(1)} disabled={isProcessingSignature}>Quay lại</Button>,
            <Button key="complete" type="primary" onClick={handleSignatureComplete} loading={isProcessingSignature} disabled={isProcessingSignature}>Ký tên</Button>
          ];
        } else {
          // QR flow: ở step thanh toán
          return [
            <Button key="back" onClick={() => setCurrentStep(1)}>Quay lại</Button>,
            <Button key="check" type="primary" onClick={handleCheckPayment}>Xác nhận đã thanh toán</Button>
          ];
        }
      case 3:
        // QR flow: ở step ký tên sau thanh toán
        return [
          <Button key="back" onClick={() => setCurrentStep(2)} disabled={isProcessingSignature}>Quay lại</Button>,
          <Button key="complete" type="primary" onClick={handleSignatureComplete} loading={isProcessingSignature} disabled={isProcessingSignature}>Ký tên</Button>
        ];
      case 4:
        return [
          <Button key="close" type="primary" onClick={handleClose}>Đóng</Button>
        ];
      default:
        return [];
    }
  };

  // Steps - động dựa trên phương thức thanh toán
  const getSteps = () => {
    if (paymentMethod === 'cash') {
      return [
        { title: 'Xác nhận' },
        { title: 'Ký tên' },
        { title: 'Hoàn thành' }
      ];
    } else {
      return [
        { title: 'Xác nhận' },
        { title: 'Thanh toán' },
        { title: 'Ký tên' },
        { title: 'Hoàn thành' }
      ];
    }
  };

  const getCurrentStepIndex = () => {
    if (paymentMethod === 'cash') {
      // Cash flow: 1->2->4 (bỏ qua step 3)
      if (currentStep === 1) return 0;
      if (currentStep === 2) return 1;
      if (currentStep === 4) return 2;
    } else {
      // QR flow: 1->2->3->4
      return currentStep - 1;
    }
    return 0;
  };

  return (
    <Modal
      title="Xác nhận đặt lịch"
      open={visible}
      onCancel={handleClose}
      footer={renderFooter()}
      width={1000}
      destroyOnClose
      centered
      styles={{
        body: {
          padding: '0',
          maxHeight: '80vh',
          overflowY: 'auto'
        }
      }}
      bodyStyle={{
        padding: '0',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}
    >
      <div style={{ padding: '32px' }}>
        <Steps current={getCurrentStepIndex()} items={getSteps()} className="mb-6" />
        {renderStepContent()}
      </div>
    </Modal>
  );
};

const BookingPage = () => {
  const { customerID } = useSelector(state => state.user);
  const [form] = Form.useForm();
  
  const [searchParams] = useSearchParams();
  const serviceID = searchParams.get('serviceID');
  const expressService = searchParams.get('express');
  
  // State cho form booking
  const [selectedServiceType, setSelectedServiceType] = useState('legal');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCollectionMethod, setSelectedCollectionMethod] = useState(null);
  const [selectedMedicationMethod, setSelectedMedicationMethod] = useState('walk-in');
  const [isExpressService, setIsExpressService] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [homeAddress, setHomeAddress] = useState('');
  const [selectedKitType, setSelectedKitType] = useState(''); // Thêm state cho loại kit
  
  // State cho modal xác nhận
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isServicePreSelected = Boolean(serviceID);
  const isExpressPreSelected = Boolean(expressService === 'true');
  const isStandardPreSelected = Boolean(expressService === 'false');
  const currentServicesData = selectedServiceType === 'legal' ? legalServicesData : nonLegalServicesData;
  const currentCollectionMethods = selectedServiceType === 'legal' ? legalCollectionMethodsData : nonLegalCollectionMethodsData;
  
  // Tính toán giá
  const calculateTotalCost = () => {
    let serviceCost = (selectedService && selectedService.basePrice) ? Number(selectedService.basePrice) : 0;
    let collectionCost = (selectedCollectionMethod && selectedCollectionMethod.price) ? Number(selectedCollectionMethod.price) : 0;
    let medicationCost = 0;
    let expressCost = 0;
    
    if (isExpressService) {
      expressCost = (selectedService && selectedService.expressPrice) ? Number(selectedService.expressPrice) : 1500000;
      if (selectedMedicationMethod === 'staff-collection') {
        medicationCost = 500000;
      } else if (selectedMedicationMethod === 'postal-delivery') {
        medicationCost = 250000;
      }
    } else {
      if (selectedMedicationMethod === 'staff-collection') {
        medicationCost = 500000;
      } else if (selectedMedicationMethod === 'postal-delivery') {
        medicationCost = 250000;
      }
    }
    
    const total = (isNaN(serviceCost) ? 0 : serviceCost) + 
                  (isNaN(collectionCost) ? 0 : collectionCost) + 
                  (isNaN(medicationCost) ? 0 : medicationCost) + 
                  (isNaN(expressCost) ? 0 : expressCost);
    
    return total;
  };
  
  // Time slots available
  const timeSlots = [
    '8:15 - 9:15',
    '9:30 - 10:30', 
    '10:45 - 11:45',
    '13:15 - 14:15',
    '14:30 - 15:30',
    '15:45 - 16:45'
  ];
  
  // Function để check xem time slot có bị disable không
  const isTimeSlotDisabled = (timeSlot) => {
    if (!appointmentDate) return false;
    
    const today = new Date();
    const selectedDate = new Date(appointmentDate);
    
    if (selectedDate.toDateString() !== today.toDateString()) {
      return false;
    }
    
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    const startTime = timeSlot.split(' - ')[0];
    const [hour, minute] = startTime.split(':').map(Number);
    const slotTime = hour * 60 + minute;
    
    return slotTime <= currentTime;
  };

  // Thêm function để kiểm tra xem tất cả khung giờ đã qua chưa
  const areAllTimeSlotsDisabled = () => {
    if (!appointmentDate) return false;
    
    const today = new Date();
    const selectedDate = new Date(appointmentDate);
    
    if (selectedDate.toDateString() !== today.toDateString()) {
      return false;
    }
    
    return timeSlots.every(timeSlot => isTimeSlotDisabled(timeSlot));
  };

  // Sample types
  const sampleTypes = [
    'Blood',
    'Buccal Swab',
    'Hair',
    'Nail',
    'Amniotic Fluid' // Thêm loại mẫu nước ối cho NIPT
  ];
  
  // Định nghĩa các cặp mối quan hệ hợp lệ
  const relationshipPairs = {
    'Father-Child': ['Father', 'Child'],
    'Mother-Child': ['Mother', 'Child'], 
    'Sibling-Sibling': ['Sibling', 'Sibling'],
    'Grandparent-Grandchild': ['Grandparent', 'Grandchild']
  };
  
  // Định nghĩa tên tiếng Việt cho các mối quan hệ
  const relationshipVietnameseNames = {
    'Father': 'Cha',
    'Mother': 'Mẹ',
    'Child': 'Con',
    'Sibling': 'Anh/Chị/Em ruột',
    'Grandparent': 'Ông/Bà',
    'Grandchild': 'Cháu',
    'Other': 'Khác'
  };

  // Map dịch vụ DNA testing với các cặp quan hệ hợp lệ
  const serviceRelationshipMap = new Map([
    // Paternity Testing (Cha-Con): Luôn là Cha – Con
    ['Paternity Testing', ['Father-Child']],
    
    // Maternity Testing (Mẹ-Con): Luôn là Mẹ – Con
    ['Maternity Testing', ['Mother-Child']],
    
    // Non-Invasive Relationship Testing (NIPT): Luôn là Cha – Con
    ['Non-Invasive Relationship Testing (NIPT)', ['Father-Child']],
    
    // Sibling Testing: Luôn là Anh/Chị/Em ruột
    ['Sibling Testing', ['Sibling-Sibling']],
    
    // Grandparent Testing: Luôn là Ông/Bà – Cháu
    ['Grandparent Testing', ['Grandparent-Grandchild']],
    
    // DNA Testing for Birth Registration: Có thể chọn Cha – Con hoặc Mẹ – Con
    ['DNA Testing for Birth Registration', ['Father-Child', 'Mother-Child']],
    
    // DNA Testing for Immigration Cases: Tất cả các cặp hợp lệ
    ['DNA Testing for Immigration Cases', ['Father-Child', 'Mother-Child', 'Sibling-Sibling', 'Grandparent-Grandchild']],
    
    // DNA Testing for Inheritance or Asset Division: Ưu tiên theo thứ tự
    ['DNA Testing for Inheritance or Asset Division', ['Father-Child', 'Mother-Child', 'Grandparent-Grandchild', 'Sibling-Sibling']]
  ]);

  // Hàm lọc mối quan hệ theo dịch vụ được chọn
  const getValidRelationshipsForService = (serviceName) => {
    if (!serviceName) return [];
    
    const validPairs = serviceRelationshipMap.get(serviceName) || [];
    const validRelationships = new Set();
    
    validPairs.forEach(pair => {
      const relationships = relationshipPairs[pair];
      if (relationships) {
        relationships.forEach(rel => validRelationships.add(rel));
      }
    });
    
    // Xử lý đặc biệt cho DNA Testing for Inheritance or Asset Division
    // Sắp xếp theo thứ tự ưu tiên: Father/Mother - Child > Grandparent - Grandchild > Sibling - Sibling
    if (serviceName === 'DNA Testing for Inheritance or Asset Division') {
      const orderedRelationships = [];
      
      // Thứ tự ưu tiên 1: Father/Mother - Child
      if (validRelationships.has('Father')) orderedRelationships.push('Father');
      if (validRelationships.has('Mother')) orderedRelationships.push('Mother');
      if (validRelationships.has('Child')) orderedRelationships.push('Child');
      
      // Thứ tự ưu tiên 2: Grandparent - Grandchild
      if (validRelationships.has('Grandparent')) orderedRelationships.push('Grandparent');
      if (validRelationships.has('Grandchild')) orderedRelationships.push('Grandchild');
      
      // Thứ tự ưu tiên 3: Sibling - Sibling
      if (validRelationships.has('Sibling')) orderedRelationships.push('Sibling');
      
      return orderedRelationships;
    }
    
    return Array.from(validRelationships);
  };

  // Thêm hàm để lấy mối quan hệ hợp lệ cho người thứ hai dựa trên người thứ nhất
  const getValidRelationshipsForSecondPerson = (serviceName, firstPersonRelationship) => {
    if (!serviceName || !firstPersonRelationship) {
      return getValidRelationshipsForService(serviceName);
    }
    
    const validPairs = serviceRelationshipMap.get(serviceName) || [];
    const validSecondPersonRelationships = new Set();
    
    validPairs.forEach(pairKey => {
      const pair = relationshipPairs[pairKey];
      if (pair) {
        // Nếu first person chọn pair[0], thì second person chỉ có thể chọn pair[1]
        if (pair[0] === firstPersonRelationship) {
          validSecondPersonRelationships.add(pair[1]);
        }
        // Nếu first person chọn pair[1], thì second person chỉ có thể chọn pair[0]
        else if (pair[1] === firstPersonRelationship) {
          validSecondPersonRelationships.add(pair[0]);
        }
      }
    });
    
    return Array.from(validSecondPersonRelationships);
  };

  // Hàm kiểm tra cặp mối quan hệ có hợp lệ với dịch vụ không
  const isValidRelationshipPair = (serviceName, relationship1, relationship2) => {
    if (!serviceName || !relationship1 || !relationship2) return false;
    
    const validPairs = serviceRelationshipMap.get(serviceName) || [];
    
    return validPairs.some(pairKey => {
      const pair = relationshipPairs[pairKey];
      if (!pair) return false;
      
      // Kiểm tra cả hai chiều của cặp quan hệ
      return (pair[0] === relationship1 && pair[1] === relationship2) ||
             (pair[0] === relationship2 && pair[1] === relationship1);
    });
  };

  // Cập nhật danh sách relationships dựa trên service được chọn
  const [availableRelationships, setAvailableRelationships] = useState([
    'Father', 'Mother', 'Child', 'Sibling',
    'Grandparent', 'Grandchild'
  ]);

  // Thêm state để quản lý available relationships cho second person
  const [availableSecondPersonRelationships, setAvailableSecondPersonRelationships] = useState([
    'Father', 'Mother', 'Child', 'Sibling',
    'Grandparent', 'Grandchild'
  ]);

  // Relationships
  const relationships = [
    'Father', 'Mother', 'Child', 'Sibling',
    'Grandparent', 'Grandchild', 'Other'
  ];

  // Validation functions
 const validateAge18 = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Vui lòng chọn ngày sinh!"));
    }

    // Convert moment object to JavaScript Date
    let birthDate;
    if (moment.isMoment(value)) {
      birthDate = value.toDate(); // Convert moment to native Date
    } else {
      birthDate = new Date(value);
    }

    if (isNaN(birthDate.getTime())) {
      return Promise.reject(new Error("Ngày sinh không hợp lệ!"));
    }

    const today = new Date();

    // Tính tuổi chính xác
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Nếu chưa đến tháng sinh hoặc đến tháng sinh nhưng chưa đến ngày sinh
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    console.log("-----------------------------");
    console.log("birthDate:", birthDate.toISOString().split("T")[0]);
    console.log("today:", today.toISOString().split("T")[0]);
    console.log("calculated age:", age);
    console.log("-----------------------------");

    if (age < 18) {
      return Promise.reject(
        new Error("Người đại diện phải từ 18 tuổi trở lên!")
      );
    }

    return Promise.resolve();
  };

  // Thêm hàm kiểm tra tuổi người thứ hai dựa trên mối quan hệ
  const validateSecondPersonAge = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Vui lòng chọn ngày sinh!"));
    }

    // Lấy mối quan hệ người thứ hai
    const relationship = form.getFieldValue(['secondPerson', 'relationship']);
    
    // Nếu chưa chọn relationship, chỉ validate là có chọn ngày sinh
    if (!relationship) {
      return Promise.resolve();
    }

    // Convert moment object to JavaScript Date
    let birthDate;
    if (moment.isMoment(value)) {
      birthDate = value.toDate();
    } else {
      birthDate = new Date(value);
    }

    if (isNaN(birthDate.getTime())) {
      return Promise.reject(new Error("Ngày sinh không hợp lệ!"));
    }

    const today = new Date();

    // Tính tuổi chính xác
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Nếu không phải là Child, phải từ 18 tuổi trở lên
    if (relationship !== 'Child' && age < 18) {
      return Promise.reject(
        new Error(`Người có mối quan hệ "${relationship}" phải từ 18 tuổi trở lên!`)
      );
    }

    // Đặc biệt kiểm tra Father và Mother, phải từ 18 tuổi trở lên
    if ((relationship === 'Father' || relationship === 'Mother') && age < 18) {
      return Promise.reject(
        new Error(`Người có mối quan hệ "${relationship}" phải từ 18 tuổi trở lên!`)
      );
    }

    return Promise.resolve();
  };

  // Kit Types
  const kitTypes = [
    { value: 'K001', label: 'PowerPlex Fusion', price: 0 },
    { value: 'K002', label: 'Global Filer', price: 0 }
  ];

  const validatePhoneNumber = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng nhập số điện thoại!'));
    }
    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error('Số điện thoại phải có 10-11 số (có thể bắt đầu bằng +84)!'));
    }
    return Promise.resolve();
  };

  const validatePersonalId = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng nhập số CCCD/CMND!'));
    }
    const idRegex = /^[0-9]{9}$|^[0-9]{12}$/;
    if (!idRegex.test(value)) {
      return Promise.reject(new Error('Số CCCD/CMND phải có 9 hoặc 12 số!'));
    }
    return Promise.resolve();
  };

  const validateAppointmentDate = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng chọn ngày hẹn!'));
    }
    if (moment(value).isBefore(moment(), 'day')) {
      return Promise.reject(new Error('Không được chọn ngày trong quá khứ!'));
    }
    return Promise.resolve();
  };

  // Cập nhật validation function cho relationship
  const validateRelationshipPair = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng chọn mối quan hệ!'));
    }
    
    return Promise.resolve(); // Chỉ validate required, không validate pair ở đây
  };

  // Tạo validation riêng cho second person để kiểm tra cặp
  const validateSecondPersonRelationship = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng chọn mối quan hệ!'));
    }
    
    const firstPersonRelationship = form.getFieldValue(['firstPerson', 'relationship']);
    
    // Chỉ kiểm tra cặp khi cả hai đã được chọn
    if (firstPersonRelationship && value && selectedService?.name) {
      if (!isValidRelationshipPair(selectedService.name, firstPersonRelationship, value)) {
        const validPairs = serviceRelationshipMap.get(selectedService.name) || [];
        const pairNames = validPairs.map(pair => {
          const relationships = relationshipPairs[pair];
          return relationships ? relationships.join(' - ') : pair;
        }).join(', ');
        
        return Promise.reject(new Error(`Cặp mối quan hệ không hợp lệ cho dịch vụ này. Các cặp hợp lệ: ${pairNames}`));
      }
    }
    
    return Promise.resolve();
  };

  const validateRelationshipDifferent = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng chọn mối quan hệ!'));
    }
    const firstPersonRelationship = form.getFieldValue(['firstPerson', 'relationship']);
    // Nếu một trong hai là 'Sibling' thì cho phép trùng
    if (value === 'Sibling' || firstPersonRelationship === 'Sibling') {
      return Promise.resolve();
    }
    if (value === firstPersonRelationship) {
      return Promise.reject(new Error('Mối quan hệ của người thứ hai phải khác với người đại diện (trừ trường hợp Sibling)!'));
    }
    return Promise.resolve();
  };

  const validateGenderRelationship = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng chọn mối quan hệ!'));
    }
    
    const gender = form.getFieldValue(['firstPerson', 'gender']);
    
    // Kiểm tra logic giới tính và quan hệ
    if (gender === 'male' && value === 'Mother') {
      return Promise.reject(new Error('Nam giới không thể chọn mối quan hệ "Mother"!'));
    }
    
    if (gender === 'female' && value === 'Father') {
      return Promise.reject(new Error('Nữ giới không thể chọn mối quan hệ "Father"!'));
    }
    
    return Promise.resolve();
  };

  const validateSecondPersonGenderRelationship = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng chọn mối quan hệ!'));
    }
    
    const gender = form.getFieldValue(['secondPerson', 'gender']);
    
    // Kiểm tra logic giới tính và quan hệ cho người thứ hai
    if (gender === 'male' && value === 'Mother') {
      return Promise.reject(new Error('Nam giới không thể chọn mối quan hệ "Mother"!'));
    }
    
    if (gender === 'female' && value === 'Father') {
      return Promise.reject(new Error('Nữ giới không thể chọn mối quan hệ "Father"!'));
    }
    
    // Kiểm tra cặp mối quan hệ hợp lệ
    const firstPersonRelationship = form.getFieldValue(['firstPerson', 'relationship']);
    if (firstPersonRelationship && value && selectedService?.name) {
      if (!isValidRelationshipPair(selectedService.name, firstPersonRelationship, value)) {
        const validPairs = serviceRelationshipMap.get(selectedService.name) || [];
        const pairNames = validPairs.map(pair => {
          const relationships = relationshipPairs[pair];
          return relationships ? relationships.join(' - ') : pair;
        }).join(', ');
        
        return Promise.reject(new Error(`Cặp mối quan hệ không hợp lệ cho dịch vụ này. Các cặp hợp lệ: ${pairNames}`));
      }
    }
    
    return Promise.resolve();
  };

  // Disable past dates
  const disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };

  // Reset timeSlot when switching to postal-delivery
  useEffect(() => {
    if (selectedMedicationMethod === 'postal-delivery') {
      setTimeSlot('');
      form.setFieldsValue({ timeSlot: undefined });
    }
  }, [selectedMedicationMethod, form]);

  // Theo dõi thay đổi của Person First và tự động điền cho Person Second nếu chưa có dữ liệu hoặc còn trống
  useEffect(() => {
    const first = form.getFieldValue('firstPerson');
    const second = form.getFieldValue('secondPerson');
    // Nếu first đã điền đủ và second chưa điền hoặc giống mặc định thì tự động copy
    if (
      first &&
      first.fullName &&
      first.dateOfBirth &&
      first.gender &&
      first.relationship &&
      first.sampleType &&
      (
        !second ||
        (!second.fullName && !second.dateOfBirth && !second.gender && !second.relationship && !second.sampleType)
      )
    ) {
      form.setFieldsValue({
        secondPerson: {
          ...second,
          fullName: first.fullName,
          dateOfBirth: first.dateOfBirth,
          gender: first.gender,
          relationship: first.relationship,
          sampleType: first.sampleType
        }
      });
    }
  }, [
    form,
    form.getFieldValue('firstPerson.fullName'),
    form.getFieldValue('firstPerson.dateOfBirth'),
    form.getFieldValue('firstPerson.gender'),
    form.getFieldValue('firstPerson.relationship'),
    form.getFieldValue('firstPerson.sampleType')
  ]);

  useEffect(() => {
    if (serviceID) {
      let foundService = legalServicesData.find(service => service.serviceID === serviceID);
      let serviceType = 'legal';
      
      if (!foundService) {
        foundService = nonLegalServicesData.find(service => service.serviceID === serviceID);
        serviceType = 'non-legal';
      }
      
      if (foundService) {
        setSelectedServiceType(serviceType);
        setSelectedService(foundService);
        
        const defaultCollectionMethods = serviceType === 'legal' ? legalCollectionMethodsData : nonLegalCollectionMethodsData;
        if (defaultCollectionMethods.length > 1) {
          setSelectedCollectionMethod(defaultCollectionMethods[1]);
        }
        
        setSelectedMedicationMethod('walk-in');
        
        if (expressService === 'true') {
          setIsExpressService(true);
          setSelectedMedicationMethod('express');
        }
      }
    }
  }, [serviceID, expressService]);
  
  const handleExpressServiceChange = (checked) => {
    setIsExpressService(checked);
    
    // Nếu tick Express Service và đang chọn Postal Delivery, reset về null
    if (checked && selectedMedicationMethod === 'postal-delivery') {
      setSelectedMedicationMethod(null);
    }
    
    if (checked) {
      setSelectedMedicationMethod('express');
    } else {
      if (selectedCollectionMethod?.name === 'At Facility') {
        setSelectedMedicationMethod('walk-in');
      } else if (selectedCollectionMethod?.name === 'At Home') {
        setSelectedMedicationMethod('staff-collection');
      }
    }
  };
  
  // Thêm useEffect để cập nhật relationships khi service thay đổi
  useEffect(() => {
    if (selectedService?.name) {
      const validRelationships = getValidRelationshipsForService(selectedService.name);
      setAvailableRelationships(validRelationships.length > 0 ? validRelationships : [
        'Father', 'Mother', 'Child', 'Sibling',
        'Grandparent', 'Grandchild'
      ]);
      
      // Reset relationships trong form khi service thay đổi
      form.setFieldsValue({
        firstPerson: { ...form.getFieldValue('firstPerson'), relationship: undefined },
        secondPerson: { ...form.getFieldValue('secondPerson'), relationship: undefined }
      });
      
      // Reset available relationships cho second person
      setAvailableSecondPersonRelationships(validRelationships.length > 0 ? validRelationships : [
        'Father', 'Mother', 'Child', 'Sibling',
        'Grandparent', 'Grandchild'
      ]);
      
      // Xử lý đặc biệt cho NIPT
      if (selectedService.name === 'Non-Invasive Relationship Testing (NIPT)') {
        // Nếu là NIPT, reset mẫu của người thứ hai (Child) và đặt là null
        form.setFieldsValue({
          secondPerson: { 
            ...form.getFieldValue('secondPerson'),
            sampleType: 'Amniotic Fluid' // Mẫu nước ối cho NIPT
          }
        });
      }
    }
  }, [selectedService, form]);

  // Cập nhật useEffect để theo dõi thay đổi của first person relationship
  useEffect(() => {
    const firstPersonRelationship = form.getFieldValue(['firstPerson', 'relationship']);
    
    if (selectedService?.name && firstPersonRelationship) {
      // Cập nhật available relationships cho second person dựa trên first person
      const validSecondRelationships = getValidRelationshipsForSecondPerson(
        selectedService.name, 
        firstPersonRelationship
      );
      setAvailableSecondPersonRelationships(validSecondRelationships.length > 0 
        ? validSecondRelationships 
        : availableRelationships
      );
      
      // Reset second person relationship nếu không còn hợp lệ
      const currentSecondRelationship = form.getFieldValue(['secondPerson', 'relationship']);
      if (currentSecondRelationship && !validSecondRelationships.includes(currentSecondRelationship)) {
        form.setFieldsValue({
          secondPerson: {
            ...form.getFieldValue('secondPerson'),
            relationship: undefined
          }
        });
      }
      
      // Xử lý đặc biệt cho NIPT
      if (selectedService.name === 'Non-Invasive Relationship Testing (NIPT)' && 
          firstPersonRelationship === 'Father' &&
          validSecondRelationships.includes('Child')) {
        // Tự động chọn Child cho người thứ hai
        form.setFieldsValue({
          secondPerson: {
            ...form.getFieldValue('secondPerson'),
            relationship: 'Child',
            sampleType: 'Amniotic Fluid' // Mẫu nước ối cho NIPT
          }
        });
      }
    } else {
      // Nếu chưa chọn service hoặc first person relationship, hiển thị tất cả
      setAvailableSecondPersonRelationships(availableRelationships);
    }
  }, [
    selectedService?.name,
    form.getFieldValue(['firstPerson', 'relationship']),
    availableRelationships,
    form
  ]);

  useEffect(() => {
    // Trigger validation cho relationship khi gender thay đổi
    const firstPersonGender = form.getFieldValue(['firstPerson', 'gender']);
    const secondPersonGender = form.getFieldValue(['secondPerson', 'gender']);
    
    if (firstPersonGender) {
      form.validateFields([['firstPerson', 'relationship']]);
    }
    
    if (secondPersonGender) {
      form.validateFields([['secondPerson', 'relationship']]);
    }
  }, [
    form.getFieldValue(['firstPerson', 'gender']),
    form.getFieldValue(['secondPerson', 'gender'])
  ]);

  useEffect(() => {
    if (!serviceID && currentServicesData.length > 0) {
      setSelectedService(currentServicesData[0]);
    }
    if (currentCollectionMethods.length > 0) {
      setSelectedCollectionMethod(currentCollectionMethods[1]);
    }
  }, [selectedServiceType, serviceID, currentServicesData, currentCollectionMethods]);
  
  const handleConfirmBooking = (values) => {
    // Lấy giá trị mới nhất từ Form (tránh lỗi khi Form chưa cập nhật kịp)
    const appointmentDateValue = form.getFieldValue('appointmentDate');
    const timeSlotValue = form.getFieldValue('timeSlot');

    // Validation bổ sung cho các trường bắt buộc
    if (!selectedService) {
      message.error('Vui lòng chọn dịch vụ!');
      return;
    }
    if (!selectedCollectionMethod) {
      message.error('Vui lòng chọn phương thức lấy mẫu!');
      return;
    }
    if (!selectedMedicationMethod) {
      message.error('Vui lòng chọn phương thức medication!');
      return;
    }
    if (!selectedKitType) {
      message.error('Vui lòng chọn loại kit!');
      return;
    }

    // Validation cho appointment date (bắt buộc cho tất cả trừ postal delivery)
    if (selectedMedicationMethod !== 'postal-delivery' && !appointmentDateValue) {
      message.error('Vui lòng chọn ngày hẹn!');
      return;
    }

    // Validation cho time slot (bắt buộc khi có appointment date và không phải postal delivery)
    if (selectedMedicationMethod !== 'postal-delivery' && appointmentDateValue && !timeSlotValue) {
      message.error('Vui lòng chọn khung giờ!');
      return;
    }

    // Validation cho home address (bắt buộc khi chọn at home hoặc postal delivery)
    if ((selectedCollectionMethod?.name === 'At Home' || selectedMedicationMethod === 'postal-delivery') && (!homeAddress || homeAddress.trim() === '')) {
      message.error('Vui lòng nhập địa chỉ nhà khi chọn lấy mẫu tại nhà hoặc giao hàng tận nơi!');
      return;
    }

    // Validation cho thông tin người thứ nhất (bắt buộc)
    if (!values.firstPerson?.fullName || values.firstPerson.fullName.trim() === '') {
      message.error('Vui lòng nhập họ và tên người thứ nhất!');
      return;
    }
    if (!values.firstPerson?.email || values.firstPerson.email.trim() === '') {
      message.error('Vui lòng nhập email người thứ nhất!');
      return;
    }
    if (!values.firstPerson?.gender) {
      message.error('Vui lòng chọn giới tính người thứ nhất!');
      return;
    }
    if (!values.firstPerson?.relationship) {
      message.error('Vui lòng chọn mối quan hệ người thứ nhất!');
      return;
    }
    if (!values.firstPerson?.sampleType) {
      message.error('Vui lòng chọn loại mẫu người thứ nhất!');
      return;
    }
    if (!values.firstPerson?.personalId) {
      message.error('Vui lòng nhập số CCCD/CMND người thứ nhất!');
      return;
    }

    // Validation cho thông tin người thứ hai (bắt buộc)
    if (!values.secondPerson?.fullName || values.secondPerson.fullName.trim() === '') {
      message.error('Vui lòng nhập họ và tên người thứ hai!');
      return;
    }
    if (!values.secondPerson?.dateOfBirth) {
      message.error('Vui lòng chọn ngày sinh người thứ hai!');
      return;
    }
    if (!values.secondPerson?.gender) {
      message.error('Vui lòng chọn giới tính người thứ hai!');
      return;
    }
    if (!values.secondPerson?.sampleType) {
      message.error('Vui lòng chọn loại mẫu người thứ hai!');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const bookingData = {
        customerID,
        serviceType: selectedServiceType,
        service: selectedService,
        collectionMethod: selectedCollectionMethod,
        medicationMethod: selectedMedicationMethod,
        appointmentDate: appointmentDateValue ? appointmentDateValue.format('YYYY-MM-DD') : '',
        timeSlot: selectedMedicationMethod === 'postal-delivery' ? null : timeSlotValue,
        firstPerson: values.firstPerson,
        secondPerson: values.secondPerson,
        totalCost: calculateTotalCost(),
        paymentMethod,
        bookingTime: new Date().toISOString(),
        // Thêm các trường mới để ConfirmBookingModal luôn nhận được dữ liệu mới nhất
        homeAddress,
        selectedKitType,
        isExpressService,
      };
      setBookingData(bookingData); // Đảm bảo bookingData luôn là dữ liệu mới nhất
      setIsModalVisible(true);
    } catch {
      message.error('Có lỗi xảy ra!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Thêm function xử lý khi hoàn tất booking từ modal
  const handleBookingComplete = async (finalBookingData) => {
    try {
      setIsSubmitting(true);
      
      // Tạm thời lưu vào localStorage thay vì gọi API
      // TODO: Thay thế bằng API thực tế khi backend sẵn sàng
      const bookingId = `BOOKING_${Date.now()}`;
      const bookingWithId = {
        ...finalBookingData,
        bookingId,
        createdAt: new Date().toISOString()
      };
      
      // Lưu vào localStorage
      const existingBookings = JSON.parse(localStorage.getItem('dna_bookings') || '[]');
      existingBookings.push(bookingWithId);
      localStorage.setItem('dna_bookings', JSON.stringify(existingBookings));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Đặt lịch thành công!');
      form.resetFields();
      setAppointmentDate('');
      setTimeSlot('');
      setIsModalVisible(false);
      setBookingData(null);
      
      // Reset form về trạng thái ban đầu
      setSelectedService(null);
      setSelectedCollectionMethod(null);
      setSelectedMedicationMethod('');
      setSelectedKitType(null);
      setHomeAddress('');
      setIsExpressService(false);
      
    } catch (error) {
      console.error('Error saving booking:', error);
      message.error('Có lỗi xảy ra khi lưu thông tin đặt lịch! Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function đóng modal
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setBookingData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <h1 className="text-2xl font-bold">DNA Testing Booking</h1>
        <p className="text-blue-100">Booking Bloodline DNA Testing</p>
      </div>
      
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Service Information */}
        <div className="lg:col-span-2 space-y-6">
              
          {/* Service Booking Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaUser className="mr-2 text-blue-600" />
              Service Booking Information
            </h2>
            
            {/* Service Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Service Type *</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => !isServicePreSelected && setSelectedServiceType('legal')}
                  disabled={isServicePreSelected}
                  className={`px-4 py-2 rounded-md transition-all ${
                    selectedServiceType === 'legal' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  } ${
                    isServicePreSelected 
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-500 hover:text-white cursor-pointer'
                  }`}
                >
                  Legal DNA Testing
                  {isServicePreSelected && selectedServiceType === 'legal' && (
                    <span className="ml-2 text-xs bg-blue-800 px-2 py-1 rounded">Đã chọn</span>
                  )}
                </button>
                <button
                  onClick={() => !isServicePreSelected && setSelectedServiceType('non-legal')}
                  disabled={isServicePreSelected}
                  className={`px-4 py-2 rounded-md transition-all ${
                    selectedServiceType === 'non-legal' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  } ${
                    isServicePreSelected 
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-500 hover:text-white cursor-pointer'
                  }`}
                >
                  Non-Legal DNA Testing
                  {isServicePreSelected && selectedServiceType === 'non-legal' && (
                    <span className="ml-2 text-xs bg-blue-800 px-2 py-1 rounded">Đã chọn</span>
                  )}
                </button>
              </div>
             
            </div>
            
            {/* Service Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Service *</label>
              <select
                value={selectedService?.serviceID || ''}
                onChange={(e) => {
                  if (!isServicePreSelected) {
                    const service = currentServicesData.find(s => s.serviceID === e.target.value);
                    setSelectedService(service);
                  }
                }}
                disabled={isServicePreSelected}
                className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 ${
                  isServicePreSelected 
                    ? 'bg-gray-100 cursor-not-allowed opacity-75 text-gray-600'
                    : 'bg-white cursor-pointer'
                }`}
              >
                {currentServicesData.map(service => (
                  <option key={service.serviceID} value={service.serviceID}>
                    {service.name}
                  </option>
                ))}
              </select>
              
              {/* Thông báo đặc biệt cho các dịch vụ */}
              {selectedService?.name === 'DNA Testing for Inheritance or Asset Division' && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-start">
                    <InfoCircleOutlined className="text-blue-600 mr-2 mt-1" />
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Thứ tự ưu tiên mối quan hệ:</p>
                      <ol className="text-xs text-blue-600 list-decimal pl-5 mt-1">
                        <li>Cha/Mẹ - Con</li>
                        <li>Ông/Bà - Cháu</li>
                        <li>Anh/Chị/Em ruột</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedService?.name === 'Non-Invasive Relationship Testing (NIPT)' && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-start">
                    <InfoCircleOutlined className="text-blue-600 mr-2 mt-1" />
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Xét nghiệm thai nhi không xâm lấn</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Mẫu của thai nhi (Child) sẽ tự động được thiết lập là "Amniotic Fluid" (nước ối)
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedService?.name === 'DNA Testing for Birth Registration' && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-start">
                    <InfoCircleOutlined className="text-blue-600 mr-2 mt-1" />
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Xét nghiệm ADN cho đăng ký khai sinh</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Cho phép chọn một trong hai cặp quan hệ: Cha - Con hoặc Mẹ - Con
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedService?.name === 'DNA Testing for Immigration Cases' && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-start">
                    <InfoCircleOutlined className="text-blue-600 mr-2 mt-1" />
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Xét nghiệm ADN cho di cư/nhập tịch</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Hỗ trợ tất cả các cặp quan hệ hợp lệ: Cha - Con, Mẹ - Con, Anh/Chị/Em ruột, Ông/Bà - Cháu
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Express Service Checkbox */}
            <div className="mb-4">
              <div className={`flex items-center p-4 border rounded-lg ${
                isStandardPreSelected 
                  ? 'border-orange-200 bg-orange-50' 
                  : 'border-orange-200 bg-orange-50'
              }`}>
                <input
                  type="checkbox"
                  id="expressService"
                  checked={isExpressService}
                  onChange={(e) => handleExpressServiceChange(e.target.checked)}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                />
                <label htmlFor="expressService" className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium flex items-center text-orange-700">
                        <FaClock className="mr-2" />
                        Express Service
                      </span>
                      <p className="text-sm mt-1 text-orange-600">
                        Xử lý nhanh và ưu tiên cao - Kết quả trong thời gian ngắn nhất
                      </p>
                      <p className="text-sm font-semibold mt-1 text-orange-600">
                        Phí thêm: {selectedService?.expressPrice ? `${selectedService.expressPrice.toLocaleString()} đ` : '1,500,000 đ'}
                      </p>
                    </div>
                    {isExpressPreSelected && isExpressService && (
                      <div className="flex items-center text-orange-600">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm8-2v2H7V7a3 3 0 0 1 6 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-medium">Đã chọn</span>
                      </div>
                    )}
                    {isStandardPreSelected && (
                      <div className="flex items-center text-orange-400">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm8-2v2H7V7a3 3 0 0 1 6 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-medium">Không khả dụng</span>
                      </div>
                    )}
                  </div>
                </label>
              </div>
              
             
            </div>
            
            {/* Collection Method */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Collection Method *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  onClick={() => {
                    setSelectedCollectionMethod({name: 'At Home', price: 0});
                    // Nếu đang là At Facility thì chuyển sang At Home, nếu medication method không hợp lệ thì set lại
                    if (selectedMedicationMethod === 'walk-in' || selectedMedicationMethod === 'express') {
                      setSelectedMedicationMethod('staff-collection');
                    }
                    // Reset timeSlot, appointmentDate khi chuyển collection method
                    setTimeSlot('');
                    setAppointmentDate('');
                    form.setFieldsValue({ timeSlot: undefined, appointmentDate: undefined });
                  }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedCollectionMethod?.name === 'At Home'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <FaUser className="text-blue-600 mr-2" />
                    <span className="font-medium">At Home</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Sample collection at your home</p>
                  <p className="text-sm font-semibold text-blue-600">Free</p>
                </div>
                
                <div
                  onClick={() => {
                    setSelectedCollectionMethod({name: 'At Facility', price: 0});
                    setSelectedMedicationMethod('walk-in');
                    // Reset timeSlot, appointmentDate khi chuyển collection method
                    setTimeSlot('');
                    setAppointmentDate('');
                    form.setFieldsValue({ timeSlot: undefined, appointmentDate: undefined });
                  }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedCollectionMethod?.name === 'At Facility'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-blue-600 mr-2" />
                    <span className="font-medium">At Facility</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Visit our facility for sample collection</p>
                  <p className="text-sm font-semibold text-blue-600">Free</p>
                </div>
              </div>
              
              {/* Address Information - hiển thị bên dưới Collection Method */}
              {selectedCollectionMethod?.name === 'At Home' && (
                <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-start mb-3">
                    <FaMapMarkerAlt className="text-blue-600 mr-2 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-blue-700 mb-2">Địa chỉ nhà *</label>
                      <p className="text-sm text-blue-600 mb-3"> Vui lòng cung cấp địa chỉ địa nhà chính xác của bạn.</p>
                    </div>
                  </div>
                  <textarea
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    placeholder="Nhập địa chỉ đầy đủ (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                    required
                  />
                </div>
              )}
              
              {selectedCollectionMethod?.name === 'At Facility' && (
                <div className="mt-4 p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-green-600 mr-2 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-green-700 mb-2">Địa chỉ cơ sở</label>
                      <div className="p-3 bg-white border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-700 mb-1">
                          7 D1 Street, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City
                        </p>
                        <p className="text-xs text-green-600">
                          📍 Vui lòng đến địa chỉ trên để thực hiện thu thập mẫu
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Medication Method */}
            {selectedCollectionMethod && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Medication Method *</label>
                <div className="space-y-3">
                  {/* Walk-in - Only for At Facility */}
                  {selectedCollectionMethod?.name === 'At Facility' && (
                    <div
                      onClick={() => !isExpressPreSelected && setSelectedMedicationMethod('walk-in')}
                      className={`p-4 border rounded-lg transition-all ${
                        selectedMedicationMethod === 'walk-in'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${
                        isExpressPreSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center">
                        <FaUser className="text-blue-600 mr-2" />
                        <div>
                          <span className="font-medium">Walk-in</span>
                          <p className="text-sm text-gray-600">Direct visit to facility</p>
                          <p className="text-sm font-semibold text-blue-600">Free</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Staff Collection - Only for At Home */}
                  {selectedCollectionMethod?.name === 'At Home' && (
                    <div
                      onClick={() => setSelectedMedicationMethod('staff-collection')}
                      className={`p-4 border rounded-lg transition-all cursor-pointer ${
                        selectedMedicationMethod === 'staff-collection'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <FaUser className="text-blue-600 mr-2" />
                        <div>
                          <span className="font-medium">Staff Collection</span>
                          <p className="text-sm text-gray-600">Professional staff will collect samples</p>
                          <p className="text-sm font-semibold text-blue-600">500,000 đ</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Postal Delivery - Hidden when Express Service is selected */}
                  {selectedCollectionMethod?.name === 'At Home' && 
                   selectedServiceType !== 'legal' && 
                   !isExpressService && (
                    <div
                      onClick={() => setSelectedMedicationMethod('postal-delivery')}
                      className={`p-4 border rounded-lg transition-all cursor-pointer ${
                        selectedMedicationMethod === 'postal-delivery'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <FaEnvelope className="text-blue-600 mr-2" />
                        <div>
                          <span className="font-medium">Postal Delivery</span>
                          <p className="text-sm text-gray-600">Sample collection kit delivered by post</p>
                          <p className="text-sm font-semibold text-blue-600">250,000 đ</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Kit Type Selection */}
            {selectedMedicationMethod && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Kit Type Selection *</label>
                <p className="text-sm text-gray-600 mb-3">
                  📋 Chọn loại kit sẽ được sử dụng cho cả hai người tham gia xét nghiệm
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {kitTypes.map(kit => (
                    <div
                      key={kit.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedKitType === kit.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedKitType(kit.value)}
                    >
                      <div className="font-medium">{kit.label}</div>
                      <p className="text-sm text-gray-600 mb-2">
                        {kit.value === 'K001' 
                          ? 'Kit xét nghiệm DNA với công nghệ PowerPlex Fusion'
                          : 'Kit xét nghiệm DNA với công nghệ Global Filer'
                        }
                      </p>
                      <p className="text-sm font-semibold text-blue-600">
                        {kit.price === 0 ? 'Miễn phí' : `${kit.price.toLocaleString()} đ`}
                      </p>
                      {selectedKitType === kit.value && (
                        <div className="flex items-center text-blue-600 mt-2">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-medium">Đã chọn</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {selectedKitType && (
                  <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-700 mb-1">
                          Kit đã chọn: {kitTypes.find(k => k.value === selectedKitType)?.label}
                        </p>
                        <p className="text-xs text-blue-600">
                          ✅ Kit này sẽ được sử dụng cho cả hai người tham gia xét nghiệm
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Appointment Schedule - Di chuyển lên đây */}
            <Card 
              title={
                <Space>
                  <CalendarOutlined style={{ color: '#1890ff' }} />
                  <span>Lịch hẹn</span>
                </Space>
              }
              style={{ marginBottom: 24 }}
            >
              {/* Date Selection */}
              <div className="mb-6">
                <Form.Item
                  name="appointmentDate"
                  label="Ngày hẹn"
                  rules={[{ validator: validateAppointmentDate }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    placeholder="Chọn ngày hẹn"
                    format="DD/MM/YYYY"
                    disabledDate={disabledDate}
                    value={form.getFieldValue('appointmentDate')}
                    onChange={(date) => {
                      form.setFieldsValue({ appointmentDate: date });
                      setAppointmentDate(date ? date.format('YYYY-MM-DD') : '');
                      // Reset time slot when date changes
                      form.setFieldsValue({ timeSlot: undefined });
                      setTimeSlot('');
                    }}
                  />
                </Form.Item>
              </div>

              {/* Time Selection - Only show when date is selected AND not postal delivery */}
              {appointmentDate && selectedMedicationMethod !== 'postal-delivery' && (
                <div>
                  <Form.Item
                    name="timeSlot"
                    label="Khung giờ"
                    rules={[{ required: true, message: 'Vui lòng chọn khung giờ!' }]}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {timeSlots.map(time => {
                        const isDisabled = isTimeSlotDisabled(time);
                        return (
                          <div
                            key={time}
                            className={`
                              p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 text-center flex items-center justify-center
                              ${
                                timeSlot === time
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : isDisabled
                                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                              }
                            `}
                            onClick={() => {
                              if (!isDisabled) {
                                setTimeSlot(time);
                                form.setFieldsValue({ timeSlot: time });
                              }
                            }}
                          >
                            <span className="w-full text-base font-medium flex justify-center items-center">{time}</span>
                            {isDisabled && (
                              <div className="text-xs mt-1 ml-2">Đã qua</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Form.Item>
                  
                  {/* Message when all time slots are disabled */}
                  {areAllTimeSlotsDisabled() && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <ClockCircleOutlined className="text-yellow-600 mr-2" />
                        <span className="text-yellow-800 font-medium">
                          Tất cả khung giờ hôm nay đã qua. Xin hẹn quay lại vào ngày khác!
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Message for postal delivery */}
              {appointmentDate && selectedMedicationMethod === 'postal-delivery' && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <MailOutlined className="text-blue-600 mr-2" />
                    <span className="text-blue-800 font-medium">
                      Với phương thức gửi bưu điện, bạn chỉ cần chọn ngày. Kit sẽ được gửi đến địa chỉ của bạn trong ngày đã chọn.
                    </span>
                  </div>
                </div>
              )}
            </Card>

          </div>



          </div>
          
          {/* Test Subject Information với Antd Form */}
          <Card title={
            <Space>
              <TeamOutlined style={{ color: '#1890ff' }} />
              <span>Test Subject Information</span>
            </Space>
          }>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              📋 Vui lòng điền thông tin đầy đủ và chính xác để đảm bảo kết quả xét nghiệm
            </Text>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleConfirmBooking}
              initialValues={{
                firstPerson: {
                  gender: 'male'
                },
                secondPerson: {
                  gender: 'male'
                }
              }}
            >
              {/* First Person */}
              <Card 
                type="inner" 
                title={
                  <Space>
                    <UserOutlined />
                    <span>First Person (Representative)</span>
                  </Space>
                }
                style={{ marginBottom: 24 }}
              >
                <Text type="warning" style={{ display: 'block', marginBottom: 16 }}>
                  ⚠️ Người đại diện phải trên 18 tuổi và sẽ chịu trách nhiệm cho việc đặt lịch này
                </Text>
                
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'fullName']}
                      label="Họ và tên"
                      rules={[
                        { required: true, message: 'Vui lòng nhập họ và tên!' },
                        { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
                      ]}
                    >
                      <Input placeholder="Nhập họ và tên" prefix={<UserOutlined />} />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'dateOfBirth']}
                      label="Ngày sinh"
                      rules={[{ validator: validateAge18 }]}
                    >
                      <DatePicker 
                        style={{ width: '100%' }}
                        placeholder="Chọn ngày sinh"
                        format="DD/MM/YYYY"
                        disabledDate={(current) => current && current > moment().endOf('day')}
                        onChange={(date) => {
                                                     // Xử lý sự kiện onChange của DatePicker
                           if (date) {
                             console.log('Date object:', date);
                             console.log('Is moment object:', moment.isMoment(date));
                             console.log('Formatted date:', date.format('DD/MM/YYYY'));
                             console.log('Age calculation:', moment().diff(date, 'years'));
                           }
                        }}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'gender']}
                      label="Giới tính"
                      rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                    >
                      <Radio.Group
                        onChange={() => {
                          // Trigger validation cho relationship khi thay đổi giới tính
                          setTimeout(() => {
                            form.validateFields([['firstPerson', 'relationship']]);
                          }, 0);
                        }}
                      >
                        <Radio value="male">Nam</Radio>
                        <Radio value="female">Nữ</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'phoneNumber']}
                      label="Số điện thoại"
                      rules={[{ validator: validatePhoneNumber }]}
                    >
                      <Input placeholder="0123456789 hoặc +84123456789" prefix={<PhoneOutlined />} />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'email']}
                      label="Email"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                      ]}
                    >
                      <Input placeholder="Nhập địa chỉ email" prefix={<MailOutlined />} />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'relationship']}
                      label="Mối quan hệ"
                      rules={[

                        { validator: validateGenderRelationship }
                      ]}
                      dependencies={[['firstPerson', 'gender']]}
                    >
                      <Select 
                        placeholder="Chọn mối quan hệ"
                        onChange={(value) => {
                          // Trigger validation và cập nhật available relationships cho second person
                          form.validateFields([['firstPerson', 'relationship'], ['secondPerson', 'relationship']]);
                          
                          // Cập nhật available relationships cho second person
                          if (selectedService?.name && value) {
                            const validSecondRelationships = getValidRelationshipsForSecondPerson(
                              selectedService.name, 
                              value
                            );
                            setAvailableSecondPersonRelationships(validSecondRelationships.length > 0 
                              ? validSecondRelationships 
                              : availableRelationships
                            );
                            
                            // Reset second person relationship nếu không còn hợp lệ
                            const currentSecondRelationship = form.getFieldValue(['secondPerson', 'relationship']);
                            if (currentSecondRelationship && !validSecondRelationships.includes(currentSecondRelationship)) {
                              form.setFieldsValue({
                                secondPerson: {
                                  ...form.getFieldValue('secondPerson'),
                                  relationship: undefined
                                }
                              });
                            }
                          }
                        }}
                      >
                        {availableRelationships.map(rel => (
                          <Option key={rel} value={rel}>{rel} - {relationshipVietnameseNames[rel]}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'sampleType']}
                      label="Loại mẫu"
                      rules={[{ required: true, message: 'Vui lòng chọn loại mẫu!' }]}
                    >
                      <Select placeholder="Chọn loại mẫu">
                        {sampleTypes.map(type => (
                          <Option key={type} value={type}>{type}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'personalId']}
                      label="Số CCCD/CMND"
                      rules={[{ validator: validatePersonalId }]}
                    >
                      <Input placeholder="Nhập số CCCD/CMND" prefix={<IdcardOutlined />} />
                    </Form.Item>
                  </Col>
                  

                </Row>
              </Card>
              
              {/* Second Person */}
              <Card 
                type="inner" 
                title={
                  <Space>
                    <UserOutlined />
                    <span>Second Person</span>
                  </Space>
                }
                style={{ marginBottom: 24 }}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['secondPerson', 'fullName']}
                      label="Họ và tên"
                      rules={[
                        { required: true, message: 'Vui lòng nhập họ và tên!' },
                        { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
                      ]}
                    >
                      <Input placeholder="Nhập họ và tên" prefix={<UserOutlined />} />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['secondPerson', 'dateOfBirth']}
                      label="Ngày sinh"
                      rules={[{ validator: validateSecondPersonAge }]}
                      dependencies={[['secondPerson', 'relationship']]}
                    >
                      <DatePicker 
                        style={{ width: '100%' }}
                        placeholder="Chọn ngày sinh"
                        format="DD/MM/YYYY"
                        disabledDate={(current) => current && current > moment().endOf('day')}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['secondPerson', 'gender']}
                      label="Giới tính"
                      rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                    >
                      <Radio.Group
                        onChange={() => {
                          // Trigger validation cho relationship khi thay đổi giới tính
                          setTimeout(() => {
                            form.validateFields([['secondPerson', 'relationship']]);
                          }, 0);
                        }}
                      >
                        <Radio value="male">Nam</Radio>
                        <Radio value="female">Nữ</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['secondPerson', 'relationship']}
                      label="Mối quan hệ"
                      rules={[
                        { validator: validateSecondPersonGenderRelationship }
                      ]}
                      dependencies={[['firstPerson', 'relationship'], ['secondPerson', 'gender']]}
                    >
                      <Select 
                        placeholder="Chọn mối quan hệ"
                        onChange={() => {
                          // Trigger validation cho second person khi thay đổi
                          form.validateFields([
                            ['secondPerson', 'relationship'],
                            ['secondPerson', 'dateOfBirth'] // Thêm validation cho dateOfBirth khi relationship thay đổi
                          ]);
                        }}
                      >
                        {availableSecondPersonRelationships.map(rel => (
                          <Option key={rel} value={rel}>{rel} - {relationshipVietnameseNames[rel]}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['secondPerson', 'sampleType']}
                      label="Loại mẫu"
                      rules={[{ required: true, message: 'Vui lòng chọn loại mẫu!' }]}
                    >
                      {selectedService?.name === 'Non-Invasive Relationship Testing (NIPT)' && 
                       form.getFieldValue(['secondPerson', 'relationship']) === 'Child' ? (
                        <Input 
                          value="Amniotic Fluid" 
                          disabled 
                          suffix={
                            <Tooltip title="Mẫu nước ối được sử dụng tự động cho xét nghiệm NIPT">
                              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                          }
                        />
                      ) : (
                        <Select placeholder="Chọn loại mẫu">
                          {sampleTypes.map(type => (
                            <Option key={type} value={type}>{type}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  

                </Row>
              </Card>
              

              
            </Form>
          </Card>
        </div>
        
        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaCreditCard className="mr-2 text-blue-600" />
              Booking Summary
            </h2>
            
            {/* Service Details */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Service Type:</span>
                <span className="font-medium">
                  {selectedServiceType === 'legal' ? 'Legal' : 'Non-Legal'}
                </span>
              </div>
              
              {selectedService && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium text-right">{selectedService.name}</span>
                </div>
              )}
              
              {selectedCollectionMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Collection:</span>
                  <span className="font-medium">{selectedCollectionMethod.name}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Medication:</span>
                <span className="font-medium capitalize">
                  {selectedMedicationMethod.replace('-', ' ')}
                </span>
              </div>
              
              {/* Thêm hiển thị Kit Type */}
              {selectedKitType && (() => {
                const kit = kitTypes.find(k => k.value === selectedKitType);
                return kit ? (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kit Type:</span>
                    <span className="font-medium text-right">{kit.label}</span>
                  </div>
                ) : null;
              })()}
              
              {appointmentDate && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium flex-1 text-right truncate">{appointmentDate}</span>
                </div>
              )}
              
              {timeSlot && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium flex-1 text-right truncate">{timeSlot}</span>
                </div>
              )}
            </div>
            
            {/* Cost Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <h3 className="font-medium mb-2">Cost Breakdown:</h3>
              
              {selectedService && (
                <div className="flex justify-between text-sm">
                  <span>Service Fee:</span>
                  <span>{selectedService.basePrice?.toLocaleString()} đ</span>
                </div>
              )}
              
              {selectedCollectionMethod && selectedCollectionMethod.price > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Collection Fee:</span>
                  <span>{selectedCollectionMethod.price.toLocaleString()} đ</span>
                </div>
              )}
              
              {selectedMedicationMethod === 'staff-collection' && (
                <div className="flex justify-between text-sm">
                  <span>Staff Collection:</span>
                  <span>500,000 đ</span>
                </div>
              )}
              
              {selectedMedicationMethod === 'postal-delivery' && (
                <div className="flex justify-between text-sm">
                  <span>Postal Delivery:</span>
                  <span>250,000 đ</span>
                </div>
              )}
              
              {isExpressService && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Express Service:</span>
                  <span>
                    {selectedService?.expressPrice ? 
                      `${selectedService.expressPrice.toLocaleString()} đ` : 
                      '1,500,000 đ'
                    }
                  </span>
                </div>
              )}
              
              {selectedKitType && (() => {
                const kit = kitTypes.find(k => k.value === selectedKitType);
                return kit && kit.price > 0 ? (
                  <div className="flex justify-between text-sm">
                    <span>Kit Fee:</span>
                    <span>{kit.price.toLocaleString()} đ</span>
                  </div>
                ) : null;
              })()}
              
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-blue-600">{calculateTotalCost().toLocaleString()} đ</span>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="mt-4 pt-4 border-t">
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="cash"
                  checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <FaCreditCard className="mr-2 text-green-600" />
                  Cash Payment
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="bank-transfer"
                    checked={paymentMethod === 'bank-transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <FaQrcode className="mr-2 text-blue-600" />
                  QR Payment
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-6 pt-4 border-t">
              <Button 
                type="primary" 
                htmlType="submit"
                loading={isSubmitting}
                className="w-full h-12 text-lg font-semibold"
                onClick={() => form.submit()} // Đảm bảo submit form khi bấm nút ngoài Form
              >
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirm Booking Modal */}
      <ConfirmBookingModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        bookingData={bookingData}
        onConfirm={handleBookingComplete}
        paymentMethod={paymentMethod}
      />
    </div>
  );
};

export default BookingPage;