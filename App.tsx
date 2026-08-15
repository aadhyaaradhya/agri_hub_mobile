import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/theme/ThemeContext';
import { AuthProvider } from './src/state/auth/AuthContext';
import { ConfigProvider } from './src/state/config/ConfigContext';
import { MarketplaceProvider } from './src/state/marketplace/MarketplaceContext';
import { ToastProvider } from './src/state/toast/ToastContext';
import { Toast } from './src/components/Toast';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <ConfigProvider>
                <MarketplaceProvider>
                  <RootNavigator />
                  <Toast />
                </MarketplaceProvider>
              </ConfigProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
