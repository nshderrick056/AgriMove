import { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  ZoomControl,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { getCoords, lerp, type LngLat } from "../../utils/locationCoords";
import { Navigation, Maximize2, Crosshair } from "lucide-react";

// ── Status → driver progress (0–1) ───────────────────────────────────────────
function statusProgress(status: string): number {
  switch (status?.toUpperCase()) {
    case "PENDING":   return 0;
    case "ASSIGNED":  return 0.05;
    case "EN_ROUTE":  return 0.5;
    case "DELIVERED": return 1;
    default:          return 0;
  }
}

// ── Custom Leaflet HTML DivIcons ─────────────────────────────────────────────
const pickupIcon = L.divIcon({
  className: "pickup-leaflet-marker",
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const destIcon = L.divIcon({
  className: "dest-leaflet-marker",
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function createDriverIcon(heading?: number | null, isLiveGps?: boolean) {
  const angle = heading ?? 0;
  return L.divIcon({
    className: "driver-directional-marker",
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        ${isLiveGps ? '<span style="position: absolute; inset: -4px; border-radius: 50%; border: 2px solid #72BF78; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></span>' : ''}
        <div style="width: 28px; height: 28px; border-radius: 50%; background: #3a7a3e; border: 2px solid #FEFF9F; box-shadow: 0 3px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; transform: rotate(${angle}deg); transition: transform 0.3s ease-out;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FEFF9F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
          </svg>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

// ── Component to auto-fit bounds on pickup, destination & driver change ───────
function FitMapBounds({
  pickupLatLng,
  destLatLng,
  driverLatLng,
}: {
  pickupLatLng: [number, number];
  destLatLng: [number, number];
  driverLatLng: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const bounds = L.latLngBounds([pickupLatLng, destLatLng, driverLatLng]);
    map.fitBounds(bounds, { padding: [45, 45], maxZoom: 14 });
  }, [map, pickupLatLng[0], pickupLatLng[1], destLatLng[0], destLatLng[1], driverLatLng[0], driverLatLng[1]]);

  return null;
}

// ── Camera Controller Helper for Map Buttons ─────────────────────────────────
function MapControlsHandler({
  driverLatLng,
  pickupLatLng,
  destLatLng,
}: {
  driverLatLng: [number, number];
  pickupLatLng: [number, number];
  destLatLng: [number, number];
}) {
  const map = useMap();

  const handleFocusDriver = () => {
    map.setView(driverLatLng, 14, { animate: true });
  };

  const handleFitAll = () => {
    const bounds = L.latLngBounds([pickupLatLng, destLatLng, driverLatLng]);
    map.fitBounds(bounds, { padding: [45, 45], maxZoom: 14 });
  };

  return (
    <div className="absolute top-2 left-2 z-[1000] flex flex-col gap-1.5">
      <button
        type="button"
        onClick={handleFocusDriver}
        className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs text-[#3a7a3e] px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[#D3EE98] shadow-sm hover:bg-[#edfae0] transition-colors"
        title="Focus map on driver location"
      >
        <Crosshair size={14} className="text-[#72BF78]" />
        My Location
      </button>
      <button
        type="button"
        onClick={handleFitAll}
        className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs text-[#3a7a3e] px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[#D3EE98] shadow-sm hover:bg-[#edfae0] transition-colors"
        title="Fit map to show pickup, delivery, and driver"
      >
        <Maximize2 size={13} className="text-[#3a7a3e]" />
        Fit All Points
      </button>
    </div>
  );
}

interface DeliveryMapProps {
  pickup: string;
  destination: string;
  status: string;
  height?: string;
  className?: string;
  driverLiveCoords?: [number, number] | null; // [lat, lng]
  driverHeading?: number | null; // angle in degrees
  isDriveMode?: boolean;
}

export function DeliveryMap({
  pickup,
  destination,
  status,
  height = "192px",
  className = "",
  driverLiveCoords,
  driverHeading,
  isDriveMode = false,
}: DeliveryMapProps) {
  // getCoords returns [lng, lat] -> Leaflet requires [lat, lng]
  const rawPickup: LngLat = getCoords(pickup);
  const rawDest: LngLat   = getCoords(destination);

  const pickupLatLng: [number, number] = [rawPickup[1], rawPickup[0]];
  const destLatLng:   [number, number] = [rawDest[1], rawDest[0]];

  // Driver animated progress fallback
  const targetProgress = statusProgress(status);
  const [driverProgress, setDriverProgress] = useState(targetProgress);

  useEffect(() => {
    const start = driverProgress;
    const end   = targetProgress;
    if (Math.abs(end - start) < 0.001) return;

    const duration = 1200;
    const startTime = performance.now();

    let raf: number;
    function animate(now: number) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDriverProgress(start + (end - start) * eased);
      if (t < 1) raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetProgress]);

  const simulatedDriverLatLng: [number, number] = [
    lerp([pickupLatLng[0], 0], [destLatLng[0], 0], driverProgress)[0],
    lerp([pickupLatLng[1], 0], [destLatLng[1], 0], driverProgress)[0],
  ];

  // Effective driver position: live GPS location if available, otherwise simulated
  const effectiveDriverLatLng: [number, number] = driverLiveCoords ?? simulatedDriverLatLng;

  // Calculate default angle pointing towards destination if heading not explicitly passed
  const calculatedHeading = useMemo(() => {
    if (driverHeading != null) return driverHeading;
    const dLat = destLatLng[0] - effectiveDriverLatLng[0];
    const dLng = destLatLng[1] - effectiveDriverLatLng[1];
    const rad = Math.atan2(dLng, dLat);
    return (rad * 180) / Math.PI;
  }, [driverHeading, effectiveDriverLatLng[0], effectiveDriverLatLng[1], destLatLng[0], destLatLng[1]]);

  const centerLatLng: [number, number] = [
    (pickupLatLng[0] + destLatLng[0]) / 2,
    (pickupLatLng[1] + destLatLng[1]) / 2,
  ];

  return (
    <div className={`w-full h-full rounded-xl overflow-hidden relative border border-[#D3EE98]/80 ${className}`} style={{ height }}>
      <MapContainer
        center={centerLatLng}
        zoom={9}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        zoomControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Live OpenStreetMap Tile Layer (Free, no token required) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Auto fit map bounds across all 3 points */}
        <FitMapBounds
          pickupLatLng={pickupLatLng}
          destLatLng={destLatLng}
          driverLatLng={effectiveDriverLatLng}
        />

        {/* Map Control Buttons */}
        <MapControlsHandler
          driverLatLng={effectiveDriverLatLng}
          pickupLatLng={pickupLatLng}
          destLatLng={destLatLng}
        />

        {/* Direct line from Pickup to Destination */}
        <Polyline
          positions={[pickupLatLng, destLatLng]}
          pathOptions={{
            color: "#2a5c2e",
            weight: 3,
            dashArray: "6, 6",
            opacity: 0.5,
          }}
        />

        {/* Segment 1: Route from Pickup to Driver Location */}
        <Polyline
          positions={[pickupLatLng, effectiveDriverLatLng]}
          pathOptions={{
            color: "#72BF78",
            weight: 5,
            opacity: 0.85,
          }}
        />

        {/* Segment 2: Route from Driver Location to Destination */}
        <Polyline
          positions={[effectiveDriverLatLng, destLatLng]}
          pathOptions={{
            color: "#3a7a3e",
            weight: 5,
            opacity: 0.85,
          }}
        />

        {/* Pickup Pin */}
        <Marker position={pickupLatLng} icon={pickupIcon}>
          <Popup>
            <div className="text-xs">
              <strong className="text-[#72BF78]">Pickup Location</strong>
              <p>{pickup || "Pickup Point"}</p>
            </div>
          </Popup>
        </Marker>

        {/* Destination Pin */}
        <Marker position={destLatLng} icon={destIcon}>
          <Popup>
            <div className="text-xs">
              <strong className="text-[#2a5c2e]">Delivery Destination</strong>
              <p>{destination || "Destination Point"}</p>
            </div>
          </Popup>
        </Marker>

        {/* Driver Location Pointer (Points at driver's live position) */}
        {status?.toUpperCase() !== "CANCELLED" && (
          <Marker
            position={effectiveDriverLatLng}
            icon={createDriverIcon(calculatedHeading, Boolean(driverLiveCoords))}
          >
            <Popup>
              <div className="text-xs">
                <strong className="text-[#3a7a3e]">Driver Current Location</strong>
                <p>{driverLiveCoords ? "📍 Live GPS Position" : "🚚 In-Transit Progress"}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Native Leaflet Zoom Controls */}
        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* Floating Legend Overlay — Top Right */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          gap: 6,
          fontSize: 11,
          color: "#3a7a3e",
          zIndex: 1000,
          pointerEvents: "none",
        }}
      >
        {[
          { color: "#72BF78", border: "none", label: pickup || "Pickup" },
          { color: "#FEFF9F", border: "1.5px solid #3a7a3e", label: isDriveMode ? "My Driver Location" : "Driver" },
          { color: "#2a5c2e", border: "none", label: destination || "Destination" },
        ].map(({ color, border, label }) => (
          <span
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(4px)",
              borderRadius: 20,
              padding: "3px 9px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: color,
                border,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

