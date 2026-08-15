import React from 'react';
import { Text as RNText, TextStyle, TextProps } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../theme/typography';

type Variant = 'h1' | 'h2' | 'subtitle' | 'body' | 'caption' | 'button';

interface AppTextProps extends TextProps {
  children: React.ReactNode;
  variant?: Variant;
  // Overrides the variant's default font size (preserving its line-height
  // ratio, weight, and color) — lets a screen reuse a variant's semantics
  // (e.g. "body" for regular weight) at a different scale instead of
  // hand-rolling a local `{ fontSize: N }` style, which is how `sm`/`xxl`
  // ended up silently reinvented in several auth screens.
  size?: keyof Typography['sizes'];
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: TextStyle | TextStyle[];
}

export const AppText: React.FC<AppTextProps> = ({
  children,
  variant = 'body',
  size,
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

  if (size) {
    const nextSize = typography.sizes[size];
    if (typeof variantStyle.fontSize === 'number' && typeof variantStyle.lineHeight === 'number') {
      const ratio = variantStyle.lineHeight / variantStyle.fontSize;
      variantStyle.lineHeight = nextSize * ratio;
    }
    variantStyle.fontSize = nextSize;
  }

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
