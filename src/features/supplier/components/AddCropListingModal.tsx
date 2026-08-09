import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components/AppText';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { AppInput } from '../../../components/AppInput';
import {
  Sprout,
  X,
  IndianRupee,
  Package,
  MapPin,
  Leaf,
  Plus,
  ArrowRight,
  FileText,
} from 'lucide-react-native';
import { ProduceCategory, ProduceItem } from '../../marketplace/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AddCropListingModalProps {
  visible: boolean;
  onClose: () => void;
  onAddProduce: (newProduce: ProduceItem) => void;
}

const categoryOptions: { id: ProduceCategory; label: string; emoji: string }[] = [
  { id: 'grains', label: 'Grains & Pulses', emoji: '🌾' },
  { id: 'vegetables', label: 'Vegetables', emoji: '🥬' },
  { id: 'fruits', label: 'Organic Fruits', emoji: '🍎' },
  { id: 'inputs', label: 'Seeds & Fertilizer', emoji: '🧪' },
  { id: 'equipment', label: 'Tools & Tractors', emoji: '🚜' },
];

const unitOptions = ['Quintal', 'Kg', 'Bag (50kg)', 'Dozen', 'Day'];

export const AddCropListingModal: React.FC<AddCropListingModalProps> = ({
  visible,
  onClose,
  onAddProduce,
}) => {
  const { colors, isDark, spacing } = useTheme();
  const [renderModal, setRenderModal] = useState(visible);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProduceCategory>('grains');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('Quintal');
  const [stockQty, setStockQty] = useState('');
  const [moq, setMoq] = useState('');
  const [location, setLocation] = useState('Ludhiana, Punjab');
  const [isOrganic, setIsOrganic] = useState(true);

  // Error State
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    stockQty?: string;
    moq?: string;
    location?: string;
  }>({});

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setRenderModal(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 60,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRenderModal(false);
      });
    }
  }, [visible]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Crop / Produce name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const numPrice = parseFloat(price);
    if (!price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(numPrice) || numPrice <= 0) {
      newErrors.price = 'Enter a valid positive price';
    }

    const numStock = parseInt(stockQty, 10);
    if (!stockQty.trim()) {
      newErrors.stockQty = 'Available stock is required';
    } else if (isNaN(numStock) || numStock <= 0) {
      newErrors.stockQty = 'Enter a valid stock quantity';
    }

    if (!moq.trim()) {
      newErrors.moq = 'Minimum order quantity is required';
    }

    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const selectedCategoryOption = categoryOptions.find((c) => c.id === category);

    const newProduce: ProduceItem = {
      id: `crop-${Date.now()}`,
      name: name.trim(),
      category: category,
      price: parseFloat(price),
      unit: unit,
      supplierName: 'Your Farm Enterprise',
      location: location.trim(),
      moq: moq.trim(),
      rating: 5.0,
      isOrganic: isOrganic,
      isVerified: true,
      stockQty: parseInt(stockQty, 10),
      imageEmoji: selectedCategoryOption ? selectedCategoryOption.emoji : '🌾',
    };

    onAddProduce(newProduce);

    // Reset form
    setName('');
    setPrice('');
    setStockQty('');
    setMoq('');
    setErrors({});
    onClose();
  };

  if (!renderModal) return null;

  return (
    <View style={styles.containerOverlay} pointerEvents="box-none">
      {/* Dimmed Backdrop */}
      <Animated.View
        style={[
          styles.backdropOverlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Animated Bottom Sheet */}
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
        {/* Drag Handle */}
        <View style={styles.dragHandleContainer}>
          <View style={[styles.dragHandlePill, { backgroundColor: colors.border }]} />
        </View>

        {/* Sheet Header */}
        <View style={styles.modalHeader}>
          <View style={styles.headerTitleRow}>
            <View style={[styles.badgeIcon, { backgroundColor: colors.primaryLight }]}>
              <Plus size={22} color={colors.primary} />
            </View>
            <View style={{ marginLeft: 12 }}>
              <AppText variant="subtitle" weight="bold">
                Add New Crop Listing
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                List produce to sell on Agri Hub
              </AppText>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: colors.surfaceSecondary }]}
            activeOpacity={0.7}
          >
            <X size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollFlex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.bodyScroll}
        >
          {/* Produce Name */}
          <AppInput
            label="Produce / Crop Name"
            required
            placeholder="e.g. Sharbati Organic Wheat"
            value={name}
            onChangeText={(val) => {
              setName(val);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            error={errors.name}
            leftIcon={<Sprout size={20} color={colors.primary} />}
          />

          {/* Category Chips Selection */}
          <View style={styles.sectionCol}>
            <AppText variant="caption" weight="bold" color={colors.textSecondary} style={styles.inputLabel}>
              Select Category <AppText color={colors.error}>*</AppText>
            </AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {categoryOptions.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    activeOpacity={0.8}
                    onPress={() => setCategory(cat.id)}
                    style={[
                      styles.chipItem,
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

          {/* Price per Unit */}
          <AppInput
            label="Price per Unit (₹)"
            required
            placeholder="e.g. 2450"
            keyboardType="number-pad"
            value={price}
            onChangeText={(val) => {
              setPrice(val.replace(/\D/g, ''));
              if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }));
            }}
            error={errors.price}
            leftIcon={<IndianRupee size={18} color={colors.primary} />}
          />

          {/* Unit Type Selection */}
          <View style={styles.sectionCol}>
            <AppText variant="caption" weight="bold" color={colors.textSecondary} style={styles.inputLabel}>
              Unit Type <AppText color={colors.error}>*</AppText>
            </AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {unitOptions.map((u) => {
                const isSelected = unit === u;
                return (
                  <TouchableOpacity
                    key={u}
                    activeOpacity={0.8}
                    onPress={() => setUnit(u)}
                    style={[
                      styles.unitChip,
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
                    <AppText
                      variant="caption"
                      weight="bold"
                      color={isSelected ? '#FFFFFF' : colors.text}
                    >
                      {u}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Available Stock & MOQ Row */}
          <View style={styles.rowTwoCol}>
            <View style={{ flex: 1 }}>
              <AppInput
                label="Total Stock"
                required
                placeholder="e.g. 250"
                keyboardType="number-pad"
                value={stockQty}
                onChangeText={(val) => {
                  setStockQty(val.replace(/\D/g, ''));
                  if (errors.stockQty) setErrors((prev) => ({ ...prev, stockQty: undefined }));
                }}
                error={errors.stockQty}
                leftIcon={<Package size={18} color={colors.primary} />}
              />
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <AppInput
                label="Min Order Qty"
                required
                placeholder="e.g. 10 Quintals"
                value={moq}
                onChangeText={(val) => {
                  setMoq(val);
                  if (errors.moq) setErrors((prev) => ({ ...prev, moq: undefined }));
                }}
                error={errors.moq}
                leftIcon={<FileText size={18} color={colors.primary} />}
              />
            </View>
          </View>

          {/* Harvest Location */}
          <AppInput
            label="Harvest Location"
            required
            placeholder="e.g. Ludhiana, Punjab"
            value={location}
            onChangeText={(val) => {
              setLocation(val);
              if (errors.location) setErrors((prev) => ({ ...prev, location: undefined }));
            }}
            error={errors.location}
            leftIcon={<MapPin size={20} color={colors.primary} />}
          />

          {/* Organic Toggle Badge */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setIsOrganic(!isOrganic)}
            style={[
              styles.organicCard,
              {
                backgroundColor: isOrganic ? colors.primaryLight : colors.surfaceSecondary,
                borderColor: isOrganic ? colors.primary : colors.border,
              },
            ]}
          >
            <Leaf size={20} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <AppText variant="subtitle" weight="bold" color={colors.primary}>
                {isOrganic ? 'Certified Organic Crop 🌱' : 'Standard Conventional Crop'}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Tap to toggle organic badge on marketplace listing
              </AppText>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Sticky Action Footer */}
        <View style={[styles.stickyFooter, { backgroundColor: colors.surface }]}>
          <Button
            title="Publish Crop Listing"
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight size={20} color="#FFFFFF" />}
            onPress={handleSubmit}
          />
        </View>
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
    paddingBottom: 24,
    height: '84%',
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
  badgeIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
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
    paddingBottom: 16,
    gap: 14,
  },
  scrollFlex: {
    flex: 1,
  },
  sectionCol: {
    marginBottom: 4,
  },
  inputLabel: {
    marginBottom: 6,
  },
  chipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  rowTwoCol: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  unitChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  organicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  stickyFooter: {
    paddingTop: 12,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
});
