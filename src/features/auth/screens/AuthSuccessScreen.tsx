import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { UserCheck, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { Card } from '../../../components/Card';
import { AppText } from '../../../components/AppText';
import { Button } from '../../../components/Button';
import { AuthStackParamList } from '../../../navigation/types';
import { useAuth } from '../../../state/auth/AuthContext';

type Rt = RouteProp<AuthStackParamList, 'AuthSuccess'>;

const ROLE_LABELS: Record<string, string> = {
  buyer: 'Buyer',
  supplier: 'Supplier',
  both: 'Buyer & Supplier',
};

// `login()` only fires here, on the explicit button tap — not the moment
// the previous screen's API call resolved. That's deliberate: AuthContext
// flipping to "authenticated" is what makes RootNavigator swap AuthNavigator
// for AppNavigator, so calling `login()` any earlier would yank this
// confirmation screen away before the user ever saw it.
export const AuthSuccessScreen: React.FC = () => {
  const { params } = useRoute<Rt>();
  const { spacing, colors } = useTheme();
  const { login } = useAuth();
  const { user } = params;

  const isSignup = params.mode === 'signup';

  return (
    <ScreenWrapper padded={false}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingHorizontal: spacing.md, paddingBottom: spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="elevated" style={styles.successCard}>
          <View style={[styles.successIconBadge, { backgroundColor: colors.primaryLight }]}>
            {isSignup ? (
              <UserCheck size={40} color={colors.primary} />
            ) : (
              <ShieldCheck size={40} color={colors.primary} />
            )}
          </View>

          <AppText variant="h1" weight="bold" style={styles.successTitle}>
            {isSignup ? 'Account Ready!' : 'Welcome Back!'}
          </AppText>

          <AppText variant="body" color={colors.textSecondary} style={styles.successSubtitle}>
            {isSignup ? (
              <>
                Welcome to{' '}
                <AppText variant="body" weight="bold">
                  Agri Hub
                </AppText>
                . Registered as a{' '}
                <AppText variant="body" weight="bold" color={colors.primary}>
                  {ROLE_LABELS[user.role]}
                </AppText>
                .
              </>
            ) : (
              <>
                Successfully authenticated as{' '}
                <AppText variant="body" weight="bold" color={colors.primary}>
                  {user.fullName || user.email || user.mobileNumber}
                </AppText>
                .
              </>
            )}
          </AppText>

          {isSignup && (
            <View
              style={[
                styles.summaryBox,
                {
                  backgroundColor: colors.surfaceSecondary,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
            >
              <View style={styles.summaryRow}>
                <AppText variant="body" color={colors.textSecondary}>
                  Full Name:
                </AppText>
                <AppText variant="body" weight="bold">
                  {user.fullName}
                </AppText>
              </View>
              {user.companyName ? (
                <View style={styles.summaryRow}>
                  <AppText variant="body" color={colors.textSecondary}>
                    Company:
                  </AppText>
                  <AppText variant="body" weight="bold">
                    {user.companyName}
                  </AppText>
                </View>
              ) : null}
              <View style={styles.summaryRow}>
                <AppText variant="body" color={colors.textSecondary}>
                  Mobile No:
                </AppText>
                <AppText variant="body" weight="bold">
                  {user.mobileNumber}
                </AppText>
              </View>
              {user.gstNumber ? (
                <View style={styles.summaryRow}>
                  <AppText variant="body" color={colors.textSecondary}>
                    GSTIN:
                  </AppText>
                  <AppText variant="body" weight="bold">
                    {user.gstNumber}
                  </AppText>
                </View>
              ) : null}
            </View>
          )}

          <Button
            title={user.role === 'supplier' ? 'Go to Dashboard' : 'Explore Marketplace'}
            variant="primary"
            size="lg"
            onPress={() => login(params.user, params.session)}
            style={styles.exploreBtn}
          />
        </Card>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingTop: 12 },
  successCard: { padding: 24, alignItems: 'center', borderRadius: 20, marginTop: 12 },
  successIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: { textAlign: 'center', marginBottom: 8 },
  successSubtitle: { textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  summaryBox: { width: '100%', padding: 16, borderRadius: 12, gap: 12, marginBottom: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exploreBtn: { width: '100%' },
});
