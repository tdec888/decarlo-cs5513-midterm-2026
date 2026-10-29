"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { randomData } from "@/src/lib/randomData.js";

const DEFAULT_CENTER = [38.437010297460034, -122.71623240115119];
const DEFAULT_ZOOM = 10;
const SELECTED_ZOOM = 12;

const markerIcons = {
  default: L.divIcon({
    className: "trail-map-marker",
    html: '<span class="trail-map-marker__dot"></span>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  }),
  selected: L.divIcon({
    className: "trail-map-marker trail-map-marker--selected",
    html: '<span class="trail-map-marker__dot"></span>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  }),
};

function MapController({ selectedTrail }) {
  const map = useMap();

  useEffect(() => {
    if (selectedTrail) {
      map.flyTo(
        selectedTrail.coordinates,
        Math.max(map.getZoom(), SELECTED_ZOOM),
        { animate: true }
      );
    }
  }, [map, selectedTrail]);

  return null;
}

function getTrailCoordinates(trail) {
  const latitude = Number(trail.latitude ?? trail.lat);
  const longitude = Number(trail.longitude ?? trail.lng);

  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return [latitude, longitude];
  }

  const fallback = trail.city && randomData.trailLocations?.[trail.city];
  if (fallback) {
    return [Number(fallback.latitude), Number(fallback.longitude)];
  }

  return null;
}

export default function TrailMap({ trails = [] }) {
  const locatedTrails = trails
    .map((trail) => ({
      ...trail,
      coordinates: getTrailCoordinates(trail),
    }))
    .filter((trail) => trail.coordinates);
  const [selectedTrailId, setSelectedTrailId] = useState(null);
  const selectedTrail =
    locatedTrails.find((trail) => trail.id === selectedTrailId) || null;

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController selectedTrail={selectedTrail} />

      {locatedTrails.map((trail) => (
        <Marker
          key={trail.id}
          position={trail.coordinates}
          icon={
            trail.id === selectedTrailId
              ? markerIcons.selected
              : markerIcons.default
          }
          eventHandlers={{
            click: () => setSelectedTrailId(trail.id),
          }}
        >
          <Popup>
            <strong>{trail.name}</strong>
            <br />
            {trail.city}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
