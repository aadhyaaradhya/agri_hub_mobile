import { authReducer, initialAuthState } from '../authReducer';
import { User } from '../../../features/auth/types';
import { Session } from '../../../services/types';

const user: User = {
  id: '1',
  role: 'buyer',
  fullName: 'Test User',
  email: 't@example.com',
  mobileNumber: '9999999999',
};
const session: Session = { token: 'abc', expiresAt: Date.now() + 1000 };

describe('authReducer', () => {
  it('starts in a hydrating state', () => {
    expect(initialAuthState.status).toBe('hydrating');
  });

  it('HYDRATE_RESULT with a user+session authenticates', () => {
    const state = authReducer(initialAuthState, { type: 'HYDRATE_RESULT', user, session });
    expect(state.status).toBe('authenticated');
    expect(state.user).toEqual(user);
  });

  it('HYDRATE_RESULT with no user leaves it unauthenticated', () => {
    const state = authReducer(initialAuthState, {
      type: 'HYDRATE_RESULT',
      user: null,
      session: null,
    });
    expect(state.status).toBe('unauthenticated');
  });

  it('LOGOUT clears the user', () => {
    const loggedIn = authReducer(initialAuthState, { type: 'LOGIN_SUCCESS', user, session });
    const loggedOut = authReducer(loggedIn, { type: 'LOGOUT' });
    expect(loggedOut.status).toBe('unauthenticated');
    expect(loggedOut.user).toBeNull();
  });

  it('UPDATE_PROFILE only applies when already logged in', () => {
    const updated = { ...user, fullName: 'New Name' };
    const stillLoggedOut = authReducer(initialAuthState, { type: 'UPDATE_PROFILE', user: updated });
    expect(stillLoggedOut.user).toBeNull();

    const loggedIn = authReducer(initialAuthState, { type: 'LOGIN_SUCCESS', user, session });
    const withUpdate = authReducer(loggedIn, { type: 'UPDATE_PROFILE', user: updated });
    expect(withUpdate.user?.fullName).toBe('New Name');
  });
});
