import { generateFakeTrailsAndReviews } from "@/src/lib/fakeTrails.js";
import { difficultyValue } from "@/src/lib/utils.js";

import {
  collection,
  onSnapshot,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  Timestamp,
  runTransaction,
  where,
  addDoc,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase/clientApp";

// Store the uploaded image URL on its trail document.
export async function updateTrailImageReference(
  trailId,
  publicImageUrl
) {
  const trailRef = doc(collection(db, "trails"), trailId);
  if (trailRef) {
    await updateDoc(trailRef, { photo: publicImageUrl });
  }
}

const updateWithRating = async (
  transaction,
  docRef,
  newRatingDocument,
  review
) => {
  // Read and update the aggregate fields within the same transaction as the review write.
  const trail = await transaction.get(docRef);
  const data = trail.data();
  const newNumRatings = data?.numRatings ? data.numRatings + 1 : 1;
  const newSumRating = (data?.sumRating || 0) + Number(review.rating);
  const newAverage = newSumRating / newNumRatings;

  transaction.update(docRef, {
    numRatings: newNumRatings,
    sumRating: newSumRating,
    avgRating: newAverage,
  });

  transaction.set(newRatingDocument, {
    ...review,
    timestamp: Timestamp.fromDate(new Date()),
  });
};

export async function addReviewToTrail(db, trailId, review) {
  // Validate required inputs before constructing Firestore document references.
  if (!trailId) {
    throw new Error("No trail ID has been provided.");
  }

  if (!review) {
    throw new Error("A valid review has not been provided.");
  }

  try {
    const docRef = doc(collection(db, "trails"), trailId);
    const newRatingDocument = doc(
      collection(db, `trails/${trailId}/ratings`),
    );

    // Commit the review and updated trail rating totals atomically.
    await runTransaction(db, (transaction) =>
      updateWithRating(transaction, docRef, newRatingDocument, review),
    );
  } catch (error) {
    console.error(
      "There was an error adding the rating to the trail",
      error,
    );
    throw error;
  }
}


function applyQueryFilters(q, { category, city, difficulty, sort }) {
  // Add only the filters supplied in the URL or by the caller.
  if (category) {
    q = query(q, where("category", "==", category));
  }
  if (city) {
    q = query(q, where("city", "==", city));
  }
  if (difficulty) {
    q = query(q, where("difficulty", "==", difficultyValue(difficulty)));
  }
  if (sort === "Rating" || !sort) {
    q = query(q, orderBy("avgRating", "desc"));
  } else if (sort === "Review") {
    q = query(q, orderBy("numRatings", "desc"));
  }
  return q;
}

// Fetch trails for the requested filters and convert timestamps to serializable dates.
export async function getTrails(db = db, filters = {}) {
  let q = query(collection(db, "trails"));

  // Convert Firestore timestamps to Dates before returning data to the caller.
  q = applyQueryFilters(q, filters);
  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}

// Subscribe to filtered trail changes and pass plain result objects to the callback.
export function getTrailsSnapshot(cb, filters = {}) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  let q = query(collection(db, "trails"));
  q = applyQueryFilters(q, filters);

  // Re-run the mapping for each snapshot so consumers receive plain trail objects.
  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: doc.data().timestamp.toDate(),
      };
    });

    cb(results);
  });
}

// Fetch one trail document for a server-rendered trail page.
export async function getTrailById(db, trailId) {
  if (!trailId) {
    console.log("Error: Invalid ID received: ", trailId);
    return;
  }
  // Fetch one trail and convert its timestamp to a serializable Date.
  const docRef = doc(db, "trails", trailId);
  const docSnap = await getDoc(docRef);
  return {
    ...docSnap.data(),
    timestamp: docSnap.data().timestamp.toDate(),
  };
}


// Subscribe to changes for a single trail document.
export function getTrailSnapshotById(trailId, cb) {
  if (!trailId) {
    console.log("Error: Invalid ID received: ", trailId);
    return;
  }

  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  // Keep the displayed trail synchronized with its Firestore document.
  const docRef = doc(db, "trails", trailId);
  return onSnapshot(docRef, (docSnap) => {
    cb({
      ...docSnap.data(),
      timestamp: docSnap.data().timestamp.toDate(),
    });
  });
}

// Fetch a trail's reviews in newest-first order.
export async function getReviewsByTrailId(db, trailId) {
  if (!trailId) {
    console.log("Error: Invalid trailId received: ", trailId);
    return;
  }

  // Return reviews newest first for the trail detail view.
  const q = query(
    collection(db, "trails", trailId, "ratings"),
    orderBy("timestamp", "desc")
  );

  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}

// Subscribe to a trail's reviews and deliver them in newest-first order.
export function getReviewsSnapshotByTrailId(trailId, cb) {
  if (!trailId) {
    console.log("Error: Invalid trailId received: ", trailId);
    return;
  }

  // Subscribe to the trail's reviews and preserve newest-first ordering.
  const q = query(
    collection(db, "trails", trailId, "ratings"),
    orderBy("timestamp", "desc")
  );
  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: doc.data().timestamp.toDate(),
      };
    });
    cb(results);
  });
}

// Generate sample data, then save each trail and its reviews to Firestore.
export async function addFakeTrailsAndReviews() {
  const data = await generateFakeTrailsAndReviews();
  // Create each trail first so its generated ratings can use the new document ID.
  for (const { trailData, ratingsData } of data) {
    try {
      const docRef = await addDoc(
        collection(db, "trails"),
        trailData
      );

      for (const ratingData of ratingsData) {
        await addDoc(
          collection(db, "trails", docRef.id, "ratings"),
          ratingData
        );
      }
    } catch (e) {
      console.log("There was an error adding the document");
      console.error("Error adding document: ", e);
    }
  }
}
