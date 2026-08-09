import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components/AppText';
import { Sprout, Sun, Moon } from 'lucide-react-native';
import { AuthMode, SignUpStep, SignInStep } from '../types';

interface AuthHeaderProps {
  authMode: AuthMode;
  step: SignUpStep;
  signInStep: SignInStep;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  authMode,
  step,
  signInStep,
}) => {
  const { colors, isDark, toggleTheme, spacing } = useTheme();

  return (
    <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
      <View style={styles.brandBadgeRow}>
        <View style={[styles.miniLogoBadge, { backgroundColor: colors.primaryLight }]}>
          <Sprout size={20} color={colors.primary} />
        </View>
        <AppText variant="h2" weight="bold">
          Agri Hub
        </AppText>
      </View>

      <View style={styles.headerRightGroup}>
        {authMode === 'signup' && step < 3 && (
          <View style={[styles.stepPill, { backgroundColor: colors.surfaceSecondary }]}>
            <AppText variant="caption" weight="semibold" color={colors.primary}>
              Step {step} of 2
            </AppText>
          </View>
        )}

        {authMode === 'signin' && signInStep !== 'success' && (
          <View style={[styles.stepPill, { backgroundColor: colors.surfaceSecondary }]}>
            <AppText variant="caption" weight="semibold" color={colors.primary}>
              {signInStep === 'phone' ? 'Sign In' : 'OTP Code'}
            </AppText>
          </View>
        )}

        <TouchableOpacity
          onPress={toggleTheme}
          style={[
            styles.themeToggle,
            { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
          ]}
          activeOpacity={0.7}
        >
          {isDark ? (
            <Sun color={colors.accent} size={20} />
          ) : (
            <Moon color={colors.textSecondary} size={20} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brandBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniLogoBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  themeToggle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
