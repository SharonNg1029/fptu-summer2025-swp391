import React, { useState } from "react";
import { Modal } from "antd";
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { submitFeedback } from "../../services/feedbackService";
import { toast } from "react-toastify";
import { CloseOutlined } from "@ant-design/icons";
import "./modal.css"; // Stylesheet to override Ant Design's default modal styles

// Dòng chữ luôn hiện cạnh logo
const defaultTitleTop = "We appreciate your trust";
const defaultTitleBottom = "Please provide your feedback on our service.";

// Header: luôn luôn có logo và 2 dòng chữ bên phải logo
const FeedbackHeader = () => (
  <div className="bg-blue-600 rounded-t-lg flex items-center px-8 py-6 min-h-[110px] relative">
    <div className="flex-shrink-0">
      <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-blue-600">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="h-10 w-10 object-contain"
        />
      </div>
    </div>
    <div className="ml-6 flex flex-col justify-center">
      <div className="text-2xl font-bold text-white leading-tight">{defaultTitleTop}</div>
      <div className="text-base text-blue-100 mt-1">{defaultTitleBottom}</div>
    </div>
  </div>
);

const FeedbackBox = ({ children }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <FeedbackHeader />
    <div className="py-8 px-8">{children}</div>
  </div>
);

const FeedbackModal = ({ visible, onClose, bookingId }) => {
  const customerID = useSelector(state => state.user?.customerID);
  const [alreadyFeedback, setAlreadyFeedback] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const createAt = new Date().toISOString().slice(0, 10);

  const handleClose = (success = false, viewFeedback = false) => {
    setAlreadyFeedback(false);
    setSubmitted(false);
    setContent("");
    setRating(0);
    setErrors({});
    onClose(success, viewFeedback);
  };

  const handleSubmit = async () => {
    // Validate manually
    let newErrors = {};
    if (!content) {
      newErrors.content = "Please enter your feedback.";
    }
    if (rating === 0) {
      newErrors.rating = "Please select a rating.";
    }

    // If there are errors, display them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Otherwise proceed with submission
    setSubmitting(true);
    
    try {
      await submitFeedback(
        bookingId,
        customerID,
        {
          title: "We appreciate your trust\nPlease provide your feedback on our service.",
          content: content,
          rating: rating,
          createAt: createAt,
        }
      );
      console.log("Feedback submitted successfully for bookingId:", bookingId);
      setSubmitted(true);
      toast.success("Thank you for your feedback!");
      
      // Immediately update the parent component when submission is successful
      console.log("Updating parent component with success=true");
      onClose(true);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setAlreadyFeedback(true);
      } else if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred while submitting feedback.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Custom close button
  const closeButton = (
    <button 
      onClick={() => handleClose()}
      className="absolute top-4 right-4 text-white hover:text-gray-200 focus:outline-none z-10 transition"
      aria-label="Close"
    >
      <CloseOutlined style={{ fontSize: '20px' }} />
    </button>
  );

  if (alreadyFeedback) {
    return (
      <Modal
        open={visible}
        onCancel={() => handleClose()}
        footer={null}
        width={500}
        destroyOnClose
        className="feedback-modal"
        closeIcon={null}
        centered
      >
        {closeButton}
        <FeedbackBox>
          <div className="mb-4 text-blue-700 font-semibold text-center">
            You have already submitted feedback. You cannot submit again.
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => handleClose()}
              className="mt-4 px-6 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded font-semibold border border-blue-200 transition"
            >
              Back
            </button>
            <button
              onClick={() => handleClose(true, true)}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold border border-blue-600 transition"
            >
              View My Feedback
            </button>
          </div>
        </FeedbackBox>
      </Modal>
    );
  }

  if (submitted) {
    return (
      <Modal
        open={visible}
        onCancel={() => handleClose(true)}
        footer={null}
        width={500}
        destroyOnClose
        className="feedback-modal"
        closeIcon={null}
        centered
      >
        {closeButton}
        <FeedbackBox>
          <div className="flex flex-col items-center justify-center text-blue-700 text-lg font-semibold mb-4">
            Thank you for your feedback!
          </div>
          <button
            onClick={() => handleClose(true)}
            className="mt-6 px-6 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded font-semibold border border-blue-200 transition w-full"
          >
            Close
          </button>
        </FeedbackBox>
      </Modal>
    );
  }

  return (
    <Modal
      open={visible}
      onCancel={() => handleClose()}
      footer={null}
      width={500}
      destroyOnClose
      className="feedback-modal"
      closeIcon={null}
      centered
    >
      {closeButton}
      <FeedbackBox>
        <div className="space-y-5">
          <div>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (e.target.value) {
                  setErrors({...errors, content: undefined});
                }
              }}
              required
              placeholder="Enter your feedback"
              rows={5}
              className={`w-full px-3 py-2 border ${errors.content ? 'border-red-500' : 'border-blue-200'} rounded bg-blue-50 focus:outline-none focus:border-blue-400 text-blue-900 resize-none`}
              style={{ minHeight: 120, maxHeight: 200 }}
            />
            {errors.content && <div className="text-red-600 text-sm mt-1">{errors.content}</div>}
          </div>
          
          <div>
            <div className="flex items-center space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  aria-label={`Rate ${star} star`}
                  onClick={() => {
                    setRating(star);
                    setErrors({...errors, rating: undefined});
                  }}
                  className="focus:outline-none"
                  tabIndex={0}
                >
                  <svg
                    className={`w-7 h-7 ${
                      star <= rating ? "text-blue-500" : "text-blue-100"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.184c.969 0 1.371 1.24.588 1.81l-3.388 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.389-2.462a1 1 0 00-1.176 0l-3.389 2.462c-.784.57-1.838-.197-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.05 9.401c-.783-.57-.38-1.81.588-1.81h4.184a1 1 0 00.95-.69l1.286-3.974z" />
                  </svg>
                </button>
              ))}
              <span className="ml-2 text-sm text-blue-600">{rating} / 5</span>
            </div>
            {errors.rating && <div className="text-red-600 text-sm mt-1">{errors.rating}</div>}
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
            <button
              type="button"
              onClick={() => handleClose()}
              className="ml-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded font-medium border border-blue-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </FeedbackBox>
    </Modal>
  );
};

export default FeedbackModal; 