import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const emailSchema = z.object({ email: z.string().email() });
const credsSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

/**
 * Step 1 of sign-in: decide where an email should go.
 *  - "password": an account exists, ask for the password
 *  - "onboard":  they were added to the directory / invited but have no account yet
 *  - "unknown":  not in the system
 */
export const startSignIn = createServerFn({ method: "POST" })
  .inputValidator((data) => emailSchema.parse(data))
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name")
      .ilike("email", email)
      .maybeSingle();

    if (profile) return { status: "password" as const, name: (profile as any).full_name ?? null };

    const { data: invite } = await supabaseAdmin
      .from("invites")
      .select("id, full_name, accepted_at, expires_at")
      .ilike("email", email)
      .is("accepted_at", null)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (invite) return { status: "onboard" as const, name: (invite as any).full_name ?? null };

    const { data: employee } = await supabaseAdmin
      .from("hr_employees")
      .select("id, full_name")
      .ilike("email", email)
      .maybeSingle();

    if (employee) return { status: "onboard" as const, name: (employee as any).full_name ?? null };

    return { status: "unknown" as const, name: null };
  });

/**
 * Step 2: check the password server-side WITHOUT handing the browser a session.
 * The browser only gets a session after the emailed 6-digit code is verified.
 */
export const verifyPassword = createServerFn({ method: "POST" })
  .inputValidator((data) => credsSchema.parse(data))
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const client = createClient(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );
    const { error } = await client.auth.signInWithPassword({
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });
    if (error) return { ok: false as const, message: "That email and password don't match." };
    await client.auth.signOut();
    return { ok: true as const };
  });

/**
 * Onboarding gate: is this email allowed to create an account?
 * Runs server-side so the browser can't use it to probe who works here.
 */
export const checkOnboardingEmail = createServerFn({ method: "POST" })
  .inputValidator((data) => emailSchema.parse(data))
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: ok } = await supabaseAdmin.rpc("onboarding_invite_check", { _email: email });
    return { ok: !!(ok as any)?.ok };
  });
