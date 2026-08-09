import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components/AppText';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import {
  Search,
  MapPin,
  ShoppingCart,
  Star,
  CheckCircle2,
  Leaf,
  Filter,
  ArrowRight,
  User,
} from 'lucide-react-native';
import { ProduceCategory, ProduceItem } from '../types';
import { categoryOptions, sampleProduceList } from '../mockData';
import { UserProfileModal } from '../../profile/UserProfileModal';

interface MarketplaceScreenProps {
  userRoleLabel: string;
  userName?: string;
  mobileNumber?: string;
  companyName?: string;
  gstNumber?: string;
  onLogout: () => void;
  onSwitchView?: () => void;
}

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({
  userRoleLabel,
  userName = 'Valued Partner',
  mobileNumber,
  companyName,
  gstNumber,
  onLogout,
  onSwitchView,
}) => {
  const { colors, isDark, spacing } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<ProduceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Filter produce list by category & search query
  const filteredProduce = sampleProduceList.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleInquire = (item: ProduceItem) => {
    setCartCount((prev) => prev + 1);
    Alert.alert(
      'Inquiry Placed!',
      `Inquiry for "${item.name}" (${item.price} / ${item.unit}) sent to ${item.supplierName}.`
    );
  };

  return (
    <View style={[styles.outerContainer, { backgroundColor: colors.background }]}>
      {/* Top Marketplace Bar */}
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <View>
          <View style={styles.locationRow}>
            <MapPin size={14} color={colors.primary} />
            <AppText variant="caption" color={colors.primary} weight="semibold" style={{ marginLeft: 4 }}>
              Punjab, India
            </AppText>
          </View>
          <AppText variant="h2" weight="bold">
            Agri Marketplace
          </AppText>
        </View>

        <View style={styles.headerRightRow}>
          <TouchableOpacity
            style={[styles.cartBadge, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <ShoppingCart size={20} color={colors.text} />
            {cartCount > 0 && (
              <View style={[styles.cartBadgeCount, { backgroundColor: colors.primary }]}>
                <AppText variant="caption" weight="bold" color="#FFFFFF" style={{ fontSize: 10 }}>
                  {cartCount}
                </AppText>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsProfileOpen(true)}
            style={[styles.profileAvatar, { backgroundColor: colors.primaryLight }]}
            activeOpacity={0.7}
          >
            <User size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
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
        onSwitchView={onSwitchView}
      />

      {/* Search Input Bar */}
      <View style={[styles.searchWrapper, { paddingHorizontal: spacing.md }]}>
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
          ]}
        >
          <Search size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search wheat, rice, tomatoes, fertilizer..."
            placeholderTextColor={colors.textSecondary + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Horizontal Category Chips */}
      <View style={styles.categorySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.md, gap: 8 }}
        >
          {categoryOptions.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : isDark
                      ? colors.surfaceSecondary
                      : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <AppText style={{ fontSize: 13, marginRight: 4 }}>{cat.emoji}</AppText>
                <AppText
                  variant="caption"
                  weight="bold"
                  color={isSelected ? '#FFFFFF' : colors.text}
                >
                  {cat.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Produce Feed */}
      <ScrollView
        contentContainerStyle={[
          styles.feedContent,
          { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultsHeaderRow}>
          <AppText variant="subtitle" weight="bold">
            {selectedCategory === 'all' ? 'All Agriculture Listings' : 'Category Produce'}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {filteredProduce.length} Items Found
          </AppText>
        </View>

        {filteredProduce.map((item) => (
          <Card key={item.id} variant="outlined" style={styles.produceCard}>
            <View style={styles.cardMainRow}>
              {/* Emoji Thumbnail Badge */}
              <View
                style={[
                  styles.itemThumbnail,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.06)'
                      : colors.surfaceSecondary,
                  },
                ]}
              >
                <AppText style={{ fontSize: 32 }}>{item.imageEmoji}</AppText>
              </View>

              {/* Produce Details Column */}
              <View style={styles.itemDetailsCol}>
                <View style={styles.titleBadgeRow}>
                  <AppText variant="subtitle" weight="bold" style={styles.produceTitle}>
                    {item.name}
                  </AppText>
                  {item.isOrganic && (
                    <View style={[styles.miniBadge, { backgroundColor: colors.primaryLight }]}>
                      <Leaf size={10} color={colors.primary} />
                      <AppText
                        variant="caption"
                        weight="bold"
                        color={colors.primary}
                        style={{ fontSize: 10, marginLeft: 2 }}
                      >
                        Organic
                      </AppText>
                    </View>
                  )}
                </View>

                {/* Price & Unit */}
                <View style={styles.priceRow}>
                  <AppText variant="h2" weight="bold" color={colors.primary}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </AppText>
                  <AppText variant="caption" color={colors.textSecondary} style={{ marginLeft: 4 }}>
                    / {item.unit}
                  </AppText>
                </View>

                {/* Supplier & Location Info */}
                <View style={styles.supplierMetaRow}>
                  <AppText variant="caption" color={colors.textSecondary}>
                    By {item.supplierName}
                  </AppText>
                  {item.isVerified && (
                    <CheckCircle2 size={13} color={colors.primary} style={{ marginLeft: 4 }} />
                  )}
                </View>

                <View style={styles.moqRow}>
                  <MapPin size={12} color={colors.textMuted} />
                  <AppText variant="caption" color={colors.textMuted} style={{ marginLeft: 3 }}>
                    {item.location} • Min: {item.moq}
                  </AppText>
                </View>
              </View>
            </View>

            {/* Bottom Card Action Row */}
            <View style={styles.cardFooterRow}>
              <View style={styles.ratingBox}>
                <Star size={14} color={colors.warning} fill={colors.warning} />
                <AppText variant="caption" weight="bold" style={{ marginLeft: 4 }}>
                  {item.rating}
                </AppText>
              </View>

              <Button
                title="Inquire & Order"
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight size={14} color="#FFFFFF" />}
                onPress={() => handleInquire(item)}
              />
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  cartBadgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrapper: {
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  feedContent: {
    gap: 14,
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  produceCard: {
    padding: 16,
    borderRadius: 16,
  },
  cardMainRow: {
    flexDirection: 'row',
    gap: 12,
  },
  itemThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDetailsCol: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  produceTitle: {
    fontSize: 15,
    flex: 1,
  },
  miniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  supplierMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  moqRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
