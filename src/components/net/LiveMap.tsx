import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Circle, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Camera } from "@/lib/net/alertwest";
import { getStatus, relTime } from "@/lib/net/alertwest";
import type { IncidentRow } from "@/lib/net/incidents";
import { STATUS_META } from "@/lib/net/incidents";
import type { ResponseArea } from "@/lib/net/area";

export type Hotspot = { lat: number; lng: number; frp: number; confidence: string; acq_datetime: string; satellite: string };
export type PlaneState = { icao: string; callsign: string | null; lat: number; lng: number; heading: number | null; altFt: number | null };

export type MapLayers = {
  cameras: boolean;
  incidents: boolean;
  hotspots: boolean;
  aircraft: boolean;
  area: boolean;
};

const BASEMAPS = {
  dark: {
    label: "Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
  },
  satellite: {
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
  terrain: {
    label: "Terrain",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenTopoMap (CC-BY-SA)",
  },
} as const;

export type BasemapId = keyof typeof BASEMAPS;
export const BASEMAP_OPTIONS = Object.entries(BASEMAPS).map(([value, b]) => ({ value, label: b.label }));

function ClickCapture({ onPick }: { onPick?: (p: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      onPick?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function planeIcon(heading: number | null) {
  return L.divIcon({
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    html: `<div style="transform:rotate(${heading ?? 0}deg);color:#38bdf8;font-size:14px;line-height:18px;text-align:center">&#10148;</div>`,
  });
}

export default function LiveMap({
  center = [37.5, -120],
  zoom = 6,
  basemap = "dark",
  layers,
  cameras = [],
  incidents = [],
  hotspots = [],
  planes = [],
  area = null,
  onPickPoint,
  onSelectCamera,
  onSelectIncident,
  height = "70vh",
}: {
  center?: [number, number];
  zoom?: number;
  basemap?: BasemapId;
  layers: MapLayers;
  cameras?: Camera[];
  incidents?: IncidentRow[];
  hotspots?: Hotspot[];
  planes?: PlaneState[];
  area?: ResponseArea | null;
  onPickPoint?: (p: { lat: number; lng: number }) => void;
  onSelectCamera?: (c: Camera) => void;
  onSelectIncident?: (i: IncidentRow) => void;
  height?: string;
}) {
  const base = BASEMAPS[basemap] ?? BASEMAPS.dark;
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="rounded-lg border border-border bg-muted/30" style={{ height }} />;

  return (
    <div className="overflow-hidden rounded-lg border border-border" style={{ height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%", background: "#0b1220" }} preferCanvas>
        <TileLayer url={base.url} attribution={base.attribution} subdomains={"abcd"} />
        <ClickCapture onPick={onPickPoint} />

        {layers.area && area && Number(area.radius_mi) > 0 && (
          <Circle
            center={[Number(area.center_lat), Number(area.center_lng)]}
            radius={Number(area.radius_mi) * 1609.34}
            pathOptions={{ color: "#38bdf8", weight: 1, fillOpacity: 0.04 }}
          />
        )}

        {layers.hotspots &&
          hotspots.map((h, i) => (
            <CircleMarker
              key={`h${i}`}
              center={[h.lat, h.lng]}
              radius={Math.min(10, 3 + (Number(h.frp) || 0) / 15)}
              pathOptions={{ color: "#f97316", fillColor: "#f97316", fillOpacity: 0.6, weight: 1 }}
            >
              <Popup>
                <div className="text-xs">
                  <p className="font-semibold">Satellite hotspot</p>
                  <p>FRP {h.frp} MW · confidence {h.confidence || "—"}</p>
                  <p>{h.satellite} · {new Date(h.acq_datetime).toLocaleString()}</p>
                  <p className="font-mono">{h.lat.toFixed(3)}, {h.lng.toFixed(3)}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {layers.cameras &&
          cameras.map((c) => {
            const lat = Number(c.site.latitude);
            const lng = Number(c.site.longitude);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
            const st = getStatus(c);
            return (
              <CircleMarker
                key={c.site.id}
                center={[lat, lng]}
                radius={4}
                pathOptions={{ color: st.color, fillColor: st.color, fillOpacity: 0.9, weight: 1 }}
                eventHandlers={{ click: () => onSelectCamera?.(c) }}
              >
                <Popup>
                  <div className="text-xs">
                    <p className="font-semibold">{c.name}</p>
                    <p>{c.site.county ? `${c.site.county}, ` : ""}{c.site.state ?? ""}</p>
                    <p>{st.label} · {relTime(c.image.time) ?? "no frame"}</p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        {layers.incidents &&
          incidents.map((inc) => (
            <CircleMarker
              key={inc.id}
              center={[Number(inc.lat), Number(inc.lng)]}
              radius={8}
              pathOptions={{
                color: STATUS_META[inc.status]?.color ?? "#ef4444",
                fillColor: STATUS_META[inc.status]?.color ?? "#ef4444",
                fillOpacity: 0.35,
                weight: 2,
              }}
              eventHandlers={{ click: () => onSelectIncident?.(inc) }}
            >
              <Popup>
                <div className="text-xs">
                  <p className="font-semibold">{inc.title}</p>
                  <p>{STATUS_META[inc.status]?.label} · {inc.priority.toUpperCase()}</p>
                  <p className="font-mono">{Number(inc.lat).toFixed(3)}, {Number(inc.lng).toFixed(3)}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {layers.aircraft &&
          planes.map((p) => (
            <Marker key={p.icao} position={[p.lat, p.lng]} icon={planeIcon(p.heading)}>
              <Popup>
                <div className="text-xs">
                  <p className="font-semibold">{p.callsign?.trim() || p.icao}</p>
                  <p>{p.altFt != null ? `${p.altFt.toLocaleString()} ft` : "altitude unknown"}</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

export function useMapLayers(initial?: Partial<MapLayers>) {
  return useState<MapLayers>({ cameras: true, incidents: true, hotspots: true, aircraft: false, area: true, ...initial });
}

export function useCameraFilter(cameras: Camera[], q: string) {
  return useMemo(() => {
    if (!q) return cameras;
    const s = q.toLowerCase();
    return cameras.filter((c) =>
      `${c.name} ${c.site.county ?? ""} ${c.site.state ?? ""}`.toLowerCase().includes(s),
    );
  }, [cameras, q]);
}
