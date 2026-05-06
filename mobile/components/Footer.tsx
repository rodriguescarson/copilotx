import { Text, View, StyleSheet } from "react-native";
import { colors, spacing } from "@/lib/theme";

export function Footer() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>built by carsonrodrigues.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  text: {
    fontSize: 11,
    color: colors.textFaint,
    letterSpacing: 0.4,
  },
});
