import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/lib/theme";

/**
 * Layered radial-ish gradients to evoke the web /studio/voice cinematic feel
 * without a custom shader. RN doesn't ship radial gradients, so we stack
 * angled linear gradients with low alpha — close enough for a screenshot.
 */
export function CinematicBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]} />
      <LinearGradient
        colors={["rgba(34,211,238,0.18)", "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["transparent", "rgba(168,85,247,0.18)", "transparent"]}
        start={{ x: 1, y: 0.1 }}
        end={{ x: 0.2, y: 0.7 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["transparent", "rgba(34,211,238,0.10)"]}
        start={{ x: 0.2, y: 0.5 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
