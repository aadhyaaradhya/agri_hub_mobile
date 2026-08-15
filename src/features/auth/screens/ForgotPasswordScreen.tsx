import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Mail, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { Card } from '../../../components/Card';
import { AppInput } from '../../../components/AppInput';
import { AppText } from '../../../components/AppText';
import { Button } from '../../../components/Button';
import { authService } from '../../../services/authService';

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const { spacing, colors } = useTheme();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!identifier.trim()) {
      setError('Enter your registered email or mobile number');
      return;
    }
    setError(undefined);
    setIsSubmitting(true);
    await authService.requestPasswordReset(identifier);
    setIsSubmitting(false);
    setIsSent(true);
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
        {isSent ? (
          <Card variant="elevated" style={styles.successCard}>
            <View style={[styles.successIconBadge, { backgroundColor: colors.primaryLight }]}>
              <CheckCircle2 size={40} color={colors.primary} />
            </View>
            <AppText variant="h1" weight="bold" style={styles.successTitle}>
              Check Your Inbox
            </AppText>
            <AppText variant="body" color={colors.textSecondary} style={styles.successSubtitle}>
              If an account exists for{' '}
              <AppText variant="body" weight="bold">
                {identifier}
              </AppText>
              , a reset link is on its way.
            </AppText>
            <Button
              title="Back to Sign In"
              variant="primary"
              size="lg"
              onPress={() => navigation.goBack()}
              style={styles.exploreBtn}
            />
          </Card>
        ) : (
          <>
            <View style={styles.introSection}>
              <AppText variant="h1" weight="bold" size="xxl" style={styles.title}>
                Reset Password
              </AppText>
              <AppText variant="body" color={colors.textSecondary} size="sm">
                Enter the email or mobile number on your account and we&apos;ll send a reset link.
              </AppText>
            </View>
            <Card variant="outlined" style={styles.formCard}>
              <AppInput
                label="Email or Mobile Number"
                required
                placeholder="e.g. name@company.com"
                autoCapitalize="none"
                value={identifier}
                onChangeText={(val) => {
                  setIdentifier(val);
                  if (error) setError(undefined);
                }}
                error={error}
                leftIcon={<Mail size={20} color={colors.primary} />}
              />
              <Button
                title="Send Reset Link"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                onPress={handleSubmit}
              />
            </Card>
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingTop: 12 },
  introSection: { marginBottom: 20 },
  title: { marginBottom: 4 },
  formCard: { padding: 20, borderRadius: 16, gap: 4 },
  successCard: { padding: 24, alignItems: 'center', borderRadius: 20, marginTop: 12 },
  successIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: { textAlign: 'center', marginBottom: 8 },
  successSubtitle: { textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  exploreBtn: { width: '100%' },
});
