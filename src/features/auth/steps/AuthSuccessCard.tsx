import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components/AppText';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { UserCheck, ShieldCheck } from 'lucide-react-native';
import { AuthMode, RegistrationForm, UserRole } from '../types';

interface AuthSuccessCardProps {
  authMode: AuthMode;
  roleLabel: string;
  formData: RegistrationForm;
  signInPhone: string;
  onExploreMarketplace: () => void;
}

export const AuthSuccessCard: React.FC<AuthSuccessCardProps> = ({
  authMode,
  roleLabel,
  formData,
  signInPhone,
  onExploreMarketplace,
}) => {
  const { colors } = useTheme();

  if (authMode === 'signup') {
    return (
      <Card variant="elevated" style={styles.successCard}>
        <View style={[styles.successIconBadge, { backgroundColor: colors.primaryLight }]}>
          <UserCheck size={40} color={colors.primary} />
        </View>

        <AppText variant="h1" weight="bold" style={styles.successTitle}>
          Account Ready!
        </AppText>

        <AppText variant="body" color={colors.textSecondary} style={styles.successSubtitle}>
          Welcome to <AppText variant="body" weight="bold">Agri Hub</AppText>. Registered as a{' '}
          <AppText variant="body" weight="bold" color={colors.primary}>
            {roleLabel}
          </AppText>
          .
        </AppText>

        <View
          style={[
            styles.summaryBox,
            { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, borderWidth: 1 },
          ]}
        >
          <View style={styles.summaryRow}>
            <AppText variant="body" color={colors.textSecondary}>
              Full Name:
            </AppText>
            <AppText variant="body" weight="bold">
              {formData.fullName}
            </AppText>
          </View>

          {formData.companyName ? (
            <View style={styles.summaryRow}>
              <AppText variant="body" color={colors.textSecondary}>
                Company:
              </AppText>
              <AppText variant="body" weight="bold">
                {formData.companyName}
              </AppText>
            </View>
          ) : null}

          <View style={styles.summaryRow}>
            <AppText variant="body" color={colors.textSecondary}>
              Mobile No:
            </AppText>
            <AppText variant="body" weight="bold">
              {formData.mobileNumber}
            </AppText>
          </View>

          {formData.gstNumber ? (
            <View style={styles.summaryRow}>
              <AppText variant="body" color={colors.textSecondary}>
                GSTIN:
              </AppText>
              <AppText variant="body" weight="bold">
                {formData.gstNumber}
              </AppText>
            </View>
          ) : null}
        </View>

        <Button
          title="Explore Marketplace"
          variant="primary"
          size="lg"
          onPress={onExploreMarketplace}
          style={styles.exploreBtn}
        />
      </Card>
    );
  }

  return (
    <Card variant="elevated" style={styles.successCard}>
      <View style={[styles.successIconBadge, { backgroundColor: colors.primaryLight }]}>
        <ShieldCheck size={40} color={colors.primary} />
      </View>

      <AppText variant="h1" weight="bold" style={styles.successTitle}>
        Welcome Back!
      </AppText>

      <AppText variant="body" color={colors.textSecondary} style={styles.successSubtitle}>
        Successfully authenticated for{' '}
        <AppText variant="body" weight="bold" color={colors.primary}>
          +91 {signInPhone}
        </AppText>
        .
      </AppText>

      <Button
        title="Go to Marketplace"
        variant="primary"
        size="lg"
        onPress={onExploreMarketplace}
        style={styles.exploreBtn}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  successCard: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 12,
  },
  successIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  summaryBox: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exploreBtn: {
    width: '100%',
  },
});
