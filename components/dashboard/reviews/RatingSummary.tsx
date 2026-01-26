"use client";

import { Star } from "lucide-react";
import "./reviews.css";

export default function RatingSummary() {
  const overallRating = 4.7;
  const totalReviews = 127;
  
  const starBreakdown = [
    { stars: 5, percentage: 80 },
    { stars: 4, percentage: 40 },
    { stars: 3, percentage: 20 },
    { stars: 2, percentage: 10 },
    { stars: 1, percentage: 5 },
  ];

  return (
    <div className="rating-summary">
      {/* Overall Rating */}
      <div className="rating-overall">
        <h1 className="rating-value">
          {overallRating}
        </h1>
        
        {/* Stars */}
        <div className="rating-stars-container">
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1;
            const isFilled = starValue <= Math.floor(overallRating);
            const isPartial = starValue === Math.ceil(overallRating) && overallRating % 1 !== 0;
            
            return (
              <div key={i} className="rating-star-wrapper">
                <Star className="rating-star" style={{
                  color: "#E5E5EA",
                  fill: "transparent",
                }} />
                {isFilled && (
                  <Star className="rating-star" style={{
                    color: "#FFD700",
                    fill: "#FFD700",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }} />
                )}
                {isPartial && (
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${(overallRating % 1) * 100}%`,
                    height: "100%",
                    overflow: "hidden",
                  }}>
                    <Star className="rating-star" style={{
                      color: "#FFD700",
                      fill: "#FFD700",
                    }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <p className="rating-reviews-text">
          Based On {totalReviews} Reviews
        </p>
      </div>

      {/* Star Breakdown */}
      <div className="rating-breakdown">
        {starBreakdown.map((item, index) => (
          <div key={index} className="rating-breakdown-item">
            {/* Star Label */}
            <span className="rating-breakdown-label">
              {item.stars} Stars
            </span>
            
            {/* Progress Bar */}
            <div className="rating-breakdown-bar">
              <div className="rating-breakdown-bar-fill" style={{
                width: `${item.percentage}%`,
              }} />
            </div>
            
            {/* Percentage */}
            <span className="rating-breakdown-percentage">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

