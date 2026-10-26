import Trail from "@/src/components/Trail.jsx";
import { Suspense } from "react";
import { getTrailById } from "@/src/lib/firebase/firestore.js";



import {
  getAuthenticatedAppForUser,
  getAuthenticatedAppForUser as getUser,
} from "@/src/lib/firebase/serverApp.js";
import ReviewsList, {
  ReviewsListSkeleton,
} from "@/src/components/Reviews/ReviewsList";
import {
  GeminiSummary,
  GeminiSummarySkeleton,
} from "@/src/components/Reviews/ReviewSummary";
import { getFirestore } from "firebase/firestore";

export default async function Home(props) {
  // This is a server component, we can access URL
  // parameters via Next.js and download the data
  // we need for this page
  const params = await props.params;
  const { currentUser } = await getUser();
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const trail = await getTrailById(
    getFirestore(firebaseServerApp),
    params.id
  );

  return (
    <main className="main__trail">
      <Trail
        id={params.id}
        initialTrail={trail}
        initialUserId={currentUser?.uid || ""}
      >
        <Suspense fallback={<GeminiSummarySkeleton />}>
          <GeminiSummary trailId={params.id} />
        </Suspense>
      </Trail>
      <Suspense
        fallback={<ReviewsListSkeleton numReviews={trail.numRatings} />}
      >
        <ReviewsList trailId={params.id} userId={currentUser?.uid || ""} />
      </Suspense>
    </main>
  );
}
