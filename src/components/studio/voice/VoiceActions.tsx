"use client";

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import type { VoiceProfile } from "./ProfileCard";

type Props = {
  profile: VoiceProfile;
  setProfile: (updater: (prev: VoiceProfile) => VoiceProfile) => void;
  transcript: string;
};

/**
 * Registers the four voice-driven profile actions on the (already-mounted) CopilotKit
 * provider, plus a readable that exposes the live transcript for the model to reason over.
 *
 * Each action returns a small "set X to Y" badge as its render output so the chat log
 * (when inspected) shows the decisions.
 */
export function VoiceActions({ profile, setProfile, transcript }: Props) {
  useCopilotReadable({
    description:
      "Live voice transcript captured from the user during onboarding. Updated as they speak.",
    value: transcript || "(no transcript yet)",
  });

  useCopilotReadable({
    description: "Current voice-onboarding profile state (null fields not yet captured).",
    value: profile,
  });

  useCopilotAction({
    name: "voice_setGoal",
    description:
      "Record the user's primary fitness goal extracted from the voice transcript (e.g. 'fat loss', 'muscle gain', 'endurance', 'general fitness').",
    parameters: [
      {
        name: "goal",
        type: "string",
        description: "Concise goal phrase, 1-4 words.",
        required: true,
      },
    ],
    handler: async ({ goal }) => {
      if (!goal || typeof goal !== "string") return "no goal";
      setProfile((p) => ({ ...p, goal: goal.trim() }));
      return `goal: ${goal.trim()}`;
    },
    render: ({ args }) => <ActionBadge label="goal" value={args?.goal} />,
  });

  useCopilotAction({
    name: "voice_setSchedule",
    description:
      "Record the user's weekly training schedule extracted from the transcript. Use a short phrase like '3x/week, 45 min' or 'Mon/Wed/Fri evenings'.",
    parameters: [
      {
        name: "schedule",
        type: "string",
        description: "Concise schedule phrase.",
        required: true,
      },
    ],
    handler: async ({ schedule }) => {
      if (!schedule || typeof schedule !== "string") return "no schedule";
      setProfile((p) => ({ ...p, schedule: schedule.trim() }));
      return `schedule: ${schedule.trim()}`;
    },
    render: ({ args }) => <ActionBadge label="schedule" value={args?.schedule} />,
  });

  useCopilotAction({
    name: "voice_setDietPref",
    description:
      "Record the user's diet preference extracted from the transcript. One of: vegetarian, vegan, non-vegetarian, pescatarian, no preference. Use the exact word the user said when possible.",
    parameters: [
      {
        name: "dietPref",
        type: "string",
        description: "Diet preference phrase.",
        required: true,
      },
    ],
    handler: async ({ dietPref }) => {
      if (!dietPref || typeof dietPref !== "string") return "no diet";
      setProfile((p) => ({ ...p, dietPref: dietPref.trim() }));
      return `diet: ${dietPref.trim()}`;
    },
    render: ({ args }) => <ActionBadge label="diet" value={args?.dietPref} />,
  });

  useCopilotAction({
    name: "voice_setSleepHours",
    description:
      "Record how many hours the user typically sleeps per night, extracted from the transcript. Whole number between 3 and 12.",
    parameters: [
      {
        name: "hours",
        type: "number",
        description: "Hours of sleep per night.",
        required: true,
      },
    ],
    handler: async ({ hours }) => {
      const n = typeof hours === "number" ? Math.round(hours) : NaN;
      if (!Number.isFinite(n)) return "no sleep hours";
      const clamped = Math.max(3, Math.min(12, n));
      setProfile((p) => ({ ...p, sleepHours: clamped }));
      return `sleep: ${clamped}h`;
    },
    render: ({ args }) => (
      <ActionBadge label="sleep" value={args?.hours ? `${args.hours}h` : undefined} />
    ),
  });

  return null;
}

function ActionBadge({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/[0.08] px-2.5 py-0.5 text-xs text-cyan-100">
      <span className="text-cyan-300/70 uppercase tracking-wider">{label}</span>
      <span>{value ?? "…"}</span>
    </span>
  );
}
