// Design tokens — see the review that produced this palette for the full
// WCAG contrast math and hue rationale. Two rules to preserve when editing:
//  1. Every text/background pair must stay >= 4.5:1 contrast (AA).
//  2. Brand/chrome tokens (primary/secondary/accent/border/textMuted) in both
//     themes must share the same yellowish-green hue family (~55-100deg) —
//     canvas tokens (background/surface/text) intentionally stay neutral.
export const colors = {
  light: {
    background: '#F7FBF4',
    surface: '#FFFFFF',
    surfaceSecondary: '#EDF5E8',
    card: '#FFFFFF',
    border: '#DCEDC8',
    primary: '#4A7A29',
    primaryLight: '#E8F5E9',
    primaryDark: '#33691E',
    onPrimary: '#FFFFFF',
    secondary: '#8BC34A',
    accent: '#9E9D24',
    text: '#1B2E15',
    textSecondary: '#4E6544',
    textMuted: '#5C6F56',
    success: '#2E7D32',
    successBackground: '#E8F5E9',
    warning: '#A85D00',
    warningBackground: '#FDF3E7',
    error: '#D32F2F',
    errorBackground: '#FDECEA',
    info: '#0369A1',
    infoBackground: '#E7F1FA',
    shadow: 'rgba(27, 46, 21, 0.08)',
  },
  dark: {
    background: '#0B0F19',
    surface: '#151D2A',
    // One real luminance step above `surface` — this (plus Card's border)
    // is the actual elevation cue in dark mode; a black shadow is nearly
    // invisible against an already-near-black background, so it can't do
    // that job here the way it does in light mode.
    card: '#18212F',
    surfaceSecondary: '#1E293B',
    border: '#3A4A33',
    primary: '#5FB12F',
    primaryLight: 'rgba(95, 177, 47, 0.18)',
    primaryDark: '#3D7A1E',
    onPrimary: '#07130B',
    secondary: '#8FD14F',
    accent: '#DCD138',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#9EB493',
    success: '#22C55E',
    successBackground: 'rgba(34, 197, 94, 0.15)',
    warning: '#F59E0B',
    warningBackground: 'rgba(245, 158, 11, 0.15)',
    error: '#EF4444',
    errorBackground: 'rgba(239, 68, 68, 0.15)',
    info: '#3B82F6',
    infoBackground: 'rgba(59, 130, 246, 0.15)',
    shadow: 'rgba(0, 0, 0, 0.4)',
  },
};

export type ThemeColors = typeof colors.light;
