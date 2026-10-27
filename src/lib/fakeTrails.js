import {
  randomNumberBetween,
  getRandomDateAfter,
  getRandomDateBefore,
} from "@/src/lib/utils.js";
import { randomData } from "@/src/lib/randomData.js";

import { Timestamp } from "firebase/firestore";

export async function generateFakeTrailsAndReviews() {
  const trailsToAdd = 5;
  const data = [];

  for (let i = 0; i < trailsToAdd; i++) {
    const trailTimestamp = Timestamp.fromDate(getRandomDateBefore());

    const ratingsData = [];

    // Generate a random number of ratings/reviews for this trail
    for (let j = 0; j < randomNumberBetween(0, 5); j++) {
      const ratingTimestamp = Timestamp.fromDate(
        getRandomDateAfter(trailTimestamp.toDate())
      );

      const ratingData = {
        rating:
          randomData.trailReviews[
            randomNumberBetween(0, randomData.trailReviews.length - 1)
          ].rating,
        text: randomData.trailReviews[
          randomNumberBetween(0, randomData.trailReviews.length - 1)
        ].text,
        userId: `User #${randomNumberBetween()}`,
        timestamp: ratingTimestamp,
      };

      ratingsData.push(ratingData);
    }

    const avgRating = ratingsData.length
      ? ratingsData.reduce(
          (accumulator, currentValue) => accumulator + currentValue.rating,
          0
        ) / ratingsData.length
      : 0;
    const city =
      randomData.trailCities[
        randomNumberBetween(0, randomData.trailCities.length - 1)
      ];

    const trailData = {
      category:
        randomData.trailCategories[
          randomNumberBetween(0, randomData.trailCategories.length - 1)
        ],
      name: randomData.trailNames[
        randomNumberBetween(0, randomData.trailNames.length - 1)
      ],
      avgRating,
      city,
      latitude: randomData.trailLocations[city].latitude,
      longitude: randomData.trailLocations[city].longitude,
      numRatings: ratingsData.length,
      sumRating: ratingsData.reduce(
        (accumulator, currentValue) => accumulator + currentValue.rating,
        0
      ),
      difficulty: randomNumberBetween(1, 4),
      photo: randomData.trailPhotos[
        randomNumberBetween(0, randomData.trailPhotos.length - 1)
      ],
      timestamp: trailTimestamp,
    };

    data.push({
      trailData,
      ratingsData,
    });
  }
  return data;
}
