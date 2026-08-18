import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { startSignIn, verifyPassword } from "@/lib/hq/signin.functions";
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

type Step = "email" | "password" | "code";

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
      const res = await verifyPassword({ data: { email: email.trim().toLowerCase(), password } });
      if (!res.ok) {
        setError(res.message);
        return;
      }
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { shouldCreateUser: false },
      });
      if (otpErr) throw otpErr;
      setNotice(`We sent a 6-digit code to ${email.trim().toLowerCase()}.`);
      setStep("code");
    } catch (err: any) {
      setError(err?.message ?? "Could not send your verification code.");
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
              {step === "email" ? "Welcome back" : step === "password" ? "One more step" : "Verify it's you"}
            </p>
            <h1 className="mt-3 text-[2rem] font-semibold leading-[1.1] tracking-tight">
              {step === "email"
                ? "Sign in to the mission."
                : step === "code"
                  ? "Enter your 6-digit code."
                  : greetName
                    ? `Hi ${greetName.split(" ")[0]}, enter your password.`
                    : "Enter your password."}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {step === "email"
                ? "Every detection, flight and decision runs through this workspace — and through the people signing into it. Yours matters."
                : step === "password"
                  ? "Passwords alone don't get you in. We'll email a code right after."
                  : "The code expires in a few minutes. Didn't arrive? Check spam, then resend."}
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
              <Submit busy={busy} label="Send my code" />
              <button
                type="button"
                onClick={() => { setStep("email"); setError(null); }}
                className="flex w-full items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
            </form>
          )}

          {step === "code" && (
            <CodeStep
              email={email.trim().toLowerCase()}
              error={error}
              notice={notice}
              setError={setError}
              setNotice={setNotice}
              onVerified={() => navigate({ to: "/workspaces" })}
              onBack={() => { setStep("password"); setError(null); setNotice(null); }}
            />
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
              Two-step verification is required on every sign-in.
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

function CodeStep({
  email, error, notice, setError, setNotice, onVerified, onBack,
}: {
  email: string;
  error: string | null;
  notice: string | null;
  setError: (v: string | null) => void;
  setNotice: (v: string | null) => void;
  onVerified: () => void;
  onBack: () => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [busy, setBusy] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const code = digits.join("");

  const setAt = (i: number, v: string) => {
    const clean = v.replace(/\D/g, "");
    if (!clean) { setDigits((d) => d.map((x, k) => (k === i ? "" : x))); return; }
    setDigits((d) => {
      const next = [...d];
      clean.split("").forEach((c, k) => { if (i + k < 6) next[i + k] = c; });
      return next;
    });
    refs.current[Math.min(i + clean.length, 5)]?.focus();
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) { setError("Enter all six digits."); return; }
    setError(null);
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
      if (err) throw err;
      onVerified();
    } catch (err: any) {
      setError(err?.message?.includes("expired") ? "That code expired. Send a new one." : (err?.message ?? "Invalid code."));
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    setBusy(false);
    if (err) setError(err.message); else setNotice("New code sent.");
  };

  return (
    <form onSubmit={verify} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Code sent to <span className="font-medium text-foreground">{email}</span>
      </p>
      <div className="flex gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            aria-label={`Digit ${i + 1}`}
            inputMode="numeric"
            autoFocus={i === 0}
            value={d}
            onChange={(e) => setAt(i, e.target.value)}
            onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus(); }}
            className="h-14 w-full rounded-xl border border-border bg-background text-center text-xl font-semibold outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
          />
        ))}
      </div>
      <Feedback error={error} notice={notice} />
      <Submit busy={busy} label="Verify and continue" />
      <div className="flex items-center justify-between text-xs">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <button type="button" onClick={resend} className="text-primary hover:underline">
          Resend code
        </button>
      </div>
    </form>
  );
}
