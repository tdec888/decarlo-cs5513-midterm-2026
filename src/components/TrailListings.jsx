"use client";

// This components handles the trail listings page
// It receives data from src/app/page.js, such as the initial trails and search params from the URL

import Link from "next/link";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import renderStars from "@/src/components/Stars.jsx";
import { getTrailsSnapshot } from "@/src/lib/firebase/firestore.js";
import Filters from "@/src/components/Filters.jsx";
import { difficultyLabel } from "@/src/lib/utils.js";

const TrailItem = ({ trail }) => (
  <li key={trail.id}>
    <Link href={`/trail/${trail.id}`}>
      <ActiveTrail trail={trail} />
    </Link>
  </li>
);

const ActiveTrail = ({ trail }) => (
  <div>
    <ImageCover photo={trail.photo} name={trail.name} />
    <TrailCardDetails trail={trail} />
  </div>
);

const ImageCover = ({ photo, name }) => (
  <div className="image-cover">
    <img src={photo} alt={name} />
  </div>
);

const TrailCardDetails = ({ trail }) => (
  <div className="trail__details">
    <h2>{trail.name}</h2>
    <TrailRating trail={trail} />
    <TrailMetadata trail={trail} />
  </div>
);

const TrailRating = ({ trail }) => (
  <div className="trail__rating">
    <ul>{renderStars(trail.avgRating)}</ul>
    <span>({trail.numRatings})</span>
  </div>
);

const TrailMetadata = ({ trail }) => (
  <div className="trail__meta">
    <p>
      {trail.category} | {trail.city}
    </p>
    <p>{difficultyLabel(trail.difficulty)}</p>
  </div>
);

export default function TrailListings({
  initialTrails,
  searchParams,
}) {
  const router = useRouter();

  // The initial filters are the search params from the URL, useful for when the user refreshes the page
  const initialFilters = {
    city: searchParams.city || "",
    category: searchParams.category || "",
    difficulty: searchParams.difficulty || "",
    sort: searchParams.sort || "",
  };

  const [trails, setTrails] = useState(initialTrails);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    routerWithFilters(router, filters);
  }, [router, filters]);

  useEffect(() => {
    return getTrailsSnapshot((data) => {
      setTrails(data);
    }, filters);
  }, [filters]);

  return (
    <article>
      <Filters filters={filters} setFilters={setFilters} />
      <ul className="trails">
        {trails.map((trail) => (
          <TrailItem key={trail.id} trail={trail} />
        ))}
      </ul>
    </article>
  );
}

function routerWithFilters(router, filters) {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  }

  const queryString = queryParams.toString();
  router.push(`?${queryString}`);
}
