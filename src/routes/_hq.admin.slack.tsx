import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Bot, Hash, Loader2, Lock, Plus, RefreshCw, Send, UserPlus } from "lucide-react";
import { useRouteAccess } from "@/lib/hq/route-access";
import {
  slackBotActivity,
  slackCreateChannel,
  slackInviteMembers,
  slackOverview,
  slackPostMessage,
} from "@/lib/hq/slack-admin.functions";

export const Route = createFileRoute("/_hq/admin/slack")({
  head: () => ({
    meta: [
      { title: "Slack administration — Clovr HQ" },
      { name: "description", content: "Create Slack channels, invite members, and monitor bot activity from the Enterprise Systems console." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SlackAdmin,
});

type Channel = { id: string; name: string; isPrivate: boolean; members: number; topic: string; botIsMember: boolean };
type Member = { id: string; name: string; email: string | null };

function SlackAdmin() {
  const access = useRouteAccess();
  const load = useServerFn(slackOverview);
  const createChannel = useServerFn(slackCreateChannel);
  const invite = useServerFn(slackInviteMembers);
  const activity = useServerFn(slackBotActivity);
  const post = useServerFn(slackPostMessage);

  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [bot, setBot] = useState<any>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const [active, setActive] = useState<Channel | null>(null);
  const [feed, setFeed] = useState<any>(null);
  const [message, setMessage] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await load({ data: undefined as never });
      setConfigured(res.configured);
      setBot(res.bot);
      setChannels(res.channels ?? []);
      setMembers(res.members ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Could not reach Slack.");
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    if (access.isAdmin) void refresh();
  }, [access.isAdmin, refresh]);

  const openChannel = async (channel: Channel) => {
    setActive(channel);
    setFeed(null);
    try {
      setFeed(await activity({ data: { channel: channel.id } }));
    } catch (err: any) {
      setError(err?.message ?? "Could not load channel activity.");
    }
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const res: any = await createChannel({ data: { name, isPrivate, purpose: purpose || undefined, invite: selected } });
      setNotice(`Created #${res.name}${selected.length ? ` and invited ${selected.length} member(s)` : ""}.`);
      setName("");
      setPurpose("");
      setSelected([]);
      await refresh();
    } catch (err: any) {
      setError(err?.message ?? "Could not create the channel.");
    } finally {
      setBusy(false);
    }
  };

  const inviteToActive = async () => {
    if (!active || selected.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      await invite({ data: { channel: active.id, users: selected } });
      setNotice(`Invited ${selected.length} member(s) to #${active.name}.`);
      setSelected([]);
      await refresh();
    } catch (err: any) {
      setError(err?.message ?? "Could not invite members.");
    } finally {
      setBusy(false);
    }
  };

  const sendTest = async () => {
    if (!active || !message.trim()) return;
    setBusy(true);
    try {
      await post({ data: { channel: active.id, text: message.trim() } });
      setMessage("");
      setNotice(`Bot posted to #${active.name}.`);
      await openChannel(active);
    } catch (err: any) {
      setError(err?.message ?? "Could not post the message.");
    } finally {
      setBusy(false);
    }
  };

  if (access.loading) return <div className="p-8 text-sm text-muted-foreground">Checking systems access…</div>;
  if (!access.isAdmin) return <div className="p-8 text-sm text-muted-foreground">Slack administration is restricted to administrators.</div>;

  return (
    <main className="mx-auto max-w-7xl px-6 py-7">
      <Link to="/admin/it" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Enterprise Systems
      </Link>
      <header className="mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs font-semibold uppercase text-primary">Slack administration</p>
          <h1 className="mt-2 text-3xl font-semibold">Workspace bot control</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Create channels, invite teammates, and watch what the Clovr bot is posting — all through the workspace bot connection.
          </p>
        </div>
        <button onClick={() => void refresh()} className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs font-medium hover:border-primary/50">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </header>

      {error && <p className="mt-4 border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
      {notice && <p className="mt-4 border border-primary/40 bg-primary/10 px-4 py-3 text-sm">{notice}</p>}

      {!loading && !configured && (
        <section className="mt-6 border border-border bg-card p-6">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="mt-4 text-sm font-semibold">Slack bot not connected</h2>
          <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
            This console is wired and ready. Approve the Slack connection request in chat so the workspace bot token is available to the
            server, then refresh this page — channels, members and bot activity appear automatically.
          </p>
        </section>
      )}

      {configured && (
        <>
          <section className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="border border-border bg-card p-5">
              <Bot className="h-5 w-5 text-primary" />
              <h2 className="mt-5 text-sm font-semibold">{bot?.user ?? "Bot"}</h2>
              <p className="mt-1 text-xs text-muted-foreground">Workspace: {bot?.team ?? "—"}</p>
            </div>
            <div className="border border-border bg-card p-5">
              <Hash className="h-5 w-5 text-primary" />
              <p className="mt-5 text-2xl font-semibold">{channels.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">Channels visible to the bot</p>
            </div>
            <div className="border border-border bg-card p-5">
              <UserPlus className="h-5 w-5 text-primary" />
              <p className="mt-5 text-2xl font-semibold">{members.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">Workspace members</p>
            </div>
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-[380px_1fr]">
            <div className="space-y-5">
              <form onSubmit={submitCreate} className="border border-border bg-card p-5">
                <h2 className="text-sm font-semibold">Create a channel</h2>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="incident-response"
                  className="mt-4 w-full border border-border bg-background px-3 py-2 text-sm"
                />
                <input
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Purpose (optional)"
                  className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm"
                />
                <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} /> Private channel
                </label>
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create channel
                </button>
              </form>

              <div className="border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <h2 className="text-sm font-semibold">Members {selected.length > 0 && <span className="text-primary">({selected.length} selected)</span>}</h2>
                  {active && selected.length > 0 && (
                    <button onClick={() => void inviteToActive()} disabled={busy} className="text-xs font-medium text-primary">
                      Invite to #{active.name}
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-border">
                  {members.map((m) => (
                    <label key={m.id} className="flex cursor-pointer items-center gap-3 px-5 py-2.5 text-sm hover:bg-muted/40">
                      <input
                        type="checkbox"
                        checked={selected.includes(m.id)}
                        onChange={(e) => setSelected((s) => (e.target.checked ? [...s, m.id] : s.filter((x) => x !== m.id)))}
                      />
                      <span className="min-w-0 flex-1 truncate">{m.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{m.email ?? ""}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <div className="border border-border bg-card">
                <div className="border-b border-border px-5 py-4"><h2 className="text-sm font-semibold">Channels</h2></div>
                <div className="max-h-[520px] overflow-y-auto divide-y divide-border">
                  {channels.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => void openChannel(c)}
                      className={`flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-muted/40 ${active?.id === c.id ? "bg-muted/60" : ""}`}
                    >
                      {c.isPrivate ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Hash className="h-4 w-4 text-muted-foreground" />}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{c.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">{c.members} members{c.topic ? ` · ${c.topic}` : ""}</span>
                      </span>
                      {!c.botIsMember && <span className="text-[10px] uppercase text-muted-foreground">bot out</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-border bg-card">
                <div className="border-b border-border px-5 py-4">
                  <h2 className="text-sm font-semibold">Bot activity{active ? ` · #${active.name}` : ""}</h2>
                </div>
                {!active && <p className="p-8 text-center text-sm text-muted-foreground">Select a channel to inspect bot activity.</p>}
                {active && !feed && <p className="p-8 text-center text-sm text-muted-foreground">Loading activity…</p>}
                {active && feed && (
                  <>
                    <div className="grid grid-cols-2 gap-px border-b border-border bg-border text-center">
                      <div className="bg-card py-3"><p className="text-xl font-semibold">{feed.botMessages}</p><p className="text-[11px] text-muted-foreground">Bot messages</p></div>
                      <div className="bg-card py-3"><p className="text-xl font-semibold">{feed.total}</p><p className="text-[11px] text-muted-foreground">Recent messages</p></div>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-border">
                      {feed.messages.map((m: any) => (
                        <div key={m.ts} className="px-5 py-3">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            {m.byBot ? "bot" : m.user} · {new Date(Number(m.ts) * 1000).toLocaleString()}
                          </p>
                          <p className="mt-1 line-clamp-3 text-sm">{m.text || "(no text)"}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 border-t border-border p-4">
                      <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Post as the bot…"
                        className="flex-1 border border-border bg-background px-3 py-2 text-sm"
                      />
                      <button onClick={() => void sendTest()} disabled={busy} className="inline-flex items-center gap-2 bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60">
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
