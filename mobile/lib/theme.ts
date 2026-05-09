// Cinematic dark palette mirroring the web /studio/voice route.
// Black background, cyan + purple gradient accents, generous spacing.

export const colors = {
  // Surfaces (zinc-950 scale)
  bg: "#09090b",
  surface: "rgba(255,255,255,0.03)",
  surfaceStrong: "rgba(24,24,27,0.7)",
  border: "rgba(255,255,255,0.10)",
  borderDashed: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(255,255,255,0.18)",

  // Text (zinc scale)
  text: "#fafafa",
  textMuted: "#a1a1aa",
  textSubtle: "#71717a",
  textFaint: "#52525b",

  // Brand accents
  cyan: "#22d3ee",
  cyanSoft: "rgba(34,211,238,0.16)",
  cyanBorder: "rgba(34,211,238,0.30)",

  purple: "#a855f7",
  purpleSoft: "rgba(168,85,247,0.12)",
  purpleBorder: "rgba(168,85,247,0.28)",

  emerald: "#34d399",
  amber: "#fbbf24",
  rose: "#fb7185",
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const typography = {
  // Use system font stack: SF Pro on iOS, Roboto on Android.
  // React Native picks the platform default when fontFamily is undefined.
  display: {
    fontSize: 28,
    fontWeight: "600" as const,
    letterSpacing: -0.4,
    color: colors.text,
  },
  title: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.text,
  },
  body: {
    fontSize: 15,
    color: colors.text,
  },
  caption: {
    fontSize: 12,
    color: colors.textMuted,
  },
  micro: {
    fontSize: 11,
    color: colors.textSubtle,
    letterSpacing: 1.4,
    textTransform: "uppercase" as const,
  },
} as const;
