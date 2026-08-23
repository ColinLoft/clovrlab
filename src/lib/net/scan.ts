import { useCallback, useRef, useState } from "react";
import { sweepCameras, type SweepResultItem } from "./ai-detect.functions";
import type { Camera } from "./alertwest";

export interface ScanStats {
  total: number;
  done: number;
  analyzed: number;
  fire: number;
  smoke: number;
  clear: number;
  queued: number;
  errors: string[];
  startedAt: number | null;
  finishedAt: number | null;
  paused: boolean;
}

const EMPTY: ScanStats = {
  total: 0, done: 0, analyzed: 0, fire: 0, smoke: 0, clear: 0, queued: 0,
  errors: [], startedAt: null, finishedAt: null, paused: false,
};

const CHUNK = 3;

export function toCameraInput(c: Camera) {
  return {
    camera_id: c.site.id,
    camera_name: c.name,
    lat: Number(c.site.latitude),
    lng: Number(c.site.longitude),
    state: c.site.state,
    county: c.site.county,
    image_url: c.image.url as string,
    image_time: c.image.time ?? new Date().toISOString(),
  };
}

/**
 * Runs a manual AI check across a set of cameras in small chunks so the
 * operator sees live progress, per-frame verdicts and running stats instead of
 * one long silent request.
 */
export function useAiScan() {
  const [stats, setStats] = useState<ScanStats>(EMPTY);
  const [results, setResults] = useState<SweepResultItem[]>([]);
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const cancelled = useRef(false);

  const cancel = useCallback(() => { cancelled.current = true; }, []);

  const reset = useCallback(() => { setStats(EMPTY); setResults([]); setCurrent(null); }, []);

  const start = useCallback(async (cameras: Camera[], max = 40) => {
    const batch = cameras.filter((c) => c.image.url).slice(0, max);
    if (!batch.length) return { ok: false, message: "No camera frames available to analyse." };

    cancelled.current = false;
    setRunning(true);
    setResults([]);
    setStats({ ...EMPTY, total: batch.length, startedAt: Date.now() });

    for (let i = 0; i < batch.length; i += CHUNK) {
      if (cancelled.current) break;
      const chunk = batch.slice(i, i + CHUNK);
      setCurrent(chunk.map((c) => c.name).join(", "));
      try {
        const res: any = await sweepCameras({ data: { cameras: chunk.map(toCameraInput) } });
        const items = (res?.results ?? []) as SweepResultItem[];
        setResults((prev) => [...items, ...prev]);
        setStats((s) => ({
          ...s,
          done: s.done + chunk.length,
          analyzed: s.analyzed + Number(res?.analyzed ?? items.length),
          queued: s.queued + Number(res?.created ?? 0),
          fire: s.fire + items.filter((r) => r.label === "fire").length,
          smoke: s.smoke + items.filter((r) => r.label === "smoke").length,
          clear: s.clear + items.filter((r) => r.label === "clear").length,
          errors: [...s.errors, ...(res?.errors ?? [])].slice(0, 8),
          paused: s.paused || Boolean(res?.paused),
        }));
        if (res?.paused) break;
      } catch (e) {
        setStats((s) => ({ ...s, done: s.done + chunk.length, errors: [...s.errors, (e as Error).message].slice(0, 8) }));
      }
    }

    setCurrent(null);
    setRunning(false);
    setStats((s) => ({ ...s, finishedAt: Date.now() }));
    return { ok: true };
  }, []);

  return { stats, results, running, current, start, cancel, reset };
}
