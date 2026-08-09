import React from 'react';
import { Text as RNText, TextStyle, StyleSheet, TextProps } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type Variant = 'h1' | 'h2' | 'subtitle' | 'body' | 'caption' | 'button';

interface AppTextProps extends TextProps {
  children: React.ReactNode;
  variant?: Variant;
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: TextStyle | TextStyle[];
}

export const AppText: React.FC<AppTextProps> = ({
  children,
  variant = 'body',
  color,
  weight,
  align = 'left',
  style,
  ...rest
}) => {
  const { colors, typography } = useTheme();

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: typography.sizes.h1,
          fontWeight: typography.weights.bold,
          lineHeight: typography.sizes.h1 * typography.lineHeights.tight,
        };
      case 'h2':
        return {
          fontSize: typography.sizes.h2,
          fontWeight: typography.weights.semibold,
          lineHeight: typography.sizes.h2 * typography.lineHeights.tight,
        };
      case 'subtitle':
        return {
          fontSize: typography.sizes.lg,
          fontWeight: typography.weights.medium,
          lineHeight: typography.sizes.lg * typography.lineHeights.normal,
        };
      case 'caption':
        return {
          fontSize: typography.sizes.xs,
          fontWeight: typography.weights.regular,
          color: colors.textMuted,
        };
      case 'button':
        return {
          fontSize: typography.sizes.md,
          fontWeight: typography.weights.semibold,
        };
      case 'body':
      default:
        return {
          fontSize: typography.sizes.md,
          fontWeight: typography.weights.regular,
          lineHeight: typography.sizes.md * typography.lineHeights.normal,
        };
    }
  };

  const variantStyle = getVariantStyle();
  const textStyle: TextStyle = {
    ...variantStyle,
    color: color || variantStyle.color || colors.text,
    textAlign: align,
    ...(weight && { fontWeight: typography.weights[weight] }),
  };

  return (
    <RNText style={[textStyle, style]} {...rest}>
      {children}
    </RNText>
  );
};
