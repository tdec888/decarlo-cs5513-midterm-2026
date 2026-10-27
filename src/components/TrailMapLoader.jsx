"use client";

import dynamic from "next/dynamic";

const TrailMap = dynamic(() => import("./TrailMap"), {
  ssr: false,
  loading: () => <p>Loading map…</p>,
});

export default function TrailMapLoader({ trails }) {
  return <TrailMap trails={trails} />;
}
