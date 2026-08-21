import { useEffect, useState } from "react";
import type { PlaneState } from "@/components/net/LiveMap";

/** Poll the ADS-B proxy route for traffic inside a bounding box. */
export function usePlanes(
  bbox: { lamin: number; lomin: number; lamax: number; lomax: number } | null,
  enabled: boolean,
) {
  const [planes, setPlanes] = useState<PlaneState[]>([]);

  useEffect(() => {
    if (!enabled || !bbox) {
      setPlanes([]);
      return;
    }
    let alive = true;
    const load = async () => {
      try {
        const qs = new URLSearchParams({
          lamin: String(bbox.lamin),
          lomin: String(bbox.lomin),
          lamax: String(bbox.lamax),
          lomax: String(bbox.lomax),
        });
        const res = await fetch(`/api/planes?${qs}`);
        if (!res.ok) return;
        const json: any = await res.json();
        const rows: PlaneState[] = (json.states ?? [])
          .map((s: any[]) => ({
            icao: String(s[0]),
            callsign: s[1] ? String(s[1]).trim() : null,
            lng: Number(s[5]),
            lat: Number(s[6]),
            altFt: s[7] != null ? Math.round(Number(s[7]) * 3.28084) : null,
            heading: s[10] != null ? Number(s[10]) : null,
          }))
          .filter((p: PlaneState) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
        if (alive) setPlanes(rows);
      } catch {
        /* transient network error — keep last frame */
      }
    };
    load();
    const t = setInterval(load, 20_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [enabled, bbox?.lamin, bbox?.lomin, bbox?.lamax, bbox?.lomax]);

  return planes;
}
