"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import "./reviews.css";

interface Review {
  id: number;
  customerName: string;
  profileImage: string;
  rating: number;
  reviewText: string;
  chargerTag: string;
  timestamp: string;
}

const reviews: Review[] = [
  {
    id: 1,
    customerName: "Amit Sharma",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    reviewText: "Excellent Charging Station! Fast Charging And Very Convenient Location. The Host Was Very Helpful.",
    chargerTag: "Premium DC Charger",
    timestamp: "Today 10:37 AM",
  },
  {
    id: 2,
    customerName: "Sneha Kapoor",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.5,
    reviewText: "Charger Ki Location Dhoondna Bahut Aasaan Tha. Parking Space Kaafi Badi Hai Aur Raat Ke Waqt Bhi Area Kaafi Safe Feel Hota Hai.",
    chargerTag: "Premium DC Charger",
    timestamp: "2 days ago",
  },
  {
    id: 3,
    customerName: "Abhijit Sharma",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 5,
    reviewText: "Great experience! The charging was fast and the location was easy to find.",
    chargerTag: "Premium DC Charger",
    timestamp: "5 days ago",
  },
  {
    id: 4,
    customerName: "Rahul Verma",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 4,
    reviewText: "Good charging station with reliable service. The app made it easy to book and the payment process was smooth. Would definitely use again!",
    chargerTag: "Premium AC Charger",
    timestamp: "1 week ago",
  },
  {
    id: 5,
    customerName: "Priya Patel",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    reviewText: "Amazing service! The charging speed was excellent and the location was perfect for my route.",
    chargerTag: "Premium DC Charger",
    timestamp: "2 weeks ago",
  },
];

export default function CustomerReviews() {
  return (
    <div className="customer-reviews-container">
      {/* Title */}
      <h2 className="customer-reviews-title">
        Customer Reviews
      </h2>

      {/* Reviews List */}
      <div className="customer-reviews-list">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="customer-review-item"
          >
            {/* Timestamp */}
            <div className="customer-review-timestamp">
              {review.timestamp}
            </div>

            {/* Review Content */}
            <div className="customer-review-content">
              {/* Profile Picture */}
              <div className="customer-review-profile">
                <Image
                  src={review.profileImage}
                  alt={review.customerName}
                  width={48}
                  height={48}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>

              {/* Review Details */}
              <div className="customer-review-details">
                {/* Customer Name */}
                <p className="customer-review-name">
                  {review.customerName}
                </p>

                {/* Stars */}
                <div className="customer-review-stars">
                  {[...Array(5)].map((_, i) => {
                    const starValue = i + 1;
                    const isFilled = starValue <= Math.floor(review.rating);
                    const isPartial = starValue === Math.ceil(review.rating) && review.rating % 1 !== 0;
                    
                    return (
                      <div key={i} className="customer-review-star">
                        <Star
                          style={{
                            width: "16px",
                            height: "16px",
                            color: "#E5E5EA",
                            fill: "transparent",
                            position: "absolute",
                          }}
                        />
                        {isFilled && (
                          <Star
                            style={{
                              width: "16px",
                              height: "16px",
                              color: "#FFD700",
                              fill: "#FFD700",
                              position: "absolute",
                            }}
                          />
                        )}
                        {isPartial && (
                          <div
                            style={{
                              position: "absolute",
                              width: `${(review.rating % 1) * 100}%`,
                              height: "100%",
                              overflow: "hidden",
                            }}
                          >
                            <Star
                              style={{
                                width: "16px",
                                height: "16px",
                                color: "#FFD700",
                                fill: "#FFD700",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Review Text */}
                <p className="customer-review-text">
                  {review.reviewText}
                </p>

                {/* Charger Tag */}
                <span className="customer-review-tag">
                  {review.chargerTag}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

