import "react-native-get-random-values";
import "react-native-reanimated";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, type ReactNode } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  AssistantRuntimeProvider,
} from "@assistant-ui/react-native";
import { useAgUiRuntime } from "@assistant-ui/react-ag-ui";
import { CinematicBackground } from "@/components/CinematicBackground";
import { ProfileTools } from "@/components/ProfileTools";
import { Footer } from "@/components/Footer";
import { buildAgent, readAguiConfig } from "@/lib/agui";
import { colors, radius, spacing, typography } from "@/lib/theme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={styles.bgRoot}>
        <RuntimeShell>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </RuntimeShell>
        <StatusBar style="light" />
      </View>
    </SafeAreaProvider>
  );
}

/**
 * Wraps the app in AssistantRuntimeProvider when EXPO_PUBLIC_AGUI_URL is set,
 * otherwise renders a clear setup screen. Keeps the rest of the app honest
 * about the AG-UI dependency.
 */
function RuntimeShell({ children }: { children: ReactNode }) {
  const config = useMemo(readAguiConfig, []);
  if (!config) {
    return <SetupScreen />;
  }
  return <ConnectedRuntime config={config}>{children}</ConnectedRuntime>;
}

function ConnectedRuntime({
  config,
  children,
}: {
  config: { url: string; apiKey?: string };
  children: ReactNode;
}) {
  const agent = useMemo(() => buildAgent(config), [config]);
  const runtime = useAgUiRuntime({
    agent,
    showThinking: true,
    onError: (e) => {
      // Surface for now; a production app would route this into UI state.
      // eslint-disable-next-line no-console
      console.warn("[AG-UI]", e);
    },
  });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ProfileTools />
      {children}
    </AssistantRuntimeProvider>
  );
}

function SetupScreen() {
  return (
    <View style={styles.setupRoot}>
      <CinematicBackground />
      <SafeAreaView style={styles.setupSafe} edges={["top", "left", "right"]}>
        <ScrollView contentContainerStyle={styles.setupScroll}>
          <Text style={styles.setupEyebrow}>CopilotX Mobile · Setup</Text>
          <Text style={styles.setupTitle}>
            Point me at an AG-UI agent to start.
          </Text>
          <Text style={styles.setupBody}>
            This app talks to any agent that speaks the AG-UI protocol over
            HTTP/SSE. Drop a URL into <Text style={styles.code}>mobile/.env</Text>
            and reload Expo.
          </Text>

          <View style={styles.envCard}>
            <Text style={styles.envLine}>EXPO_PUBLIC_AGUI_URL=https://your-agent.example.com/agui</Text>
            <Text style={styles.envLineDim}>EXPO_PUBLIC_AGUI_API_KEY=optional</Text>
          </View>

          <Text style={styles.setupBody}>
            See <Text style={styles.code}>mobile/README.md</Text> for compatible
            agent runtimes (Mastra, LangGraph, the AG-UI sample agent, or your
            own).
          </Text>
        </ScrollView>
        <Footer />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bgRoot: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  setupRoot: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  setupSafe: {
    flex: 1,
  },
  setupScroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  setupEyebrow: {
    ...typography.micro,
  },
  setupTitle: {
    ...typography.display,
    fontSize: 26,
    marginTop: 4,
  },
  setupBody: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textMuted,
  },
  envCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: 6,
  },
  envLine: {
    fontFamily: "Menlo",
    fontSize: 12,
    color: "#67e8f9",
  },
  envLineDim: {
    fontFamily: "Menlo",
    fontSize: 12,
    color: colors.textSubtle,
  },
  code: {
    fontFamily: "Menlo",
    fontSize: 13,
    color: colors.text,
  },
});
