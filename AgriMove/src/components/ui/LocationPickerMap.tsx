import { useState, useCallback, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  ZoomControl,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { getCoords, findNearestLocation, type LngLat } from "../../utils/locationCoords";
import { MapPin, Navigation } from "lucide-react";

interface LocationPickerMapProps {
  pickup: string;
  destination: string;
  onSelectPickup: (locationName: string) => void;
  onSelectDestination: (locationName: string) => void;
  height?: string;
}

type SelectionMode = "pickup" | "destination";

const pickupIcon = L.divIcon({
  className: "pickup-leaflet-marker",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const destIcon = L.divIcon({
  className: "dest-leaflet-marker",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FitMapBoundsPicker({
  pickupLatLng,
  destLatLng,
  hasPickup,
  hasDest,
}: {
  pickupLatLng: [number, number];
  destLatLng: [number, number];
  hasPickup: boolean;
  hasDest: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (hasPickup && hasDest) {
      const bounds = L.latLngBounds([pickupLatLng, destLatLng]);
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
    } else if (hasPickup) {
      map.setView(pickupLatLng, 14, { animate: true });
    } else if (hasDest) {
      map.setView(destLatLng, 14, { animate: true });
    }
  }, [map, pickupLatLng[0], pickupLatLng[1], destLatLng[0], destLatLng[1], hasPickup, hasDest]);

  return null;
}

const PRESET_HUBS = [
  "Musanze Hub",
  "Kigali Market",
  "Nyagatare Farm",
  "Huye Depot",
  "Rubavu",
  "Bugesera Farm",
];

export function LocationPickerMap({
  pickup,
  destination,
  onSelectPickup,
  onSelectDestination,
  height = "360px",
}: LocationPickerMapProps) {
  const [activeMode, setActiveMode] = useState<SelectionMode>("pickup");

  // getCoords returns [lng, lat] -> Leaflet requires [lat, lng]
  const rawPickup: LngLat = getCoords(pickup);
  const rawDest: LngLat   = getCoords(destination);

  const pickupLatLng: [number, number] = [rawPickup[1], rawPickup[0]];
  const destLatLng:   [number, number] = [rawDest[1], rawDest[0]];

  const hasPickup = Boolean(pickup.trim());
  const hasDest   = Boolean(destination.trim());

  // Handle map click with exact building/street coordinate precision
  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      let placeName = findNearestLocation(lng, lat);

      // Attempt high-detail reverse geocoding (zoom=18 for exact building/street precision)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat.toFixed(6)}&lon=${lng.toFixed(6)}&zoom=18`,
          { headers: { "Accept-Language": "en" } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.address) {
            const a = data.address;
            const micro = a.amenity || a.building || a.shop || a.road || a.pedestrian || a.suburb || a.neighbourhood || a.village;
            const district = a.town || a.city || a.county || a.district;
            const mainLabel = micro && district && micro !== district
              ? `${micro}, ${district}`
              : (micro || district || data.name || "Exact Spot");
            placeName = `${mainLabel} (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
          }
        }
      } catch {
        // Fall back to findNearestLocation
      }

      if (activeMode === "pickup") {
        onSelectPickup(placeName);
        setActiveMode("destination"); // Auto switch mode to destination for fast entry
      } else {
        onSelectDestination(placeName);
      }
    },
    [activeMode, onSelectPickup, onSelectDestination]
  );

  const applyPreset = (presetName: string) => {
    if (activeMode === "pickup") {
      onSelectPickup(presetName);
      setActiveMode("destination");
    } else {
      onSelectDestination(presetName);
    }
  };

  return (
    <div className="space-y-2">
      {/* Mode Control Header */}
      <div className="flex flex-col gap-2 bg-[#f8fdf8] p-2.5 rounded-lg border border-[#D3EE98]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#3a7a3e] flex items-center gap-1.5">
            <MapPin size={14} />
            Click map to pinpoint exact {activeMode === "pickup" ? "Pickup 🟢" : "Destination 🟤"}:
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setActiveMode("pickup")}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
                activeMode === "pickup"
                  ? "bg-[#72BF78] text-white shadow-sm ring-2 ring-[#72BF78]/40"
                  : "bg-white text-[#555] border border-[#e0e0e0] hover:bg-[#f0f0f0]"
              }`}
            >
              🟢 Pickup {hasPickup ? `✓` : ""}
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("destination")}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
                activeMode === "destination"
                  ? "bg-[#2a5c2e] text-white shadow-sm ring-2 ring-[#2a5c2e]/40"
                  : "bg-white text-[#555] border border-[#e0e0e0] hover:bg-[#f0f0f0]"
              }`}
            >
              🟤 Destination {hasDest ? `✓` : ""}
            </button>
          </div>
        </div>

        {/* Quick preset hub buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pt-1 pb-0.5 text-[11px] scrollbar-none">
          <span className="text-[#666] font-medium shrink-0 flex items-center gap-0.5 text-[10px]">
            <Navigation size={10} /> Quick presets:
          </span>
          {PRESET_HUBS.map((hub) => (
            <button
              key={hub}
              type="button"
              onClick={() => applyPreset(hub)}
              className="shrink-0 px-2 py-0.5 bg-white border border-[#D3EE98] text-[#3a7a3e] rounded-full hover:bg-[#edfae0] hover:border-[#72BF78] transition-colors"
            >
              + {hub}
            </button>
          ))}
        </div>
      </div>

      {/* Leaflet Map Container */}
      <div className="rounded-xl overflow-hidden border border-[#D3EE98] relative shadow-inner" style={{ height }}>
        <MapContainer
          center={[-1.9441, 30.0619]}
          zoom={9}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          dragging={true}
          zoomControl={false}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Live OpenStreetMap Tile Server */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <FitMapBoundsPicker
            pickupLatLng={pickupLatLng}
            destLatLng={destLatLng}
            hasPickup={hasPickup}
            hasDest={hasDest}
          />

          <MapClickHandler onClick={handleMapClick} />

          {hasPickup && hasDest && (
            <Polyline
              positions={[pickupLatLng, destLatLng]}
              pathOptions={{
                color: "#3a7a3e",
                weight: 4,
                dashArray: "6, 6",
                opacity: 0.9,
              }}
            />
          )}

          {hasPickup && (
            <Marker position={pickupLatLng} icon={pickupIcon}>
              <Popup>
                <div className="text-xs">
                  <strong className="text-[#72BF78]">Exact Pickup Point</strong>
                  <p className="mt-0.5 font-medium">{pickup}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {hasDest && (
            <Marker position={destLatLng} icon={destIcon}>
              <Popup>
                <div className="text-xs">
                  <strong className="text-[#2a5c2e]">Exact Delivery Destination</strong>
                  <p className="mt-0.5 font-medium">{destination}</p>
                </div>
              </Popup>
            </Marker>
          )}

          <ZoomControl position="bottomright" />
        </MapContainer>

        {/* Legend Indicator */}
        <div className="absolute top-2 left-2 z-[1000] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-medium text-[#3a7a3e] border border-[#D3EE98] shadow-xs flex gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#72BF78]" /> Pickup Point
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#2a5c2e]" /> Destination Point
          </span>
        </div>
      </div>
    </div>
  );
}


