import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { Card } from '../../../components/Card';
import { AppInput } from '../../../components/AppInput';
import { AppText } from '../../../components/AppText';
import { Button } from '../../../components/Button';
import { AuthStackParamList } from '../../../navigation/types';
import { authService } from '../../../services/authService';
import { useToast } from '../../../state/toast/ToastContext';
import { useAuth } from '../../../state/auth/AuthContext';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'SignInPassword'>;

export const SignInPasswordScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { spacing, colors } = useTheme();
  const { showToast } = useToast();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const newErrors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) newErrors.identifier = 'Email or Mobile Number is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      const { user, session } = await authService.loginWithPassword(identifier, password);
      await login(user, session);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Sign in failed.', 'error');
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
        <View style={styles.introSection}>
          <AppText variant="h1" weight="bold" size="xxl" style={styles.title}>
            Welcome Back!
          </AppText>
          <AppText variant="body" color={colors.textSecondary} size="sm">
            Use your registered email or mobile number and password.
          </AppText>
        </View>

        <Card variant="outlined" style={styles.formCard}>
          <AppInput
            label="Email Address or Mobile Number"
            required
            placeholder="e.g. name@company.com or 9876543210"
            autoCapitalize="none"
            autoCorrect={false}
            value={identifier}
            onChangeText={(val) => {
              setIdentifier(val);
              if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }));
            }}
            error={errors.identifier}
            leftIcon={<Mail size={20} color={colors.primary} />}
          />
          <AppInput
            label="Password"
            required
            placeholder="Enter your password"
            secureTextEntry
            isPassword
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            leftIcon={<Lock size={20} color={colors.primary} />}
          />
          <Button
            title="Forgot password?"
            variant="ghost"
            size="sm"
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotBtn}
          />
        </Card>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingHorizontal: spacing.md, backgroundColor: colors.background },
        ]}
      >
        <Button
          title="Sign In"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          rightIcon={<ArrowRight size={20} color={colors.onPrimary} />}
          onPress={handleSubmit}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingTop: 12 },
  introSection: { marginBottom: 20 },
  title: { marginBottom: 4 },
  formCard: { padding: 20, borderRadius: 16 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -4 },
  footer: { paddingVertical: 12 },
});
