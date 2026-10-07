import { i as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./client-B5YVWdzA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/phone-BVB7nyHS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ctx = null;
function ac() {
	if (typeof window === "undefined") return null;
	if (!ctx) try {
		const AC = window.AudioContext || window.webkitAudioContext;
		if (AC) ctx = new AC();
	} catch {
		return null;
	}
	if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
	return ctx;
}
var loops = /* @__PURE__ */ new Map();
function tone(freq, duration, opts = {}) {
	const a = ac();
	if (!a) return;
	const { type = "sine", gain = .15, delay = 0, attack = .01, release = .05 } = opts;
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
	osc.stop(t0 + duration + .02);
}
function playRingback() {
	stopSound("ringback");
	if (!ac()) return;
	let cancelled = false;
	const cycle = () => {
		if (cancelled) return;
		tone(440, 1.9, {
			gain: .08,
			attack: .05,
			release: .1
		});
		tone(480, 1.9, {
			gain: .08,
			attack: .05,
			release: .1
		});
		const id = window.setTimeout(cycle, 6e3);
		loops.set("ringback", { stop: () => {
			cancelled = true;
			clearTimeout(id);
		} });
	};
	cycle();
}
function playIncomingRing() {
	stopSound("incoming");
	if (!ac()) return;
	let cancelled = false;
	const cycle = () => {
		if (cancelled) return;
		tone(659.25, .5, {
			gain: .09,
			type: "sine",
			attack: .06,
			release: .2
		});
		tone(523.25, .6, {
			gain: .09,
			type: "sine",
			delay: .4,
			attack: .06,
			release: .25
		});
		const id = window.setTimeout(cycle, 3e3);
		loops.set("incoming", { stop: () => {
			cancelled = true;
			clearTimeout(id);
		} });
	};
	cycle();
}
/**
* Harsh emergency siren for pages. A detuned dual-oscillator sweep pushed
* through a distortion curve — closer to a real alarm panel than a chime.
* Runs until stopSound("siren") is called.
*/
function sweep(from, to, dur, delay, gain) {
	const a = ac();
	if (!a) return;
	const t0 = a.currentTime + delay;
	const shaper = a.createWaveShaper();
	const n = 256;
	const curve = new Float32Array(n);
	for (let i = 0; i < n; i++) {
		const x = i / 255 * 2 - 1;
		curve[i] = Math.tanh(x * 6);
	}
	shaper.curve = curve;
	shaper.oversample = "4x";
	const g = a.createGain();
	g.gain.setValueAtTime(0, t0);
	g.gain.linearRampToValueAtTime(gain, t0 + .008);
	g.gain.setValueAtTime(gain, t0 + dur - .03);
	g.gain.linearRampToValueAtTime(0, t0 + dur);
	for (const detune of [0, 11]) {
		const osc = a.createOscillator();
		osc.type = "sawtooth";
		osc.detune.setValueAtTime(detune, t0);
		osc.frequency.setValueAtTime(from, t0);
		osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), t0 + dur);
		osc.connect(shaper);
		osc.start(t0);
		osc.stop(t0 + dur + .02);
	}
	shaper.connect(g).connect(a.destination);
}
function playSiren() {
	stopSound("siren");
	if (!ac()) return;
	let cancelled = false;
	const cycle = () => {
		if (cancelled) return;
		sweep(520, 1180, .5, 0, .42);
		sweep(1180, 520, .5, .5, .42);
		sweep(1400, 1400, .13, 1.06, .4);
		sweep(1400, 1400, .13, 1.24, .4);
		const id = window.setTimeout(cycle, 1600);
		loops.set("siren", { stop: () => {
			cancelled = true;
			clearTimeout(id);
		} });
	};
	cycle();
	if (typeof navigator !== "undefined" && navigator.vibrate) try {
		navigator.vibrate([
			500,
			120,
			500,
			120,
			200,
			100,
			200
		]);
	} catch {}
}
function stopSound(name) {
	const l = loops.get(name);
	if (l) {
		l.stop();
		loops.delete(name);
	}
}
function stopAllCallSounds() {
	stopSound("ringback");
	stopSound("incoming");
}
function playSound(name) {
	switch (name) {
		case "notification":
			tone(880, .12, {
				gain: .1,
				type: "sine"
			});
			tone(1320, .16, {
				gain: .09,
				type: "sine",
				delay: .11
			});
			break;
		case "message":
			tone(660, .08, {
				gain: .09,
				type: "triangle"
			});
			tone(990, .1, {
				gain: .08,
				type: "triangle",
				delay: .07
			});
			break;
		case "success":
			tone(660, .09, {
				gain: .1,
				type: "sine"
			});
			tone(880, .09, {
				gain: .1,
				type: "sine",
				delay: .08
			});
			tone(1320, .14, {
				gain: .1,
				type: "sine",
				delay: .16
			});
			break;
		case "error":
			tone(220, .18, {
				gain: .12,
				type: "sawtooth"
			});
			tone(180, .22, {
				gain: .12,
				type: "sawtooth",
				delay: .18
			});
			break;
		case "click":
			tone(1200, .03, {
				gain: .06,
				type: "square"
			});
			break;
		case "call-connect":
			tone(520, .1, { gain: .1 });
			tone(780, .14, {
				gain: .1,
				delay: .09
			});
			break;
		case "call-end":
			tone(520, .14, { gain: .1 });
			tone(300, .22, {
				gain: .1,
				delay: .12
			});
	}
}
if (typeof window !== "undefined") {
	const prime = () => {
		ac();
		window.removeEventListener("pointerdown", prime);
		window.removeEventListener("keydown", prime);
	};
	window.addEventListener("pointerdown", prime, { once: true });
	window.addEventListener("keydown", prime, { once: true });
}
var Ctx = (0, import_react.createContext)(null);
var HISTORY_KEY = "hq.call.history";
var AUTONOTES_KEY = "hq.phone.autonotes";
var ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];
function PhoneProvider({ children }) {
	const [active, setActive] = (0, import_react.useState)(null);
	const [incoming, setIncoming] = (0, import_react.useState)(null);
	const [history, setHistory] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return [];
		try {
			return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]").map((c) => ({
				kind: "user",
				notes: "",
				...c
			}));
		} catch {
			return [];
		}
	});
	const [autoNotesEnabled, setAutoNotesEnabledState] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return false;
		return localStorage.getItem(AUTONOTES_KEY) === "1";
	});
	const meIdRef = (0, import_react.useRef)(null);
	const meNameRef = (0, import_react.useRef)("");
	const pcRef = (0, import_react.useRef)(null);
	const localStreamRef = (0, import_react.useRef)(null);
	const remoteAudioRef = (0, import_react.useRef)(null);
	const savedIdsRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const pendingIceRef = (0, import_react.useRef)([]);
	const inboxChannelRef = (0, import_react.useRef)(null);
	const peerChannelsRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const callIdRef = (0, import_react.useRef)(null);
	const recognitionRef = (0, import_react.useRef)(null);
	const recognitionActiveRef = (0, import_react.useRef)(false);
	const [channelCall, setChannelCallState] = (0, import_react.useState)(null);
	const channelCallChRef = (0, import_react.useRef)(null);
	const channelCallSessionIdRef = (0, import_react.useRef)(null);
	const channelPeerConnectionsRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const channelRemoteAudiosRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const channelPendingIceRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const channelCallRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		channelCallRef.current = channelCall;
	}, [channelCall]);
	const appendNotes = (0, import_react.useCallback)((text) => {
		if (!text.trim()) return;
		setActive((cur) => cur ? {
			...cur,
			notes: (cur.notes ? cur.notes.trimEnd() + " " : "") + text.trim()
		} : cur);
	}, []);
	const startRecognition = (0, import_react.useCallback)(() => {
		if (recognitionActiveRef.current) return;
		const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
		if (!SR) return;
		try {
			const rec = new SR();
			rec.continuous = true;
			rec.interimResults = false;
			rec.lang = navigator.language || "en-US";
			rec.onresult = (e) => {
				for (let i = e.resultIndex; i < e.results.length; i++) {
					const r = e.results[i];
					if (r.isFinal) appendNotes(r[0]?.transcript || "");
				}
			};
			rec.onerror = () => {};
			rec.onend = () => {
				if (recognitionActiveRef.current) try {
					rec.start();
				} catch {}
			};
			rec.start();
			recognitionRef.current = rec;
			recognitionActiveRef.current = true;
		} catch {}
	}, [appendNotes]);
	const stopRecognition = (0, import_react.useCallback)(() => {
		recognitionActiveRef.current = false;
		const rec = recognitionRef.current;
		if (rec) try {
			rec.stop();
		} catch {}
		recognitionRef.current = null;
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
		} catch {}
	}, [history]);
	const setAutoNotesEnabled = (0, import_react.useCallback)((v) => {
		setAutoNotesEnabledState(v);
		try {
			localStorage.setItem(AUTONOTES_KEY, v ? "1" : "0");
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		(async () => {
			const { data } = await supabase.auth.getUser();
			if (!mounted || !data.user) return;
			meIdRef.current = data.user.id;
			const { data: p } = await supabase.from("profiles").select("full_name, email").eq("id", data.user.id).maybeSingle();
			meNameRef.current = p?.full_name || p?.email || "Someone";
			const ch = supabase.channel(`phone:${data.user.id}`, { config: { broadcast: { self: false } } });
			ch.on("broadcast", { event: "offer" }, ({ payload }) => handleOffer(payload));
			ch.on("broadcast", { event: "answer" }, ({ payload }) => handleAnswer(payload));
			ch.on("broadcast", { event: "ice" }, ({ payload }) => handleIce(payload));
			ch.on("broadcast", { event: "end" }, ({ payload }) => handleRemoteEnd(payload));
			ch.subscribe();
			inboxChannelRef.current = ch;
		})();
		return () => {
			mounted = false;
			if (inboxChannelRef.current) supabase.removeChannel(inboxChannelRef.current);
			cleanupMedia();
		};
	}, []);
	const getPeerChannel = (0, import_react.useCallback)((peerId) => {
		const cache = peerChannelsRef.current;
		let p = cache.get(peerId);
		if (!p) {
			p = new Promise((resolve) => {
				const ch = supabase.channel(`phone:${peerId}`);
				ch.subscribe((status) => {
					if (status === "SUBSCRIBED") resolve(ch);
				});
			});
			cache.set(peerId, p);
		}
		return p;
	}, []);
	const sendToPeer = (0, import_react.useCallback)(async (peerId, event, payload) => {
		await (await getPeerChannel(peerId)).send({
			type: "broadcast",
			event,
			payload
		});
	}, [getPeerChannel]);
	const dropPeerChannels = () => {
		for (const p of peerChannelsRef.current.values()) p.then((ch) => {
			try {
				supabase.removeChannel(ch);
			} catch {}
		});
		peerChannelsRef.current.clear();
	};
	const cleanupChannelMesh = () => {
		for (const pc of channelPeerConnectionsRef.current.values()) try {
			pc.close();
		} catch {}
		channelPeerConnectionsRef.current.clear();
		for (const audio of channelRemoteAudiosRef.current.values()) try {
			audio.pause();
			audio.srcObject = null;
			audio.remove();
		} catch {}
		channelRemoteAudiosRef.current.clear();
		channelPendingIceRef.current.clear();
	};
	const cleanupMedia = () => {
		if (pcRef.current) {
			try {
				pcRef.current.close();
			} catch {}
			pcRef.current = null;
		}
		cleanupChannelMesh();
		if (localStreamRef.current) {
			localStreamRef.current.getTracks().forEach((t) => t.stop());
			localStreamRef.current = null;
		}
		pendingIceRef.current = [];
		dropPeerChannels();
		stopAllCallSounds();
		stopRecognition();
	};
	const createPeer = (0, import_react.useCallback)((remoteId, callId) => {
		const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
		pc.ontrack = (e) => {
			if (remoteAudioRef.current) {
				remoteAudioRef.current.srcObject = e.streams[0];
				remoteAudioRef.current.play().catch(() => {});
			}
		};
		pc.onicecandidate = (e) => {
			if (e.candidate && meIdRef.current) sendToPeer(remoteId, "ice", {
				callId,
				from: meIdRef.current,
				candidate: e.candidate.toJSON()
			});
		};
		pc.onconnectionstatechange = () => {
			if (pc.connectionState === "connected") setActive((cur) => cur && cur.status !== "active" ? {
				...cur,
				status: "active",
				startedAt: (/* @__PURE__ */ new Date()).toISOString()
			} : cur);
			else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") finishCall();
		};
		pcRef.current = pc;
		return pc;
	}, [sendToPeer]);
	const ensureLocalStream = (0, import_react.useCallback)(async () => {
		if (localStreamRef.current) return localStreamRef.current;
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: false
		});
		localStreamRef.current = stream;
		return stream;
	}, []);
	const attachLocalMedia = async (pc) => {
		const stream = await ensureLocalStream();
		stream.getTracks().forEach((t) => pc.addTrack(t, stream));
		return stream;
	};
	const finishCall = (0, import_react.useCallback)(() => {
		setActive((cur) => {
			if (!cur) return null;
			if (savedIdsRef.current.has(cur.id)) {
				cleanupMedia();
				return null;
			}
			savedIdsRef.current.add(cur.id);
			const done = {
				...cur,
				status: "ended",
				endedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			queueMicrotask(async () => {
				setHistory((h) => h.some((x) => x.id === done.id) ? h : [done, ...h].slice(0, 50));
				if (autoNotesEnabled && done.notes.trim()) try {
					const { data: u } = await supabase.auth.getUser();
					if (u.user) await supabase.from("meeting_notes").insert({
						author_id: u.user.id,
						title: `Call with ${done.peerName}`,
						content_md: done.notes,
						meeting_date: done.startedAt.slice(0, 10),
						attendees: done.kind === "user" ? [done.peerId] : [],
						tags: ["call"]
					});
				} catch {}
			});
			cleanupMedia();
			return null;
		});
		callIdRef.current = null;
	}, [autoNotesEnabled]);
	const handleOffer = (0, import_react.useCallback)(async (payload) => {
		const { callId, from, fromName, offer } = payload || {};
		if (!callId || !from || !offer) return;
		if (pcRef.current || active) {
			sendToPeer(from, "end", {
				callId,
				from: meIdRef.current,
				reason: "busy"
			});
			return;
		}
		setIncoming({
			callId,
			fromUserId: from,
			fromName: fromName || "Unknown",
			offer
		});
	}, [active, sendToPeer]);
	const handleAnswer = (0, import_react.useCallback)(async (payload) => {
		const { answer } = payload || {};
		if (!pcRef.current || !answer) return;
		try {
			await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
			for (const c of pendingIceRef.current) try {
				await pcRef.current.addIceCandidate(c);
			} catch {}
			pendingIceRef.current = [];
			setActive((cur) => cur && cur.status === "ringing" ? {
				...cur,
				status: "connecting"
			} : cur);
		} catch {}
	}, []);
	const handleIce = (0, import_react.useCallback)(async (payload) => {
		const { candidate } = payload || {};
		if (!candidate) return;
		if (pcRef.current && pcRef.current.remoteDescription) try {
			await pcRef.current.addIceCandidate(candidate);
		} catch {}
		else pendingIceRef.current.push(candidate);
	}, []);
	const handleRemoteEnd = (0, import_react.useCallback)((_payload) => {
		finishCall();
	}, [finishCall]);
	const startCall = (0, import_react.useCallback)(async (peerId, peerName, kind = "user") => {
		if (active || !meIdRef.current) return;
		const callId = crypto.randomUUID();
		callIdRef.current = callId;
		const call = {
			id: callId,
			peerId,
			peerName,
			kind,
			direction: "outbound",
			status: "ringing",
			startedAt: (/* @__PURE__ */ new Date()).toISOString(),
			endedAt: null,
			muted: false,
			notes: ""
		};
		setActive(call);
		try {
			const pc = createPeer(peerId, callId);
			await attachLocalMedia(pc);
			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);
			await sendToPeer(peerId, "offer", {
				callId,
				from: meIdRef.current,
				fromName: meNameRef.current,
				offer: {
					type: offer.type,
					sdp: offer.sdp
				}
			});
		} catch (err) {
			console.error("startCall failed", err);
			finishCall();
		}
	}, [
		active,
		createPeer,
		sendToPeer,
		finishCall
	]);
	const acceptIncoming = (0, import_react.useCallback)(async () => {
		if (!incoming || !meIdRef.current) return;
		const inc = incoming;
		setIncoming(null);
		const call = {
			id: inc.callId,
			peerId: inc.fromUserId,
			peerName: inc.fromName,
			kind: "user",
			direction: "inbound",
			status: "connecting",
			startedAt: (/* @__PURE__ */ new Date()).toISOString(),
			endedAt: null,
			muted: false,
			notes: ""
		};
		setActive(call);
		callIdRef.current = inc.callId;
		try {
			const pc = createPeer(inc.fromUserId, inc.callId);
			await attachLocalMedia(pc);
			await pc.setRemoteDescription(new RTCSessionDescription(inc.offer));
			for (const c of pendingIceRef.current) try {
				await pc.addIceCandidate(c);
			} catch {}
			pendingIceRef.current = [];
			const answer = await pc.createAnswer();
			await pc.setLocalDescription(answer);
			await sendToPeer(inc.fromUserId, "answer", {
				callId: inc.callId,
				from: meIdRef.current,
				answer: {
					type: answer.type,
					sdp: answer.sdp
				}
			});
		} catch (err) {
			console.error("acceptIncoming failed", err);
			finishCall();
		}
	}, [
		incoming,
		createPeer,
		sendToPeer,
		finishCall
	]);
	const declineIncoming = (0, import_react.useCallback)(() => {
		if (!incoming || !meIdRef.current) return;
		sendToPeer(incoming.fromUserId, "end", {
			callId: incoming.callId,
			from: meIdRef.current,
			reason: "declined"
		});
		setIncoming(null);
	}, [incoming, sendToPeer]);
	const disconnectChannelPresence = (0, import_react.useCallback)(async () => {
		if (channelCallChRef.current) {
			try {
				await channelCallChRef.current.send({
					type: "broadcast",
					event: "bye",
					payload: {
						user_id: meIdRef.current,
						session_id: channelCallSessionIdRef.current
					}
				});
			} catch {}
			try {
				await channelCallChRef.current.untrack();
			} catch {}
			supabase.removeChannel(channelCallChRef.current);
			channelCallChRef.current = null;
		}
		channelCallSessionIdRef.current = null;
		channelCallRef.current = null;
		setChannelCallState(null);
		cleanupChannelMesh();
	}, []);
	const endCall = (0, import_react.useCallback)(async () => {
		const cur = active;
		if (cur?.kind === "channel") {
			await disconnectChannelPresence();
			finishCall();
			return;
		}
		if (cur && meIdRef.current) try {
			await sendToPeer(cur.peerId, "end", {
				callId: cur.id,
				from: meIdRef.current
			});
		} catch {}
		finishCall();
	}, [
		active,
		sendToPeer,
		finishCall,
		disconnectChannelPresence
	]);
	const toggleMute = (0, import_react.useCallback)(() => {
		setActive((cur) => {
			if (!cur) return cur;
			const next = !cur.muted;
			if (localStreamRef.current) localStreamRef.current.getAudioTracks().forEach((t) => {
				t.enabled = !next;
			});
			return {
				...cur,
				muted: next
			};
		});
	}, []);
	const updateNotes = (0, import_react.useCallback)((notes) => {
		setActive((cur) => cur ? {
			...cur,
			notes
		} : cur);
	}, []);
	const prevStatusRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const status = active?.status ?? null;
		const prev = prevStatusRef.current;
		if (active?.direction === "outbound" && status === "ringing") playRingback();
		else {
			stopAllCallSounds();
			if (active && status === "active" && prev !== "active") playSound("call-connect");
		}
		if (!active && prev && prev !== "ended") playSound("call-end");
		prevStatusRef.current = status;
	}, [
		active?.status,
		active?.direction,
		active
	]);
	(0, import_react.useEffect)(() => {
		if (incoming) playIncomingRing();
		else stopAllCallSounds();
	}, [incoming]);
	(0, import_react.useEffect)(() => {
		if (active?.status === "active" && autoNotesEnabled) startRecognition();
		else stopRecognition();
	}, [
		active?.status,
		autoNotesEnabled,
		startRecognition,
		stopRecognition
	]);
	const getOrCreateChannelPeer = (0, import_react.useCallback)(async (remoteId, sessionId, ch) => {
		if (!meIdRef.current || remoteId === meIdRef.current) return null;
		const existing = channelPeerConnectionsRef.current.get(remoteId);
		if (existing) return existing;
		const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
		pc.onicecandidate = (e) => {
			if (e.candidate) ch.send({
				type: "broadcast",
				event: "mesh-ice",
				payload: {
					session_id: sessionId,
					from: meIdRef.current,
					to: remoteId,
					candidate: e.candidate.toJSON()
				}
			});
		};
		pc.ontrack = (e) => {
			let audio = channelRemoteAudiosRef.current.get(remoteId);
			if (!audio) {
				audio = new Audio();
				audio.autoplay = true;
				audio.setAttribute("playsinline", "true");
				audio.className = "hidden";
				document.body.appendChild(audio);
				channelRemoteAudiosRef.current.set(remoteId, audio);
			}
			audio.srcObject = e.streams[0];
			audio.play().catch(() => {});
		};
		pc.onconnectionstatechange = () => {
			if (pc.connectionState === "failed" || pc.connectionState === "closed") {
				try {
					pc.close();
				} catch {}
				channelPeerConnectionsRef.current.delete(remoteId);
				const audio = channelRemoteAudiosRef.current.get(remoteId);
				if (audio) try {
					audio.pause();
					audio.srcObject = null;
					audio.remove();
				} catch {}
				channelRemoteAudiosRef.current.delete(remoteId);
			}
		};
		const stream = await ensureLocalStream();
		stream.getTracks().forEach((track) => pc.addTrack(track, stream));
		channelPeerConnectionsRef.current.set(remoteId, pc);
		return pc;
	}, [ensureLocalStream]);
	const makeChannelOffer = (0, import_react.useCallback)(async (remoteId, sessionId, ch) => {
		const pc = await getOrCreateChannelPeer(remoteId, sessionId, ch);
		if (!pc || pc.signalingState !== "stable") return;
		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);
		await ch.send({
			type: "broadcast",
			event: "mesh-offer",
			payload: {
				session_id: sessionId,
				from: meIdRef.current,
				to: remoteId,
				offer: {
					type: offer.type,
					sdp: offer.sdp
				}
			}
		});
	}, [getOrCreateChannelPeer]);
	const joinChannelCallPresence = (0, import_react.useCallback)(async (channelId, channelName, isHost, sessionId = crypto.randomUUID()) => {
		if (!meIdRef.current) return;
		if (channelCallChRef.current) await disconnectChannelPresence();
		await ensureLocalStream();
		const startedAt = (/* @__PURE__ */ new Date()).toISOString();
		const callId = `channel:${sessionId}:${meIdRef.current}`;
		callIdRef.current = callId;
		setActive({
			id: callId,
			peerId: channelId,
			peerName: `#${channelName}`,
			kind: "channel",
			direction: isHost ? "outbound" : "inbound",
			status: "active",
			startedAt,
			endedAt: null,
			muted: false,
			notes: ""
		});
		channelCallSessionIdRef.current = sessionId;
		const ch = supabase.channel(`channel-call:${channelId}`, { config: { presence: { key: meIdRef.current } } });
		ch.on("broadcast", { event: "who" }, () => {
			ch.send({
				type: "broadcast",
				event: "hello",
				payload: {
					user_id: meIdRef.current,
					session_id: sessionId,
					fresh: false
				}
			});
		});
		ch.on("broadcast", { event: "hello" }, ({ payload }) => {
			const uid = payload?.user_id;
			if (!uid || uid === meIdRef.current || payload?.session_id !== sessionId) return;
			if (payload?.fresh === true || meIdRef.current && meIdRef.current > uid && !channelPeerConnectionsRef.current.has(uid)) makeChannelOffer(uid, sessionId, ch);
		});
		ch.on("broadcast", { event: "mesh-offer" }, async ({ payload }) => {
			if (payload?.session_id !== sessionId || payload?.to !== meIdRef.current || !payload?.from || !payload?.offer) return;
			try {
				const pc = await getOrCreateChannelPeer(payload.from, sessionId, ch);
				if (!pc) return;
				await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
				const pending = channelPendingIceRef.current.get(payload.from) ?? [];
				for (const c of pending) try {
					await pc.addIceCandidate(c);
				} catch {}
				channelPendingIceRef.current.delete(payload.from);
				const answer = await pc.createAnswer();
				await pc.setLocalDescription(answer);
				await ch.send({
					type: "broadcast",
					event: "mesh-answer",
					payload: {
						session_id: sessionId,
						from: meIdRef.current,
						to: payload.from,
						answer: {
							type: answer.type,
							sdp: answer.sdp
						}
					}
				});
			} catch (err) {
				console.error("channel offer failed", err);
			}
		});
		ch.on("broadcast", { event: "mesh-answer" }, async ({ payload }) => {
			if (payload?.session_id !== sessionId || payload?.to !== meIdRef.current || !payload?.from || !payload?.answer) return;
			const pc = channelPeerConnectionsRef.current.get(payload.from);
			if (!pc) return;
			try {
				await pc.setRemoteDescription(new RTCSessionDescription(payload.answer));
				const pending = channelPendingIceRef.current.get(payload.from) ?? [];
				for (const c of pending) try {
					await pc.addIceCandidate(c);
				} catch {}
				channelPendingIceRef.current.delete(payload.from);
			} catch (err) {
				console.error("channel answer failed", err);
			}
		});
		ch.on("broadcast", { event: "mesh-ice" }, async ({ payload }) => {
			if (payload?.session_id !== sessionId || payload?.to !== meIdRef.current || !payload?.from || !payload?.candidate) return;
			const pc = channelPeerConnectionsRef.current.get(payload.from);
			if (pc?.remoteDescription) try {
				await pc.addIceCandidate(payload.candidate);
			} catch {}
			else {
				const pending = channelPendingIceRef.current.get(payload.from) ?? [];
				pending.push(payload.candidate);
				channelPendingIceRef.current.set(payload.from, pending);
			}
		});
		ch.subscribe(async (status) => {
			if (status === "SUBSCRIBED") {
				await ch.track({
					user_id: meIdRef.current,
					session_id: sessionId,
					joined_at: (/* @__PURE__ */ new Date()).toISOString()
				});
				await ch.send({
					type: "broadcast",
					event: "hello",
					payload: {
						user_id: meIdRef.current,
						session_id: sessionId,
						fresh: true
					}
				});
				await ch.send({
					type: "broadcast",
					event: "who",
					payload: { session_id: sessionId }
				});
			}
		});
		channelCallChRef.current = ch;
		setChannelCallState({
			channelId,
			channelName,
			sessionId,
			isHost
		});
	}, [
		disconnectChannelPresence,
		ensureLocalStream,
		getOrCreateChannelPeer,
		makeChannelOffer
	]);
	const startChannelCall = (0, import_react.useCallback)(async (channelId, channelName) => {
		if (active || channelCall || !meIdRef.current) return;
		const sessionId = crypto.randomUUID();
		try {
			await supabase.from("channel_messages").insert({
				channel_id: channelId,
				author_id: meIdRef.current,
				body: `📞 Started a call — click Join in the header to hop in.`,
				attachments: [{
					type: "call_announcement",
					channelId,
					host_id: meIdRef.current,
					session_id: sessionId
				}]
			});
		} catch {}
		await joinChannelCallPresence(channelId, channelName, true, sessionId);
		playSound("call-connect");
	}, [
		active,
		channelCall,
		joinChannelCallPresence
	]);
	const joinChannelCall = (0, import_react.useCallback)(async (channelId, channelName, sessionId) => {
		if (active || channelCall) return;
		await joinChannelCallPresence(channelId, channelName, false, sessionId);
		playSound("call-connect");
	}, [
		active,
		channelCall,
		joinChannelCallPresence
	]);
	const leaveChannelCall = (0, import_react.useCallback)(async () => {
		await disconnectChannelPresence();
		finishCall();
		playSound("call-end");
	}, [disconnectChannelPresence, finishCall]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Ctx.Provider, {
		value: {
			active,
			history,
			incoming,
			autoNotesEnabled,
			setAutoNotesEnabled,
			startCall,
			acceptIncoming,
			declineIncoming,
			endCall,
			toggleMute,
			updateNotes,
			remoteAudioRef,
			channelCall,
			startChannelCall,
			joinChannelCall,
			leaveChannelCall
		},
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
			ref: remoteAudioRef,
			autoPlay: true,
			playsInline: true,
			className: "hidden"
		})]
	});
}
function usePhone() {
	const c = (0, import_react.useContext)(Ctx);
	if (!c) throw new Error("usePhone must be used within PhoneProvider");
	return c;
}
function formatDuration(start, end) {
	const s = new Date(start).getTime();
	const e = end ? new Date(end).getTime() : Date.now();
	const sec = Math.max(0, Math.floor((e - s) / 1e3));
	return `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;
}
//#endregion
export { stopSound as a, playSound as i, formatDuration as n, usePhone as o, playSiren as r, PhoneProvider as t };
