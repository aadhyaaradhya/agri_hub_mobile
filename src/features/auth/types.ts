import { LucideIcon } from 'lucide-react-native';

export type UserRole = 'buyer' | 'supplier' | 'both';

export interface RegistrationForm {
  fullName: string;
  email: string;
  companyName: string;
  mobileNumber: string;
  gstNumber: string;
  password: string;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  gstNumber?: string;
  password?: string;
  signInPhone?: string;
  otpCode?: string;
  username?: string;
}

export interface RoleOption {
  id: UserRole;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badge: string;
}

// The signed-in account shape — kept distinct from `RegistrationForm` since
// a real backend will eventually return this from an API response rather
// than it being copy of the form the user typed.
export interface User {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  companyName?: string;
  mobileNumber: string;
  gstNumber?: string;
}
