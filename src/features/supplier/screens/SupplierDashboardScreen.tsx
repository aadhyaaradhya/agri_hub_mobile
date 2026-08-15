import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Package,
  IndianRupee,
  ShoppingBag,
  CheckCircle2,
  Truck,
  ChevronRight,
  ArrowRight,
  Sun,
  Moon,
  Plus,
} from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components/AppText';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { LoadingState } from '../../../components/LoadingState';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { useMarketplace } from '../../../state/marketplace/MarketplaceContext';
import { useAuth } from '../../../state/auth/AuthContext';
import { useToast } from '../../../state/toast/ToastContext';
import { useConfig } from '../../../state/config/ConfigContext';
import { AppStackParamList, SupplierTabParamList } from '../../../navigation/types';
import { IncomingOrder } from '../../marketplace/types';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<SupplierTabParamList, 'Dashboard'>,
  NativeStackNavigationProp<AppStackParamList>
>;

// All figures here (active listings, revenue, pending orders, buyer demand)
// are derived from `MarketplaceContext` — nothing is a hardcoded stat
// anymore, so publishing a listing or a buyer submitting an inquiry moves
// these numbers immediately.
export const SupplierDashboardScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { colors, isDark, toggleTheme, spacing } = useTheme();
  const { listings, orders, inquiries, isLoaded, updateOrderStatus } = useMarketplace();
  const { config, isLoading: configLoading } = useConfig();
  const { user } = useAuth();
  const { showToast } = useToast();

  if (!isLoaded || configLoading || !config || !user) {
    return (
      <ScreenWrapper>
        <LoadingState label="Loading dashboard…" />
      </ScreenWrapper>
    );
  }

  const monthlyRevenue = orders
    .filter((o) => o.status !== 'Pending')
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;

  const handleUpdateOrderStatus = async (orderId: string, nextStatus: IncomingOrder['status']) => {
    await updateOrderStatus(orderId, nextStatus);
    showToast(`Order #${orderId} marked as ${nextStatus}.`, 'success');
  };

  return (
    <ScreenWrapper padded={false} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <View>
          <AppText variant="caption" color={colors.primary} weight="bold">
            SUPPLIER CONTROL PANEL
          </AppText>
          <AppText variant="h2" weight="bold">
            {user.companyName || user.fullName}
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
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {user.role === 'both' && (
          <TouchableOpacity
            onPress={() => navigation.navigate('BuyerTabs')}
            activeOpacity={0.85}
            style={[
              styles.bannerBox,
              {
                backgroundColor: colors.primaryLight,
                borderColor: colors.primary + '30',
                borderWidth: 1,
              },
            ]}
          >
            <View style={styles.bannerTextCol}>
              <AppText variant="subtitle" weight="bold" color={colors.primary}>
                Browse Buyer Marketplace 🌾
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Switch to view aggregate demand across grades
              </AppText>
            </View>
            <ChevronRight size={20} color={colors.primary} />
          </TouchableOpacity>
        )}

        <View style={styles.statsGrid}>
          <Card variant="outlined" style={styles.statCard}>
            <View style={[styles.statIconBadge, { backgroundColor: colors.primaryLight }]}>
              <Package size={18} color={colors.primary} />
            </View>
            <AppText variant="subtitle" weight="bold" style={styles.statValue}>
              {listings.length}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary} style={styles.statLabel}>
              Active Crop Listings
            </AppText>
          </Card>

          <Card variant="outlined" style={styles.statCard}>
            <View style={[styles.statIconBadge, { backgroundColor: colors.warningBackground }]}>
              <IndianRupee size={18} color={colors.warning} />
            </View>
            <AppText
              variant="subtitle"
              weight="bold"
              color={colors.warning}
              style={styles.statValue}
            >
              ₹{(monthlyRevenue / 100000).toFixed(2)}L
            </AppText>
            <AppText variant="caption" color={colors.textSecondary} style={styles.statLabel}>
              Revenue (Accepted+)
            </AppText>
          </Card>

          <Card variant="outlined" style={styles.statCard}>
            <View style={[styles.statIconBadge, { backgroundColor: colors.infoBackground }]}>
              <ShoppingBag size={18} color={colors.info} />
            </View>
            <AppText variant="subtitle" weight="bold" color={colors.info} style={styles.statValue}>
              {pendingOrdersCount}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary} style={styles.statLabel}>
              Pending Orders
            </AppText>
          </Card>
        </View>

        <Button
          title="+ Add New Crop Listing"
          variant="primary"
          size="lg"
          onPress={() => navigation.navigate('AddSupplyOrInquiry', { userRole: 'supplier' })}
          style={styles.addBtn}
        />

        <View style={styles.sectionHeaderRow}>
          <AppText variant="subtitle" weight="bold">
            Buyer Demand Summary
          </AppText>
        </View>
        <View
          style={[
            styles.demandCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <AppText variant="caption" color={colors.textSecondary} style={{ marginBottom: 10 }}>
            Open buyer inquiries by purity grade — {inquiries.length} total
          </AppText>
          <View style={styles.purityGrid}>
            {config.gradeOptions
              .filter((g) => g.id !== 'custom')
              .map((grade) => {
                const count = inquiries.filter(
                  (i) => i.category === grade.id && i.status === 'Open'
                ).length;
                return (
                  <View
                    key={grade.id}
                    style={[
                      styles.purityBox,
                      { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                    ]}
                  >
                    <AppText style={{ fontSize: 13 }}>{grade.emoji}</AppText>
                    <AppText
                      variant="caption"
                      weight="bold"
                      color={colors.text}
                      style={{ marginTop: 2 }}
                    >
                      {grade.label}
                    </AppText>
                    <AppText
                      variant="subtitle"
                      weight="bold"
                      color={colors.primary}
                      style={{ marginVertical: 1 }}
                    >
                      {count}
                    </AppText>
                    <AppText
                      variant="caption"
                      color={colors.textSecondary}
                      style={{ fontSize: 10 }}
                    >
                      {count === 1 ? 'buyer wants this' : 'buyers want this'}
                    </AppText>
                  </View>
                );
              })}
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <AppText variant="subtitle" weight="bold">
            Incoming Buyer Orders
          </AppText>
          <AppText variant="caption" color={colors.primary} weight="bold">
            {orders.length} Total
          </AppText>
        </View>

        {orders.map((ord) => (
          <Card key={ord.id} variant="outlined" style={styles.orderCard}>
            <View style={styles.orderHeaderRow}>
              <View style={styles.flex1}>
                <AppText variant="subtitle" weight="bold" numberOfLines={1}>
                  {ord.buyerName}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {ord.date} • Order #{ord.id}
                </AppText>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      ord.status === 'Pending'
                        ? colors.warningBackground
                        : ord.status === 'Accepted'
                          ? colors.primaryLight
                          : colors.infoBackground,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  weight="bold"
                  color={
                    ord.status === 'Pending'
                      ? colors.warning
                      : ord.status === 'Accepted'
                        ? colors.primary
                        : colors.info
                  }
                >
                  {ord.status}
                </AppText>
              </View>
            </View>

            <View style={[styles.orderBodyRow, { borderTopColor: colors.border }]}>
              <View style={styles.flex1}>
                <AppText variant="body" weight="semibold">
                  {ord.produceName} ({ord.quantity})
                </AppText>
              </View>
              <AppText variant="h2" weight="bold" color={colors.primary} style={{ marginLeft: 8 }}>
                ₹{ord.totalPrice.toLocaleString('en-IN')}
              </AppText>
            </View>

            {ord.status === 'Pending' && (
              <View style={[styles.orderFooterRow, { borderTopColor: colors.border }]}>
                <Button
                  title="Accept Order"
                  variant="primary"
                  size="sm"
                  rightIcon={<CheckCircle2 size={14} color={colors.onPrimary} />}
                  onPress={() => handleUpdateOrderStatus(ord.id, 'Accepted')}
                />
              </View>
            )}

            {ord.status === 'Accepted' && (
              <View style={[styles.orderFooterRow, { borderTopColor: colors.border }]}>
                <Button
                  title="Dispatch Shipment"
                  variant="outline"
                  size="sm"
                  rightIcon={<ArrowRight size={14} color={colors.primary} />}
                  onPress={() => handleUpdateOrderStatus(ord.id, 'Shipped')}
                />
              </View>
            )}

            {ord.status === 'Shipped' && (
              <View style={[styles.orderFooterRow, { borderTopColor: colors.border }]}>
                <Button
                  title="Mark Delivered"
                  variant="outline"
                  size="sm"
                  rightIcon={<Truck size={14} color={colors.primary} />}
                  onPress={() => handleUpdateOrderStatus(ord.id, 'Delivered')}
                />
              </View>
            )}
          </Card>
        ))}

        <View style={styles.sectionHeaderRow}>
          <AppText variant="subtitle" weight="bold">
            My Active Inventory
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {listings.length} Active Products
          </AppText>
        </View>

        {listings.map((item) => (
          <Card key={item.id} variant="outlined" style={styles.inventoryCard}>
            <View style={styles.inventoryRow}>
              <AppText style={{ fontSize: 26, marginRight: 10 }}>{item.imageEmoji}</AppText>
              <View style={{ flex: 1 }}>
                <AppText variant="subtitle" weight="bold">
                  {item.name}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  Stock: {item.stockQty} {item.unit}s • ₹{item.price} / {item.unit}
                </AppText>
              </View>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('AddSupplyOrInquiry', {
                    userRole: 'supplier',
                    existingItem: item,
                  })
                }
                style={[styles.editBtn, { borderColor: colors.border }]}
                accessibilityRole="button"
                accessibilityLabel={`Edit listing for ${item.name}`}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <AppText variant="caption" weight="bold" color={colors.primary}>
                  Edit
                </AppText>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
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
    gap: 16,
    paddingBottom: 80,
  },
  bannerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
  },
  bannerTextCol: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
    alignItems: 'flex-start',
  },
  statIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    marginTop: 6,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    lineHeight: 14,
  },
  addBtn: {
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  demandCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  purityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  purityBox: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    alignItems: 'flex-start',
  },
  orderCard: {
    padding: 16,
    borderRadius: 16,
  },
  flex1: {
    flex: 1,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  orderBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  orderFooterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  inventoryCard: {
    padding: 14,
    borderRadius: 14,
  },
  inventoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
});
