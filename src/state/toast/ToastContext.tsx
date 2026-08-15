import React, { createContext, useContext, useCallback, useState } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  toast: ToastData | null;
  showToast: (message: string, variant?: ToastVariant) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Replaces the app's blocking `Alert.alert` calls with a small, themed,
// auto-dismissing banner — see `src/components/Toast.tsx` for the renderer,
// mounted once at the app root.
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    setToast({ id: Date.now(), message, variant });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};
