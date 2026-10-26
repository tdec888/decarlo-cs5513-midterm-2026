import TrailListings from "@/src/components/TrailListings.jsx";
import { getTrails } from "@/src/lib/firebase/firestore.js";
//import { getTrailSnapshotById } from "@/src/lib/firebase/firestore.js";


import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it

export const dynamic = "force-dynamic";

// This line also forces this route to be server-side rendered
// export const revalidate = 0;

export default async function Home(props) {
  // Resolve URL filters and use the authenticated Firebase app to fetch the listing.
  const searchParams = await props.searchParams;
  // Using seachParams which Next.js provides, allows the filtering to happen on the server-side, for example:
  // ?city=Yosemite&category=Alpine&sort=Review
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const trails = await getTrails(
    getFirestore(firebaseServerApp),
    searchParams
  );
  return (
    <main className="main__home">
      <TrailListings
        initialTrails={trails}
        searchParams={searchParams}
      />
    </main>
  );
}
