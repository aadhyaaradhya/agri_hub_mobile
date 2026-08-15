import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { Button } from '../../../components/Button';
import { SignInOtpStep } from '../steps/SignInOtpStep';
import { AuthStackParamList } from '../../../navigation/types';
import { authService } from '../../../services/authService';
import { ServiceError } from '../../../services/types';
import { useToast } from '../../../state/toast/ToastContext';
import { useAuth } from '../../../state/auth/AuthContext';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'SignInOtp'>;
type Rt = RouteProp<AuthStackParamList, 'SignInOtp'>;

export const SignInOtpScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const { spacing, colors } = useTheme();
  const { showToast } = useToast();
  const { login } = useAuth();

  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  const handleVerify = async () => {
    if (!otpCode.trim()) {
      setError('OTP code is required');
      return;
    }
    setError(undefined);
    setIsSubmitting(true);
    try {
      const { user, session } = await authService.verifyOtp(params.phone, otpCode);
      await login(user, session);
    } catch (e) {
      if (e instanceof ServiceError && e.code === 'not_registered') {
        showToast(e.message, 'warning');
        navigation.navigate('RoleSelection');
        return;
      }
      setError(e instanceof Error ? e.message : 'Invalid OTP code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper padded={false} edges={['bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingHorizontal: spacing.md, paddingBottom: spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <SignInOtpStep
          signInPhone={params.phone}
          otpCode={otpCode}
          timerSeconds={timerSeconds}
          error={error}
          onChangeOtp={(val) => {
            setOtpCode(val.replace(/\D/g, ''));
            if (error) setError(undefined);
          }}
          onResendOtp={() => {
            setTimerSeconds(30);
            authService.sendOtp(params.phone);
          }}
        />
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingHorizontal: spacing.md, backgroundColor: colors.background },
        ]}
      >
        <View style={styles.dualButtonRow}>
          <View style={styles.flex1}>
            <Button
              title="Previous"
              variant="outline"
              size="lg"
              leftIcon={<ArrowLeft size={18} color={colors.primary} />}
              onPress={() => navigation.goBack()}
            />
          </View>
          <View style={styles.flex2}>
            <Button
              title="Verify & Sign In"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              rightIcon={<ArrowRight size={18} color={colors.onPrimary} />}
              onPress={handleVerify}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingTop: 12 },
  footer: { paddingVertical: 12 },
  dualButtonRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flex1: { flex: 1 },
  flex2: { flex: 2 },
});
