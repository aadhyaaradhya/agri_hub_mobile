import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components/AppText';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import {
  Plus,
  Package,
  IndianRupee,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck,
  User,
  ChevronRight,
  TrendingUp,
  ArrowRight,
} from 'lucide-react-native';
import { sampleSupplierStat, sampleIncomingOrders, sampleProduceList } from '../../marketplace/mockData';
import { IncomingOrder, ProduceItem } from '../../marketplace/types';
import { UserProfileModal } from '../../profile/UserProfileModal';
import { AddCropListingModal } from '../components/AddCropListingModal';

interface SupplierDashboardScreenProps {
  supplierName?: string;
  userName?: string;
  userRoleLabel?: string;
  mobileNumber?: string;
  companyName?: string;
  gstNumber?: string;
  onLogout: () => void;
  onSwitchToMarketplace: () => void;
}

export const SupplierDashboardScreen: React.FC<SupplierDashboardScreenProps> = ({
  supplierName = 'Green Agro Traders',
  userName = 'Valued Partner',
  userRoleLabel = 'Supplier',
  mobileNumber,
  companyName,
  gstNumber,
  onLogout,
  onSwitchToMarketplace,
}) => {
  const { colors, isDark, spacing } = useTheme();
  const [orders, setOrders] = useState<IncomingOrder[]>(sampleIncomingOrders);
  const [produceItems, setProduceItems] = useState<ProduceItem[]>(sampleProduceList);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);

  const handleUpdateOrderStatus = (orderId: string, nextStatus: 'Accepted' | 'Shipped') => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: nextStatus } : ord))
    );
    Alert.alert('Status Updated!', `Order #${orderId} has been marked as ${nextStatus}.`);
  };

  const handleAddProduceItem = (newProduce: ProduceItem) => {
    // Add to shared produce list for Buyer Marketplace feed
    sampleProduceList.unshift(newProduce);
    // Add to local state for Supplier Active Inventory
    setProduceItems((prev) => [newProduce, ...prev]);

    Alert.alert(
      'Listing Published! 🌱',
      `"${newProduce.name}" (${newProduce.price} ₹ / ${newProduce.unit}) is now live on the Agri Hub Marketplace.`
    );
  };

  const handleAddListing = () => {
    setIsAddCropOpen(true);
  };

  return (
    <View style={[styles.outerContainer, { backgroundColor: colors.background }]}>
      {/* Top Header Bar */}
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <View>
          <AppText variant="caption" color={colors.primary} weight="bold">
            SUPPLIER CONTROL PANEL
          </AppText>
          <AppText variant="h2" weight="bold">
            {supplierName}
          </AppText>
        </View>

        <TouchableOpacity
          onPress={() => setIsProfileOpen(true)}
          style={[styles.profileAvatar, { backgroundColor: colors.primaryLight }]}
          activeOpacity={0.7}
        >
          <User size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* User Profile Modal */}
      <UserProfileModal
        visible={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userName={userName}
        userRoleLabel={userRoleLabel}
        mobileNumber={mobileNumber}
        companyName={companyName}
        gstNumber={gstNumber}
        onLogout={onLogout}
        onSwitchView={onSwitchToMarketplace}
      />

      {/* Add Crop Listing Modal */}
      <AddCropListingModal
        visible={isAddCropOpen}
        onClose={() => setIsAddCropOpen(false)}
        onAddProduce={handleAddProduceItem}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Switch Mode Banner */}
        <TouchableOpacity
          onPress={onSwitchToMarketplace}
          activeOpacity={0.85}
          style={[
            styles.bannerBox,
            { backgroundColor: colors.primaryLight, borderColor: colors.primary + '30', borderWidth: 1 },
          ]}
        >
          <View style={styles.bannerTextCol}>
            <AppText variant="subtitle" weight="bold" color={colors.primary}>
              Browse Buyer Marketplace 🌾
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Switch to view live produce prices across mandis
            </AppText>
          </View>
          <ChevronRight size={20} color={colors.primary} />
        </TouchableOpacity>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <Card variant="outlined" style={styles.statCard}>
            <View style={[styles.statIconBadge, { backgroundColor: colors.primaryLight }]}>
              <Package size={18} color={colors.primary} />
            </View>
            <AppText variant="subtitle" weight="bold" style={styles.statValue}>
              {sampleSupplierStat.activeListings}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary} style={styles.statLabel}>
              Active Crop Listings
            </AppText>
          </Card>

          <Card variant="outlined" style={styles.statCard}>
            <View style={[styles.statIconBadge, { backgroundColor: isDark ? 'rgba(234, 179, 8, 0.15)' : '#FEF9C3' }]}>
              <IndianRupee size={18} color={colors.warning} />
            </View>
            <AppText variant="subtitle" weight="bold" color={colors.warning} style={styles.statValue}>
              ₹1.48L
            </AppText>
            <AppText variant="caption" color={colors.textSecondary} style={styles.statLabel}>
              Monthly Revenue
            </AppText>
          </Card>

          <Card variant="outlined" style={styles.statCard}>
            <View style={[styles.statIconBadge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF' }]}>
              <ShoppingBag size={18} color="#3B82F6" />
            </View>
            <AppText variant="subtitle" weight="bold" color="#3B82F6" style={styles.statValue}>
              {sampleSupplierStat.pendingOrders}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary} style={styles.statLabel}>
              Pending Orders
            </AppText>
          </Card>
        </View>

        {/* Primary Action Button */}
        <Button
          title="+ Add New Crop Listing"
          variant="primary"
          size="lg"
          onPress={handleAddListing}
          style={styles.addBtn}
        />

        {/* Incoming Orders Section */}
        <View style={styles.sectionHeaderRow}>
          <AppText variant="subtitle" weight="bold">
            Incoming Buyer Orders
          </AppText>
          <AppText variant="caption" color={colors.primary} weight="bold">
            View All ({orders.length})
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
                        ? isDark ? 'rgba(234, 179, 8, 0.2)' : '#FEF9C3'
                        : ord.status === 'Accepted'
                        ? colors.primaryLight
                        : isDark ? 'rgba(59, 130, 246, 0.2)' : '#EFF6FF',
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
                      : '#3B82F6'
                  }
                >
                  {ord.status}
                </AppText>
              </View>
            </View>

            <View style={styles.orderBodyRow}>
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
              <View style={styles.orderFooterRow}>
                <Button
                  title="Accept Order"
                  variant="primary"
                  size="sm"
                  rightIcon={<CheckCircle2 size={14} color="#FFFFFF" />}
                  onPress={() => handleUpdateOrderStatus(ord.id, 'Accepted')}
                />
              </View>
            )}

            {ord.status === 'Accepted' && (
              <View style={styles.orderFooterRow}>
                <Button
                  title="Dispatch Shipment"
                  variant="outline"
                  size="sm"
                  rightIcon={<ArrowRight size={14} color={colors.primary} />}
                  onPress={() => handleUpdateOrderStatus(ord.id, 'Shipped')}
                />
              </View>
            )}
          </Card>
        ))}

        {/* Active Inventory List */}
        <View style={styles.sectionHeaderRow}>
          <AppText variant="subtitle" weight="bold">
            My Active Inventory
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {produceItems.length} Active Products
          </AppText>
        </View>

        {produceItems.map((item) => (
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
                onPress={() => Alert.alert('Edit Listing', `Editing options for ${item.name}`)}
                style={[styles.editBtn, { borderColor: colors.border }]}
              >
                <AppText variant="caption" weight="bold" color={colors.primary}>
                  Edit
                </AppText>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    gap: 16,
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
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  orderFooterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
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
