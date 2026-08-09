import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components/AppText';
import { Card } from '../../../components/Card';
import { AppInput } from '../../../components/AppInput';
import { User, Building2, Phone, FileText } from 'lucide-react-native';
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
        <AppText variant="h1" weight="bold" style={styles.title}>
          Complete Profile
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Registering as <AppText variant="body" weight="bold" color={colors.primary}>{roleLabel}</AppText>
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
          label="Company / Farm Name"
          placeholder="e.g. Green Agro Traders (Optional)"
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
          label="GST Number"
          placeholder="15-character GSTIN (Optional)"
          autoCapitalize="characters"
          maxLength={15}
          value={formData.gstNumber}
          onChangeText={(val) => onChangeInput('gstNumber', val.toUpperCase())}
          error={errors.gstNumber}
          leftIcon={<FileText size={20} color={colors.primary} />}
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
});
