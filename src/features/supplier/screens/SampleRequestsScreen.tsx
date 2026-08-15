import React from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Inbox, MapPin, Phone, Sun, Moon } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { AppText } from '../../../components/AppText';
import { Card } from '../../../components/Card';
import { EmptyState } from '../../../components/EmptyState';
import { LoadingState } from '../../../components/LoadingState';
import { useMarketplace } from '../../../state/marketplace/MarketplaceContext';

export const SampleRequestsScreen: React.FC = () => {
  const { colors, isDark, toggleTheme, spacing } = useTheme();
  const { sampleRequests, isLoaded } = useMarketplace();

  if (!isLoaded) {
    return (
      <ScreenWrapper>
        <LoadingState label="Loading sample requests…" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padded={false} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <View style={{ flex: 1 }}>
          <AppText variant="h2" weight="bold">
            Incoming Sample Requests
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            Buyers requesting a physical sample of your Psyllium Husk grades
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

      <FlatList
        data={sampleRequests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
        ]}
        ListEmptyComponent={
          <EmptyState
            icon={Inbox}
            title="No sample requests yet"
            description="When a buyer requests a sample from the Marketplace, it'll show up here with their delivery details."
          />
        }
        renderItem={({ item }) => (
          <Card variant="outlined" style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={{ flex: 1 }}>
                <AppText variant="body" weight="bold">
                  {item.companyName}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  Psyllium Husk {item.purityGrade} Pure • {item.sampleQuantity}
                </AppText>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: colors.warningBackground }]}>
                <AppText variant="caption" weight="bold" color={colors.warning}>
                  {item.status}
                </AppText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MapPin size={13} color={colors.textMuted} />
              <AppText
                variant="caption"
                color={colors.textMuted}
                style={styles.detailText}
                numberOfLines={2}
              >
                {item.deliveryAddress}
              </AppText>
            </View>
            {item.contactNumber ? (
              <View style={styles.detailRow}>
                <Phone size={13} color={colors.textMuted} />
                <AppText variant="caption" color={colors.textMuted} style={styles.detailText}>
                  {item.contactNumber}
                </AppText>
              </View>
            ) : null}
            <AppText variant="caption" color={colors.textMuted} style={{ marginTop: 4 }}>
              GSTIN: {item.gstNumber}
            </AppText>
          </Card>
        )}
      />
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
  list: { gap: 12 },
  card: { padding: 14, borderRadius: 14 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  detailText: { marginLeft: 6, flex: 1 },
});
