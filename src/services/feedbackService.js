import api from '../configs/axios';

/**
 * Check if a booking has feedback
 * @param {number} bookingId - The booking ID to check
 * @returns {Promise<{bookingId: number, hasFeedback: boolean}>} - Whether the booking has feedback
 */
export const checkBookingHasFeedback = async (bookingId) => {
  const response = await api.get(`/feedback/booking/${bookingId}/has-feedback`);
  return response.data;
};

/**
 * Check multiple bookings for feedback status
 * @param {number[]} bookingIds - Array of booking IDs to check
 * @returns {Promise<Object>} - Map of booking IDs to feedback status
 */
export const checkMultipleBookingsFeedback = async (bookingIds) => {
  const response = await api.post('/feedback/check-bookings', bookingIds);
  return response.data;
};

/**
 * Get all feedback from a customer
 * @param {string} customerId - The customer ID
 * @returns {Promise<{feedbackCount: number, feedbacks: Array}>} - Customer feedbacks
 */
export const getCustomerFeedback = async (customerId) => {
  const response = await api.get(`/feedback/customer/${customerId}`);
  return response.data;
};

/**
 * Submit feedback for a booking
 * @param {number} bookingId - The booking ID
 * @param {string} customerId - The customer ID
 * @param {Object} feedbackData - The feedback data
 * @returns {Promise<Object>} - The submitted feedback
 */
export const submitFeedback = async (bookingId, customerId, feedbackData) => {
  const response = await api.post(
    `/customer/feedback/${bookingId}/${customerId}`, 
    feedbackData
  );
  return response.data;
};

/**
 * Get feedback for a specific booking
 * @param {number} bookingId - The booking ID
 * @param {string} customerId - The customer ID
 * @returns {Promise<Object>} - The feedback for the booking
 */
export const getBookingFeedback = async (bookingId, customerId) => {
  // First get all customer feedbacks
  const allFeedback = await getCustomerFeedback(customerId);
  
  // Then find the specific feedback for this booking
  const bookingFeedback = allFeedback.feedbacks?.find(
    feedback => feedback.bookingID.toString() === bookingId.toString()
  );
  
  return bookingFeedback;
};

export default {
  checkBookingHasFeedback,
  checkMultipleBookingsFeedback,
  getCustomerFeedback,
  submitFeedback,
  getBookingFeedback,
}; 