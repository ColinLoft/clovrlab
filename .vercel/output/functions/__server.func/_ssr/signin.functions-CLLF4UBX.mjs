import { r as createServerFn } from "./server-BrzklweG.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DX9VUQiX.mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signin.functions-CLLF4UBX.js
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
var startSignIn = createServerFn({ method: "POST" }).inputValidator((data) => emailSchema.parse(data)).handler(createSsrRpc("b18756008daaa7e52dd6f3e25204ee699cce4e83eac185921623528127d8e28f"));
createServerFn({ method: "POST" }).inputValidator((data) => credsSchema.parse(data)).handler(createSsrRpc("0192c518be761803da5e7387affc5681c3715589a8ef4158fea27e0dddb704e5"));
/**
* Onboarding gate: is this email allowed to create an account?
* Runs server-side so the browser can't use it to probe who works here.
*/
var checkOnboardingEmail = createServerFn({ method: "POST" }).inputValidator((data) => emailSchema.parse(data)).handler(createSsrRpc("83a2e82e135743960bc36a77f77855d1d7d132c7accc3bda239a653018bdde2d"));
//#endregion
export { startSignIn as n, checkOnboardingEmail as t };
