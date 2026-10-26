"use client";

import React, { useState, useEffect } from "react";
import { getReviewsSnapshotByTrailId } from "@/src/lib/firebase/firestore.js";
import { Review } from "@/src/components/Reviews/Review";

export default function ReviewsListClient({
  initialReviews,
  trailId,
  userId,
}) {
  const [reviews, setReviews] = useState(initialReviews);

  useEffect(() => {
    return getReviewsSnapshotByTrailId(trailId, (data) => {
      setReviews(data);
    });
  }, [trailId]);
  return (
    <article>
      <ul className="reviews">
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review) => (
              <Review
                key={review.id}
                rating={review.rating}
                text={review.text}
                timestamp={review.timestamp}
              />
            ))}
          </ul>
        ) : (
          <p>
            This trail has not been reviewed yet,{" "}
            {!userId ? "first login and then" : ""} add your own review!
          </p>
        )}
      </ul>
    </article>
  );
}
