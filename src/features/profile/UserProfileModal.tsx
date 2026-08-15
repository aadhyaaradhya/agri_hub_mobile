import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import {
  User,
  Building2,
  Phone,
  FileText,
  ShieldCheck,
  X,
  LogOut,
  Repeat,
} from 'lucide-react-native';
import { useAuth } from '../../state/auth/AuthContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface UserProfileModalProps {
  visible: boolean;
  onClose: () => void;
  // Omit entirely to hide the switcher — only "Both"-role accounts should
  // pass this, closing the gap where any authenticated user could freely
  // open the other role's dashboard regardless of what they registered as.
  onSwitchView?: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  buyer: 'Buyer',
  supplier: 'Supplier',
  both: 'Buyer & Supplier',
};

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  visible,
  onClose,
  onSwitchView,
}) => {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const [renderModal, setRenderModal] = useState(visible);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setRenderModal(true);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 60,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => setRenderModal(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `fadeAnim`/`slideAnim` (useRef) are stable.
  }, [visible]);

  if (!renderModal || !user) return null;

  return (
    <View style={styles.containerOverlay} pointerEvents="box-none">
      <Animated.View style={[styles.backdropOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.backdropTouchable} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.bottomSheetCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.dragHandleContainer}>
          <View style={[styles.dragHandlePill, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.modalHeader}>
          <View style={styles.headerTitleRow}>
            <View style={[styles.avatarBadge, { backgroundColor: colors.primaryLight }]}>
              <User size={24} color={colors.primary} />
            </View>
            <View style={{ marginLeft: 12 }}>
              <AppText variant="subtitle" weight="bold">
                My Profile
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Agri Hub Partner Account
              </AppText>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: colors.surfaceSecondary }]}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.bodyScroll}>
          <Card
            variant="outlined"
            style={[
              styles.userCard,
              { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
            ]}
          >
            <AppText variant="h2" weight="bold">
              {user.fullName}
            </AppText>
            <View style={[styles.rolePill, { backgroundColor: colors.primaryLight }]}>
              <ShieldCheck size={14} color={colors.primary} />
              <AppText
                variant="caption"
                weight="bold"
                color={colors.primary}
                style={{ marginLeft: 4 }}
              >
                Registered {ROLE_LABELS[user.role]}
              </AppText>
            </View>
          </Card>

          <View style={styles.detailsGroup}>
            <AppText
              variant="caption"
              weight="bold"
              color={colors.textSecondary}
              style={styles.groupTitle}
            >
              ACCOUNT & BUSINESS DETAILS
            </AppText>

            {user.mobileNumber ? (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Phone size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="caption" color={colors.textSecondary}>
                    Mobile Number
                  </AppText>
                  <AppText variant="body" weight="semibold">
                    +91 {user.mobileNumber}
                  </AppText>
                </View>
              </View>
            ) : null}

            {user.companyName ? (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Building2 size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="caption" color={colors.textSecondary}>
                    Company / Farm Name
                  </AppText>
                  <AppText variant="body" weight="semibold">
                    {user.companyName}
                  </AppText>
                </View>
              </View>
            ) : null}

            {user.gstNumber ? (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <FileText size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="caption" color={colors.textSecondary}>
                    GSTIN
                  </AppText>
                  <AppText variant="body" weight="semibold">
                    {user.gstNumber}
                  </AppText>
                </View>
              </View>
            ) : null}
          </View>

          {onSwitchView && (
            <TouchableOpacity
              onPress={onSwitchView}
              activeOpacity={0.8}
              style={[styles.switchCard, { borderColor: colors.border }]}
              accessibilityRole="button"
              accessibilityLabel="Switch between marketplace and supplier view"
            >
              <Repeat size={18} color={colors.primary} />
              <AppText
                variant="body"
                weight="bold"
                color={colors.primary}
                style={{ marginLeft: 10 }}
              >
                Switch Marketplace / Supplier View
              </AppText>
            </TouchableOpacity>
          )}

          <Button
            title="Log Out of Agri Hub"
            variant="outline"
            size="lg"
            leftIcon={<LogOut size={18} color={colors.error} />}
            onPress={() => {
              onClose();
              logout();
            }}
            style={{ marginTop: 8, borderColor: colors.error + '50' }}
          />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 9999,
    elevation: 9999,
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  backdropTouchable: {
    flex: 1,
  },
  bottomSheetCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 36,
    maxHeight: '82%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 24,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  dragHandlePill: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyScroll: {
    gap: 16,
  },
  userCard: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'flex-start',
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  detailsGroup: {
    gap: 12,
  },
  groupTitle: {
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailIcon: {
    marginRight: 12,
  },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
});
