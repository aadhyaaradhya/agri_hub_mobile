import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StatusBarStyle } from 'expo-status-bar';
import { useTheme } from '../theme/ThemeContext';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  statusBarColor?: string;
  statusBarStyle?: StatusBarStyle;
  padded?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  statusBarStyle,
  padded = true,
}) => {
  const { colors, isDark, spacing } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
        padded && { paddingHorizontal: spacing.md },
        style,
      ]}
    >
      <StatusBar style={statusBarStyle || (isDark ? 'light' : 'dark')} />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
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
