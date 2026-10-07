import { n as __exportAll } from "../_runtime.mjs";
import { n as createClient, t as __exportAll$1 } from "./dist-rSdW_MYk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-B7QlDyqv.js
var client_B7QlDyqv_exports = /* @__PURE__ */ __exportAll({
	n: () => supabase,
	t: () => client_exports
});
var client_exports = /* @__PURE__ */ __exportAll$1({ supabase: () => supabase });
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
function createSupabaseClient() {
	const SUPABASE_URL = "https://wurruktklcmvhiyeaduy.supabase.co";
	const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1cnJ1a3RrbGNtdmhpeWVhZHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MzgxODUsImV4cCI6MjEwNjMxNDE4NX0.DYOo5voE40rgMNsxLioY0dVZXTpHtpB8XIVlvy12Cps";
	return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		global: { fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY) },
		auth: {
			storage: typeof window !== "undefined" ? localStorage : void 0,
			persistSession: true,
			autoRefreshToken: true
		}
	});
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
//#endregion
export { supabase as n, client_B7QlDyqv_exports as t };
