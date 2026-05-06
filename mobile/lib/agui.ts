// AG-UI runtime helpers.
//
// CopilotKit speaks the wire-only AG-UI protocol; @ag-ui/client's HttpAgent
// posts an SSE stream to a configurable URL. The web app uses CopilotKit
// Cloud (a GraphQL runtime), so this mobile app needs a separate AG-UI agent
// endpoint — see mobile/README.md for setup.
//
// Two env vars wire it up:
//   EXPO_PUBLIC_AGUI_URL     — required, full URL of an AG-UI agent
//   EXPO_PUBLIC_AGUI_API_KEY — optional, sent as `x-api-key` header

import "react-native-get-random-values"; // crypto.randomUUID() shim for RN
import { HttpAgent } from "@ag-ui/client";

export type AguiConfig = {
  url: string;
  apiKey?: string;
};

export function readAguiConfig(): AguiConfig | null {
  const url = process.env.EXPO_PUBLIC_AGUI_URL;
  if (!url) return null;
  const apiKey = process.env.EXPO_PUBLIC_AGUI_API_KEY;
  return { url, ...(apiKey ? { apiKey } : {}) };
}

export function buildAgent(config: AguiConfig): HttpAgent {
  const headers: Record<string, string> = {
    Accept: "text/event-stream",
    "Content-Type": "application/json",
  };
  if (config.apiKey) {
    headers["x-api-key"] = config.apiKey;
    headers["Authorization"] = `Bearer ${config.apiKey}`;
  }
  return new HttpAgent({
    url: config.url,
    headers,
  });
}
