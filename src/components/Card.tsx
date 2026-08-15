import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'elevated' }) => {
  const { colors, spacing } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'flat':
        return {
          backgroundColor: colors.surfaceSecondary,
        };
      case 'elevated':
      default:
        // Dark mode: a black shadow barely registers against an
        // already-near-black background, so `colors.card` is set one real
        // luminance step above `colors.surface` — that step (plus this
        // border) is the actual elevation cue in dark mode, not the shadow.
        return {
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 12,
          elevation: 3,
          borderWidth: 1,
          borderColor: colors.border,
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: spacing.borderRadius.lg,
          padding: spacing.md,
        },
        getVariantStyles(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
