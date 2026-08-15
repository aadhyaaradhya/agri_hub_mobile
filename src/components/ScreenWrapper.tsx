import React from 'react';
import { StyleSheet, View, ViewStyle, Platform, StatusBar as RNStatusBar } from 'react-native';
import { useSafeAreaInsets, Edge } from 'react-native-safe-area-context';
import { StatusBar, StatusBarStyle } from 'expo-status-bar';
import { useTheme } from '../theme/ThemeContext';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  statusBarColor?: string;
  statusBarStyle?: StatusBarStyle;
  padded?: boolean;
  edges?: readonly Edge[];
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  statusBarStyle,
  padded = true,
  edges = ['top', 'bottom', 'left', 'right'],
}) => {
  const { colors, isDark, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const includeTop = edges.includes('top');
  const includeBottom = edges.includes('bottom');
  const includeLeft = edges.includes('left');
  const includeRight = edges.includes('right');

  const topInset = includeTop
    ? Math.max(insets.top, Platform.OS === 'android' ? RNStatusBar.currentHeight || 0 : 0)
    : 0;
  const bottomInset = includeBottom ? insets.bottom : 0;
  const leftInset = includeLeft ? insets.left : 0;
  const rightInset = includeRight ? insets.right : 0;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: topInset,
          paddingBottom: bottomInset,
          paddingLeft: leftInset + (padded ? spacing.md : 0),
          paddingRight: rightInset + (padded ? spacing.md : 0),
        },
        style,
      ]}
    >
      <StatusBar style={statusBarStyle || (isDark ? 'light' : 'dark')} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
