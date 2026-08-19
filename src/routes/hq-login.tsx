import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { startSignIn } from "@/lib/hq/signin.functions";
import teamPhoto from "@/assets/hq-team.jpg";
import { ArrowLeft, ArrowRight, Loader2, Mail, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/hq-login")({
  ssr: false,
  component: HQLogin,
  head: () => ({
    meta: [
      { title: "Clovr HQ — Sign in" },
      { name: "description", content: "Sign in to Clovr HQ, the internal operations workspace for the Clovr Labs team." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type Step = "email" | "password";

const field =
  "mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10";

function HQLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [greetName, setGreetName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) navigate({ to: "/workspaces" });
    })();
  }, [navigate]);

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await startSignIn({ data: { email: email.trim().toLowerCase() } });
      setGreetName(res.name);
      setStep("password");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (signInError) throw signInError;
      await navigate({ to: "/workspaces" });
    } catch (err: any) {
      setError(err?.message?.includes("Invalid login credentials")
        ? "That email and password don't match."
        : (err?.message ?? "Could not sign you in."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-dvh grid-cols-1 bg-background text-foreground lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
      <div className="flex flex-col px-6 py-10 sm:px-12 lg:px-20">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-[13px] font-bold text-primary-foreground">
            CL
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">Clovr HQ</p>
            <p className="text-[11px] text-muted-foreground">Internal operations</p>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <div className="mb-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              {step === "email" ? "Welcome back" : "Secure sign in"}
            </p>
            <h1 className="mt-3 text-[2rem] font-semibold leading-[1.1] tracking-tight">
              {step === "email"
                ? "Sign in to the mission."
                : greetName
                    ? `Hi ${greetName.split(" ")[0]}, enter your password.`
                    : "Enter your password."}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {step === "email"
                ? "Every detection, flight and decision runs through this workspace — and through the people signing into it. Yours matters."
                : "Use your Clovr HQ credentials to continue to your workspaces."}
            </p>
          </div>

          {step === "email" && (
            <form onSubmit={submitEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Work email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    aria-label="Work email"
                    type="email"
                    required
                    autoFocus
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@clovrlab.com"
                    className={`${field} pl-10`}
                  />
                </div>
              </div>
              <Feedback error={error} notice={notice} />
              <Submit busy={busy} label="Continue" />
              <p className="text-center text-xs text-muted-foreground">
                New here?{" "}
                <a href="/welcome" className="font-medium text-primary hover:underline">
                  Start onboarding
                </a>
              </p>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={submitPassword} className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-sm">
                <span className="text-muted-foreground">Signing in as </span>
                <span className="font-medium">{email}</span>
                <button
                  type="button"
                  onClick={() => { setStep("email"); setError(null); setPassword(""); }}
                  className="ml-2 text-xs text-primary hover:underline"
                >
                  Change
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</label>
                <input
                  aria-label="Password"
                  type="password"
                  required
                  autoFocus
                  minLength={8}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={field}
                />
              </div>
              <Feedback error={error} notice={notice} />
              <Submit busy={busy} label="Sign in" />
              <button
                type="button"
                onClick={() => { setStep("email"); setError(null); }}
                className="flex w-full items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
            </form>
          )}

        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Private company system. Access is logged and restricted to Clovr Labs staff.
        </p>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={teamPhoto}
          alt="The Clovr Labs team in the workshop with a prototype aircraft"
          width={1280}
          height={1600}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10">
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Why you're here</p>
            <p className="mt-3 text-lg font-semibold leading-snug">
              A small team is why a fire gets seen in minutes instead of hours.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Sensors, aircraft and the people watching them only work together because someone here keeps them
              moving. That's the job you're signing into.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Access is protected by your individual Clovr HQ credentials.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feedback({ error, notice }: { error: string | null; notice: string | null }) {
  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
        {error}
      </div>
    );
  }
  if (notice) {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-2.5 text-sm text-foreground">
        {notice}
      </div>
    );
  }
  return null;
}

function Submit({ busy, label }: { busy: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {busy ? "Please wait…" : label}
      {!busy && <ArrowRight className="h-4 w-4" />}
    </button>
  );
}

