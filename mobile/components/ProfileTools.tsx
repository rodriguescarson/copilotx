// Registers the same four extraction tools the web /studio/voice route does
// (voice_setGoal / voice_setSchedule / voice_setDietPref / voice_setSleepHours)
// so any AG-UI agent that follows the same instructions can drive the
// mobile profile cards. Lives at the top of the chat tree so the registration
// is active whenever the assistant runtime is mounted.

import {
  useAssistantTool,
  useAssistantInstructions,
} from "@assistant-ui/react-native";
import { profileStore } from "@/lib/profileStore";

const SYSTEM_INSTRUCTIONS = `You are a fitness onboarding assistant.
Your job: extract these four fields from the user's chat messages and call the matching tool for each one as soon as you have a confident value:
- voice_setGoal(goal: short phrase, e.g. "fat loss", "muscle gain", "endurance")
- voice_setSchedule(schedule: short phrase, e.g. "3x/week, 45 min", "Mon/Wed/Fri evenings")
- voice_setDietPref(dietPref: vegetarian | vegan | non-vegetarian | pescatarian | no preference)
- voice_setSleepHours(hours: integer 3-12)

Rules:
- Call tools IMMEDIATELY when you can infer the value.
- Don't ask follow-up questions for fields the user already answered.
- It's fine to leave fields un-set if they were not mentioned.
- A one-sentence acknowledgement is plenty after each tool call.`;

export function ProfileTools() {
  useAssistantInstructions(SYSTEM_INSTRUCTIONS);

  useAssistantTool({
    toolName: "voice_setGoal",
    description:
      "Record the user's primary fitness goal (e.g. 'fat loss', 'muscle gain', 'endurance', 'general fitness').",
    parameters: {
      type: "object",
      properties: {
        goal: {
          type: "string",
          description: "Concise goal phrase, 1-4 words.",
        },
      },
      required: ["goal"],
    },
    execute: async ({ goal }: { goal: string }) => {
      profileStore.setGoal(goal);
      return `goal: ${goal.trim()}`;
    },
  });

  useAssistantTool({
    toolName: "voice_setSchedule",
    description:
      "Record the user's weekly training schedule. Short phrase like '3x/week, 45 min' or 'Mon/Wed/Fri evenings'.",
    parameters: {
      type: "object",
      properties: {
        schedule: {
          type: "string",
          description: "Concise schedule phrase.",
        },
      },
      required: ["schedule"],
    },
    execute: async ({ schedule }: { schedule: string }) => {
      profileStore.setSchedule(schedule);
      return `schedule: ${schedule.trim()}`;
    },
  });

  useAssistantTool({
    toolName: "voice_setDietPref",
    description:
      "Record the user's diet preference. One of: vegetarian, vegan, non-vegetarian, pescatarian, no preference.",
    parameters: {
      type: "object",
      properties: {
        dietPref: {
          type: "string",
          description: "Diet preference phrase.",
        },
      },
      required: ["dietPref"],
    },
    execute: async ({ dietPref }: { dietPref: string }) => {
      profileStore.setDietPref(dietPref);
      return `diet: ${dietPref.trim()}`;
    },
  });

  useAssistantTool({
    toolName: "voice_setSleepHours",
    description:
      "Record how many hours the user typically sleeps per night. Whole number between 3 and 12.",
    parameters: {
      type: "object",
      properties: {
        hours: {
          type: "number",
          description: "Hours of sleep per night.",
        },
      },
      required: ["hours"],
    },
    execute: async ({ hours }: { hours: number }) => {
      profileStore.setSleepHours(hours);
      return `sleep: ${Math.round(hours)}h`;
    },
  });

  return null;
}
