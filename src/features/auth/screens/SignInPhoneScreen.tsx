import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { Button } from '../../../components/Button';
import { AppText } from '../../../components/AppText';
import { SignInPhoneStep } from '../steps/SignInPhoneStep';
import { AuthStackParamList } from '../../../navigation/types';
import { authService } from '../../../services/authService';
import { useToast } from '../../../state/toast/ToastContext';
import { useAuth } from '../../../state/auth/AuthContext';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'SignInPhone'>;

export const SignInPhoneScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { spacing, colors } = useTheme();
  const { showToast } = useToast();
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = async () => {
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone) {
      setError('Mobile Number is required');
      return;
    }
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError(undefined);
    setIsSubmitting(true);
    try {
      await authService.sendOtp(cleanPhone);
      navigation.navigate('SignInOtp', { phone: cleanPhone });
    } catch {
      showToast('Could not send OTP. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { user, session } = await authService.loginWithGoogle();
      await login(user, session);
    } catch {
      showToast('Google sign-in failed. Please try again.', 'error');
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
        <SignInPhoneStep
          signInPhone={phone}
          error={error}
          onChangePhone={(val) => {
            setPhone(val.replace(/\D/g, ''));
            if (error) setError(undefined);
          }}
          onGoogleLogin={handleGoogleLogin}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('SignInPassword')}
          style={styles.linkRow}
        >
          <AppText variant="caption" weight="bold" color={colors.primary}>
            Sign in with username &amp; password instead
          </AppText>
        </TouchableOpacity>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingHorizontal: spacing.md, backgroundColor: colors.background },
        ]}
      >
        <Button
          title="Send OTP"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          rightIcon={<ArrowRight size={20} color={colors.onPrimary} />}
          onPress={handleSendOtp}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('RoleSelection')}
          style={styles.linkRow}
        >
          <AppText variant="caption" color={colors.textSecondary}>
            Don&apos;t have an account?{' '}
          </AppText>
          <AppText variant="caption" weight="bold" color={colors.primary}>
            Register
          </AppText>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingTop: 12 },
  footer: { paddingVertical: 12 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 4,
  },
});
