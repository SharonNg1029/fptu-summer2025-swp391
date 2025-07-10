import React from "react";
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
} from "@ant-design/icons";

const { Text } = Typography;

const formatCurrency = (value) =>
  value?.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }) || "—";

const BookingDetailModal = ({
  open,
  onClose,
  bookingDetail = {},
}) => {
  if (!bookingDetail) return null; 
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

  const getMediationLabel = (value) => {
    const map = {
      courier: "Chuyển phát nhanh",
      pickup: "Tự đến lấy mẫu",
      staff: "Nhân viên đến lấy",
    };
    return map[value] || value || "—";
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      title={`Chi tiết lịch hẹn: #${bookingDetail?.bookingId || "—"}`}
    >
      {/* Include all cards in order, like your popup */}
      {/* You can copy each Card component you’ve posted earlier and place here directly */}
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
                        <Text strong style={{ fontSize: 14 }}>{service}</Text>
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
                            <Text style={{ fontSize: 13 }}>{firstPerson?.phone}</Text>
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
    </Modal>
  );
};

export default BookingDetailModal;
