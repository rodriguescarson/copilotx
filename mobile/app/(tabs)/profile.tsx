import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CinematicBackground } from "@/components/CinematicBackground";
import { ProfileCard } from "@/components/ProfileCard";
import { Footer } from "@/components/Footer";
import { useProfile, profileStats, profileStore } from "@/lib/profileStore";
import { colors, radius, spacing, typography } from "@/lib/theme";

export default function ProfileScreen() {
  const profile = useProfile();
  const { complete, filled, total } = profileStats(profile);

  return (
    <View style={styles.root}>
      <CinematicBackground />
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Fitness profile</Text>
            <Text style={styles.title}>
              {complete ? "Plan ready." : `${filled} of ${total} captured.`}
            </Text>
            <Text style={styles.subtitle}>
              Tools called from the chat tab feed straight into these cards in
              real time.
            </Text>
          </View>

          <View style={styles.statusPillRow}>
            <View
              style={[
                styles.statusPill,
                complete ? styles.statusPillDone : styles.statusPillIncomplete,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: complete ? colors.cyan : colors.textSubtle,
                  },
                ]}
              />
              <Text style={styles.statusPillText}>
                {complete ? "Profile complete" : `${filled} / ${total} captured`}
              </Text>
            </View>
            {filled > 0 && (
              <Pressable
                onPress={() => profileStore.reset()}
                style={({ pressed }) => [
                  styles.resetButton,
                  pressed && styles.resetButtonPressed,
                ]}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </Pressable>
            )}
          </View>

          <ProfileCard profile={profile} />

          {complete && (
            <View style={styles.applyCard}>
              <Text style={styles.applyEyebrow}>Profile ready</Text>
              <Text style={styles.applyBody}>
                Same fields the web /studio/voice route surfaces. Wire these to
                a server route in production to persist them.
              </Text>
            </View>
          )}

          <View style={styles.helpCard}>
            <Text style={styles.helpTitle}>How this works</Text>
            <Text style={styles.helpBody}>
              The chat tab streams over AG-UI to a CopilotKit-style agent. Each
              of the four tools the agent can call (goal, schedule, diet,
              sleep) writes into a tiny observable store. This screen
              re-renders whenever a tool fires.
            </Text>
          </View>
        </ScrollView>
        <Footer />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    paddingBottom: spacing.sm,
  },
  eyebrow: {
    ...typography.micro,
    marginBottom: 4,
  },
  title: {
    ...typography.display,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    maxWidth: 360,
  },
  statusPillRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  statusPillDone: {
    borderColor: colors.cyanBorder,
    backgroundColor: colors.cyanSoft,
  },
  statusPillIncomplete: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  statusPillText: {
    fontSize: 12,
    color: colors.text,
    letterSpacing: 0.4,
  },
  resetButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  resetButtonPressed: {
    opacity: 0.6,
  },
  resetButtonText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  applyCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.cyanBorder,
    backgroundColor: "rgba(34,211,238,0.06)",
    padding: spacing.lg,
    gap: 6,
  },
  applyEyebrow: {
    fontSize: 11,
    color: "#a5f3fc",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  applyBody: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  helpCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: 6,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  helpBody: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
