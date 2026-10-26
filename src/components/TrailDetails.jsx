// This component shows trail metadata, and offers some actions to the user like uploading a new trail image, and adding a review.

import React from "react";
import renderStars from "@/src/components/Stars.jsx";
import { difficultyLabel } from "@/src/lib/utils.js";

const TrailDetails = ({
  trail,
  userId,
  handleTrailImage,
  setIsOpen,
  isOpen,
  children,
}) => {
  return (
    <section className="img__section">
      <img src={trail.photo} alt={trail.name} />

      <div className="actions">
        {userId && (
          <img
            alt="review"
            className="review"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            src="/review.svg"
          />
        )}
        <label
          onChange={(event) => handleTrailImage(event.target)}
          htmlFor="upload-image"
          className="add"
        >
          <input
            name=""
            type="file"
            id="upload-image"
            className="file-input hidden w-full h-full"
          />

          <img className="add-image" src="/add.svg" alt="Add image" />
        </label>
      </div>

      <div className="details__container">
        <div className="details">
          <h2>{trail.name}</h2>

          <div className="trail__rating">
            <ul>{renderStars(trail.avgRating)}</ul>

            <span>({trail.numRatings})</span>
          </div>

          <p>
            {trail.category} | {trail.city}
          </p>
          <p>{difficultyLabel(trail.difficulty)}</p>
          {children}
        </div>
      </div>
    </section>
  );
};

export default TrailDetails;
