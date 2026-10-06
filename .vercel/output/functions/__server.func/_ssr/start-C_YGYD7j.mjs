import { r as supabase } from "./client-PsXr_elE.mjs";
import { n as createMiddleware } from "./server-D_zSarl9.mjs";
import { t as renderErrorPage } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/start-C_YGYD7j.js
function dedupeSerializationAdapters(deduped, serializationAdapters) {
	for (let i = 0, len = serializationAdapters.length; i < len; i++) {
		const current = serializationAdapters[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
		}
	}
}
var createStart = (getOptions) => {
	return {
		getOptions: async () => {
			const options = await getOptions();
			if (options.serializationAdapters) {
				const deduped = /* @__PURE__ */ new Set();
				dedupeSerializationAdapters(deduped, options.serializationAdapters);
				options.serializationAdapters = Array.from(deduped);
			}
			return options;
		},
		createMiddleware
	};
};
var attachSupabaseAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { data } = await supabase.auth.getSession();
	const token = data.session?.access_token;
	return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
});
var errorMiddleware = createMiddleware().server(async ({ request, next }) => {
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		console.error(error);
		try {
			const { supabaseAdmin } = await import("./client.server-pv5dszoL.mjs");
			const url = new URL(request.url);
			await supabaseAdmin.from("sys_error_log").insert({
				service: "web",
				path: url.pathname,
				method: request.method,
				status: 500,
				message: error?.message ? String(error.message).slice(0, 500) : String(error).slice(0, 500),
				stack: error?.stack ? String(error.stack).slice(0, 4e3) : null
			});
		} catch (logError) {
			console.error("Failed to record error", logError);
		}
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
var startInstance = createStart(() => ({
	functionMiddleware: [attachSupabaseAuth],
	requestMiddleware: [errorMiddleware]
}));
//#endregion
export { startInstance };
