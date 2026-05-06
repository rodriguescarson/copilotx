import { View, Text, StyleSheet } from "react-native";
import {
  ThreadPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
} from "@assistant-ui/react-native";
import { colors, radius, spacing, typography } from "@/lib/theme";

const SUGGESTIONS = [
  "I want to lose fat training 4x a week.",
  "Build muscle, Mon/Wed/Fri 45 min, vegetarian, sleep 7.",
  "Endurance focus, eat pescatarian, 6 hours of sleep.",
];

export function ChatThread() {
  return (
    <ThreadPrimitive.Root style={styles.threadRoot}>
      <ThreadPrimitive.Messages
        style={styles.list}
        contentContainerStyle={styles.listContent}
        components={{
          UserMessage,
          AssistantMessage,
        }}
        ListEmptyComponent={EmptyState}
      />
      <Composer />
    </ThreadPrimitive.Root>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEyebrow}>CopilotKit · AG-UI · Mobile</Text>
      <Text style={styles.emptyTitle}>
        Tell me your training goal in one message.
      </Text>
      <Text style={styles.emptyBody}>
        I&apos;ll extract goal, schedule, diet, and sleep into your profile as
        we chat.
      </Text>
      <View style={styles.suggestions}>
        {SUGGESTIONS.map((s, i) => (
          <ThreadPrimitive.Suggestion
            key={i}
            prompt={s}
            send
            style={styles.suggestion}
          >
            <Text style={styles.suggestionText}>{s}</Text>
          </ThreadPrimitive.Suggestion>
        ))}
      </View>
    </View>
  );
}

function UserMessage() {
  return (
    <MessagePrimitive.Root style={[styles.row, styles.rowUser]}>
      <View style={[styles.bubble, styles.bubbleUser]}>
        <MessagePrimitive.Content
          renderText={({ part, index }) => (
            <Text key={index} style={styles.bubbleTextUser}>
              {part.text}
            </Text>
          )}
        />
      </View>
    </MessagePrimitive.Root>
  );
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root style={[styles.row, styles.rowAssistant]}>
      <View style={[styles.bubble, styles.bubbleAssistant]}>
        <MessagePrimitive.Content
          renderText={({ part, index }) => (
            <Text key={index} style={styles.bubbleTextAssistant}>
              {part.text}
            </Text>
          )}
          renderToolCall={({ part, index }) => (
            <View key={index} style={styles.toolBadge}>
              <Text style={styles.toolBadgeLabel}>
                {prettyToolName(part.toolName)}
              </Text>
              <Text style={styles.toolBadgeValue}>
                {summarizeToolArgs(part.args)}
              </Text>
            </View>
          )}
        />
      </View>
    </MessagePrimitive.Root>
  );
}

function prettyToolName(toolName: string): string {
  const map: Record<string, string> = {
    voice_setGoal: "goal",
    voice_setSchedule: "schedule",
    voice_setDietPref: "diet",
    voice_setSleepHours: "sleep",
  };
  return map[toolName] ?? toolName;
}

function summarizeToolArgs(args: unknown): string {
  if (args == null || typeof args !== "object") return "…";
  const a = args as Record<string, unknown>;
  const v = a.goal ?? a.schedule ?? a.dietPref ?? a.hours;
  if (v == null) return "…";
  return typeof v === "number" ? `${v}h` : String(v);
}

function Composer() {
  return (
    <ComposerPrimitive.Root style={styles.composerRoot}>
      <ComposerPrimitive.Input
        placeholder="Tell me about your training plan…"
        placeholderTextColor={colors.textFaint}
        style={styles.input}
        multiline
      />
      <ComposerPrimitive.Send>
        <View style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </View>
      </ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  );
}

const styles = StyleSheet.create({
  threadRoot: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  empty: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  emptyEyebrow: {
    ...typography.micro,
  },
  emptyTitle: {
    ...typography.display,
    fontSize: 24,
  },
  emptyBody: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
  },
  suggestions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  suggestion: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.text,
  },
  row: {
    width: "100%",
    flexDirection: "row",
  },
  rowUser: {
    justifyContent: "flex-end",
  },
  rowAssistant: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "85%",
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
  },
  bubbleUser: {
    backgroundColor: "rgba(34,211,238,0.10)",
    borderColor: colors.cyanBorder,
  },
  bubbleAssistant: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: colors.border,
  },
  bubbleTextUser: {
    color: "#cffafe",
    fontSize: 15,
    lineHeight: 22,
  },
  bubbleTextAssistant: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  toolBadge: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.cyanBorder,
    backgroundColor: colors.cyanSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  toolBadgeLabel: {
    fontSize: 11,
    color: "#67e8f9",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  toolBadgeValue: {
    fontSize: 12,
    color: "#cffafe",
  },
  composerRoot: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: "rgba(9,9,11,0.85)",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
  },
  sendButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    backgroundColor: colors.cyan,
    borderRadius: radius.pill,
  },
  sendButtonText: {
    color: "#09090b",
    fontSize: 14,
    fontWeight: "600",
  },
});
