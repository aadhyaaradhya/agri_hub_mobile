import React, { createContext, useContext, useEffect, useReducer, useMemo } from 'react';
import { User } from '../../features/auth/types';
import { Session } from '../../services/types';
import { secureStorage, storage, STORAGE_KEYS } from '../../services/storageService';
import { authReducer, initialAuthState } from './authReducer';

interface AuthContextType {
  status: 'hydrating' | 'authenticated' | 'unauthenticated';
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, session: Session) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Boot-time hydration: restore a session that hasn't expired yet, so the
  // user stays logged in across app restarts instead of resetting to
  // signed-out on every launch (previously in-memory-only `useState`).
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        // Add a safety timeout so hydration never hangs if native storage stalls
        const timeoutPromise = new Promise<[null, null]>((resolve) =>
          setTimeout(() => resolve([null, null]), 2000)
        );

        const storagePromise = Promise.all([
          secureStorage.get<Session>(STORAGE_KEYS.session),
          storage.get<User>(STORAGE_KEYS.user),
        ]);

        const [session, user] = await Promise.race([storagePromise, timeoutPromise]);
        const isValid = !!(session && user && session.expiresAt > Date.now());

        if (isMounted) {
          dispatch({
            type: 'HYDRATE_RESULT',
            user: isValid ? user : null,
            session: isValid ? session : null,
          });
        }

        if (!isValid && session) {
          await Promise.all([
            secureStorage.remove(STORAGE_KEYS.session),
            storage.remove(STORAGE_KEYS.user),
          ]);
        }
      } catch (err) {
        console.error('Failed to hydrate auth state:', err);
        if (isMounted) {
          dispatch({
            type: 'HYDRATE_RESULT',
            user: null,
            session: null,
          });
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (user: User, session: Session) => {
    await Promise.all([
      secureStorage.set(STORAGE_KEYS.session, session),
      storage.set(STORAGE_KEYS.user, user),
    ]);
    dispatch({ type: 'LOGIN_SUCCESS', user, session });
  };

  const logout = async () => {
    await Promise.all([
      secureStorage.remove(STORAGE_KEYS.session),
      storage.remove(STORAGE_KEYS.user),
    ]);
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (user: User) => {
    await storage.set(STORAGE_KEYS.user, user);
    dispatch({ type: 'UPDATE_PROFILE', user });
  };

  const value = useMemo<AuthContextType>(
    () => ({
      status: state.status,
      user: state.user,
      isAuthenticated: state.status === 'authenticated',
      login,
      logout,
      updateProfile,
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
