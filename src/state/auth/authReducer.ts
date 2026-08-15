import { AuthState, AuthAction } from './types';

export const initialAuthState: AuthState = {
  status: 'hydrating',
  user: null,
  session: null,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'HYDRATE_RESULT':
      return action.user && action.session
        ? { status: 'authenticated', user: action.user, session: action.session }
        : { status: 'unauthenticated', user: null, session: null };
    case 'LOGIN_SUCCESS':
      return { status: 'authenticated', user: action.user, session: action.session };
    case 'LOGOUT':
      return { status: 'unauthenticated', user: null, session: null };
    case 'UPDATE_PROFILE':
      return state.user ? { ...state, user: action.user } : state;
    default:
      return state;
  }
}
