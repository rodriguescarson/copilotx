import type { GymState } from "@/types/gym";

const SCHEMA_VERSION = 1;
export const STORAGE_KEY = "copilotx-gym-state-v1";

interface StoredPayload {
  version: number;
  state: GymState;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadGymState(): GymState | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredPayload>;
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.version !== SCHEMA_VERSION) return null;
    if (!parsed.state || typeof parsed.state !== "object") return null;
    return parsed.state as GymState;
  } catch {
    return null;
  }
}

export function saveGymState(state: GymState): void {
  if (!isBrowser()) return;
  try {
    const payload: StoredPayload = { version: SCHEMA_VERSION, state };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Persistence is best-effort; ignore quota / serialization errors.
  }
}

export function clearGymState(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
