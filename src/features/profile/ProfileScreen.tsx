import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  User,
  Building2,
  Phone,
  FileText,
  ShieldCheck,
  LogOut,
  Repeat,
  Sun,
  Moon,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../state/auth/AuthContext';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AppStackParamList, BuyerTabParamList } from '../../navigation/types';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<BuyerTabParamList, 'Profile'>,
  NativeStackNavigationProp<AppStackParamList>
>;

const ROLE_LABELS: Record<string, string> = {
  buyer: 'Buyer',
  supplier: 'Supplier',
  both: 'Buyer & Supplier',
};

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { colors, isDark, toggleTheme, spacing } = useTheme();
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of Agri Hub?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const handleSwitchView = () => {
    if (user.role === 'both') {
      navigation.navigate('SupplierTabs');
    }
  };

  return (
    <ScreenWrapper padded={false} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <View>
          <AppText variant="h2" weight="bold">
            My Profile
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            Agri Hub Partner Account
          </AppText>
        </View>

        <TouchableOpacity
          onPress={toggleTheme}
          style={[
            styles.iconBtn,
            { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
          ]}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          {isDark ? <Sun size={20} color={colors.primary} /> : <Moon size={20} color={colors.text} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.md }]}
      >
        <Card
          variant="outlined"
          style={[
            styles.userCard,
            { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
          ]}
        >
          <View style={styles.userCardTopRow}>
            <View style={[styles.avatarBadge, { backgroundColor: colors.primaryLight }]}>
              <User size={28} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
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
                  Registered {ROLE_LABELS[user.role] || user.role}
                </AppText>
              </View>
            </View>
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

          <Card
            variant="outlined"
            style={[
              styles.infoCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {user.mobileNumber ? (
              <View style={styles.detailRow}>
                <View style={[styles.detailIcon, { backgroundColor: colors.primaryLight }]}>
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
              <View style={[styles.detailRow, { borderTopWidth: 1, borderTopColor: colors.border }]}>
                <View style={[styles.detailIcon, { backgroundColor: colors.primaryLight }]}>
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
              <View style={[styles.detailRow, { borderTopWidth: 1, borderTopColor: colors.border }]}>
                <View style={[styles.detailIcon, { backgroundColor: colors.primaryLight }]}>
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
          </Card>
        </View>

        <View style={styles.detailsGroup}>
          <AppText
            variant="caption"
            weight="bold"
            color={colors.textSecondary}
            style={styles.groupTitle}
          >
            PREFERENCES & ACTIONS
          </AppText>

          <Card
            variant="outlined"
            style={[
              styles.infoCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={toggleTheme}
              style={styles.actionRow}
              accessibilityRole="button"
              accessibilityLabel="Toggle display theme"
            >
              <View style={[styles.detailIcon, { backgroundColor: colors.surfaceSecondary }]}>
                {isDark ? <Sun size={18} color={colors.primary} /> : <Moon size={18} color={colors.primary} />}
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="body" weight="semibold">
                  Theme Appearance
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {isDark ? 'Dark Mode (Currently Active)' : 'Light Mode (Currently Active)'}
                </AppText>
              </View>
            </TouchableOpacity>

            {user.role === 'both' && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSwitchView}
                style={[styles.actionRow, { borderTopWidth: 1, borderTopColor: colors.border }]}
                accessibilityRole="button"
                accessibilityLabel="Switch between Marketplace and Supplier view"
              >
                <View style={[styles.detailIcon, { backgroundColor: colors.primaryLight }]}>
                  <Repeat size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="body" weight="semibold" color={colors.primary}>
                    Switch to Supplier Control Panel
                  </AppText>
                  <AppText variant="caption" color={colors.textSecondary}>
                    Manage stock, inventory, and sample requests
                  </AppText>
                </View>
              </TouchableOpacity>
            )}
          </Card>
        </View>

        <Button
          title="Log Out of Agri Hub"
          variant="outline"
          size="lg"
          leftIcon={<LogOut size={18} color={colors.error} />}
          onPress={handleLogout}
          style={{ marginTop: 8, borderColor: colors.error + '60' }}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginBottom: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 16,
  },
  userCard: {
    padding: 16,
    borderRadius: 16,
  },
  userCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  detailsGroup: {
    gap: 8,
  },
  groupTitle: {
    letterSpacing: 0.5,
  },
  infoCard: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
});
