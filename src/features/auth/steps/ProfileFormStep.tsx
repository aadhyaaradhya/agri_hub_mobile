import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components/AppText';
import { Card } from '../../../components/Card';
import { AppInput } from '../../../components/AppInput';
import { User, Mail, Building2, Phone, FileText, Lock } from 'lucide-react-native';
import { RegistrationForm, FormErrors, UserRole } from '../types';

interface ProfileFormStepProps {
  selectedRole: UserRole;
  roleLabel: string;
  formData: RegistrationForm;
  errors: FormErrors;
  onChangeInput: (field: keyof RegistrationForm, value: string) => void;
}

export const ProfileFormStep: React.FC<ProfileFormStepProps> = ({
  roleLabel,
  formData,
  errors,
  onChangeInput,
}) => {
  const { colors } = useTheme();

  return (
    <>
      <View style={styles.introSection}>
        <AppText variant="h1" weight="bold" size="xxl" style={styles.title}>
          Complete Profile
        </AppText>
        <AppText variant="body" color={colors.textSecondary} size="sm">
          Registering as{' '}
          <AppText variant="body" weight="bold" color={colors.primary}>
            {roleLabel}
          </AppText>
        </AppText>
      </View>

      <Card variant="outlined" style={styles.formCard}>
        <AppInput
          label="Full Name"
          required
          placeholder="Enter your full name"
          value={formData.fullName}
          onChangeText={(val) => onChangeInput('fullName', val)}
          error={errors.fullName}
          leftIcon={<User size={20} color={colors.primary} />}
        />

        <AppInput
          label="Email Address"
          required
          placeholder="e.g. name@company.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(val) => onChangeInput('email', val)}
          error={errors.email}
          leftIcon={<Mail size={20} color={colors.primary} />}
        />

        <AppInput
          label="Company / Farm Name (Optional)"
          placeholder="e.g. Green Agro Traders"
          value={formData.companyName}
          onChangeText={(val) => onChangeInput('companyName', val)}
          leftIcon={<Building2 size={20} color={colors.primary} />}
        />

        <AppInput
          label="Mobile Number"
          required
          placeholder="10-digit mobile number"
          keyboardType="number-pad"
          maxLength={10}
          value={formData.mobileNumber}
          onChangeText={(val) => onChangeInput('mobileNumber', val.replace(/\D/g, ''))}
          error={errors.mobileNumber}
          leftIcon={<Phone size={20} color={colors.primary} />}
        />

        <AppInput
          label="GST Number (Optional)"
          placeholder="15-character GSTIN"
          autoCapitalize="characters"
          maxLength={15}
          value={formData.gstNumber}
          onChangeText={(val) => onChangeInput('gstNumber', val.toUpperCase())}
          error={errors.gstNumber}
          leftIcon={<FileText size={20} color={colors.primary} />}
        />

        <AppInput
          label="Password"
          required
          placeholder="At least 6 characters"
          secureTextEntry
          value={formData.password}
          onChangeText={(val) => onChangeInput('password', val)}
          error={errors.password}
          leftIcon={<Lock size={20} color={colors.primary} />}
        />
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
