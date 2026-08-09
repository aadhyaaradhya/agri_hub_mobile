import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components/AppText';
import { Card } from '../../../components/Card';
import { AppInput } from '../../../components/AppInput';
import { KeyRound } from 'lucide-react-native';

interface SignInOtpStepProps {
  signInPhone: string;
  otpCode: string;
  timerSeconds: number;
  error?: string;
  onChangeOtp: (code: string) => void;
  onResendOtp: () => void;
}

export const SignInOtpStep: React.FC<SignInOtpStepProps> = ({
  signInPhone,
  otpCode,
  timerSeconds,
  error,
  onChangeOtp,
  onResendOtp,
}) => {
  const { colors } = useTheme();

  return (
    <>
      <View style={styles.introSection}>
        <AppText variant="h1" weight="bold" style={styles.title}>
          Enter OTP Code
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          We sent a 4-digit code to{' '}
          <AppText variant="body" weight="bold" color={colors.primary}>
            +91 {signInPhone}
          </AppText>
        </AppText>
      </View>

      <Card variant="outlined" style={styles.formCard}>
        <AppInput
          label="Verification Code (Try: 1234)"
          required
          placeholder="Enter 4-digit OTP code"
          keyboardType="number-pad"
          maxLength={4}
          value={otpCode}
          onChangeText={(val) => onChangeOtp(val.replace(/\D/g, ''))}
          error={error}
          leftIcon={<KeyRound size={20} color={colors.primary} />}
        />

        <View style={styles.timerRow}>
          <AppText variant="caption" color={colors.textSecondary}>
            {timerSeconds > 0
              ? `Resend OTP in ${timerSeconds}s`
              : 'Did not receive code?'}
          </AppText>
          {timerSeconds === 0 && (
            <TouchableOpacity onPress={onResendOtp} activeOpacity={0.7}>
              <AppText
                variant="caption"
                weight="bold"
                color={colors.primary}
                style={{ marginLeft: 6 }}
              >
                Resend OTP
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  introSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  formCard: {
    padding: 20,
    borderRadius: 16,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
});
