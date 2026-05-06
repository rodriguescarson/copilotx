import { View, Text, StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "@/lib/theme";
import { profileStats, type FitnessProfile } from "@/lib/profileStore";

type FieldDef = {
  key: keyof FitnessProfile;
  label: string;
  dotColor: string;
  format: (v: FitnessProfile[keyof FitnessProfile]) => string;
};

const FIELDS: ReadonlyArray<FieldDef> = [
  {
    key: "goal",
    label: "Goal",
    dotColor: colors.cyan,
    format: (v) => (typeof v === "string" ? v : ""),
  },
  {
    key: "schedule",
    label: "Weekly schedule",
    dotColor: colors.purple,
    format: (v) => (typeof v === "string" ? v : ""),
  },
  {
    key: "dietPref",
    label: "Diet preference",
    dotColor: colors.emerald,
    format: (v) => (typeof v === "string" ? v : ""),
  },
  {
    key: "sleepHours",
    label: "Sleep hours",
    dotColor: colors.amber,
    format: (v) => (typeof v === "number" ? `${v} hours / night` : ""),
  },
];

export function ProfileCard({ profile }: { profile: FitnessProfile }) {
  const { filled, total, complete, elapsedMs } = profileStats(profile);
  const seconds = elapsedMs != null ? (elapsedMs / 1000).toFixed(1) : null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Profile</Text>
        <Text style={styles.headerCount}>
          {filled} / {total}
        </Text>
      </View>

      <View style={styles.list}>
        {FIELDS.map((f) => {
          const value = profile[f.key];
          const filledIn = value != null && value !== "";
          const display = f.format(value);
          return (
            <View
              key={String(f.key)}
              style={[
                styles.row,
                filledIn ? styles.rowFilled : styles.rowEmpty,
              ]}
            >
              <View style={styles.rowHeader}>
                <View
                  style={[styles.dot, { backgroundColor: f.dotColor }]}
                  accessibilityElementsHidden
                />
                <Text style={styles.rowLabel}>{f.label}</Text>
              </View>
              <Text
                style={[
                  styles.rowValue,
                  filledIn ? styles.rowValueFilled : styles.rowValueEmpty,
                ]}
              >
                {filledIn ? display : "listening…"}
              </Text>
            </View>
          );
        })}
      </View>

      {complete && (
        <View style={styles.completeBanner}>
          <Text style={styles.completeText}>
            {seconds
              ? `Profile built in ${seconds} seconds.`
              : "Profile built."}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(9,9,11,0.7)",
    padding: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  headerLabel: {
    ...typography.micro,
  },
  headerCount: {
    fontSize: 12,
    color: colors.textSubtle,
    fontVariant: ["tabular-nums"],
  },
  list: {
    gap: spacing.md,
  },
  row: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowFilled: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  rowEmpty: {
    borderColor: colors.borderDashed,
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  rowLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.textSubtle,
  },
  rowValue: {
    marginTop: 4,
    fontSize: 15,
    minHeight: 22,
  },
  rowValueFilled: {
    color: colors.text,
  },
  rowValueEmpty: {
    color: colors.textFaint,
    fontStyle: "italic",
  },
  completeBanner: {
    marginTop: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cyanBorder,
    backgroundColor: "rgba(34,211,238,0.06)",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  completeText: {
    fontSize: 13,
    color: "#a5f3fc",
  },
});
