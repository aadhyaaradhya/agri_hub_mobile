import { User, UserRole, RegistrationForm } from '../features/auth/types';
import { Session, ServiceError } from './types';
import { storage, STORAGE_KEYS } from './storageService';

export interface IAuthService {
  register(role: UserRole, form: RegistrationForm): Promise<{ user: User; session: Session }>;
  sendOtp(phone: string): Promise<void>;
  verifyOtp(phone: string, code: string): Promise<{ user: User; session: Session }>;
  loginWithPassword(identifier: string, password: string): Promise<{ user: User; session: Session }>;
  loginWithGoogle(): Promise<{ user: User; session: Session }>;
  requestPasswordReset(identifier: string): Promise<void>;
}

// 30 days — matches the client's "don't auto-logout" requirement.
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

interface MockUserRecord {
  user: User;
  password?: string;
}

function delay(ms = 400) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function createSession(): Session {
  return {
    token: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
}

async function getDirectory(): Promise<MockUserRecord[]> {
  return (await storage.get<MockUserRecord[]>(STORAGE_KEYS.mockUsers)) || [];
}

async function saveDirectory(records: MockUserRecord[]): Promise<void> {
  await storage.set(STORAGE_KEYS.mockUsers, records);
}

// Mock, local-only implementation — every method here is exactly the seam a
// real backend replaces later; the `IAuthService` interface above is what
// stays stable across that swap. Persisting a small user directory locally
// (rather than accepting any input) is what makes sign-in actually check
// "is this account registered" per SIGNIN_FLOW.md's documented edge case,
// and lets a user's real registered role survive a sign-out/sign-in cycle.
class MockAuthService implements IAuthService {
  async register(role: UserRole, form: RegistrationForm) {
    await delay();
    const user: User = {
      id: `user-${Date.now()}`,
      role,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      companyName: form.companyName.trim() || undefined,
      mobileNumber: form.mobileNumber.trim(),
      gstNumber: form.gstNumber.trim() || undefined,
    };
    const directory = await getDirectory();
    directory.push({ user, password: form.password });
    await saveDirectory(directory);
    return { user, session: createSession() };
  }

  async sendOtp(_phone: string) {
    await delay(300);
    // Mock: no SMS is actually dispatched. A real backend swaps only this method.
  }

  async verifyOtp(phone: string, code: string) {
    await delay();
    if (code.trim() !== '1234') {
      throw new ServiceError('Invalid OTP code. Enter 1234 for testing.', 'invalid_otp');
    }
    const directory = await getDirectory();
    const existing = directory.find((r) => r.user.mobileNumber === phone);
    if (!existing) {
      throw new ServiceError(
        'No account found with this number. Would you like to Register?',
        'not_registered'
      );
    }
    return { user: existing.user, session: createSession() };
  }

  async loginWithPassword(identifier: string, password: string) {
    await delay();
    const directory = await getDirectory();
    const clean = identifier.trim().toLowerCase();
    const cleanPhone = identifier.trim().replace(/\D/g, '');

    const existing = directory.find(
      (r) =>
        r.user.email.toLowerCase() === clean ||
        (cleanPhone.length === 10 && r.user.mobileNumber === cleanPhone)
    );
    if (!existing || existing.password !== password) {
      throw new ServiceError('Incorrect email/mobile number or password.', 'invalid_credentials');
    }
    return { user: existing.user, session: createSession() };
  }

  async loginWithGoogle() {
    await delay(600);
    // Mock: a real implementation wires expo-auth-session here and returns
    // whatever profile Google's userinfo endpoint reports.
    const user: User = {
      id: 'user-google-demo',
      role: 'buyer',
      fullName: 'Google Demo User',
      email: 'demo@gmail.com',
      mobileNumber: '',
    };
    return { user, session: createSession() };
  }

  async requestPasswordReset(_identifier: string) {
    await delay(500);
    // Mock: no email is actually sent — real dispatch is a backend concern.
  }
}

export const authService: IAuthService = new MockAuthService();
