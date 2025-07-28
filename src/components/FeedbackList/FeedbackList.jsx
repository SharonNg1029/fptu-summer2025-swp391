import React from "react";

// Hàm lọc, chuẩn hóa, và lấy 3 feedback 5 sao mới nhất
const getTop5StarFeedbacks = (feedbacks) => {
  const dateToNumber = (dateArr) =>
    dateArr ? dateArr[0] * 10000 + dateArr[1] * 100 + dateArr[2] : 0;

  return feedbacks
    .filter((fb) => fb.rating === 5)
    .sort((a, b) => dateToNumber(b.createAt) - dateToNumber(a.createAt))

    //Trả về một mảng con gồm các phần tử từ chỉ số bắt đầu đến chỉ số kết thúc (không bao gồm chỉ số kết thúc).
    .slice(0, 4) //Lấy 4 feedback mới nhất
    .map((fb) => ({
      fullName: fb.customerName || "Khách hàng", // dùng luôn customerName
      bookingID: fb.bookingID,
      title: fb.title || "Feedback",
      content: fb.content,
      rating: fb.rating,
      date: fb.createAt
        ? `${String(fb.createAt[2]).padStart(2, "0")}/${String(
            fb.createAt[1]
          ).padStart(2, "0")}/${fb.createAt[0]}`
        : "",
    }));
};

const getStars = (rating) =>
  Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
      ★
    </span>
  ));

const FeedbackList = ({ feedbacks }) => {
  // Không cần useSelector, chỉ dùng hàm lọc
  const topFeedbacks = getTop5StarFeedbacks(feedbacks);

  return (
    <div className="py-10 bg-white">
      <h2
        className="text-3xl font-bold text-blue-900 mb-8 text-center"
        style={{ color: "#003469" }}
      >
        Customer Feedback
      </h2>

      {/* 
  grid-cols-1: 1 cột trên mobile
  sm:grid-cols-2: 2 cột trên màn hình nhỏ trở lên
  md:grid-cols-4: 4 cột trên màn hình vừa trở lên
  gap-6: khoảng cách giữa các feedback
*/}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {topFeedbacks.length === 0 ? (
          <div className="text-center text-gray-400">
            No feedback available.
          </div>
        ) : (
          topFeedbacks.map((fb, idx) => (
            <div
              key={fb.bookingID || idx}
              className="bg-gray-50 rounded-xl p-6 shadow border border-gray-100"
            >
              <div className="flex items-center mb-2">
                <span className="font-bold text-blue-800 mr-2">
                  {fb.fullName}
                </span>
                <span className="text-xs text-gray-400 ml-auto">{fb.date}</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="mr-2">{getStars(fb.rating)}</span>
              </div>
              <p className="text-gray-700 mt-2">{fb.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedbackList;
