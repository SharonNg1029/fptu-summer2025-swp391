import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Form, Input, Select, DatePicker, Radio, Button, message, Row, Col, Card, Typography, Space, Checkbox } from 'antd';
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, PhoneOutlined, MailOutlined, IdcardOutlined, TeamOutlined, EnvironmentOutlined, CreditCardOutlined, QrcodeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { legalServicesData, legalCollectionMethodsData } from '../home-page/services/legalDNA/data-legal/legalData';
import { nonLegalServicesData, nonLegalCollectionMethodsData } from '../home-page/services/non-legalDNA/data-non-legal/nonLegalData';
import { FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, FaIdCard, FaUsers, FaMapMarkerAlt, FaCreditCard, FaQrcode } from 'react-icons/fa';

const { Title, Text } = Typography;
const { Option } = Select;

const BookingPage = () => {
  const dispatch = useDispatch();
  const { currentUser, isAuthenticated, customerID } = useSelector(state => state.user);
  const [form] = Form.useForm();
  
  // ... existing code ...
  const [searchParams] = useSearchParams();
  const serviceID = searchParams.get('serviceID');
  const expressService = searchParams.get('express');
  
  // State cho form booking
  const [serviceType, setServiceType] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState('legal');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCollectionMethod, setSelectedCollectionMethod] = useState(null);
  const [selectedMedicationMethod, setSelectedMedicationMethod] = useState('walk-in');
  const [isExpressService, setIsExpressService] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [homeAddress, setHomeAddress] = useState('');
  
  // State cho thông tin test subjects
  const [firstPerson, setFirstPerson] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    phoneNumber: '',
    email: '',
    relationship: '',
    sampleType: '',
    personalId: ''
  });
  
  const [secondPerson, setSecondPerson] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    relationship: '',
    sampleType: '',
    personalId: ''
  });

  // ... existing code ...
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
    'Blood Sample',
    'Buccal Swab (Saliva)',
    'Hair with Root Follicles',
    'Nail Clippings'
  ];
  
  // Relationships
  const relationships = [
    'Father', 'Mother', 'Child', 'Sibling',
    'Grandparent', 'Grandchild', 'Other'
  ];

  // Validation functions
  const validateAge18 = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng chọn ngày sinh!'));
    }
    const age = moment().diff(moment(value), 'years');
    if (age < 18) {
      return Promise.reject(new Error('Người đại diện phải trên 18 tuổi!'));
    }
    return Promise.resolve();
  };

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

  const validateRelationshipDifferent = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng chọn mối quan hệ!'));
    }
    const firstPersonRelationship = form.getFieldValue(['firstPerson', 'relationship']);
    if (value === firstPersonRelationship) {
      return Promise.reject(new Error('Mối quan hệ của người thứ hai phải khác với người đại diện!'));
    }
    return Promise.resolve();
  };

  // Disable past dates
  const disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };



  // ... existing useEffect code ...
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
  
  useEffect(() => {
    if (!serviceID && currentServicesData.length > 0) {
      setSelectedService(currentServicesData[0]);
    }
    if (currentCollectionMethods.length > 0) {
      setSelectedCollectionMethod(currentCollectionMethods[1]);
    }
  }, [selectedServiceType, serviceID]);
  
  const handleConfirmBooking = (values) => {
    const bookingData = {
      customerID,
      serviceType: selectedServiceType,
      service: selectedService,
      collectionMethod: selectedCollectionMethod,
      medicationMethod: selectedMedicationMethod,
      appointmentDate: values.appointmentDate?.format('YYYY-MM-DD'),
      timeSlot: values.timeSlot,
      firstPerson: values.firstPerson,
      secondPerson: values.secondPerson,
      totalCost: calculateTotalCost(),
      paymentMethod,
      bookingTime: new Date().toISOString()
    };
    
    console.log('Booking Data:', bookingData);
    message.success('Đặt lịch thành công!');
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
          
          {/* Thông báo khi service được pre-selected */}
          {isServicePreSelected && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Service đã được chọn từ trang trước:</strong> {selectedService?.name} ({selectedServiceType === 'legal' ? 'Legal' : 'Non-Legal'})
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Thông tin service không thể thay đổi để đảm bảo tính nhất quán với lựa chọn ban đầu.
                  </p>
                </div>
              </div>
            </div>
          )}
          
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
              {isServicePreSelected && (
                <p className="text-xs text-gray-500 mt-2">
                  🔒 Service type đã được khóa vì đã chọn từ trang service
                </p>
              )}
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
                  onChange={(e) => !isExpressPreSelected && !isStandardPreSelected && handleExpressServiceChange(e.target.checked)}
                  disabled={isExpressPreSelected || isStandardPreSelected}
                  className={`w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 ${
                    isStandardPreSelected ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                />
                <label htmlFor="expressService" className={`ml-3 flex-1 ${
                  isStandardPreSelected ? 'opacity-60' : ''
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`font-medium flex items-center ${
                        isStandardPreSelected ? 'text-orange-400' : 'text-orange-700'
                      }`}>
                        <FaClock className="mr-2" />
                        Express Service
                      </span>
                      <p className={`text-sm mt-1 ${
                        isStandardPreSelected ? 'text-orange-300' : 'text-orange-600'
                      }`}>
                        Xử lý nhanh và ưu tiên cao - Kết quả trong thời gian ngắn nhất
                      </p>
                      <p className={`text-sm font-semibold mt-1 ${
                        isStandardPreSelected ? 'text-orange-300' : 'text-orange-600'
                      }`}>
                        Phí thêm: {selectedService?.expressPrice ? `${selectedService.expressPrice.toLocaleString()} đ` : '1,500,000 đ'}
                      </p>
                    </div>
                    {isExpressPreSelected && isExpressService && (
                      <div className="flex items-center text-orange-600">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-medium">Đã chọn</span>
                      </div>
                    )}
                    {isStandardPreSelected && (
                      <div className="flex items-center text-orange-400">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-medium">Không khả dụng</span>
                      </div>
                    )}
                  </div>
                </label>
              </div>
              {isExpressPreSelected && (
                <p className="text-xs text-orange-600 mt-2">
                  🔒 Express Service đã được chọn từ trang trước và không thể thay đổi
                </p>
              )}
              {isStandardPreSelected && (
                <p className="text-xs text-orange-400 mt-2">
                  🔒 Bạn đã chọn Standard Service - Express Service không khả dụng
                </p>
              )}
            </div>
            
            {/* Collection Method */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Collection Method *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  onClick={() => setSelectedCollectionMethod({name: 'At Home', price: 0})}
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
                  onClick={() => setSelectedCollectionMethod({name: 'At Facility', price: 0})}
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
            </div>
            
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
                      onClick={() => !isExpressPreSelected && setSelectedMedicationMethod('staff-collection')}
                      className={`p-4 border rounded-lg transition-all ${
                        selectedMedicationMethod === 'staff-collection'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${
                        isExpressPreSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
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
                  
                  {/* Postal Delivery - Only for At Home and Non-Legal */}
                  {selectedCollectionMethod?.name === 'At Home' && selectedServiceType !== 'legal' && (
                    <div
                      onClick={() => !isExpressPreSelected && setSelectedMedicationMethod('postal-delivery')}
                      className={`p-4 border rounded-lg transition-all ${
                        selectedMedicationMethod === 'postal-delivery'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${
                        isExpressPreSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
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
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'gender']}
                      label="Giới tính"
                      rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                    >
                      <Radio.Group>
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
                      rules={[{ required: true, message: 'Vui lòng chọn mối quan hệ!' }]}
                    >
                      <Select placeholder="Chọn mối quan hệ">
                        {relationships.map(rel => (
                          <Option key={rel} value={rel}>{rel}</Option>
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
                      rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
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
                      <Radio.Group>
                        <Radio value="male">Nam</Radio>
                        <Radio value="female">Nữ</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['secondPerson', 'relationship']}
                      label="Mối quan hệ"
                      rules={[{ validator: validateRelationshipDifferent }]}
                      dependencies={[['firstPerson', 'relationship']]}
                    >
                      <Select placeholder="Chọn mối quan hệ">
                        {relationships.map(rel => (
                          <Option key={rel} value={rel}>{rel}</Option>
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
                      <Select placeholder="Chọn loại mẫu">
                        {sampleTypes.map(type => (
                          <Option key={type} value={type}>{type}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['secondPerson', 'personalId']}
                      label="Số CCCD/CMND"
                      rules={[{ validator: validatePersonalId }]}
                    >
                      <Input placeholder="Nhập số CCCD/CMND" prefix={<IdcardOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              
              {/* Appointment Schedule */}
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
                      onChange={(date) => {
                        setAppointmentDate(date?.format('YYYY-MM-DD') || '');
                        // Reset time slot when date changes
                        form.setFieldsValue({ timeSlot: undefined });
                        setTimeSlot('');
                      }}
                    />
                  </Form.Item>
                </div>

                {/* Time Selection - Only show when date is selected */}
                {appointmentDate && (
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
                                p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 text-center
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
                              <div className="font-medium">{time}</div>
                              {isDisabled && (
                                <div className="text-xs mt-1">Đã qua</div>
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
              
              {appointmentDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{appointmentDate}</span>
                </div>
              )}
              
              {timeSlot && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{timeSlot}</span>
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
                  Bank Transfer
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-6 pt-4 border-t">
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                onClick={() => {
                  form.submit();
                }}
              >
                Xác nhận đặt lịch
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;