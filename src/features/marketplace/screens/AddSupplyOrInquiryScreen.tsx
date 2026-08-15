import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight, IndianRupee, Package, FileText, Sprout, X } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { AppText } from '../../../components/AppText';
import { Button } from '../../../components/Button';
import { AppInput } from '../../../components/AppInput';
import { LoadingState } from '../../../components/LoadingState';
import { useConfig } from '../../../state/config/ConfigContext';
import { useMarketplace } from '../../../state/marketplace/MarketplaceContext';
import { useAuth } from '../../../state/auth/AuthContext';
import { useToast } from '../../../state/toast/ToastContext';
import { AppStackParamList } from '../../../navigation/types';
import { ProduceCategory, ProduceItem, Inquiry } from '../types';

type Nav = NativeStackNavigationProp<AppStackParamList, 'AddSupplyOrInquiry'>;
type Rt = RouteProp<AppStackParamList, 'AddSupplyOrInquiry'>;

// Replaces the old `AddCropListingModal` bottom-sheet with a real full-screen
// navigator route (the client was explicit: forms must open full-screen,
// not as a half-cut popup). Serves both "New Supply" (supplier) and
// "New Inquiry" (buyer) — same fields, only the copy and which service
// method gets called differ — plus "Edit Listing" via `existingItem`.
export const AddSupplyOrInquiryScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const { userRole, existingItem } = params;
  const isEditing = !!existingItem;
  const { colors, isDark, spacing } = useTheme();
  const { config, isLoading } = useConfig();
  const { addListing, updateListing, addInquiry } = useMarketplace();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedGradeId, setSelectedGradeId] = useState<ProduceCategory>(
    existingItem?.category || 'husk_98'
  );
  const [customGradeName, setCustomGradeName] = useState('');
  const [price, setPrice] = useState(existingItem ? String(existingItem.price) : '');
  const [unit, setUnit] = useState(existingItem?.unit || 'Kg');
  const [stockQty, setStockQty] = useState(existingItem ? String(existingItem.stockQty) : '');
  const [quantity, setQuantity] = useState(existingItem?.moq || '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    grade?: string;
    price?: string;
    stockQty?: string;
    quantity?: string;
  }>({});

  if (isLoading || !config) {
    return (
      <ScreenWrapper>
        <LoadingState label="Loading form…" />
      </ScreenWrapper>
    );
  }

  const gradeOptions = config.gradeOptions;
  const unitOptions = config.unitOptions;
  const selectedOption = gradeOptions.find((g) => g.id === selectedGradeId);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (selectedGradeId === 'custom' && !customGradeName.trim()) {
      newErrors.grade = 'Please type your required grade specification';
    }
    const numPrice = parseFloat(price);
    if (!price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(numPrice) || numPrice <= 0) {
      newErrors.price = 'Enter a valid positive price';
    }
    if (userRole === 'supplier') {
      const numStock = parseInt(stockQty, 10);
      if (!stockQty.trim()) {
        newErrors.stockQty = 'Available stock is required';
      } else if (isNaN(numStock) || numStock <= 0) {
        newErrors.stockQty = 'Enter a valid stock quantity';
      }
    }
    if (!quantity.trim()) {
      newErrors.quantity =
        userRole === 'buyer' ? 'Quantity needed is required' : 'Order quantity is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || isSubmitting) return;
    setIsSubmitting(true);

    const finalGradeName =
      selectedGradeId === 'custom'
        ? customGradeName.trim()
        : selectedOption?.gradeName || selectedOption?.label || 'Psyllium Husk';

    try {
      if (userRole === 'supplier') {
        const item: ProduceItem = {
          id: existingItem?.id || `husk-${Date.now()}`,
          name: finalGradeName,
          grade: finalGradeName,
          category: selectedGradeId,
          price: parseFloat(price),
          unit,
          supplierName: user?.companyName || user?.fullName || 'Your Enterprise',
          moq: quantity.trim(),
          rating: existingItem?.rating ?? 5.0,
          isVerified: true,
          stockQty: parseInt(stockQty, 10),
          imageEmoji: selectedOption?.emoji || '🌿',
        };
        if (isEditing) {
          await updateListing(item);
          showToast(`"${item.name}" updated successfully.`, 'success');
        } else {
          await addListing(item);
          showToast(`"${item.name}" is now live on the Agri Hub Marketplace.`, 'success');
        }
      } else {
        const inquiry: Inquiry = {
          id: `inq-${Date.now()}`,
          buyerName: user?.fullName || 'Valued Partner',
          buyerCompany: user?.companyName,
          category: selectedGradeId,
          gradeName: finalGradeName,
          quantityNeeded: quantity.trim(),
          unit,
          notes: notes.trim() || undefined,
          status: 'Open',
          createdAt: Date.now(),
        };
        await addInquiry(inquiry);
        showToast('Your inquiry has been submitted to suppliers.', 'success');
      }
      navigation.goBack();
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = isEditing ? 'Edit Listing' : userRole === 'buyer' ? 'New Inquiry' : 'New Supply';
  const subtitle = isEditing
    ? 'Update your Psyllium Husk supply details'
    : userRole === 'buyer'
      ? 'List your Psyllium Husk inquiry specifications'
      : 'List your Psyllium Husk supply specifications';
  const submitLabel = isEditing
    ? 'Save Changes'
    : userRole === 'buyer'
      ? 'Submit Inquiry'
      : 'Submit Supply';

  return (
    <ScreenWrapper padded={false}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <AppText variant="subtitle" weight="bold">
            {title}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {subtitle}
          </AppText>
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.closeBtn,
            { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, borderWidth: 1 },
          ]}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.bodyScroll, { paddingHorizontal: spacing.md }]}
      >
        <View style={styles.sectionCol}>
          <View style={[styles.productBannerBox, { backgroundColor: colors.primaryLight }]}>
            <AppText variant="caption" weight="bold" color={colors.textSecondary}>
              PRODUCT:
            </AppText>
            <AppText
              variant="subtitle"
              weight="bold"
              color={colors.primary}
              style={{ marginLeft: 6 }}
            >
              {config.productLabel}
            </AppText>
          </View>

          <AppText
            variant="caption"
            weight="bold"
            color={colors.textSecondary}
            style={styles.inputLabel}
          >
            Select Grade Purity <AppText color={colors.error}>*</AppText>
          </AppText>
          <View style={styles.smallTabsContainer}>
            {gradeOptions.map((grade) => {
              const isSelected = selectedGradeId === grade.id;
              return (
                <TouchableOpacity
                  key={grade.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedGradeId(grade.id);
                    if (errors.grade) setErrors((prev) => ({ ...prev, grade: undefined }));
                  }}
                  style={[
                    styles.smallGradeTab,
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
                  {grade.id !== 'custom' && (
                    <AppText style={{ fontSize: 13, marginRight: 4 }}>{grade.emoji}</AppText>
                  )}
                  <AppText
                    variant="caption"
                    weight="bold"
                    color={isSelected ? colors.onPrimary : colors.text}
                    style={{ fontSize: 13 }}
                  >
                    {grade.id === 'custom' ? '✏️ Custom Grade' : grade.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {selectedGradeId === 'custom' && (
          <AppInput
            label="Type Required Grade"
            required
            placeholder="e.g. Psyllium Husk 99.5% Extra Fine Powder"
            value={customGradeName}
            onChangeText={(val) => {
              setCustomGradeName(val);
              if (errors.grade) setErrors((prev) => ({ ...prev, grade: undefined }));
            }}
            error={errors.grade}
            leftIcon={<Sprout size={20} color={colors.primary} />}
          />
        )}

        <AppInput
          label={userRole === 'buyer' ? 'Target Price per Unit (₹)' : 'Price per Unit (₹)'}
          required
          placeholder="e.g. 290"
          keyboardType="number-pad"
          value={price}
          onChangeText={(val) => {
            setPrice(val.replace(/\D/g, ''));
            if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }));
          }}
          error={errors.price}
          leftIcon={<IndianRupee size={18} color={colors.primary} />}
        />

        <View style={styles.sectionCol}>
          <AppText
            variant="caption"
            weight="bold"
            color={colors.textSecondary}
            style={styles.inputLabel}
          >
            Unit (kgs & Tons) <AppText color={colors.error}>*</AppText>
          </AppText>
          <View style={{ flexDirection: 'row', gap: 12 }}>
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
                      flex: 1,
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
                    variant="body"
                    weight="bold"
                    color={isSelected ? colors.onPrimary : colors.text}
                  >
                    {u === 'Kg' ? 'kgs' : 'Tons'}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.rowTwoCol}>
          <View style={{ flex: 1 }}>
            <AppInput
              label={userRole === 'buyer' ? 'Quantity Needed' : 'Order Quantity'}
              required
              placeholder="e.g. 500 Kg or 2 Tons"
              value={quantity}
              onChangeText={(val) => {
                setQuantity(val);
                if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: undefined }));
              }}
              error={errors.quantity}
              leftIcon={<FileText size={18} color={colors.primary} />}
            />
          </View>

          {userRole === 'supplier' && (
            <View style={{ flex: 1, marginLeft: 12 }}>
              <AppInput
                label="Available Stock"
                required
                placeholder="e.g. 5000"
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
          )}
        </View>

        <AppInput
          label="Additional Specifications / Notes (Optional)"
          placeholder="Enter any specific requirements, packaging, or remarks..."
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
          leftIcon={<FileText size={18} color={colors.primary} />}
        />
      </ScrollView>

      <View
        style={[
          styles.stickyFooter,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        <Button
          title="Cancel"
          variant="outline"
          size="lg"
          style={{ flex: 1, marginRight: 10 }}
          onPress={() => navigation.goBack()}
        />
        <Button
          title={submitLabel}
          variant="primary"
          size="lg"
          loading={isSubmitting}
          style={{ flex: 1.6 }}
          rightIcon={<ArrowRight size={20} color={colors.onPrimary} />}
          onPress={handleSubmit}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginBottom: 8,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyScroll: { paddingBottom: 16, gap: 14 },
  sectionCol: { marginBottom: 4 },
  inputLabel: { marginBottom: 6 },
  productBannerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  smallTabsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  smallGradeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  rowTwoCol: { flexDirection: 'row', alignItems: 'flex-start' },
  unitChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  stickyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
});
