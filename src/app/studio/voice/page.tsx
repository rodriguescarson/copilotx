"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useCopilotChat } from "@copilotkit/react-core";
import { TextMessage, MessageRole } from "@copilotkit/runtime-client-gql";
import { useRouter } from "next/navigation";
import { useGym } from "@/context/GymContext";
import type { CalorieMode, DietPreference } from "@/types/gym";
import { MicButton, type MicState } from "@/components/studio/voice/MicButton";
import { Waveform } from "@/components/studio/voice/Waveform";
import { TranscriptPanel } from "@/components/studio/voice/TranscriptPanel";
import {
  ProfileCard,
  type VoiceProfile,
} from "@/components/studio/voice/ProfileCard";
import { VoiceActions } from "@/components/studio/voice/VoiceActions";
import { VoiceController, detectSpeechSupport } from "@/lib/voice";

const EMPTY_PROFILE: VoiceProfile = {
  goal: null,
  schedule: null,
  dietPref: null,
  sleepHours: null,
};

const COPILOT_INSTRUCTIONS = `You are a hands-free fitness onboarding assistant.
The user is speaking; you receive their voice transcript as the user message.
Your ONLY job: extract these four fields from the transcript and call the matching action for each one as soon as you have a confident value:
- voice_setGoal(goal: short phrase, e.g. "fat loss", "muscle gain", "endurance")
- voice_setSchedule(schedule: short phrase, e.g. "3x/week, 45 min", "Mon/Wed/Fri evenings")
- voice_setDietPref(dietPref: vegetarian | vegan | non-vegetarian | pescatarian | no preference)
- voice_setSleepHours(hours: integer 3-12)

Rules:
- Call actions IMMEDIATELY when you can infer the value, even if other fields are still missing.
- Never ask the user a follow-up question. They cannot type. Just extract and call.
- It is fine to leave fields un-set if they were not mentioned.
- Do not produce a long text reply. A one-sentence acknowledgement is plenty.`;

const DAY_ALIASES: Record<string, string> = {
  mon: "Monday", monday: "Monday",
  tue: "Tuesday", tues: "Tuesday", tuesday: "Tuesday",
  wed: "Wednesday", wednesday: "Wednesday",
  thu: "Thursday", thur: "Thursday", thurs: "Thursday", thursday: "Thursday",
  fri: "Friday", friday: "Friday",
  sat: "Saturday", saturday: "Saturday",
  sun: "Sunday", sunday: "Sunday",
};

function parseSchedule(s: string): Record<string, number> {
  const lower = s.toLowerCase();
  const minMatch = lower.match(/(\d+)\s*(min|minute|mins|minutes|m\b)/);
  const minutes = minMatch ? parseInt(minMatch[1], 10) : 45;
  const seen = new Set<string>();
  const out: Record<string, number> = {};
  for (const [alias, day] of Object.entries(DAY_ALIASES)) {
    if (seen.has(day)) continue;
    if (new RegExp(`\\b${alias}\\b`).test(lower)) {
      out[day] = minutes;
      seen.add(day);
    }
  }
  return out;
}

function mapDietPref(s: string): DietPreference {
  const lower = s.toLowerCase().trim();
  if (lower === "vegan") return "vegan";
  if (lower.includes("non") || lower.includes("meat") || lower.includes("chicken") || lower.includes("fish") || lower.includes("pescat")) return "non_vegetarian";
  if (lower.includes("vegetarian") || lower.includes("veggie") || lower === "veg") return "vegetarian";
  return s;
}

function inferCalorieMode(goal: string): CalorieMode {
  const g = goal.toLowerCase();
  if (g.includes("muscle") || g.includes("gain") || g.includes("bulk") || g.includes("mass")) return "surplus";
  if (g.includes("fat") || g.includes("loss") || g.includes("cut") || g.includes("lean")) return "deficit";
  return "maintenance";
}

const DEMO_TRANSCRIPT_CHUNKS = [
  "Hey, I'm trying to build muscle this year. ",
  "I can train Monday, Wednesday, and Friday for about 45 minutes. ",
  "I eat vegetarian. ",
  "And I usually sleep around 7 hours a night.",
];

// Stable subscribe (support never changes within a session).
const subscribeNoop = () => () => {};
const getSupportClient = () => detectSpeechSupport().supported;
const getSupportServer = () => true;

