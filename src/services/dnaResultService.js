import api from '../configs/axios';

/**
 * Lấy kết quả xét nghiệm DNA theo bookingID
 * @param {number|string} bookingId - ID của booking
 * @returns {Promise<Object>} - Kết quả xét nghiệm DNA hoặc null nếu không có
 */
export const getDnaResultByBooking = async (bookingId) => {
  try {
    const response = await api.get(`/customer/by-booking/${bookingId}`);
    return response.data;
  } catch (error) {
    // Nếu API trả về lỗi hoặc không có kết quả, trả về null
    return null;
  }
};

export default {
  getDnaResultByBooking,
}; 