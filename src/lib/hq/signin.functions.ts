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
    // Deliberately uniform: the response must never reveal whether this address
    // belongs to an employee, a pending invite, or nobody at all (account
    // enumeration). Everyone is sent to the password step; new hires use the
    // separate "New hire?" onboarding link.
    void data.email;
    return { status: "password" as const, name: null as string | null };
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
