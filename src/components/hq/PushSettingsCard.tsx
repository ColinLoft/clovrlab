import { useEffect, useState } from "react";
import { BellRing, Smartphone } from "lucide-react";
import { Card, Btn, Pill } from "@/components/hq/work/kit";
import {
  disablePush, enablePush, initPush, isIOS, isStandalone, pushStatus, pushSupported, setPushQueues,
} from "@/lib/hq/push";
import { QUEUE_LABEL, type PageQueue } from "@/lib/hq/paging";

/** Device-level push opt-in for the on-call operator sitting at this browser. */
export function PushSettingsCard({ queue }: { queue: PageQueue }) {
  const [state, setState] = useState({ subscribed: false, permission: false, id: null as string | null });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = () => setState(pushStatus());

  useEffect(() => {
    let alive = true;
    initPush().then(() => { if (alive) refresh(); });
    return () => { alive = false; };
  }, []);

  const turnOn = async () => {
    setBusy(true); setMsg(null);
    const res = await enablePush();
    if (res.ok) { await setPushQueues([queue]); setMsg("Push notifications are on for this device."); }
    else setMsg(res.reason ?? "Could not enable push.");
    refresh(); setBusy(false);
  };

  const turnOff = async () => {
    setBusy(true);
    await disablePush();
    setMsg("Push notifications are off for this device.");
    refresh(); setBusy(false);
  };

  const iosNeedsInstall = isIOS() && !isStandalone();

  return (
    <Card
      title="Push notifications on this device"
      hint={`Wakes you for ${QUEUE_LABEL[queue]} pages`}
      action={<Pill tone={state.subscribed ? "good" : "warn"}>{state.subscribed ? "Subscribed" : "Not subscribed"}</Pill>}
    >
      <p className="text-xs leading-5 text-muted-foreground">
        Pages are pushed to every device you enable here, even when the tab is closed. Keep it on for any phone or
        laptop you sleep next to while on call.
      </p>

      {iosNeedsInstall && (
        <p className="mt-3 flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <Smartphone className="mt-0.5 h-3.5 w-3.5 flex-none" />
          On iPhone or iPad, tap <strong className="mx-1">Share → Add to Home Screen</strong> first, then open the
          installed app and turn push on from here.
        </p>
      )}

      {!pushSupported() && (
        <p className="mt-3 text-xs text-muted-foreground">This browser can’t receive push notifications.</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {state.subscribed ? (
          <Btn disabled={busy} onClick={turnOff}>Turn off on this device</Btn>
        ) : (
          <Btn variant="primary" disabled={busy || !pushSupported()} onClick={turnOn}>
            <BellRing className="h-3.5 w-3.5" /> {busy ? "Enabling…" : "Enable push"}
          </Btn>
        )}
        {msg && <span className="text-xs text-muted-foreground">{msg}</span>}
      </div>
    </Card>
  );
}
