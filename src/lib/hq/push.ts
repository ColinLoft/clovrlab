import OneSignal from "react-onesignal";
import { supabase } from "@/integrations/supabase/client";

/**
 * OneSignal push notifications (web + iOS/Android home-screen PWA).
 *
 * The signed-in HQ user id is used as the OneSignal external id, so the
 * paging backend can push to a specific on-call operator by user id.
 */
export const ONESIGNAL_APP_ID = "496b911f-703d-49f4-a680-ad8bc42ed89e";

let initPromise: Promise<boolean> | null = null;
let initialized = false;

export function pushReady() {
  return initialized;
}

export function pushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/** True once iOS users have installed the app to the home screen. */
export function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

export function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1);
}

/** Initialise the SDK once per page load and bind the current user. */
export async function initPush(): Promise<boolean> {
  if (typeof window === "undefined" || !pushSupported()) return false;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await OneSignal.init({
        appId: ONESIGNAL_APP_ID,
        allowLocalhostAsSecureOrigin: true,
        // We drive the permission request ourselves from the alert settings UI.
        autoResume: true,
        notifyButton: { enable: false } as any,
      });
      initialized = true;

      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id;
      if (uid) {
        try { await OneSignal.login(uid); } catch {}
        if (data.user?.email) {
          try { OneSignal.User.addAlias("email_addr", data.user.email); } catch {}
        }
      }
      return true;
    } catch {
      initialized = false;
      return false;
    }
  })();

  return initPromise;
}

/** Ask the browser for notification permission and opt the device in. */
export async function enablePush(): Promise<{ ok: boolean; reason?: string }> {
  if (!pushSupported()) return { ok: false, reason: "This browser can't receive push notifications." };
  if (isIOS() && !isStandalone()) {
    return {
      ok: false,
      reason: "On iPhone, open Share → Add to Home Screen, then turn push on from the installed app.",
    };
  }
  const ready = await initPush();
  if (!ready) return { ok: false, reason: "Push service failed to load." };

  try {
    await OneSignal.Notifications.requestPermission();
  } catch {
    /* user dismissed */
  }
  if (!OneSignal.Notifications.permission) {
    return { ok: false, reason: "Notification permission was not granted." };
  }
  try { await OneSignal.User.PushSubscription.optIn(); } catch {}
  return { ok: true };
}

export async function disablePush() {
  if (!initialized) return;
  try { await OneSignal.User.PushSubscription.optOut(); } catch {}
}

/** Tag the device with which paging queues it should receive. */
export async function setPushQueues(queues: string[]) {
  if (!initialized) return;
  try {
    OneSignal.User.addTags({
      queue_ops: queues.includes("ops") ? "1" : "0",
      queue_systems: queues.includes("systems") ? "1" : "0",
    });
  } catch {}
}

export function pushStatus() {
  if (!initialized) return { subscribed: false, permission: false, id: null as string | null };
  return {
    subscribed: !!OneSignal.User?.PushSubscription?.optedIn,
    permission: !!OneSignal.Notifications?.permission,
    id: OneSignal.User?.PushSubscription?.id ?? null,
  };
}

export async function logoutPush() {
  if (!initialized) return;
  try { await OneSignal.logout(); } catch {}
}
