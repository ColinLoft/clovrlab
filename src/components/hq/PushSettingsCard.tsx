import { useEffect, useState } from "react";
import { BellRing, Copy, ExternalLink, RefreshCw, Smartphone } from "lucide-react";
import { Card, Btn, Pill } from "@/components/hq/work/kit";
import {
  clearMyTopic, ensureMyTopic, getMyTopic, isIOS, rotateMyTopic, sendTestPush, topicUrl,
} from "@/lib/hq/push";
import { QUEUE_LABEL, type PageQueue } from "@/lib/hq/paging";

/** Device-level push opt-in (ntfy.sh) for the on-call operator. */
export function PushSettingsCard({ queue }: { queue: PageQueue }) {
  const [topic, setTopic] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getMyTopic().then((t) => { if (alive) setTopic(t); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const wrap = async (fn: () => Promise<void>) => {
    setBusy(true); setMsg(null);
    try { await fn(); } catch (e) { setMsg((e as Error).message); } finally { setBusy(false); }
  };

  const turnOn = () => wrap(async () => {
    const t = await ensureMyTopic();
    setTopic(t);
    setMsg("Subscribe to this topic in the ntfy app to get paged on this device.");
  });

  const rotate = () => wrap(async () => {
    const t = await rotateMyTopic();
    setTopic(t);
    setMsg("New topic issued — re-subscribe on every device.");
  });

  const turnOff = () => wrap(async () => {
    await clearMyTopic();
    setTopic(null);
    setMsg("Push paging is off. You’ll still get pages by email and in the app.");
  });

  const test = () => wrap(async () => {
    if (!topic) return;
    await sendTestPush(topic);
    setMsg("Test page sent — check your phone.");
  });

  const copy = () => {
    if (!topic) return;
    navigator.clipboard?.writeText(topic).then(() => setMsg("Topic copied."), () => {});
  };

  return (
    <Card
      title="Push notifications (ntfy)"
      hint={`Wakes you for ${QUEUE_LABEL[queue]} pages`}
      action={<Pill tone={topic ? "good" : "warn"}>{topic ? "Topic active" : "Not set up"}</Pill>}
    >
      <p className="text-xs leading-5 text-muted-foreground">
        Pages are published to your own private ntfy topic. Install the free{" "}
        <strong>ntfy</strong> app, subscribe to the topic below, and every page reaches you even when the tab is
        closed. Set the ntfy notification priority to max so urgent pages break through Do Not Disturb.
      </p>

      {topic ? (
        <>
          <div className="mt-3 rounded-md border border-border bg-muted/40 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Your topic</p>
            <p className="mt-1 break-all font-mono text-xs">{topic}</p>
            <p className="mt-1 break-all text-[11px] text-muted-foreground">{topicUrl(topic)}</p>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Btn onClick={copy}><Copy className="h-3.5 w-3.5" /> Copy topic</Btn>
            <a href={topicUrl(topic)} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">
              <ExternalLink className="h-3.5 w-3.5" /> Open in ntfy web
            </a>
            <Btn disabled={busy} onClick={test}><BellRing className="h-3.5 w-3.5" /> Send test page</Btn>
            <Btn disabled={busy} onClick={rotate}><RefreshCw className="h-3.5 w-3.5" /> New topic</Btn>
            <Btn disabled={busy} onClick={turnOff}>Turn off</Btn>
          </div>
        </>
      ) : (
        <div className="mt-3">
          <Btn variant="primary" disabled={busy} onClick={turnOn}>
            <BellRing className="h-3.5 w-3.5" /> {busy ? "Setting up…" : "Set up push paging"}
          </Btn>
        </div>
      )}

      <p className="mt-3 flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <Smartphone className="mt-0.5 h-3.5 w-3.5 flex-none" />
        {isIOS()
          ? "On iPhone: install ntfy from the App Store, tap +, and enter the topic above."
          : "On Android: install ntfy from Google Play or F-Droid, tap +, and enter the topic above."}
      </p>

      {msg && <p className="mt-2 text-xs text-muted-foreground">{msg}</p>}
    </Card>
  );
}
