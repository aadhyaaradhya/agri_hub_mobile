import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ScreenWrapper } from '../components/ScreenWrapper';
import {
  UserRole,
  AuthMode,
  SignUpStep,
  SignInStep,
  RegistrationForm,
  FormErrors,
} from '../features/auth/types';
import { AuthHeader } from '../features/auth/components/AuthHeader';
import { AuthFooter } from '../features/auth/components/AuthFooter';
import { RoleSelectionStep } from '../features/auth/steps/RoleSelectionStep';
import { ProfileFormStep } from '../features/auth/steps/ProfileFormStep';
import { SignInPhoneStep } from '../features/auth/steps/SignInPhoneStep';
import { SignInOtpStep } from '../features/auth/steps/SignInOtpStep';
import { AuthSuccessCard } from '../features/auth/steps/AuthSuccessCard';
import { MarketplaceScreen } from '../features/marketplace/screens/MarketplaceScreen';
import { SupplierDashboardScreen } from '../features/supplier/screens/SupplierDashboardScreen';

export const HomeScreen: React.FC = () => {
  const { spacing } = useTheme();

  // Navigation & Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'supplier'>('marketplace');

  // Mode & Step Navigation State
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [step, setStep] = useState<SignUpStep>(1);
  const [signInStep, setSignInStep] = useState<SignInStep>('phone');

  // Form State
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  const [formData, setFormData] = useState<RegistrationForm>({
    fullName: '',
    companyName: '',
    mobileNumber: '',
    gstNumber: '',
  });
  const [signInPhone, setSignInPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [errors, setErrors] = useState<FormErrors>({});

  // Countdown Timer for OTP Resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authMode === 'signin' && signInStep === 'otp' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authMode, signInStep, timerSeconds]);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'buyer':
        return 'Buyer';
      case 'supplier':
        return 'Supplier';
      case 'both':
        return 'Buyer & Supplier';
    }
  };

  const handleInputChange = (field: keyof RegistrationForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateSignUp = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    const cleanPhone = formData.mobileNumber.trim().replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (cleanPhone.length !== 10) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (formData.gstNumber.trim()) {
      const cleanGst = formData.gstNumber.trim().toUpperCase();
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(cleanGst)) {
        newErrors.gstNumber = 'Invalid 15-character GSTIN format (e.g. 22AAAAA0000A1Z5)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitRegistration = () => {
    if (validateSignUp()) {
      setStep(3);
    }
  };

  const handleSendOTP = () => {
    const cleanPhone = signInPhone.trim().replace(/\D/g, '');
    if (!cleanPhone) {
      setErrors({ signInPhone: 'Mobile Number is required' });
      return;
    }
    if (cleanPhone.length !== 10) {
      setErrors({ signInPhone: 'Please enter a valid 10-digit mobile number' });
      return;
    }

    setErrors({});
    setTimerSeconds(30);
    setSignInStep('otp');
  };

  const handleVerifyOTP = () => {
    if (!otpCode.trim()) {
      setErrors({ otpCode: 'OTP code is required' });
      return;
    }
    if (otpCode.trim() !== '1234' && otpCode.trim().length !== 4) {
      setErrors({ otpCode: 'Invalid OTP code. Enter 1234 for testing.' });
      return;
    }

    setErrors({});
    setSignInStep('success');
  };

  const handleEnterMainApp = () => {
    setIsAuthenticated(true);
    if (selectedRole === 'supplier') {
      setActiveTab('supplier');
    } else {
      setActiveTab('marketplace');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthMode('signup');
    setStep(1);
    setSignInStep('phone');
    setErrors({});
  };

  // IF USER IS AUTHENTICATED -> RENDER MAIN APP SCREENS
  if (isAuthenticated) {
    return (
      <ScreenWrapper padded={false}>
        {activeTab === 'supplier' ? (
          <SupplierDashboardScreen
            supplierName={formData.companyName || formData.fullName || 'Green Agro Traders'}
            userName={formData.fullName || 'Valued Partner'}
            userRoleLabel={getRoleLabel(selectedRole)}
            mobileNumber={formData.mobileNumber || signInPhone || '9876543210'}
            companyName={formData.companyName}
            gstNumber={formData.gstNumber}
            onLogout={handleLogout}
            onSwitchToMarketplace={() => setActiveTab('marketplace')}
          />
        ) : (
          <MarketplaceScreen
            userRoleLabel={getRoleLabel(selectedRole)}
            userName={formData.fullName || 'Valued Partner'}
            mobileNumber={formData.mobileNumber || signInPhone || '9876543210'}
            companyName={formData.companyName}
            gstNumber={formData.gstNumber}
            onLogout={handleLogout}
            onSwitchView={() => setActiveTab('supplier')}
          />
        )}
      </ScreenWrapper>
    );
  }

  // ONBOARDING / AUTHENTICATION FLOW
  return (
    <ScreenWrapper padded={false}>
      <View style={styles.outerContainer}>
        {/* Top Header Bar */}
        <AuthHeader authMode={authMode} step={step} signInStep={signInStep} />

        {/* Scrollable Content View */}
        <ScrollView
          style={styles.scrollFlex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: spacing.md, paddingBottom: spacing.lg },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* SIGN UP FLOW */}
          {authMode === 'signup' && (
            <>
              {step === 1 && (
                <RoleSelectionStep
                  selectedRole={selectedRole}
                  onSelectRole={setSelectedRole}
                />
              )}

              {step === 2 && (
                <ProfileFormStep
                  selectedRole={selectedRole}
                  roleLabel={getRoleLabel(selectedRole)}
                  formData={formData}
                  errors={errors}
                  onChangeInput={handleInputChange}
                />
              )}

              {step === 3 && (
                <AuthSuccessCard
                  authMode={authMode}
                  roleLabel={getRoleLabel(selectedRole)}
                  formData={formData}
                  signInPhone={signInPhone}
                  onExploreMarketplace={handleEnterMainApp}
                />
              )}
            </>
          )}

          {/* SIGN IN FLOW */}
          {authMode === 'signin' && (
            <>
              {signInStep === 'phone' && (
                <SignInPhoneStep
                  signInPhone={signInPhone}
                  error={errors.signInPhone}
                  onChangePhone={(val) => {
                    setSignInPhone(val.replace(/\D/g, ''));
                    if (errors.signInPhone) setErrors((prev) => ({ ...prev, signInPhone: undefined }));
                  }}
                />
              )}

              {signInStep === 'otp' && (
                <SignInOtpStep
                  signInPhone={signInPhone}
                  otpCode={otpCode}
                  timerSeconds={timerSeconds}
                  error={errors.otpCode}
                  onChangeOtp={(val) => {
                    setOtpCode(val.replace(/\D/g, ''));
                    if (errors.otpCode) setErrors((prev) => ({ ...prev, otpCode: undefined }));
                  }}
                  onResendOtp={() => setTimerSeconds(30)}
                />
              )}

              {signInStep === 'success' && (
                <AuthSuccessCard
                  authMode={authMode}
                  roleLabel={getRoleLabel(selectedRole)}
                  formData={formData}
                  signInPhone={signInPhone}
                  onExploreMarketplace={handleEnterMainApp}
                />
              )}
            </>
          )}
        </ScrollView>

        {/* Sticky Bottom Action Bar */}
        <AuthFooter
          authMode={authMode}
          step={step}
          signInStep={signInStep}
          selectedRoleLabel={getRoleLabel(selectedRole)}
          onSignUpStep1Continue={() => setStep(2)}
          onSignUpStep2Previous={() => setStep(1)}
          onSignUpStep2Submit={handleSubmitRegistration}
          onSignInSendOTP={handleSendOTP}
          onSignInOtpPrevious={() => setSignInStep('phone')}
          onSignInVerifyOTP={handleVerifyOTP}
          onToggleMode={(mode) => {
            setAuthMode(mode);
            setErrors({});
            if (mode === 'signin') setSignInStep('phone');
            if (mode === 'signup') setStep(1);
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    paddingTop: 12,
  },
  scrollFlex: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
  },
});
