import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getBookingFeedback } from "../../services/feedbackService";

// Header component reused from feedback form
const FeedbackHeader = () => (
  <div className="bg-blue-600 rounded-t-2xl flex items-center px-8 py-6 min-h-[110px]">
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
      <div className="text-2xl font-bold text-white leading-tight">Your Previous Feedback</div>
      <div className="text-base text-blue-100 mt-1">Thank you for your valuable input</div>
    </div>
  </div>
);

const FeedbackBox = ({ children }) => (
  <div className="max-w-md w-full mx-auto mt-16 bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
    <FeedbackHeader />
    <div className="py-8 px-8">{children}</div>
  </div>
);

const ViewFeedback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingID = searchParams.get("bookingId") || searchParams.get("bookingid");
  const customerID = useSelector(state => state.user?.customerID);
  
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!bookingID || !customerID) return;
      
      try {
        setLoading(true);
        // Get the feedback for this booking using the service
        const bookingFeedback = await getBookingFeedback(bookingID, customerID);
        
        if (bookingFeedback) {
          setFeedback(bookingFeedback);
        } else {
          setError("Feedback not found for this booking");
        }
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Could not load your feedback. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, [bookingID, customerID]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!bookingID || !customerID) {
    return (
      <FeedbackBox>
        <div className="flex flex-col items-center justify-center text-base font-medium text-red-600">
          Missing required information!
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition border border-blue-200"
          >
            Back
          </button>
        </div>
      </FeedbackBox>
    );
  }

  if (loading) {
    return (
      <FeedbackBox>
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-700">Loading your feedback...</p>
        </div>
      </FeedbackBox>
    );
  }

  if (error) {
    return (
      <FeedbackBox>
        <div className="flex flex-col items-center justify-center text-base font-medium text-red-600">
          {error}
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition border border-blue-200"
          >
            Back
          </button>
        </div>
      </FeedbackBox>
    );
  }

  if (!feedback) {
    return (
      <FeedbackBox>
        <div className="flex flex-col items-center justify-center text-base font-medium text-red-600">
          No feedback found for this booking.
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition border border-blue-200"
          >
            Back
          </button>
        </div>
      </FeedbackBox>
    );
  }

  return (
    <FeedbackBox>
      <div className="space-y-6">
        <div>
          <div className="text-gray-500 text-sm">Submitted on</div>
          <div className="text-blue-700 font-medium">
            {new Date(feedback.createAt).toLocaleDateString()}
          </div>
        </div>
        
        <div>
          <div className="text-gray-500 text-sm">Your rating</div>
          <div className="flex items-center space-x-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star}>
                <svg
                  className={`w-6 h-6 ${
                    star <= feedback.rating ? "text-blue-500" : "text-blue-100"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.184c.969 0 1.371 1.24.588 1.81l-3.388 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.389-2.462a1 1 0 00-1.176 0l-3.389 2.462c-.784.57-1.838-.197-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.05 9.401c-.783-.57-.38-1.81.588-1.81h4.184a1 1 0 00.95-.69l1.286-3.974z" />
                </svg>
              </div>
            ))}
            <span className="ml-2 text-sm text-blue-600">{feedback.rating} / 5</span>
          </div>
        </div>
        
        <div>
          <div className="text-gray-500 text-sm">Your feedback</div>
          <div className="mt-1 p-3 bg-blue-50 rounded border border-blue-100 text-blue-900">
            {feedback.content}
          </div>
        </div>
        
        <button
          onClick={handleBack}
          className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
        >
          Back
        </button>
      </div>
    </FeedbackBox>
  );
};

export default ViewFeedback; 