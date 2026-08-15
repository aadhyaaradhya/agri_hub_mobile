import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';

export const ThemeToggleButton: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        styles.button,
        { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
      ]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      {isDark ? (
        <Sun color={colors.accent} size={18} />
      ) : (
        <Moon color={colors.textSecondary} size={18} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 8,
  },
});
