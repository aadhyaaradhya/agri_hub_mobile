import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, XCircle, AlertTriangle, Info, LucideIcon } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { useToast, ToastVariant } from '../state/toast/ToastContext';
import { AppText } from './AppText';

const ICONS: Record<ToastVariant, LucideIcon> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const AUTO_DISMISS_MS = 3000;

// Mounted once at the app root (see App.tsx). Replaces the scattered
// `Alert.alert` success/error calls with a themed, non-blocking banner.
export const Toast: React.FC = () => {
  const { toast, hideToast } = useToast();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-80)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!toast) return;
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 70,
      friction: 11,
    }).start();
    timerRef.current = setTimeout(() => {
      Animated.timing(translateY, { toValue: -80, duration: 200, useNativeDriver: true }).start(
        () => hideToast()
      );
    }, AUTO_DISMISS_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // `translateY` (useRef) and `hideToast` (useCallback) are referentially
    // stable; re-running this effect on `toast` alone is correct.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  if (!toast) return null;

  const variantColors: Record<ToastVariant, { bg: string; fg: string }> = {
    success: { bg: colors.successBackground, fg: colors.success },
    error: { bg: colors.errorBackground, fg: colors.error },
    warning: { bg: colors.warningBackground, fg: colors.warning },
    info: { bg: colors.infoBackground, fg: colors.info },
  };
  const { bg, fg } = variantColors[toast.variant];
  const Icon = ICONS[toast.variant];

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, { top: insets.top + 8, transform: [{ translateY }] }]}
    >
      <View style={[styles.card, { backgroundColor: bg, borderColor: fg + '30' }]}>
        <Icon size={18} color={fg} />
        <AppText variant="body" weight="semibold" color={fg} style={styles.message}>
          {toast.message}
        </AppText>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 9999,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  message: {
    marginLeft: 10,
    flex: 1,
  },
});
