// Lightweight Web Audio–synthesized sound effects. No asset files needed.
// Sounds are generated on demand and can be looped (ringback/incoming ring).

let ctx: AudioContext | null = null;
function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AC) ctx = new AC();
    } catch { return null; }
  }
  if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

type Loop = { stop: () => void };
const loops = new Map<string, Loop>();

function tone(freq: number, duration: number, opts: { type?: OscillatorType; gain?: number; delay?: number; attack?: number; release?: number } = {}) {
  const a = ac(); if (!a) return;
  const { type = "sine", gain = 0.15, delay = 0, attack = 0.01, release = 0.05 } = opts;
  const t0 = a.currentTime + delay;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + attack);
  g.gain.setValueAtTime(gain, t0 + duration - release);
  g.gain.linearRampToValueAtTime(0, t0 + duration);
  osc.connect(g).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

// ---------- Looping call sounds ----------

export function playRingback() {
  stopSound("ringback");
  const a = ac(); if (!a) return;
  // US-style ringback: 440+480 Hz, 2s on / 4s off
  let cancelled = false;
  const cycle = () => {
    if (cancelled) return;
    tone(440, 1.9, { gain: 0.08, attack: 0.05, release: 0.1 });
    tone(480, 1.9, { gain: 0.08, attack: 0.05, release: 0.1 });
    const id = window.setTimeout(cycle, 6000);
    loops.set("ringback", { stop: () => { cancelled = true; clearTimeout(id); } });
  };
  cycle();
}

export function playIncomingRing() {
  stopSound("incoming");
  const a = ac(); if (!a) return;
  let cancelled = false;
  const cycle = () => {
    if (cancelled) return;
    // Soft two-note descending chime (E5 → C5), like a gentle doorbell
    tone(659.25, 0.5, { gain: 0.09, type: "sine", attack: 0.06, release: 0.2 });
    tone(523.25, 0.6, { gain: 0.09, type: "sine", delay: 0.4, attack: 0.06, release: 0.25 });
    const id = window.setTimeout(cycle, 3000);
    loops.set("incoming", { stop: () => { cancelled = true; clearTimeout(id); } });
  };
  cycle();
}

/**
 * Harsh emergency siren for pages. A detuned dual-oscillator sweep pushed
 * through a distortion curve — closer to a real alarm panel than a chime.
 * Runs until stopSound("siren") is called.
 */
function sweep(from: number, to: number, dur: number, delay: number, gain: number) {
  const a = ac(); if (!a) return;
  const t0 = a.currentTime + delay;

  const shaper = a.createWaveShaper();
  const n = 256;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * 6); // hard clip → buzzy, metallic edge
  }
  shaper.curve = curve;
  shaper.oversample = "4x";

  const g = a.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.008);
  g.gain.setValueAtTime(gain, t0 + dur - 0.03);
  g.gain.linearRampToValueAtTime(0, t0 + dur);

  // two detuned saws beating against each other = siren "grind"
  for (const detune of [0, 11]) {
    const osc = a.createOscillator();
    osc.type = "sawtooth";
    osc.detune.setValueAtTime(detune, t0);
    osc.frequency.setValueAtTime(from, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), t0 + dur);
    osc.connect(shaper);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }
  shaper.connect(g).connect(a.destination);
}

export function playSiren() {
  stopSound("siren");
  const a = ac(); if (!a) return;
  let cancelled = false;
  const cycle = () => {
    if (cancelled) return;
    // rising wail, falling wail, then two stabbing bursts
    sweep(520, 1180, 0.5, 0, 0.42);
    sweep(1180, 520, 0.5, 0.5, 0.42);
    sweep(1400, 1400, 0.13, 1.06, 0.4);
    sweep(1400, 1400, 0.13, 1.24, 0.4);
    const id = window.setTimeout(cycle, 1600);
    loops.set("siren", { stop: () => { cancelled = true; clearTimeout(id); } });
  };
  cycle();
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try { navigator.vibrate([500, 120, 500, 120, 200, 100, 200]); } catch {}
  }
}


export function stopSound(name: "ringback" | "incoming" | "siren" | string) {
  const l = loops.get(name);
  if (l) { l.stop(); loops.delete(name); }
}

export function stopAllCallSounds() {
  stopSound("ringback");
  stopSound("incoming");
}

// ---------- One-shot sound effects ----------

export type SoundName =
  | "notification"
  | "message"
  | "success"
  | "error"
  | "click"
  | "call-connect"
  | "call-end";

export function playSound(name: SoundName) {
  switch (name) {
    case "notification":
      tone(880, 0.12, { gain: 0.1, type: "sine" });
      tone(1320, 0.16, { gain: 0.09, type: "sine", delay: 0.11 });
      break;
    case "message":
      tone(660, 0.08, { gain: 0.09, type: "triangle" });
      tone(990, 0.1, { gain: 0.08, type: "triangle", delay: 0.07 });
      break;
    case "success":
      tone(660, 0.09, { gain: 0.1, type: "sine" });
      tone(880, 0.09, { gain: 0.1, type: "sine", delay: 0.08 });
      tone(1320, 0.14, { gain: 0.1, type: "sine", delay: 0.16 });
      break;
    case "error":
      tone(220, 0.18, { gain: 0.12, type: "sawtooth" });
      tone(180, 0.22, { gain: 0.12, type: "sawtooth", delay: 0.18 });
      break;
    case "click":
      tone(1200, 0.03, { gain: 0.06, type: "square" });
      break;
    case "call-connect":
      tone(520, 0.1, { gain: 0.1 });
      tone(780, 0.14, { gain: 0.1, delay: 0.09 });
      break;
    case "call-end":
      tone(520, 0.14, { gain: 0.1 });
      tone(300, 0.22, { gain: 0.1, delay: 0.12 });
      break;
  }
}

// Prime the AudioContext on first user gesture so autoplay policies don't
// block later programmatic sounds (e.g. incoming call ring).
if (typeof window !== "undefined") {
  const prime = () => {
    ac();
    window.removeEventListener("pointerdown", prime);
    window.removeEventListener("keydown", prime);
  };
  window.addEventListener("pointerdown", prime, { once: true });
  window.addEventListener("keydown", prime, { once: true });
}
