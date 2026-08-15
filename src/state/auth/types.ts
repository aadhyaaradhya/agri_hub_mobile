import { User } from '../../features/auth/types';
import { Session } from '../../services/types';

export interface AuthState {
  status: 'hydrating' | 'authenticated' | 'unauthenticated';
  user: User | null;
  session: Session | null;
}

export type AuthAction =
  | { type: 'HYDRATE_RESULT'; user: User | null; session: Session | null }
  | { type: 'LOGIN_SUCCESS'; user: User; session: Session }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; user: User };
