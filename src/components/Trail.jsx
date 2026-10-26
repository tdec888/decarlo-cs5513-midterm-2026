"use client";

// This components shows one individual trail
// It receives data from src/app/trail/[id]/page.jsx

import { React, useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { getTrailSnapshotById } from "@/src/lib/firebase/firestore.js";
import { useUser } from "@/src/lib/getUser";
import TrailDetails from "@/src/components/TrailDetails.jsx";
import { updateTrailImage } from "@/src/lib/firebase/storage.js";

const ReviewDialog = dynamic(() => import("@/src/components/ReviewDialog.jsx"));

// Client-side trail view: keeps live trail data and review form state in sync.
export default function Trail({
  id,
  initialTrail,
  initialUserId,
  children,
}) {
  const [trailDetails, setTrailDetails] = useState(initialTrail);
  const [isOpen, setIsOpen] = useState(false);

  // Prefer the live client auth state, with the server-rendered user ID as an initial fallback.
  const userId = useUser()?.uid || initialUserId;
  const [review, setReview] = useState({
    rating: 0,
    text: "",
  });

  const onChange = (value, name) => {
    // Update only the edited field while retaining the rest of the current review.
    setReview({ ...review, [name]: value });
  };

  // Upload a selected image and immediately reflect its returned URL in the displayed details.
  async function handleTrailImage(target) {
    const image = target.files ? target.files[0] : null;
    if (!image) {
      return;
    }

    const imageURL = await updateTrailImage(id, image);
    setTrailDetails({ ...trailDetails, photo: imageURL });
  }

  const handleClose = () => {
    // Clear the draft when closing so the next review starts empty.
    setIsOpen(false);
    setReview({ rating: 0, text: "" });
  };

  // Subscribe to Firestore updates for this trail; return the unsubscribe callback on cleanup.
  useEffect(() => {
    return getTrailSnapshotById(id, (data) => {
      setTrailDetails(data);
    });
  }, [id]);

  return (
    <>
      <TrailDetails
        trail={trailDetails}
        userId={userId}
        handleTrailImage={handleTrailImage}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        {children}
      </TrailDetails>
      {userId && (
        <Suspense fallback={<p>Loading...</p>}>
          <ReviewDialog
            isOpen={isOpen}
            handleClose={handleClose}
            review={review}
            onChange={onChange}
            userId={userId}
            id={id}
          />
        </Suspense>
      )}
    </>
  );
}
