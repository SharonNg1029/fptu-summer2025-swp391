import api from '../configs/axios';

/**
 * Lấy thông tin staff theo staffID
 * @param {string|number} staffID
 * @returns {Promise<Object|null>} Thông tin staff hoặc null nếu không có
 */
export const getStaffById = async (staffID) => {
  try {
    const response = await api.get(`/staff/${staffID}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export default {
  getStaffById,
}; 