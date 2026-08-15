import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ClipboardList, Package, Sprout, Sun, Moon } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { AppText } from '../../../components/AppText';
import { Card } from '../../../components/Card';
import { EmptyState } from '../../../components/EmptyState';
import { LoadingState } from '../../../components/LoadingState';
import { useMarketplace } from '../../../state/marketplace/MarketplaceContext';
import { BuyerTabParamList } from '../../../navigation/types';
import { Inquiry, SampleRequest } from '../types';

type Row = { kind: 'inquiry'; data: Inquiry } | { kind: 'sample'; data: SampleRequest };
type Rt = RouteProp<BuyerTabParamList, 'MyRequests' | 'MyInquiries'>;

const STATUS_COLOR_KEY: Record<string, 'primary' | 'warning' | 'info'> = {
  Open: 'info',
  Pending: 'warning',
  Fulfilled: 'primary',
  Dispatched: 'info',
  Delivered: 'primary',
  Closed: 'warning',
};

export const MyRequestsScreen: React.FC = () => {
  const route = useRoute<Rt>();
  const { colors, isDark, toggleTheme, spacing } = useTheme();
  const { inquiries, sampleRequests, isLoaded } = useMarketplace();

  const [activeFilter, setActiveFilter] = useState<'all' | 'inquiries' | 'samples'>(
    route.params?.filter || 'all'
  );

  useEffect(() => {
    if (route.params?.filter) {
      setActiveFilter(route.params.filter);
    }
  }, [route.params?.filter]);

  if (!isLoaded) {
    return (
      <ScreenWrapper>
        <LoadingState label="Loading your requests…" />
      </ScreenWrapper>
    );
  }

  const allRows: Row[] = [
    ...inquiries.map((data): Row => ({ kind: 'inquiry', data })),
    ...sampleRequests.map((data): Row => ({ kind: 'sample', data })),
  ].sort((a, b) => b.data.createdAt - a.data.createdAt);

  const filteredRows =
    activeFilter === 'inquiries'
      ? allRows.filter((r) => r.kind === 'inquiry')
      : activeFilter === 'samples'
        ? allRows.filter((r) => r.kind === 'sample')
        : allRows;

  return (
    <ScreenWrapper padded={false} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <View style={{ flex: 1 }}>
          <AppText variant="h2" weight="bold">
            {activeFilter === 'inquiries' ? 'My Inquiries' : 'My Requests'}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {activeFilter === 'inquiries'
              ? 'Track specifications and quotes you requested'
              : 'Track your inquiries and sample requests'}
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

      {/* Filter Tabs */}
      <View style={[styles.tabsRow, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveFilter('all')}
          style={[
            styles.tabChip,
            activeFilter === 'all'
              ? { backgroundColor: colors.primary }
              : { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, borderWidth: 1 },
          ]}
        >
          <AppText
            variant="caption"
            weight="bold"
            color={activeFilter === 'all' ? colors.onPrimary : colors.textSecondary}
          >
            All ({allRows.length})
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveFilter('inquiries')}
          style={[
            styles.tabChip,
            activeFilter === 'inquiries'
              ? { backgroundColor: colors.primary }
              : { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, borderWidth: 1 },
          ]}
        >
          <AppText
            variant="caption"
            weight="bold"
            color={activeFilter === 'inquiries' ? colors.onPrimary : colors.textSecondary}
          >
            Inquiries ({inquiries.length})
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveFilter('samples')}
          style={[
            styles.tabChip,
            activeFilter === 'samples'
              ? { backgroundColor: colors.primary }
              : { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, borderWidth: 1 },
          ]}
        >
          <AppText
            variant="caption"
            weight="bold"
            color={activeFilter === 'samples' ? colors.onPrimary : colors.textSecondary}
          >
            Samples ({sampleRequests.length})
          </AppText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredRows}
        keyExtractor={(row) => row.data.id}
        contentContainerStyle={[
          styles.list,
          { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
        ]}
        ListEmptyComponent={
          <EmptyState
            icon={activeFilter === 'inquiries' ? Sprout : ClipboardList}
            title={activeFilter === 'inquiries' ? 'No inquiries yet' : 'No requests yet'}
            description={
              activeFilter === 'inquiries'
                ? 'Tap the + button below to submit a new inquiry specification.'
                : 'Inquiries and sample requests you submit from the Marketplace will show up here.'
            }
          />
        }
        renderItem={({ item }) => {
          const statusKey = STATUS_COLOR_KEY[item.data.status] || 'info';
          const statusColor =
            statusKey === 'primary'
              ? colors.primary
              : statusKey === 'warning'
                ? colors.warning
                : colors.info;
          const statusBg =
            statusKey === 'primary'
              ? colors.primaryLight
              : statusKey === 'warning'
                ? colors.warningBackground
                : colors.infoBackground;

          return (
            <Card variant="outlined" style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={[styles.iconBadge, { backgroundColor: colors.surfaceSecondary }]}>
                  {item.kind === 'inquiry' ? (
                    <ClipboardList size={18} color={colors.primary} />
                  ) : (
                    <Package size={18} color={colors.primary} />
                  )}
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <AppText variant="body" weight="bold">
                    {item.kind === 'inquiry'
                      ? item.data.gradeName
                      : `Psyllium Husk ${item.data.purityGrade} Pure`}
                  </AppText>
                  <AppText variant="caption" color={colors.textSecondary}>
                    {item.kind === 'inquiry'
                      ? `Inquiry • ${item.data.quantityNeeded} ${item.data.unit}`
                      : `Sample Request • ${item.data.sampleQuantity}`}
                  </AppText>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                  <AppText variant="caption" weight="bold" color={statusColor}>
                    {item.data.status}
                  </AppText>
                </View>
              </View>
            </Card>
          );
        }}
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
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { gap: 12 },
  card: { padding: 14, borderRadius: 14 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
});
