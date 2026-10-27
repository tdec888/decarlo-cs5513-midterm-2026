import TrailListings from "@/src/components/TrailListings.jsx";
import { getTrails } from "@/src/lib/firebase/firestore.js";
//import { getTrailSnapshotById } from "@/src/lib/firebase/firestore.js";


import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";


import TrailMapLoader from "@/src/components/TrailMapLoader.jsx"; // loader for leaflet

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

        <div>
      
        <br /> 
        <div className="container alignContainerCenter"> 
          <img src="/back.png" className="imgSize alignCenter" />
        </div>
        <br />
        <div className="container ">
          <div className="row gx-5">
            <div className="col-md-6 col-sm-12 p-5">
              <div className=" bgColor2 addShadow p-5">
                <p>Welcome to my CS 55.13 Mid-Term Project. This project utilized themes and assets from my CS50B midterm project into a global override css file. </p>
                <p>Bootstrap was then imported into the layout.js for global customizations and bootstrap react was integrated into the reviews react component.</p>
                <br />
                <br />
                <br />

              </div>
            </div>
             
            <div className="col-md-6 col-sm-12 p-5 ">
              <div className=" bgColor2 addShadow alignContainerCenter p-2 ">

                <TrailMapLoader trails={trails} />
                
                <div id="map" className="alignCenter" /> 
                
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className="container overflow-hidden ">
          <div className="row">
            <div className="addShadow col-12 "> 
              
              <TrailListings className=""
                initialTrails={trails}
                searchParams={searchParams}
              />
              
               

              
            </div>
          </div>
          <div className="row">

            {/*    <section class="card" style="max-width: 100px; max-height: 100px;">
                <img src="assets/images/mapIcon1.png" class="card-img-top" alt="...">
                <div class="card-body">
                  <h4 class="card-title">Card title</h4>
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                  <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>  

              </section>
          */}
          </div>
        </div>
        <br />
        <br />
        <br />
      </div>


      <br></br>

    </main>
  );
}
