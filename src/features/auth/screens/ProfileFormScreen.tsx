import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { Button } from '../../../components/Button';
import { ProfileFormStep } from '../steps/ProfileFormStep';
import { RegistrationForm, FormErrors, UserRole } from '../types';
import { AuthStackParamList } from '../../../navigation/types';
import { authService } from '../../../services/authService';
import { useToast } from '../../../state/toast/ToastContext';
import { useAuth } from '../../../state/auth/AuthContext';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ProfileForm'>;
type Rt = RouteProp<AuthStackParamList, 'ProfileForm'>;

const ROLE_LABELS: Record<string, string> = {
  buyer: 'Buyer',
  supplier: 'Supplier',
  both: 'Buyer & Supplier',
};

export const ProfileFormScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const { spacing, colors } = useTheme();
  const { showToast } = useToast();
  const { login } = useAuth();

  const [formData, setFormData] = useState<RegistrationForm>({
    fullName: '',
    email: '',
    companyName: '',
    mobileNumber: '',
    gstNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof RegistrationForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const cleanPhone = formData.mobileNumber.trim().replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (cleanPhone.length !== 10) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (formData.gstNumber.trim()) {
      const cleanGst = formData.gstNumber.trim().toUpperCase();
      if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(cleanGst)) {
        newErrors.gstNumber = 'Invalid 15-character GSTIN format (e.g. 22AAAAA0000A1Z5)';
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required for future logins';
    } else if (formData.password.trim().length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { user, session } = await authService.register(params.role, formData);
      await login(user, session);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Registration failed. Please try again.', 'error');
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
        <ProfileFormStep
          selectedRole={params.role}
          roleLabel={ROLE_LABELS[params.role]}
          formData={formData}
          errors={errors}
          onChangeInput={handleInputChange}
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
              title="Back"
              variant="outline"
              size="lg"
              leftIcon={<ArrowLeft size={18} color={colors.primary} />}
              onPress={() => navigation.goBack()}
            />
          </View>
          <View style={styles.flex2}>
            <Button
              title="Submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              rightIcon={<ArrowRight size={18} color={colors.onPrimary} />}
              onPress={handleSubmit}
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