export default function VoicePage() {
  const router = useRouter();
  const { setGoal, setSchedule, setDietPref, setSleepHours, setCalorieMode } = useGym();
  const [applied, setApplied] = useState(false);
  const supportSupported = useSyncExternalStore(
    subscribeNoop,
    getSupportClient,
    getSupportServer,
  );
  const [micState, setMicState] = useState<MicState>("idle");
  const [interim, setInterim] = useState("");
  const [finalText, setFinalText] = useState("");
  const [profile, setProfileState] = useState<VoiceProfile>(EMPTY_PROFILE);
  const [error, setError] = useState<string | null>(null);
  const [startTs, setStartTs] = useState<number | null>(null);
  const [completedAt, setCompletedAt] = useState<number | null>(null);

  const controllerRef = useRef<VoiceController | null>(null);
  const sentChunksRef = useRef<Set<string>>(new Set());

  // Keep this stable so children don't re-create animation loops needlessly.
  const getLevel = useCallback(() => controllerRef.current?.getLevel() ?? 0, []);

  // Initialise the controller once on the client, inside an effect (refs are
  // for imperative side-effects only, not derived render values).
  useEffect(() => {
    if (controllerRef.current == null) {
      controllerRef.current = new VoiceController();
    }
    return () => {
      controllerRef.current?.stop();
    };
  }, []);

  /** setProfile wrapper: latches the completion timestamp the first time
   *  all four fields are non-null. Done at update time (event handler), not
   *  during render. */
  const setProfile = useCallback(
    (updater: (prev: VoiceProfile) => VoiceProfile) => {
      setProfileState((prev) => {
        const next = updater(prev);
        const wasFull =
          prev.goal != null &&
          prev.schedule != null &&
          prev.dietPref != null &&
          prev.sleepHours != null;
        const nowFull =
          next.goal != null &&
          next.schedule != null &&
          next.dietPref != null &&
          next.sleepHours != null;
        if (!wasFull && nowFull) {
          setCompletedAt(Date.now());
        }
        return next;
      });
    },
    [],
  );

  // Hidden chat driver: programmatically appends user messages built from transcripts.
  const { appendMessage, isLoading } = useCopilotChat({
    id: "voice-onboarding",
    makeSystemMessage: () => COPILOT_INSTRUCTIONS,
  });

  // When chat is "thinking" derive a processing state for the mic indicator.
  const effectiveMicState: MicState =
    isLoading && micState !== "listening" ? "processing" : micState;

  const filledCount =
    Number(profile.goal != null) +
    Number(profile.schedule != null) +
    Number(profile.dietPref != null) +
    Number(profile.sleepHours != null);
  const filledAll = filledCount === 4;
  const elapsedMs =
    filledAll && completedAt != null && startTs != null
      ? completedAt - startTs
      : null;

  const sendToCopilot = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sentChunksRef.current.has(trimmed)) return;
      sentChunksRef.current.add(trimmed);
      try {
        await appendMessage(
          new TextMessage({ role: MessageRole.User, content: trimmed }),
        );
      } catch (err) {
        console.error("appendMessage failed:", err);
      }
    },
    [appendMessage],
  );

  const handleStart = useCallback(async () => {
    if (!controllerRef.current) return;
    setError(null);
    setProfileState(EMPTY_PROFILE);
    setInterim("");
    setFinalText("");
    setCompletedAt(null);
    sentChunksRef.current.clear();
    controllerRef.current.reset();
    setStartTs(Date.now());
    setMicState("listening");
    await controllerRef.current.start({
      onTranscript: (i, f) => {
        setInterim(i);
        setFinalText(f);
      },
      onFinal: (chunk, full) => {
        setFinalText(full);
        // Send each finalized utterance to CopilotKit; the model decides which actions to call.
        void sendToCopilot(chunk);
      },
      onError: (err) => {
        setError(err);
        setMicState("idle");
      },
      onEnd: () => {
        setMicState((prev) => (prev === "processing" ? prev : "idle"));
      },
    });
  }, [sendToCopilot]);

  const handleStop = useCallback(() => {
    controllerRef.current?.stop();
    setInterim("");
    setMicState((prev) => (prev === "processing" ? prev : "idle"));
  }, []);

  const handleToggle = useCallback(() => {
    if (micState === "listening") handleStop();
    else handleStart();
  }, [micState, handleStart, handleStop]);

  const applyToGymPlan = useCallback(
    (navigate: boolean) => {
      if (profile.goal) {
        setGoal(profile.goal);
        setCalorieMode(inferCalorieMode(profile.goal));
      }
      if (profile.schedule) {
        const parsed = parseSchedule(profile.schedule);
        if (Object.keys(parsed).length > 0) setSchedule(parsed);
      }
      if (profile.dietPref) setDietPref(mapDietPref(profile.dietPref));
      if (profile.sleepHours != null) setSleepHours(profile.sleepHours);
      setApplied(true);
      if (navigate) router.push("/");
    },
    [profile, setGoal, setSchedule, setDietPref, setSleepHours, setCalorieMode, router],
  );

  // Demo mode: progressively reveal a fake transcript so screenshot mode works
  // even without mic permission.
  const runDemo = useCallback(async () => {
    setError(null);
    setProfileState(EMPTY_PROFILE);
    setInterim("");
    setFinalText("");
    setCompletedAt(null);
    sentChunksRef.current.clear();
    setStartTs(Date.now());
    setMicState("listening");
    let acc = "";
    for (const chunk of DEMO_TRANSCRIPT_CHUNKS) {
      // "interim" reveal
      const tokens = chunk.split(" ");
      for (let i = 0; i < tokens.length; i++) {
        await new Promise((r) => setTimeout(r, 70));
        const partial = tokens.slice(0, i + 1).join(" ");
        setInterim(partial);
      }
      acc = (acc + " " + chunk).trim();
      setFinalText(acc);
      setInterim("");
      void sendToCopilot(chunk);
      await new Promise((r) => setTimeout(r, 350));
    }
    setMicState("idle");
  }, [sendToCopilot]);

  const statusLabel = (() => {
    if (error) return error;
    if (effectiveMicState === "processing") return "Reasoning over your transcript…";
    if (effectiveMicState === "listening") return "Listening — speak naturally.";
    if (filledAll) return "Profile complete.";
    if (filledCount > 0) return "Tap the mic to keep going.";
    return "Tap the mic to begin.";
  })();

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Cinematic background gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(34,211,238,0.18),transparent_60%),radial-gradient(60%_50%_at_85%_30%,rgba(168,85,247,0.18),transparent_60%),radial-gradient(70%_60%_at_15%_85%,rgba(34,211,238,0.10),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:60px_60px] [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent_75%)]"
      />

      {/* Hidden actions registration */}
      <VoiceActions
        profile={profile}
        setProfile={setProfile}
        transcript={finalText || interim}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10 lg:py-14">
        <header className="flex items-baseline justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              CopilotKit Studio · Unit 11
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Voice-driven onboarding
            </h1>
            <p className="mt-1 max-w-xl text-sm text-zinc-400">
              Talk for ten seconds. CopilotKit listens, reasons, and assembles
              your fitness profile hands-free.
            </p>
          </div>
        </header>

        {!supportSupported ? (
          <UnsupportedFallback onDemo={runDemo} />
        ) : (
          <main className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            <section className="flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-zinc-900/30 p-8 backdrop-blur">
              <div className="flex h-44 w-full items-center justify-center">
                <MicButton
                  state={effectiveMicState}
                  getLevel={getLevel}
                  onClick={handleToggle}
                  ariaLabel={
                    effectiveMicState === "listening"
                      ? "Stop listening"
                      : "Start listening"
                  }
                />
              </div>
              <Waveform
                getLevel={getLevel}
                active={effectiveMicState === "listening"}
              />
              <p
                className={[
                  "text-center text-sm transition-colors",
                  error ? "text-rose-300" : "text-zinc-400",
                ].join(" ")}
                aria-live="polite"
              >
                {statusLabel}
              </p>
              <div className="w-full">
                <TranscriptPanel finalText={finalText} interimText={interim} />
              </div>
              <button
                type="button"
                onClick={runDemo}
                className="text-xs text-zinc-500 hover:text-zinc-300 underline-offset-4 hover:underline"
              >
                Run demo transcript
              </button>
            </section>

            <div className="flex flex-col gap-4">
              <ProfileCard profile={profile} elapsedMs={elapsedMs} />
              {filledAll && (
                <div className="flex flex-col gap-2 rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/[0.08] via-purple-500/[0.06] to-transparent p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">
                    Profile ready
                  </p>
                  <p className="text-sm text-zinc-300">
                    Send these values to your gym plan and start training.
                  </p>
                  <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => applyToGymPlan(true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200"
                    >
                      Apply to my gym plan
                      <span aria-hidden>→</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => applyToGymPlan(false)}
                      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.08]"
                    >
                      Save without leaving
                    </button>
                  </div>
                  {applied && (
                    <p className="text-xs text-emerald-300/90" role="status">
                      Saved. Open the home tab to see your workout, diet, and sleep tabs.
                    </p>
                  )}
                </div>
              )}
            </div>
          </main>
        )}

        <footer className="text-xs text-zinc-600">
          Uses the browser&apos;s built-in Web Speech API. Best in Chrome or Edge.
        </footer>
      </div>

      <style jsx global>{`
        @keyframes voice-pulse-slow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .voice-pulse-slow {
          animation: voice-pulse-slow 1.6s ease-in-out infinite;
          will-change: opacity, transform;
        }
        @keyframes voice-ring-pulse {
          0% { transform: scale(1); opacity: 0.7; }
          70% { transform: scale(1.18); opacity: 0; }
          100% { transform: scale(1.18); opacity: 0; }
        }
        .voice-ring-pulse {
          animation: voice-ring-pulse 1.8s ease-out infinite;
        }
        .voice-ring-pulse-delayed {
          animation: voice-ring-pulse 1.8s ease-out infinite;
          animation-delay: 0.6s;
        }
        @keyframes voice-field-pop {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .voice-field-pop {
          animation: voice-field-pop 280ms cubic-bezier(0.2, 0.7, 0.1, 1) both;
        }
      `}</style>
    </div>
  );
}

function UnsupportedFallback({ onDemo }: { onDemo: () => void }) {
  return (
    <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-white/10 bg-zinc-900/40 p-8 text-center backdrop-blur">
      <h2 className="text-lg font-semibold text-zinc-100">
        Voice onboarding requires Chrome or Edge.
      </h2>
      <p className="mt-2 text-sm text-zinc-400">
        Open this page in a supported browser to try the live demo. Or run the
        scripted transcript below to see the flow.
      </p>
      <button
        type="button"
        onClick={onDemo}
        className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/[0.08] px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/[0.14]"
      >
        Run demo transcript
      </button>
    </div>
  );
}
