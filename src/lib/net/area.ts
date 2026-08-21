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

export async function saveResponseArea(patch: Partial<ResponseArea>) {
  const { error } = await supabase
    .from("net_response_area")
    .update(patch as never)
    .eq("id", true);
  if (error) throw error;
}

/** True when a point falls inside the configured response radius. */
export function inArea(area: ResponseArea | null, p: { lat: number; lng: number }) {
  if (!area) return true;
  const radius = Number(area.radius_mi) || 0;
  if (radius <= 0) return true;
  return haversineMi({ lat: Number(area.center_lat), lng: Number(area.center_lng) }, p) <= radius;
}
