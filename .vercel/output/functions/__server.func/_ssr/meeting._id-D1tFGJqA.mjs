import { i as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { C as useSearch, S as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { r as createServerFn } from "./server-DjCj4rPg.mjs";
import { n as supabase } from "./client-B5YVWdzA.mjs";
import { At as MicOff, K as Send, Lt as Maximize2, X as ScreenShareOff, Y as ScreenShare, Yn as Copy, c as Video, jn as FileText, jt as MessageSquare, kt as Mic, l as VideoOff, mr as Check, mt as PhoneOff, n as X, u as Users } from "../_libs/lucide-react.mjs";
import { s as Route$63 } from "./router-rvM-za4Z.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CkcSjSkU.mjs";
import { t as EscapeKey } from "./EscapeKey-s0O3wTFo.mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/meeting._id-D1tFGJqA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lookupSchema = objectType({
	token: stringType().min(8).max(200),
	meetingId: stringType().uuid()
});
var joinSchema = objectType({
	token: stringType().min(8).max(200),
	meetingId: stringType().uuid(),
	name: stringType().trim().min(1).max(120).nullable().optional()
});
/** Resolve a guest meeting invite from its token. Returns null when the token is invalid. */
var lookupMeetingInvite = createServerFn({ method: "POST" }).inputValidator((data) => lookupSchema.parse(data)).handler(createSsrRpc("b5a00bf46c82250e21b4230e3b59f6c39c0e1a07754a20d0caabae71a77303ba"));
/** Mark a guest invite as joined, optionally recording the guest's display name. */
var markMeetingInviteJoined = createServerFn({ method: "POST" }).inputValidator((data) => joinSchema.parse(data)).handler(createSsrRpc("e38c8e23a6b1843dd86f35d56ee3847da934918ae586cac6ace1f06b848cc227"));
var ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }];
function useHQThemeSync() {
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const apply = () => {
			const stored = window.localStorage.getItem("hq-theme") ?? "dark";
			const resolved = stored === "system" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : stored;
			const root = document.documentElement;
			if (resolved === "dark") root.classList.add("dark");
			else root.classList.remove("dark");
		};
		apply();
		const mm = window.matchMedia("(prefers-color-scheme: dark)");
		mm.addEventListener?.("change", apply);
		return () => mm.removeEventListener?.("change", apply);
	}, []);
}
function MeetingRoom() {
	useHQThemeSync();
	const { id } = Route$63.useParams();
	const { t: inviteToken } = useSearch({ from: "/meeting/$id" });
	const navigate = useNavigate();
	const [meeting, setMeeting] = (0, import_react.useState)(null);
	const [me, setMe] = (0, import_react.useState)(null);
	const [guestNamePrompt, setGuestNamePrompt] = (0, import_react.useState)(null);
	const [peers, setPeers] = (0, import_react.useState)({});
	const [micOn, setMicOn] = (0, import_react.useState)(true);
	const [camOn, setCamOn] = (0, import_react.useState)(true);
	const [sharing, setSharing] = (0, import_react.useState)(false);
	const [transcribing, setTranscribing] = (0, import_react.useState)(false);
	const [transcript, setTranscript] = (0, import_react.useState)([]);
	const [interim, setInterim] = (0, import_react.useState)("");
	const [chat, setChat] = (0, import_react.useState)([]);
	const [chatDraft, setChatDraft] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [sidePanel, setSidePanel] = (0, import_react.useState)("chat");
	const [enlarged, setEnlarged] = (0, import_react.useState)(null);
	const [, forceTick] = (0, import_react.useState)(0);
	const [speakingKeys, setSpeakingKeys] = (0, import_react.useState)({});
	const [showLeaveConfirm, setShowLeaveConfirm] = (0, import_react.useState)(false);
	const [ending, setEnding] = (0, import_react.useState)(false);
	const [notesDraft, setNotesDraft] = (0, import_react.useState)(null);
	const localVideoRef = (0, import_react.useRef)(null);
	const localStreamRef = (0, import_react.useRef)(null);
	const screenStreamRef = (0, import_react.useRef)(null);
	const peersRef = (0, import_react.useRef)({});
	const channelRef = (0, import_react.useRef)(null);
	const recognitionRef = (0, import_react.useRef)(null);
	const meRef = (0, import_react.useRef)(null);
	const noteSavedRef = (0, import_react.useRef)(false);
	const chatEndRef = (0, import_react.useRef)(null);
	const audioCtxRef = (0, import_react.useRef)(null);
	const analysersRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const startedAtRef = (0, import_react.useRef)(Date.now());
	const updatePeer = (uid, updater) => {
		const next = updater(peersRef.current[uid]);
		if (!next) {
			const { [uid]: _, ...rest } = peersRef.current;
			peersRef.current = rest;
		} else peersRef.current = {
			...peersRef.current,
			[uid]: next
		};
		setPeers({ ...peersRef.current });
	};
	const sendOffer = (0, import_react.useCallback)(async (remoteId, pc) => {
		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);
		channelRef.current?.send({
			type: "broadcast",
			event: "offer",
			payload: {
				to: remoteId,
				from: meRef.current?.id,
				fromName: meRef.current?.name,
				sdp: offer
			}
		});
	}, []);
	const createPeer = (0, import_react.useCallback)((remoteId, remoteName, initiator) => {
		const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
		localStreamRef.current?.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current));
		screenStreamRef.current?.getTracks().forEach((t) => pc.addTrack(t, screenStreamRef.current));
		pc.ontrack = (e) => {
			const stream = e.streams[0];
			if (!stream) return;
			updatePeer(remoteId, (p) => {
				const base = p ?? {
					pc,
					name: remoteName,
					streams: {}
				};
				if (!base.streams[stream.id]) {
					base.streams = {
						...base.streams,
						[stream.id]: stream
					};
					stream.onremovetrack = () => {
						if (stream.getTracks().length === 0) updatePeer(remoteId, (pp) => {
							if (!pp) return pp;
							const { [stream.id]: _drop, ...rest } = pp.streams;
							return {
								...pp,
								streams: rest
							};
						});
					};
				}
				return { ...base };
			});
		};
		pc.onicecandidate = (e) => {
			if (e.candidate) channelRef.current?.send({
				type: "broadcast",
				event: "ice",
				payload: {
					to: remoteId,
					from: meRef.current?.id,
					candidate: e.candidate
				}
			});
		};
		updatePeer(remoteId, () => ({
			pc,
			name: remoteName,
			streams: {}
		}));
		if (initiator) sendOffer(remoteId, pc);
		return pc;
	}, [sendOffer]);
	const cleanupAll = (0, import_react.useCallback)(() => {
		try {
			recognitionRef.current?.stop();
		} catch {}
		Object.values(peersRef.current).forEach((p) => p.pc.close());
		peersRef.current = {};
		localStreamRef.current?.getTracks().forEach((t) => t.stop());
		screenStreamRef.current?.getTracks().forEach((t) => t.stop());
		if (channelRef.current) supabase.removeChannel(channelRef.current);
		channelRef.current = null;
	}, []);
	const buildAutoNotes = (0, import_react.useCallback)((options) => {
		const attendeeNames = Array.from(/* @__PURE__ */ new Set([meRef.current?.name ?? "Me", ...Object.values(peersRef.current).map((p) => p.name)]));
		const durationMs = Date.now() - startedAtRef.current;
		const mins = Math.floor(durationMs / 6e4);
		const secs = Math.floor(durationMs % 6e4 / 1e3);
		const durationStr = mins >= 1 ? `${mins} min ${secs}s` : `${secs}s`;
		const chatMsgs = chat.filter((m) => m.text.trim());
		const links = [];
		for (const m of chatMsgs) {
			const found = m.text.match(/https?:\/\/[^\s]+/g);
			if (found) links.push(...found);
		}
		const uniqueLinks = Array.from(new Set(links));
		const topics = transcript.map((t) => t.text.trim()).filter((t) => t.length > 20).slice(0, 6);
		return {
			md: [
				`# ${meeting?.title ?? "Meeting"} — Notes`,
				"",
				`_${(/* @__PURE__ */ new Date()).toLocaleString([], {
					dateStyle: "full",
					timeStyle: "short"
				})} · ${durationStr}${options?.hostEnded ? " · host ended for everyone" : ""}_`,
				"",
				"## Summary",
				"_Write a 2-3 sentence summary of what was covered._",
				"",
				"## Key Discussion Points",
				...topics.length ? topics.map((t) => `- ${t}`) : ["- _Add the main topics discussed._"],
				"",
				"## Decisions",
				"- _What was decided?_",
				"",
				"## Action Items",
				"- [ ] _Owner — action — due date_",
				"",
				"## Attendees",
				...attendeeNames.map((n) => `- ${n}`),
				...uniqueLinks.length ? [
					"",
					"## Links shared",
					...uniqueLinks.map((l) => `- ${l}`)
				] : [],
				...chatMsgs.length ? [
					"",
					"## Chat highlights",
					...chatMsgs.slice(-10).map((m) => `- **${m.fromName}:** ${m.text}`)
				] : [],
				...transcript.length ? [
					"",
					"<details><summary>Raw transcript</summary>",
					"",
					...transcript.map((t) => `- **${t.speaker}** _(${new Date(t.t).toLocaleTimeString()})_: ${t.text}`),
					"",
					"</details>"
				] : []
			].filter((line, i, arr) => !(line === "" && arr[i - 1] === "")).join("\n"),
			attendees: attendeeNames
		};
	}, [
		chat,
		transcript,
		meeting?.title
	]);
	const saveMeetingNote = (0, import_react.useCallback)(async (options) => {
		if (noteSavedRef.current) return;
		if (!meRef.current || meRef.current.external) return;
		const { data: existing } = await supabase.from("meeting_notes").select("id").eq("meeting_id", id).limit(1);
		if (existing && existing.length > 0) {
			noteSavedRef.current = true;
			return;
		}
		const { md: autoMd, attendees } = buildAutoNotes(options);
		const md = options?.overrideMd ?? autoMd;
		const plain = md.replace(/[#*_>`]/g, "");
		await supabase.from("meeting_notes").insert({
			meeting_id: id,
			author_id: meRef.current.id,
			title: `${meeting?.title ?? "Meeting"} — Notes`,
			body: plain,
			content_md: md,
			meeting_date: (/* @__PURE__ */ new Date()).toISOString(),
			tags: options?.overrideMd ? ["edited", "auto"] : ["auto"],
			attendees
		});
		noteSavedRef.current = true;
	}, [
		id,
		meeting?.title,
		buildAutoNotes
	]);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		(async () => {
			const { data: u } = await supabase.auth.getUser();
			let meData = null;
			if (u.user) {
				const { data: p } = await supabase.from("profiles").select("id, full_name, email").eq("id", u.user.id).maybeSingle();
				const name = p?.full_name || p?.email || "Teammate";
				meData = {
					id: u.user.id,
					name,
					external: false
				};
			} else if (inviteToken) {
				const inv = await lookupMeetingInvite({ data: {
					token: inviteToken,
					meetingId: id
				} });
				if (!inv) {
					setError("This guest link is invalid or has expired.");
					return;
				}
				const cachedName = typeof window !== "undefined" ? window.sessionStorage.getItem(`meeting-guest-${id}`) : null;
				const name = inv.name || cachedName || null;
				if (!name) {
					setGuestNamePrompt({ email: inv.email });
					return;
				}
				meData = {
					id: `guest-${inv.id}`,
					name,
					external: true
				};
				await markMeetingInviteJoined({ data: {
					token: inviteToken,
					meetingId: id,
					name
				} });
			} else {
				setError("This meeting is private. Sign in with your Clovr account, or ask the host for a guest invite link.");
				return;
			}
			meRef.current = meData;
			setMe(meData);
			const { data: m } = await supabase.from("meetings").select("*").eq("id", id).maybeSingle();
			if (m) setMeeting(m);
			if (!meData.external) await supabase.from("meeting_participants").upsert({
				meeting_id: id,
				user_id: meData.id,
				rsvp: "yes"
			}, { onConflict: "meeting_id,user_id" });
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true
				});
				if (!mounted) {
					stream.getTracks().forEach((t) => t.stop());
					return;
				}
				localStreamRef.current = stream;
				forceTick((n) => n + 1);
				if (localVideoRef.current) localVideoRef.current.srcObject = stream;
			} catch (err) {
				setError("Camera/mic access denied. " + err.message);
				return;
			}
			const ch = supabase.channel(`meeting:${id}`, { config: { presence: { key: meData.id } } });
			channelRef.current = ch;
			ch.on("broadcast", { event: "offer" }, async ({ payload }) => {
				if (payload.to !== meRef.current?.id) return;
				let peer = peersRef.current[payload.from];
				if (!peer) {
					createPeer(payload.from, payload.fromName ?? "Guest", false);
					peer = peersRef.current[payload.from];
				}
				await peer.pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
				const answer = await peer.pc.createAnswer();
				await peer.pc.setLocalDescription(answer);
				ch.send({
					type: "broadcast",
					event: "answer",
					payload: {
						to: payload.from,
						from: meRef.current?.id,
						sdp: answer
					}
				});
			});
			ch.on("broadcast", { event: "answer" }, async ({ payload }) => {
				if (payload.to !== meRef.current?.id) return;
				const peer = peersRef.current[payload.from];
				if (peer) await peer.pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
			});
			ch.on("broadcast", { event: "ice" }, async ({ payload }) => {
				if (payload.to !== meRef.current?.id) return;
				const peer = peersRef.current[payload.from];
				if (peer && payload.candidate) try {
					await peer.pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
				} catch {}
			});
			ch.on("broadcast", { event: "leave" }, ({ payload }) => {
				const peer = peersRef.current[payload.from];
				if (peer) {
					peer.pc.close();
					updatePeer(payload.from, () => void 0);
				}
			});
			ch.on("broadcast", { event: "transcript" }, ({ payload }) => {
				if (payload.from === meRef.current?.id) return;
				setTranscript((prev) => [...prev, {
					t: payload.t,
					text: payload.text,
					speaker: payload.speaker
				}]);
			});
			ch.on("broadcast", { event: "chat" }, ({ payload }) => {
				if (payload.from === meRef.current?.id) return;
				setChat((prev) => [...prev, payload]);
			});
			ch.on("broadcast", { event: "end-meeting" }, () => {
				cleanupAll();
				if (meRef.current?.external) navigate({ to: "/" });
				else navigate({ to: "/meetings" });
			});
			ch.on("presence", { event: "sync" }, () => {
				const state = ch.presenceState();
				Object.keys(state).forEach((uid) => {
					if (uid === meRef.current?.id) return;
					if (peersRef.current[uid]) return;
					const initiate = meRef.current.id < uid;
					const name = state[uid]?.[0]?.name ?? "Guest";
					if (initiate) createPeer(uid, name, true);
				});
			});
			await ch.subscribe(async (status) => {
				if (status === "SUBSCRIBED") await ch.track({ name: meData.name });
			});
		})();
		return () => {
			mounted = false;
			channelRef.current?.send({
				type: "broadcast",
				event: "leave",
				payload: { from: meRef.current?.id }
			});
			saveMeetingNote();
			cleanupAll();
		};
	}, [id, guestNamePrompt]);
	(0, import_react.useEffect)(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chat.length]);
	(0, import_react.useEffect)(() => {
		const AC = window.AudioContext || window.webkitAudioContext;
		if (!AC) return;
		if (!audioCtxRef.current) audioCtxRef.current = new AC();
		const ctx = audioCtxRef.current;
		const entries = [];
		if (localStreamRef.current && localStreamRef.current.getAudioTracks().length) entries.push({
			key: "me-cam",
			stream: localStreamRef.current
		});
		Object.entries(peersRef.current).forEach(([uid, p]) => {
			Object.values(p.streams).forEach((s, i) => {
				if (s.getAudioTracks().length) entries.push({
					key: i === 0 ? uid : `${uid}-${s.id}`,
					stream: s
				});
			});
		});
		const live = new Set(entries.map((e) => e.key));
		for (const [key, node] of analysersRef.current) if (!live.has(key)) {
			try {
				node.source.disconnect();
				node.analyser.disconnect();
			} catch {}
			analysersRef.current.delete(key);
		}
		for (const { key, stream } of entries) {
			if (analysersRef.current.has(key)) continue;
			try {
				const source = ctx.createMediaStreamSource(stream);
				const analyser = ctx.createAnalyser();
				analyser.fftSize = 512;
				source.connect(analyser);
				analysersRef.current.set(key, {
					analyser,
					source
				});
			} catch {}
		}
		const buf = /* @__PURE__ */ new Uint8Array(512);
		let raf = 0;
		const tick = () => {
			const next = {};
			analysersRef.current.forEach(({ analyser }, key) => {
				analyser.getByteTimeDomainData(buf);
				let sum = 0;
				for (let i = 0; i < buf.length; i++) {
					const v = buf[i] - 128;
					sum += v * v;
				}
				if (Math.sqrt(sum / buf.length) > 8) next[key] = true;
			});
			setSpeakingKeys((prev) => {
				const keys = /* @__PURE__ */ new Set([...Object.keys(prev), ...Object.keys(next)]);
				for (const k of keys) if (!!prev[k] !== !!next[k]) return next;
				return prev;
			});
			raf = window.setTimeout(tick, 150);
		};
		tick();
		return () => {
			window.clearTimeout(raf);
		};
	}, [
		peers,
		camOn,
		micOn
	]);
	const toggleMic = () => {
		const track = localStreamRef.current?.getAudioTracks()[0];
		if (track) {
			track.enabled = !track.enabled;
			setMicOn(track.enabled);
		}
	};
	const toggleCam = () => {
		const track = localStreamRef.current?.getVideoTracks()[0];
		if (track) {
			track.enabled = !track.enabled;
			setCamOn(track.enabled);
		}
	};
	const renegotiateAll = async () => {
		for (const [uid, p] of Object.entries(peersRef.current)) if (meRef.current.id < uid) try {
			await sendOffer(uid, p.pc);
		} catch {}
	};
	const toggleShare = async () => {
		if (sharing) {
			const s = screenStreamRef.current;
			if (s) s.getTracks().forEach((t) => {
				Object.values(peersRef.current).forEach((p) => {
					const sender = p.pc.getSenders().find((sn) => sn.track === t);
					if (sender) try {
						p.pc.removeTrack(sender);
					} catch {}
				});
				t.stop();
			});
			screenStreamRef.current = null;
			setSharing(false);
			await renegotiateAll();
			return;
		}
		try {
			const disp = await navigator.mediaDevices.getDisplayMedia({
				video: true,
				audio: true
			});
			screenStreamRef.current = disp;
			disp.getTracks().forEach((t) => {
				Object.values(peersRef.current).forEach((p) => {
					p.pc.addTrack(t, disp);
				});
			});
			disp.getVideoTracks()[0].onended = () => {
				toggleShare();
			};
			setSharing(true);
			await renegotiateAll();
		} catch {}
	};
	const toggleTranscribe = () => {
		const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SR) {
			alert("Live transcription is not supported in this browser. Try Chrome or Edge.");
			return;
		}
		if (transcribing) {
			try {
				recognitionRef.current?.stop();
			} catch {}
			recognitionRef.current = null;
			setTranscribing(false);
			setInterim("");
			return;
		}
		const rec = new SR();
		rec.continuous = true;
		rec.interimResults = true;
		rec.lang = "en-US";
		rec.onresult = (event) => {
			let interimStr = "";
			for (let i = event.resultIndex; i < event.results.length; i++) {
				const res = event.results[i];
				const text = res[0].transcript.trim();
				if (res.isFinal && text) {
					const entry = {
						t: Date.now(),
						text,
						speaker: meRef.current?.name ?? "Me"
					};
					setTranscript((prev) => [...prev, entry]);
					channelRef.current?.send({
						type: "broadcast",
						event: "transcript",
						payload: {
							...entry,
							from: meRef.current?.id
						}
					});
				} else interimStr += text + " ";
			}
			setInterim(interimStr);
		};
		rec.onerror = () => {};
		rec.onend = () => {
			if (recognitionRef.current === rec) try {
				rec.start();
			} catch {}
		};
		recognitionRef.current = rec;
		try {
			rec.start();
			setTranscribing(true);
		} catch (e) {
			alert(e.message);
		}
	};
	const sendChat = (e) => {
		e.preventDefault();
		const text = chatDraft.trim();
		if (!text || !meRef.current) return;
		const msg = {
			id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
			from: meRef.current.id,
			fromName: meRef.current.name,
			text,
			t: Date.now()
		};
		setChat((prev) => [...prev, msg]);
		channelRef.current?.send({
			type: "broadcast",
			event: "chat",
			payload: msg
		});
		setChatDraft("");
	};
	const isHost = !!meeting && !!me && !me.external && meeting.host_id === me.id;
	const handleLeaveClick = () => {
		if (isHost) setShowLeaveConfirm(true);
		else doLeave(false);
	};
	const doLeave = async (endForAll, overrideMd) => {
		setEnding(true);
		await saveMeetingNote({
			hostEnded: endForAll,
			overrideMd
		});
		if (endForAll && isHost) {
			channelRef.current?.send({
				type: "broadcast",
				event: "end-meeting",
				payload: { from: meRef.current?.id }
			});
			await supabase.from("calendar_events").delete().eq("meeting_id", id);
			await supabase.from("meetings").delete().eq("id", id);
		}
		channelRef.current?.send({
			type: "broadcast",
			event: "leave",
			payload: { from: meRef.current?.id }
		});
		cleanupAll();
		if (meRef.current?.external) navigate({ to: "/" });
		else navigate({ to: "/meetings" });
	};
	const openEndWithNotesEditor = () => {
		const { md } = buildAutoNotes({ hostEnded: true });
		setNotesDraft(md);
		setShowLeaveConfirm(false);
	};
	const copyLink = async () => {
		const url = new URL(window.location.href);
		url.search = "";
		const host = url.hostname.toLowerCase();
		if (!(host === "hq.clovrlab.com" || host === "clovrlab.com" || host === "www.clovrlab.com")) {
			url.protocol = "https:";
			url.hostname = "hq.clovrlab.com";
			url.port = "";
		}
		await navigator.clipboard.writeText(url.toString());
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};
	const tiles = [];
	if (localStreamRef.current) tiles.push({
		key: "me-cam",
		label: `${me?.name ?? "You"} (you)`,
		stream: localStreamRef.current,
		muted: true,
		isMe: true,
		isScreen: false
	});
	if (screenStreamRef.current) tiles.push({
		key: "me-screen",
		label: `${me?.name ?? "You"} · screen`,
		stream: screenStreamRef.current,
		muted: true,
		isMe: true,
		isScreen: true
	});
	Object.entries(peers).forEach(([uid, p]) => {
		const streams = Object.values(p.streams);
		if (streams.length === 0) tiles.push({
			key: uid,
			label: p.name,
			stream: null,
			muted: false,
			isMe: false,
			isScreen: false
		});
		else streams.forEach((s, i) => {
			const isScreen = streams.length > 1 && i > 0;
			tiles.push({
				key: `${uid}-${s.id}`,
				label: isScreen ? `${p.name} · screen` : p.name,
				stream: s,
				muted: false,
				isMe: false,
				isScreen
			});
		});
	});
	const gridCols = tiles.length >= 4 ? "grid-cols-2 lg:grid-cols-3" : tiles.length >= 2 ? "grid-cols-2" : "grid-cols-1";
	if (guestNamePrompt) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-dvh items-center justify-center bg-background p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				const fd = new FormData(e.currentTarget);
				const name = String(fd.get("name") ?? "").trim();
				if (!name) return;
				window.sessionStorage.setItem(`meeting-guest-${id}`, name);
				setGuestNamePrompt(null);
			},
			className: "w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-semibold",
					children: "Join the meeting"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: guestNamePrompt.email ? `Signed in as guest: ${guestNamePrompt.email}` : "Enter your name to join."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": "Your name",
					name: "name",
					required: true,
					autoFocus: true,
					placeholder: "Your name",
					className: "mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "mt-3 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
					children: "Continue"
				})
			]
		})
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-6 py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-lg font-semibold",
			children: error
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground",
			children: "Home"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border px-4 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "truncate text-sm font-semibold",
						children: meeting?.title ?? "Meeting"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted-foreground flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }),
							" ",
							Object.keys(peers).length + 1,
							" in room · ",
							me?.name,
							me?.external ? " (guest)" : ""
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: copyLink,
						className: "flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted",
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), " Invite link"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-0 flex-1 flex-col p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `grid flex-1 gap-3 ${gridCols}`,
						children: tiles.slice().sort((a, b) => {
							const as = speakingKeys[a.key] ? 1 : 0;
							return (speakingKeys[b.key] ? 1 : 0) - as;
						}).map((tile) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
							label: tile.label,
							stream: tile.stream,
							muted: tile.muted,
							showAvatar: tile.isMe && !camOn && !tile.isScreen,
							avatarLetter: me?.name?.[0]?.toUpperCase() ?? "?",
							speaking: !!speakingKeys[tile.key],
							onEnlarge: tile.stream ? () => setEnlarged({
								stream: tile.stream,
								label: tile.label
							}) : void 0,
							videoRef: tile.key === "me-cam" ? localVideoRef : void 0
						}, tile.key))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center justify-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlBtn, {
								active: micOn,
								onClick: toggleMic,
								label: micOn ? "Mute" : "Unmute",
								icon: micOn ? Mic : MicOff,
								danger: !micOn
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlBtn, {
								active: camOn,
								onClick: toggleCam,
								label: camOn ? "Stop video" : "Start video",
								icon: camOn ? Video : VideoOff,
								danger: !camOn
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlBtn, {
								active: sharing,
								onClick: toggleShare,
								label: sharing ? "Stop share" : "Share screen",
								icon: sharing ? ScreenShareOff : ScreenShare
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlBtn, {
								active: transcribing,
								onClick: toggleTranscribe,
								label: transcribing ? "Stop transcribing" : "Live transcribe",
								icon: FileText
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlBtn, {
								active: sidePanel === "chat",
								onClick: () => setSidePanel(sidePanel === "chat" ? null : "chat"),
								label: "Chat",
								icon: MessageSquare
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleLeaveClick,
								className: "ml-2 flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "h-4 w-4" }), " Leave"]
							})
						]
					})]
				}), sidePanel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "hidden w-80 flex-col border-l border-border md:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border px-4 py-3 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSidePanel("chat"),
								className: sidePanel === "chat" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
								children: "Chat"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSidePanel("transcript"),
								className: sidePanel === "transcript" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
								children: "Transcript"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSidePanel(null),
							className: "text-muted-foreground hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}), sidePanel === "chat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 overflow-y-auto px-4 py-3 text-sm space-y-3",
						children: [
							chat.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Send messages, links, or notes to everyone in the meeting."
							}),
							chat.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [
									m.fromName,
									" · ",
									new Date(m.t).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "whitespace-pre-wrap break-words",
								children: linkify(m.text)
							})] }, m.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: chatEndRef })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: sendChat,
						className: "flex items-center gap-2 border-t border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: chatDraft,
							onChange: (e) => setChatDraft(e.target.value),
							placeholder: "Message everyone",
							className: "flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": "Send message",
							type: "submit",
							className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
						})]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 overflow-y-auto px-4 py-3 text-sm",
						children: [
							transcript.length === 0 && !interim && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: transcribing ? "Listening…" : "Click Live transcribe to capture your mic. A meeting note is auto-created when you leave."
							}),
							transcript.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										t.speaker,
										" · ",
										new Date(t.t).toLocaleTimeString()
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t.text })]
							}, i)),
							interim && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "italic text-muted-foreground",
								children: interim
							})
						]
					})]
				})]
			}),
			enlarged && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6",
				onClick: () => setEnlarged(null),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: (e) => {
							e.stopPropagation();
							setEnlarged(null);
						},
						className: "absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80",
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-6 top-6 rounded bg-black/60 px-3 py-1 text-sm text-white",
						children: enlarged.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlargedVideo, { stream: enlarged.stream })
				]
			}),
			showLeaveConfirm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4",
				onClick: () => !ending && setShowLeaveConfirm(false),
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "Leave meeting",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: () => !ending && setShowLeaveConfirm(false) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "dialog",
					"aria-modal": "true",
					className: "w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-semibold",
							children: "Leaving as host"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "You're the host of this meeting. End it for everyone (you'll review and edit the meeting notes before saving), or just leave and let the meeting continue."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-col gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: ending,
									onClick: openEndWithNotesEditor,
									className: "rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground disabled:opacity-50",
									children: "Review notes & end for everyone"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: ending,
									onClick: () => doLeave(false),
									className: "rounded-lg border border-border bg-background px-4 py-2 text-sm",
									children: "Just leave (others stay)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: ending,
									onClick: () => setShowLeaveConfirm(false),
									className: "rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted",
									children: "Cancel"
								})
							]
						})
					]
				})]
			}),
			notesDraft !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4",
				onClick: () => !ending && setNotesDraft(null),
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "Meeting notes",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: () => !ending && setNotesDraft(null) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "dialog",
					"aria-modal": "true",
					className: "flex w-full max-w-2xl flex-col rounded-xl border border-border bg-card shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					style: { maxHeight: "85vh" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between border-b border-border p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-semibold",
								children: "Meeting notes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Edit before saving. These notes will be visible to everyone with access to the meeting."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: ending,
								onClick: () => setNotesDraft(null),
								className: "rounded p-1 hover:bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: notesDraft,
							onChange: (e) => setNotesDraft(e.target.value),
							rows: 20,
							className: "flex-1 resize-none border-0 bg-background px-5 py-4 font-mono text-xs leading-relaxed outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 border-t border-border p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: ending,
								onClick: () => setNotesDraft(buildAutoNotes({ hostEnded: true }).md),
								className: "rounded-lg border border-border px-3 py-2 text-xs hover:bg-muted",
								children: "Reset to auto"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: ending,
									onClick: () => setNotesDraft(null),
									className: "rounded-lg border border-border px-4 py-2 text-sm",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: ending,
									onClick: () => doLeave(true, notesDraft),
									className: "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50",
									children: ending ? "Ending…" : "Save notes & end meeting"
								})]
							})]
						})
					]
				})]
			})
		]
	});
}
function Tile({ label, stream, muted, showAvatar, avatarLetter, onEnlarge, videoRef, speaking }) {
	const localRef = (0, import_react.useRef)(null);
	const ref = videoRef ?? localRef;
	(0, import_react.useEffect)(() => {
		if (ref.current && stream && ref.current.srcObject !== stream) ref.current.srcObject = stream;
	}, [stream, ref]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `group relative overflow-hidden rounded-xl bg-black transition-all duration-150 ${onEnlarge ? "cursor-zoom-in" : ""} ${speaking ? "ring-4 ring-primary shadow-[0_0_24px_hsl(var(--primary)/0.6)] scale-[1.01]" : "ring-1 ring-transparent"}`,
		onClick: onEnlarge,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref,
				autoPlay: true,
				muted,
				playsInline: true,
				className: "h-full w-full object-cover"
			}),
			showAvatar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center bg-black text-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-2xl font-semibold",
					children: avatarLetter
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `absolute bottom-2 left-2 rounded px-2 py-0.5 text-xs text-white transition ${speaking ? "bg-primary font-semibold" : "bg-black/60"}`,
				children: [speaking && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mr-1 inline-block h-2 w-2 rounded-full bg-white animate-pulse" }), label]
			}),
			onEnlarge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute right-2 top-2 hidden rounded bg-black/60 p-1.5 text-white group-hover:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-3.5 w-3.5" })
			})
		]
	});
}
function EnlargedVideo({ stream }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (ref.current) ref.current.srcObject = stream;
	}, [stream]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
		ref,
		autoPlay: true,
		playsInline: true,
		className: "max-h-full max-w-full rounded-xl object-contain",
		onClick: (e) => e.stopPropagation()
	});
}
function ControlBtn({ active, onClick, label, icon: Icon, danger }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		title: label,
		className: `flex h-11 w-11 items-center justify-center rounded-full transition ${danger ? "bg-destructive text-destructive-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
	});
}
function linkify(text) {
	return text.split(/(https?:\/\/[^\s]+)/g).map((p, i) => /^https?:\/\//.test(p) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: p,
		target: "_blank",
		rel: "noreferrer",
		className: "text-primary underline break-all",
		children: p
	}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p }, i));
}
//#endregion
export { MeetingRoom as component };
