import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components/AppText';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { AppInput } from '../../../components/AppInput';
import { Phone } from 'lucide-react-native';

interface SignInPhoneStepProps {
  signInPhone: string;
  error?: string;
  onChangePhone: (phone: string) => void;
  onGoogleLogin: () => void;
}

export const SignInPhoneStep: React.FC<SignInPhoneStepProps> = ({
  signInPhone,
  error,
  onChangePhone,
  onGoogleLogin,
}) => {
  const { colors } = useTheme();

  return (
    <>
      <View style={styles.introSection}>
        <AppText variant="h1" weight="bold" size="xxl" style={styles.title}>
          Welcome Back!
        </AppText>
        <AppText variant="body" color={colors.textSecondary} size="sm">
          Enter your registered 10-digit mobile number to receive a verification code.
        </AppText>
      </View>

      <Card variant="outlined" style={styles.formCard}>
        <AppInput
          label="Registered Mobile Number"
          required
          placeholder="10-digit mobile number"
          keyboardType="number-pad"
          maxLength={10}
          value={signInPhone}
          onChangeText={(val) => onChangePhone(val.replace(/\D/g, ''))}
          error={error}
          leftIcon={<Phone size={20} color={colors.primary} />}
        />

        <View
          style={{
            marginTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingTop: 14,
          }}
        >
          <Button
            title="Continue with Google"
            variant="outline"
            size="md"
            onPress={onGoogleLogin}
          />
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
    marginBottom: 4,
  },
  formCard: {
    padding: 20,
    borderRadius: 16,
  },
});
