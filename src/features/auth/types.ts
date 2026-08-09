import { LucideIcon } from 'lucide-react-native';

export type UserRole = 'buyer' | 'supplier' | 'both';
export type AuthMode = 'signup' | 'signin';
export type SignUpStep = 1 | 2 | 3;
export type SignInStep = 'phone' | 'otp' | 'success';

export interface RegistrationForm {
  fullName: string;
  companyName: string;
  mobileNumber: string;
  gstNumber: string;
}

export interface FormErrors {
  fullName?: string;
  mobileNumber?: string;
  gstNumber?: string;
  signInPhone?: string;
  otpCode?: string;
}

export interface RoleOption {
  id: UserRole;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badge: string;
}
