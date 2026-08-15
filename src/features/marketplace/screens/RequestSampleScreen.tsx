import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Building2,
  FileText,
  Package,
  MapPin,
  Phone,
  CheckCircle2,
  Sprout,
  X,
} from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { AppText } from '../../../components/AppText';
import { Button } from '../../../components/Button';
import { AppInput } from '../../../components/AppInput';
import { useMarketplace } from '../../../state/marketplace/MarketplaceContext';
import { AppStackParamList } from '../../../navigation/types';
import { SampleRequest } from '../types';

type Nav = NativeStackNavigationProp<AppStackParamList, 'RequestSample'>;
type Rt = RouteProp<AppStackParamList, 'RequestSample'>;

export const RequestSampleScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const { colors, spacing } = useTheme();
  const { addSampleRequest } = useMarketplace();

  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [sampleQuantity, setSampleQuantity] = useState('1 Kg');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [errors, setErrors] = useState<{
    companyName?: string;
    gstNumber?: string;
    address?: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};
    if (!companyName.trim()) newErrors.companyName = 'Company Name is required for sample request';
    if (!gstNumber.trim()) newErrors.gstNumber = 'GST Number is required for verification';
    if (!deliveryAddress.trim()) newErrors.address = 'Delivery address is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    const request: SampleRequest = {
      id: `sample-${Date.now()}`,
      purityGrade: params.purityGrade,
      companyName: companyName.trim(),
      gstNumber: gstNumber.trim().toUpperCase(),
      sampleQuantity: sampleQuantity.trim(),
      deliveryAddress: deliveryAddress.trim(),
      contactNumber: contactNumber.trim(),
      status: 'Pending',
      createdAt: Date.now(),
    };
    await addSampleRequest(request);
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => navigation.goBack(), 1800);
  };

  return (
    <ScreenWrapper padded={false}>
      <View
        style={[styles.header, { paddingHorizontal: spacing.md, borderBottomColor: colors.border }]}
      >
        <View>
          <AppText variant="subtitle" weight="bold">
            Request Product Sample
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            Get an official sample shipped to your business address
          </AppText>
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.closeBtn, { backgroundColor: colors.surfaceSecondary }]}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      {isSubmitted ? (
        <View style={styles.successContainer}>
          <CheckCircle2 size={64} color={colors.success} style={{ marginBottom: 16 }} />
          <AppText variant="h2" weight="bold" style={{ textAlign: 'center' }}>
            Sample Request Sent!
          </AppText>
          <AppText
            variant="body"
            color={colors.textSecondary}
            style={{ textAlign: 'center', marginTop: 8, paddingHorizontal: 24 }}
          >
            Your sample request for{' '}
            <AppText weight="bold" color={colors.primary}>
              Psyllium Husk {params.purityGrade} Pure
            </AppText>{' '}
            has been successfully dispatched to suppliers.
          </AppText>
        </View>
      ) : (
        <>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.md }]}
          >
            <View style={[styles.gradeBanner, { backgroundColor: colors.primaryLight }]}>
              <Sprout size={20} color={colors.primary} />
              <View style={{ marginLeft: 10 }}>
                <AppText variant="caption" color={colors.textSecondary}>
                  SELECTED PRODUCT & PURITY:
                </AppText>
                <AppText variant="subtitle" weight="bold" color={colors.primary}>
                  Psyllium Husk {params.purityGrade} Pure
                </AppText>
              </View>
            </View>

            <AppInput
              label="Company Name"
              required
              placeholder="e.g. AgriCorp Pharma Pvt Ltd"
              value={companyName}
              onChangeText={(val) => {
                setCompanyName(val);
                if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: undefined }));
              }}
              error={errors.companyName}
              leftIcon={<Building2 size={18} color={colors.primary} />}
            />

            <AppInput
              label="GST Registration Number"
              required
              placeholder="e.g. 24ABCDE1234F1Z5"
              autoCapitalize="characters"
              value={gstNumber}
              onChangeText={(val) => {
                setGstNumber(val.toUpperCase());
                if (errors.gstNumber) setErrors((prev) => ({ ...prev, gstNumber: undefined }));
              }}
              error={errors.gstNumber}
              leftIcon={<FileText size={18} color={colors.primary} />}
            />

            <AppInput
              label="Sample Quantity Needed"
              placeholder="e.g. 500 grams / 1 Kg"
              value={sampleQuantity}
              onChangeText={setSampleQuantity}
              leftIcon={<Package size={18} color={colors.primary} />}
            />

            <AppInput
              label="Delivery Office Address"
              required
              placeholder="Enter complete office/factory address..."
              multiline
              numberOfLines={3}
              value={deliveryAddress}
              onChangeText={(val) => {
                setDeliveryAddress(val);
                if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
              }}
              error={errors.address}
              leftIcon={<MapPin size={18} color={colors.primary} />}
            />

            <AppInput
              label="Contact Phone Number"
              placeholder="e.g. +91 9876543210"
              keyboardType="phone-pad"
              value={contactNumber}
              onChangeText={setContactNumber}
              leftIcon={<Phone size={18} color={colors.primary} />}
            />
          </ScrollView>

          <View
            style={[
              styles.footer,
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
              title="Request Sample"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              style={{ flex: 1.5 }}
              onPress={handleSubmit}
            />
          </View>
        </>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: { paddingTop: 16, paddingBottom: 20, gap: 14 },
  gradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 6,
  },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  footer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderTopWidth: 1 },
});
