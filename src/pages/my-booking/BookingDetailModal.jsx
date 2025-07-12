import React, { useEffect } from "react";
import moment from 'moment';
import {
  Modal,
  Card,
  Row,
  Col,
  Typography,
  Divider,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  QrcodeOutlined,
  BankOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const formatCurrency = (value) =>
  value?.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }) || "—";

// Helper function to format date
const formatDate = (dateValue) => {
  if (!dateValue) return "—";
  
  // Handle array format [year, month, day]
  if (Array.isArray(dateValue) && dateValue.length >= 3) {
    const [year, month, day] = dateValue;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }
  
  // Handle string format
  if (typeof dateValue === 'string') {
    // If it's already in format YYYYMMDD
    if (dateValue.length === 6 || dateValue.length === 8) {
      const year = dateValue.substring(0, 4);
      const month = dateValue.substring(4, 6);
      const day = dateValue.length === 8 ? dateValue.substring(6, 8) : "";
      return `${day}/${month}/${year}`;
    }
    return dateValue;
  }
  
  // If it's a moment object
  if (dateValue.format) {
    return dateValue.format('DD/MM/YYYY');
  }
  
  return String(dateValue);
};

// Helper function to convert gender code to text
const formatGender = (gender) => {
  if (gender === 1 || gender === "1") return "Male";
  if (gender === 2 || gender === "2") return "Female";
  
  return gender || "—"; // Return original if not 0 or 1
};

