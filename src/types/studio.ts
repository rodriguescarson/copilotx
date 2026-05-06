// Studio-wide types for the CopilotKit Studio surfaces.
// Owned by Unit 10 (/studio/actions). Other studio units may extend this file.

export type ActionParamType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "object[]"
  | "string[]"
  | "number[]";

export interface GeneratedActionParam {
  name: string;
  type: ActionParamType;
  description: string;
  required?: boolean;
}

/**
 * The descriptor produced by the Director — a structured representation of the
 * useCopilotAction the AI suggested. We store this in state so the Sandbox can
 * render a typed mock invocation form without ever eval'ing AI-generated code.
 */
export interface GeneratedActionSpec {
  name: string;
  description: string;
  parameters: GeneratedActionParam[];
  /** A short, human-readable summary of what the handler does. */
  handlerSummary: string;
  /** The full TypeScript snippet (useCopilotAction call) shown in the center pane. */
  code: string;
  /** Set when the spec was created. */
  createdAt: number;
}

export interface SandboxInvocation {
  id: string;
  prompt: string;
  args: Record<string, unknown>;
  response: string;
  timestamp: number;
}
