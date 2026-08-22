import { supabase } from "@/integrations/supabase/client";

export type AreaMode = "address" | "region";

export interface ResponseArea {
  id: boolean;
  mode: AreaMode;
  address: string | null;
  center_lat: number;
  center_lng: number;
  radius_mi: number;
  states: string[];
  counties: string[];
  updated_at: string;
}

const R = 3958.8;

export function haversineMi(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export async function fetchResponseArea(): Promise<ResponseArea | null> {
  const { data } = await supabase.from("net_response_area").select("*").eq("id", true).maybeSingle();
  return (data as unknown as ResponseArea) ?? null;
}

export async function saveResponseArea(patch: Partial<ResponseArea>): Promise<ResponseArea> {
  const { data, error } = await supabase
    .from("net_response_area")
    .upsert({ id: true, ...patch } as never, { onConflict: "id" })
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Nothing was saved — admin access is required to change the service area.");
  return data as unknown as ResponseArea;
}

const norm = (v?: string | null) => (v ?? "").trim().toLowerCase().replace(/\s+county$/, "");

/**
 * True when a point is inside the configured response area.
 * - "address" mode: radius around the geocoded centre point.
 * - "region" mode: the point's state / county must be on the subscribed list.
 * Passing state/county is optional; without them a region area falls back to the radius.
 */
export function inArea(
  area: ResponseArea | null,
  p: { lat: number; lng: number; state?: string | null; county?: string | null },
) {
  if (!area) return true;

  if (area.mode === "region") {
    const states = (area.states ?? []).map(norm).filter(Boolean);
    const counties = (area.counties ?? []).map(norm).filter(Boolean);
    if (!states.length && !counties.length) return true;
    if (p.state == null && p.county == null) return true;
    const stateOk = !states.length || states.includes(norm(p.state));
    const countyOk = !counties.length || counties.includes(norm(p.county));
    return stateOk && countyOk;
  }

  const radius = Number(area.radius_mi) || 0;
  if (radius <= 0) return true;
  return haversineMi({ lat: Number(area.center_lat), lng: Number(area.center_lng) }, p) <= radius;
}