const BookingDetailModal = ({
  open,
  onClose,
  bookingDetail = {},
}) => {
  if (!bookingDetail) return null;

  // Debug log
  useEffect(() => {
    if (open) {
      console.log("BookingDetailModal - bookingDetail:", bookingDetail);
      console.log("BookingDetailModal - firstPerson:", bookingDetail.firstPerson);
      console.log("BookingDetailModal - secondPerson:", bookingDetail.secondPerson);
    }
  }, [open, bookingDetail]);
  
  const {
    serviceType,
    service,
    collectionMethod,
    selectedKitType,
    kitTypes = [],
    homeAddress,
    medicationMethod,
    isExpressService,
    appointmentDate,
    timeSlot,
    firstPerson,
    secondPerson,
    serviceCost,
    mediationCost,
    expressCost,
    totalCost,
    paymentMethod,
  } = bookingDetail;
  
  // Helper function to get payment method label and icon
  const getPaymentMethodInfo = (method) => {
    switch(method?.toLowerCase()) {
      case 'cash':
        return {
          icon: <CreditCardOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
          label: '💵 Cash payment upon service delivery',
          color: '#52c41a',
          bgColor: '#f6ffed',
          borderColor: '#d9f7be'
        };
      case 'bank':
        return {
          icon: <BankOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
          label: '🏦 Bank transfer',
          color: '#722ed1',
          bgColor: '#f9f0ff',
          borderColor: '#d3adf7'
        };
      case 'vnpay':
        return {
          icon: <QrcodeOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
          label: '📱 Payment via VNPAY',
          color: '#1890ff',
          bgColor: '#e6f7ff',
          borderColor: '#91d5ff'
        };
      default:
        return {
          icon: <QrcodeOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
          label: '📱 Scan QR code to pay',
          color: '#1890ff',
          bgColor: '#e6f7ff',
          borderColor: '#91d5ff'
        };
    }
  };

  const getMediationLabel = (value) => {
    const map = {
      courier: "Courier",
      pickup: "Self Pickup",
      staff: "Staff Collection",
    };
    return map[value] || value || "—";
  };

  // Helper function to safely get collection method name
  const getCollectionMethodName = () => {
    if (collectionMethod?.name) {
      return collectionMethod.name;
    }
    return collectionMethod || "At Facility";
  };

  // Helper function to check if collection is at home
  const isAtHome = () => {
    if (collectionMethod?.name) {
      return collectionMethod.name === 'At Home';
    }
    return collectionMethod === 'At Home';
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
      title={`Booking Details`}
    >
      {/* Include all cards in order, like your popup */}
      {/* You can copy each Card component you've posted earlier and place here directly */}
      {/* For brevity, just placeholder: */}

      <div style={{ maxHeight: "80vh", overflowY: "auto", paddingRight: 8 }}>
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
                      <span style={{ fontSize: 18, fontWeight: 600, color: '#1890ff' }}>Service Information</span>
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
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>SERVICE TYPE</Text>
                        <Text strong style={{ fontSize: 14, color: '#1890ff' }}>
                          {serviceType === 'legal' ? '🏛️ Legal DNA Testing' : '🧬 Non-Legal DNA Testing'}
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>SERVICE NAME</Text>
                        <Text strong style={{ fontSize: 14 }}>{service}</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>COLLECTION METHOD</Text>
                        <Text strong style={{ fontSize: 14 }}>
                          {isAtHome() ? '🏠 ' : '🏥 '}{getCollectionMethodName()}
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>TEST KIT</Text>
                        <Text strong style={{ fontSize: 14 }}>
                          {selectedKitType ? (kitTypes.find(k => k.name === selectedKitType)?.name) : '—'}
                        </Text>
                      </div>
                    </Col>
                  </Row>
                  
                  <Divider style={{ margin: '16px 0' }} />
                  
                  {/* Address & Transport */}
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <div style={{ padding: '12px 16px', backgroundColor: '#f6ffed', borderRadius: 8, border: '1px solid #b7eb8f' }}>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>📍 COLLECTION ADDRESS</Text>
                        <Text strong style={{ fontSize: 14, color: '#52c41a' }}>
                          {isAtHome() ? homeAddress || '—' : '7 D1 Street, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City'}
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>TRANSPORTATION METHOD</Text>
                        <Text strong style={{ fontSize: 14 }}>{getMediationLabel(medicationMethod)}</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ padding: '12px 16px', backgroundColor: isExpressService ? '#fff2e8' : '#fafafa', borderRadius: 8, border: `1px solid ${isExpressService ? '#ffbb96' : '#f0f0f0'}` }}>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>EXPRESS SERVICE</Text>
                        <Text strong style={{ fontSize: 14, color: isExpressService ? '#fa8c16' : '#666' }}>
                          {isExpressService ? '⚡ Yes' : '❌ No'}
                        </Text>
                      </div>
                    </Col>
                  </Row>
                  
                  {/* Appointment */}
                  {appointmentDate && (
                    <>
                      <Divider style={{ margin: '16px 0' }} />
                      <div style={{ padding: '16px', backgroundColor: '#e6f7ff', borderRadius: 8, border: '1px solid #91d5ff' }}>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>📅 APPOINTMENT</Text>
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
                      <span style={{ fontSize: 18, fontWeight: 600, color: '#52c41a' }}>Test Participants Information</span>
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
                          👤 PRIMARY PERSON
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <div style={{ marginBottom: 8 }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>FULL NAME</Text>
                            <br/>
                            <Text strong style={{ fontSize: 14 }}>{firstPerson?.fullname || '—'}</Text>
                          </div>
                          <Row gutter={8}>
                            <Col span={12}>
                              <Text type="secondary" style={{ fontSize: 11 }}>DATE OF BIRTH</Text>
                              <br/>
                              <Text style={{ fontSize: 13 }}>{formatDate(firstPerson?.dateOfBirth)}</Text>
                            </Col>
                            <Col span={12}>
                              <Text type="secondary" style={{ fontSize: 11 }}>GENDER</Text>
                              <br/>
                              <Text style={{ fontSize: 13 }}>{formatGender(firstPerson?.gender)}</Text>
                            </Col>
                          </Row>
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>PHONE NUMBER</Text>
                            <br/>
                            <Text style={{ fontSize: 13 }}>{firstPerson?.phone}</Text>
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>EMAIL</Text>
                            <br/>
                            <Text style={{ fontSize: 13 }}>{firstPerson?.email}</Text>
                          </div>
                          <Row gutter={8} style={{ marginTop: 8 }}>
                            <Col span={12}>
                              <Text type="secondary" style={{ fontSize: 11 }}>RELATIONSHIP</Text>
                              <br/>
                              <Text style={{ fontSize: 13 }}>{firstPerson?.relationship}</Text>
                            </Col>
                            <Col span={12}>
                              <Text type="secondary" style={{ fontSize: 11 }}>SAMPLE TYPE</Text>
                              <br/>
                              <Text style={{ fontSize: 13 }}>{firstPerson?.sampleType}</Text>
                            </Col>
                          </Row>
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>ID CARD/PASSPORT</Text>
                            <br/>
                            <Text style={{ fontSize: 13 }}>{firstPerson?.personalId || firstPerson?.idNumber || '—'}</Text>
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
                          👥 SECOND PERSON
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <div style={{ marginBottom: 8 }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>FULL NAME</Text>
                            <br/>
                            <Text strong style={{ fontSize: 14 }}>{secondPerson?.fullname || '—'}</Text>
                          </div>
                          <Row gutter={8}>
                            <Col span={12}>
                              <Text type="secondary" style={{ fontSize: 11 }}>DATE OF BIRTH</Text>
                              <br/>
                              <Text style={{ fontSize: 13 }}>{formatDate(secondPerson?.dateOfBirth)}</Text>
                            </Col>
                            <Col span={12}>
                              <Text type="secondary" style={{ fontSize: 11 }}>GENDER</Text>
                              <br/>
                              <Text style={{ fontSize: 13 }}>{formatGender(secondPerson?.gender)}</Text>
                            </Col>
                          </Row>
                          <Row gutter={8} style={{ marginTop: 8 }}>
                            <Col span={12}>
                              <Text type="secondary" style={{ fontSize: 11 }}>RELATIONSHIP</Text>
                              <br/>
                              <Text style={{ fontSize: 13 }}>{secondPerson?.relationship}</Text>
                            </Col>
                            <Col span={12}>
                              <Text type="secondary" style={{ fontSize: 11 }}>SAMPLE TYPE</Text>
                              <br/>
                              <Text style={{ fontSize: 13 }}>{secondPerson?.sampleType}</Text>
                            </Col>
                          </Row>
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>ID CARD/PASSPORT</Text>
                            <br/>
                            <Text style={{ fontSize: 13 }}>{secondPerson?.personalId || secondPerson?.idNumber || '—'}</Text>
                          </div>
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
                      <span style={{ fontSize: 18, fontWeight: 600, color: '#fa8c16' }}>Cost Breakdown</span>
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
                      <Text>🚚 Transportation Cost</Text>
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
                      <Text strong style={{ fontSize: 16, color: '#1890ff' }}>💎 TOTAL COST</Text>
                      <Text strong style={{ fontSize: 18, color: '#1890ff' }}>{formatCurrency(totalCost)}</Text>
                    </Row>
                  </div>
                </Card>
        
                {/* Payment Method Card */}
                {(() => {
                  const paymentInfo = getPaymentMethodInfo(paymentMethod);
                  
                  return (
                    <Card 
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '50%', 
                            backgroundColor: paymentInfo.color, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}>
                            {React.cloneElement(paymentInfo.icon, { style: { color: 'white', fontSize: 16 } })}
                          </div>
                          <span style={{ fontSize: 18, fontWeight: 600, color: paymentInfo.color }}>Payment Method</span>
                        </div>
                      }
                      style={{ 
                        borderRadius: 12, 
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        border: `1px solid ${paymentInfo.bgColor}`
                      }}
                      headStyle={{ 
                        backgroundColor: paymentInfo.bgColor, 
                        borderBottom: `1px solid ${paymentInfo.borderColor}`,
                        borderRadius: '12px 12px 0 0'
                      }}
                    >
                      <div style={{ 
                        padding: '16px', 
                        backgroundColor: paymentInfo.bgColor, 
                        borderRadius: 8, 
                        border: `2px solid ${paymentInfo.color}`,
                        textAlign: 'center'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                          {paymentInfo.icon}
                          <Text strong style={{ fontSize: 16, color: paymentInfo.color }}>{paymentInfo.label}</Text>
                        </div>
                      </div>
                    </Card>
                  );
                })()}
      </div>
    </Modal>
  );
};

export default BookingDetailModal;
