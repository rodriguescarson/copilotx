"use client";

import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { GymProvider } from "@/context/GymContext";
import { GymBuddyActions } from "./GymBuddyActions";

export function Providers({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_COPILOT_PUBLIC_API_KEY;
  if (!apiKey) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-red-600 dark:text-red-400">
          Missing NEXT_PUBLIC_COPILOT_PUBLIC_API_KEY in .env.local
        </p>
      </div>
    );
  }

  return (
    <CopilotKit publicApiKey={apiKey}>
      <GymProvider>
        <GymBuddyActions />
        {children}
      </GymProvider>
    </CopilotKit>
  );
}
