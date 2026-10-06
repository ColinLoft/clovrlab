import { r as createServerFn } from "./server-D_zSarl9.mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-DZoXAkE6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signin.functions-BeBfBn8j.js
var emailSchema = objectType({ email: stringType().email() });
var credsSchema = objectType({
	email: stringType().email(),
	password: stringType().min(1)
});
/**
* Step 1 of sign-in: decide where an email should go.
*  - "password": an account exists, ask for the password
*  - "onboard":  they were added to the directory / invited but have no account yet
*  - "unknown":  not in the system
*/
var startSignIn_createServerFn_handler = createServerRpc({
	id: "b18756008daaa7e52dd6f3e25204ee699cce4e83eac185921623528127d8e28f",
	name: "startSignIn",
	filename: "src/lib/hq/signin.functions.ts"
}, (opts) => startSignIn.__executeServer(opts));
var startSignIn = createServerFn({ method: "POST" }).inputValidator((data) => emailSchema.parse(data)).handler(startSignIn_createServerFn_handler, async ({ data }) => {
	data.email;
	return {
		status: "password",
		name: null
	};
});
var verifyPassword_createServerFn_handler = createServerRpc({
	id: "0192c518be761803da5e7387affc5681c3715589a8ef4158fea27e0dddb704e5",
	name: "verifyPassword",
	filename: "src/lib/hq/signin.functions.ts"
}, (opts) => verifyPassword.__executeServer(opts));
var verifyPassword = createServerFn({ method: "POST" }).inputValidator((data) => credsSchema.parse(data)).handler(verifyPassword_createServerFn_handler, async ({ data }) => {
	const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
	const client = createClient(process.env["SUPABASE_URL"], process.env["SUPABASE_PUBLISHABLE_KEY"], { auth: {
		storage: void 0,
		persistSession: false,
		autoRefreshToken: false
	} });
	const { error } = await client.auth.signInWithPassword({
		email: data.email.trim().toLowerCase(),
		password: data.password
	});
	if (error) return {
		ok: false,
		message: "That email and password don't match."
	};
	await client.auth.signOut();
	return { ok: true };
});
var checkOnboardingEmail_createServerFn_handler = createServerRpc({
	id: "83a2e82e135743960bc36a77f77855d1d7d132c7accc3bda239a653018bdde2d",
	name: "checkOnboardingEmail",
	filename: "src/lib/hq/signin.functions.ts"
}, (opts) => checkOnboardingEmail.__executeServer(opts));
var checkOnboardingEmail = createServerFn({ method: "POST" }).inputValidator((data) => emailSchema.parse(data)).handler(checkOnboardingEmail_createServerFn_handler, async ({ data }) => {
	const email = data.email.trim().toLowerCase();
	const { supabaseAdmin } = await import("./client.server-pv5dszoL.mjs");
	const { data: ok } = await supabaseAdmin.rpc("onboarding_invite_check", { _email: email });
	return { ok: !!ok?.ok };
});
//#endregion
export { checkOnboardingEmail_createServerFn_handler, startSignIn_createServerFn_handler, verifyPassword_createServerFn_handler };
