import { User } from '../features/auth/types';
import { Session } from '../services/types';
import { ProduceItem } from '../features/marketplace/types';

export type AuthStackParamList = {
  RoleSelection: undefined;
  ProfileForm: { role: 'buyer' | 'supplier' | 'both' };
  SignInPhone: undefined;
  SignInOtp: { phone: string };
  SignInPassword: undefined;
  ForgotPassword: undefined;
  // Carries the just-authenticated user/session rather than reading them
  // from AuthContext — login() only fires when the user taps through on
  // this screen, so RootNavigator doesn't swap trees out from under it
  // before they've seen the confirmation.
  AuthSuccess: { mode: 'signup' | 'signin'; user: User; session: Session };
};

export type BuyerTabParamList = {
  Marketplace: undefined;
  MyInquiries: { filter?: 'all' | 'inquiries' | 'samples' } | undefined;
  NewInquiryAction: undefined;
  MyRequests: { filter?: 'all' | 'inquiries' | 'samples' } | undefined;
  Profile: undefined;
};

export type SupplierTabParamList = {
  Dashboard: undefined;
  NewSupplyAction: undefined;
  Requests: undefined;
  Profile: undefined;
};

// Modal screens presented on top of the authenticated app, reachable from
// either tab navigator — kept in a shared stack so both buyer and supplier
// flows push the same full-screen form.
export type AppStackParamList = {
  BuyerTabs: undefined;
  SupplierTabs: undefined;
  AddSupplyOrInquiry: { userRole: 'buyer' | 'supplier'; existingItem?: ProduceItem };
  RequestSample: { purityGrade: string };
};
