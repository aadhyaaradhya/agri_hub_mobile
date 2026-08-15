export interface Session {
  token: string;
  expiresAt: number; // epoch ms
}

// Thrown by mock service methods so callers can branch on `code` (e.g. the
// sign-in screen distinguishing "wrong OTP" from "number not registered")
// without parsing message strings.
export class ServiceError extends Error {
  code: string;
  constructor(message: string, code = 'unknown') {
    super(message);
    this.code = code;
  }
}
