import { r as createServerFn } from "./server-DjCj4rPg.mjs";
import { t as createServerRpc } from "./createServerRpc-nqu-4SJ1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firms.functions-o9jlNjxO.js
var cache = null;
var TTL_MS = 9e5;
var BBOX = "-125,24,-66,50";
var SOURCES = ["VIIRS_NOAA20_NRT", "VIIRS_SNPP_NRT"];
var DAYS = 2;
var getFirmsHotspots_createServerFn_handler = createServerRpc({
	id: "f3b1585e99b9b54bc187d006b484e9f0ea8c31c510669e6fedf54fd2212ee1c8",
	name: "getFirmsHotspots",
	filename: "src/lib/net/firms.functions.ts"
}, (opts) => getFirmsHotspots.__executeServer(opts));
var getFirmsHotspots = createServerFn({ method: "GET" }).handler(getFirmsHotspots_createServerFn_handler, async () => {
	const now = Date.now();
	if (cache && now - cache.at < TTL_MS) return {
		hotspots: cache.data,
		cached: true
	};
	const key = process.env.FIRMS_MAP_KEY;
	if (!key) return {
		hotspots: [],
		error: "FIRMS_MAP_KEY missing"
	};
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	const errors = [];
	try {
		for (const src of SOURCES) {
			const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${key}/${src}/${BBOX}/${DAYS}`;
			const res = await fetch(url);
			if (!res.ok) {
				errors.push(`${src} ${res.status}`);
				continue;
			}
			const lines = (await res.text()).trim().split(/\r?\n/);
			if (lines.length < 2) continue;
			const header = lines[0].split(",");
			const idx = (n) => header.indexOf(n);
			const iLat = idx("latitude"), iLng = idx("longitude"), iBri = idx("bright_ti4"), iFrp = idx("frp"), iConf = idx("confidence"), iDate = idx("acq_date"), iTime = idx("acq_time"), iSat = idx("satellite"), iDN = idx("daynight");
			for (let i = 1; i < lines.length; i++) {
				const c = lines[i].split(",");
				const lat = Number(c[iLat]);
				const lng = Number(c[iLng]);
				if (!isFinite(lat) || !isFinite(lng)) continue;
				const t = (c[iTime] ?? "0000").padStart(4, "0");
				const dt = `${c[iDate]}T${t.slice(0, 2)}:${t.slice(2)}:00Z`;
				const dedupKey = `${lat.toFixed(3)}|${lng.toFixed(3)}|${c[iDate]}|${t.slice(0, 2)}`;
				if (seen.has(dedupKey)) continue;
				seen.add(dedupKey);
				out.push({
					lat,
					lng,
					bright_ti4: Number(c[iBri]) || 0,
					frp: Number(c[iFrp]) || 0,
					confidence: (c[iConf] ?? "").trim(),
					acq_datetime: dt,
					satellite: c[iSat] ?? "",
					daynight: c[iDN] ?? ""
				});
			}
		}
		cache = {
			at: now,
			data: out
		};
		return {
			hotspots: out,
			cached: false,
			error: errors.length ? errors.join("; ") : void 0
		};
	} catch (e) {
		return {
			hotspots: cache?.data ?? [],
			error: e.message
		};
	}
});
//#endregion
export { getFirmsHotspots_createServerFn_handler };
