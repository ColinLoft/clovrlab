import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/slack/api";

async function assertAdmin(context: any) {
  const { data: roles, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  if (error) throw new Error(error.message);
  const ok = (roles ?? []).some((r: any) => r.role === "admin" || r.role === "super_admin");
  if (!ok) throw new Error("Only administrators can manage Slack");
}

function creds() {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const slackKey = process.env["SLACK_API_KEY"];
  return { lovableKey, slackKey, configured: Boolean(lovableKey && slackKey) };
}

async function slack(method: string, body?: Record<string, unknown>) {
  const { lovableKey, slackKey, configured } = creds();
  if (!configured) throw new Error("Slack is not connected for this project yet.");
  const res = await fetch(`${GATEWAY_URL}/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": slackKey!,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Slack request failed [${res.status}]: ${text.slice(0, 400)}`);
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Slack returned a non-JSON response: ${text.slice(0, 200)}`);
  }
  if (!json.ok) throw new Error(`Slack error: ${json.error ?? "unknown_error"}`);
  return json;
}

/** Bot identity + channel/member inventory for the Enterprise Systems console. */
export const slackOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    if (!creds().configured) {
      return { configured: false as const, bot: null, channels: [], members: [] };
    }
    const auth = await slack("auth.test");
    const chans = await slack("conversations.list", {
      limit: 200,
      exclude_archived: true,
      types: "public_channel,private_channel",
    });
    const users = await slack("users.list", { limit: 200 });
    return {
      configured: true as const,
      bot: { user: auth.user, userId: auth.user_id, team: auth.team, teamId: auth.team_id, url: auth.url },
      channels: (chans.channels ?? []).map((c: any) => ({
        id: c.id,
        name: c.name,
        isPrivate: Boolean(c.is_private),
        members: c.num_members ?? 0,
        topic: c.topic?.value ?? "",
        botIsMember: Boolean(c.is_member),
      })),
      members: (users.members ?? [])
        .filter((m: any) => !m.deleted && !m.is_bot && m.id !== "USLACKBOT")
        .map((m: any) => ({
          id: m.id,
          name: m.profile?.display_name || m.real_name || m.name,
          email: m.profile?.email ?? null,
        })),
    };
  });

export const slackCreateChannel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        name: z.string().min(1).max(80),
        isPrivate: z.boolean().default(false),
        purpose: z.string().max(250).optional(),
        invite: z.array(z.string().min(1)).max(200).default([]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const name = data.name
      .trim()
      .toLowerCase()
      .replace(/^#/, "")
      .replace(/[^a-z0-9-_]/g, "-")
      .slice(0, 80);
    const created = await slack("conversations.create", { name, is_private: data.isPrivate });
    const channel = created.channel;
    if (data.purpose) {
      await slack("conversations.setPurpose", { channel: channel.id, purpose: data.purpose });
    }
    if (data.invite.length) {
      await slack("conversations.invite", { channel: channel.id, users: data.invite.join(",") });
    }
    return { id: channel.id as string, name: channel.name as string };
  });

export const slackInviteMembers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ channel: z.string().min(1), users: z.array(z.string().min(1)).min(1).max(200) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    await slack("conversations.invite", { channel: data.channel, users: data.users.join(",") });
    return { ok: true as const, invited: data.users.length };
  });

/** Recent messages posted by the bot in a channel — used for bot activity monitoring. */
export const slackBotActivity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ channel: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const auth = await slack("auth.test");
    const history = await slack("conversations.history", { channel: data.channel, limit: 50 });
    const msgs = (history.messages ?? []).map((m: any) => ({
      ts: m.ts as string,
      text: (m.text ?? "") as string,
      byBot: Boolean(m.bot_id) || m.user === auth.user_id,
      user: (m.user ?? m.bot_id ?? "unknown") as string,
    }));
    return {
      total: msgs.length,
      botMessages: msgs.filter((m: any) => m.byBot).length,
      messages: msgs.slice(0, 25),
    };
  });

export const slackPostMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ channel: z.string().min(1), text: z.string().min(1).max(3000) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    await slack("chat.postMessage", { channel: data.channel, text: data.text });
    return { ok: true as const };
  });
