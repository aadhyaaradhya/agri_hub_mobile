import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components/AppText';
import { Button } from '../../../components/Button';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { AuthMode, SignUpStep, SignInStep, UserRole } from '../types';

interface AuthFooterProps {
  authMode: AuthMode;
  step: SignUpStep;
  signInStep: SignInStep;
  selectedRoleLabel: string;
  onSignUpStep1Continue: () => void;
  onSignUpStep2Previous: () => void;
  onSignUpStep2Submit: () => void;
  onSignInSendOTP: () => void;
  onSignInOtpPrevious: () => void;
  onSignInVerifyOTP: () => void;
  onToggleMode: (mode: AuthMode) => void;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  authMode,
  step,
  signInStep,
  selectedRoleLabel,
  onSignUpStep1Continue,
  onSignUpStep2Previous,
  onSignUpStep2Submit,
  onSignInSendOTP,
  onSignInOtpPrevious,
  onSignInVerifyOTP,
  onToggleMode,
}) => {
  const { colors, spacing } = useTheme();

  const showFooter =
    (authMode === 'signup' && step < 3) ||
    (authMode === 'signin' && signInStep !== 'success');

  if (!showFooter) return null;

  return (
    <View
      style={[
        styles.stickyFooter,
        { paddingHorizontal: spacing.md, backgroundColor: colors.background },
      ]}
    >
      {/* SIGN UP BUTTONS */}
      {authMode === 'signup' && (
        <>
          {step === 1 && (
            <Button
              title={`Continue as ${selectedRoleLabel}`}
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={20} color="#FFFFFF" />}
              onPress={onSignUpStep1Continue}
            />
          )}

          {step === 2 && (
            <View style={styles.dualButtonRow}>
              <View style={styles.flex1}>
                <Button
                  title="Previous"
                  variant="outline"
                  size="lg"
                  leftIcon={<ArrowLeft size={18} color={colors.primary} />}
                  onPress={onSignUpStep2Previous}
                />
              </View>
              <View style={styles.flex2}>
                <Button
                  title="Submit"
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight size={18} color="#FFFFFF" />}
                  onPress={onSignUpStep2Submit}
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onToggleMode('signin')}
            style={styles.signInPromptRow}
          >
            <AppText variant="caption" color={colors.textSecondary}>
              Already have an account?{' '}
            </AppText>
            <AppText variant="caption" weight="bold" color={colors.primary}>
              Sign In
            </AppText>
          </TouchableOpacity>
        </>
      )}

      {/* SIGN IN BUTTONS */}
      {authMode === 'signin' && (
        <>
          {signInStep === 'phone' && (
            <Button
              title="Send OTP"
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={20} color="#FFFFFF" />}
              onPress={onSignInSendOTP}
            />
          )}

          {signInStep === 'otp' && (
            <View style={styles.dualButtonRow}>
              <View style={styles.flex1}>
                <Button
                  title="Previous"
                  variant="outline"
                  size="lg"
                  leftIcon={<ArrowLeft size={18} color={colors.primary} />}
                  onPress={onSignInOtpPrevious}
                />
              </View>
              <View style={styles.flex2}>
                <Button
                  title="Verify & Sign In"
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight size={18} color="#FFFFFF" />}
                  onPress={onSignInVerifyOTP}
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onToggleMode('signup')}
            style={styles.signInPromptRow}
          >
            <AppText variant="caption" color={colors.textSecondary}>
              Don't have an account?{' '}
            </AppText>
            <AppText variant="caption" weight="bold" color={colors.primary}>
              Register
            </AppText>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  stickyFooter: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: 'transparent',
  },
  dualButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  signInPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 4,
  },
});
