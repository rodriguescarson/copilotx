import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CinematicBackground } from "@/components/CinematicBackground";
import { ChatThread } from "@/components/ChatThread";
import { Footer } from "@/components/Footer";
import { colors, spacing, typography } from "@/lib/theme";

export default function ChatScreen() {
  return (
    <View style={styles.root}>
      <CinematicBackground />
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            CopilotKit Studio · Mobile · Unit 12
          </Text>
          <Text style={styles.title}>Onboarding chat</Text>
          <Text style={styles.subtitle}>
            Chat once. CopilotKit assembles your fitness profile in the next
            tab.
          </Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.threadWrap}
          keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
        >
          <ChatThread />
        </KeyboardAvoidingView>
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
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
  threadWrap: {
    flex: 1,
  },
});
