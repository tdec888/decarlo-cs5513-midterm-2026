import "@/src/app/styles.css";
import Header from "@/src/components/Header.jsx";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";

// custom imports added to midterm. layout.js is used to bring all css to all routes and pages
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css"; // leaflet css
import "./custom.css"; // custom over rides

import BootstrapClient from "@/src/components/BootstrapClient";
// ****

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Grand Hiking Trails",
  description:
    "Grand Hiking Trails is a hiking trail review website built with Next.js and Firebase.",
};

export default async function RootLayout({ children }) {
  const { currentUser } = await getAuthenticatedAppForUser();
  return (
    <html lang="en">
      <body>
        <Header initialUser={currentUser?.toJSON()} />

          <nav className="navbar navbar-expand-md addShadow txtColor1"> {/* Developer note: change to expand-sm*/}
          <div className="container-fluid ">
            <a className="navbar-brand " href="/">Home</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon">=</span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav ">
                <a className="nav-link active txtColor1" aria-current="page" href="#"></a>
                <a className="nav-link" href="/about/">About</a>
              </div>
            </div>
          </div>
        </nav>

        <main>{children}</main>
        <BootstrapClient />
      </body>
    </html>
  );
}
