import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Sprout, Sun, Moon, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components/AppText';
import { LoadingState } from '../../../components/LoadingState';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { useMarketplace } from '../../../state/marketplace/MarketplaceContext';
import { useConfig } from '../../../state/config/ConfigContext';
import { totalStockByCategory } from '../utils';
import { AppStackParamList, BuyerTabParamList } from '../../../navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 300);
const CARD_GAP = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

const GRADE_BANNERS: Record<string, any> = {
  grade_85: require('../../../../assets/banners/banner_85.jpg'),
  grade_95: require('../../../../assets/banners/banner_95.jpg'),
  grade_98: require('../../../../assets/banners/banner_98.jpg'),
  grade_99: require('../../../../assets/banners/banner_99.jpg'),
};

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<BuyerTabParamList, 'Marketplace'>,
  NativeStackNavigationProp<AppStackParamList>
>;

// Buyer home screen. Deliberately shows ONLY aggregate supply counts per
// purity grade — no supplier name, no price, anywhere on this screen.
export const MarketplaceScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { colors, isDark, toggleTheme, spacing } = useTheme();
  const { listings, isLoaded } = useMarketplace();
  const { config, isLoading: configLoading } = useConfig();

  const carouselRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isInteracting = useRef(false);

  const gradeOptions = config ? config.gradeOptions.filter((g) => g.id !== 'custom') : [];

  // Auto-scroll carousel effect
  useEffect(() => {
    if (gradeOptions.length <= 1) return;

    const timer = setInterval(() => {
      if (isInteracting.current) return;
      setActiveIndex((prev) => {
        const next = (prev + 1) % gradeOptions.length;
        carouselRef.current?.scrollTo({
          x: next * SNAP_INTERVAL,
          animated: true,
        });
        return next;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [gradeOptions.length]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / SNAP_INTERVAL);
    if (index >= 0 && index < gradeOptions.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  if (!isLoaded || configLoading || !config) {
    return (
      <ScreenWrapper>
        <LoadingState label="Loading marketplace…" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padded={false} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <View style={styles.brandTitleRow}>
          <Image
            source={require('../../../../assets/icon.png')}
            style={[styles.brandLogo, { borderColor: colors.border }]}
            resizeMode="cover"
          />
          <AppText variant="h2" weight="bold" color={colors.text} style={styles.brandTitleText}>
            Agri Hub
          </AppText>
        </View>

        <View style={styles.headerRightRow}>
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
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionContainer}>
          <View style={styles.summaryHeaderRow}>
            <View style={{ flex: 1 }}>
              <AppText variant="caption" weight="bold" color={colors.primary}>
                MARKETPLACE OVERVIEW
              </AppText>
              <AppText variant="subtitle" weight="bold">
                Available Supply Summary
              </AppText>
            </View>
          </View>
          <AppText variant="caption" color={colors.textSecondary} style={{ marginBottom: 12 }}>
            Swipe or tap any purity grade to order test samples directly.
          </AppText>

          {/* Auto-scrolling Horizontal Carousel */}
          <ScrollView
            ref={carouselRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP_INTERVAL}
            snapToAlignment="start"
            decelerationRate="fast"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onScrollBeginDrag={() => {
              isInteracting.current = true;
            }}
            onScrollEndDrag={() => {
              setTimeout(() => {
                isInteracting.current = false;
              }, 2000);
            }}
            contentContainerStyle={styles.carouselContainer}
          >
            {gradeOptions.map((grade) => (
              <TouchableOpacity
                key={grade.id}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate('RequestSample', {
                    purityGrade: grade.label.replace(' Pure', ''),
                  })
                }
                style={[
                  styles.carouselCard,
                  {
                    borderColor: colors.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Request sample for ${grade.label} purity`}
              >
                <ImageBackground
                  source={GRADE_BANNERS[grade.id] || GRADE_BANNERS.grade_85}
                  style={styles.cardImageBg}
                  imageStyle={styles.cardImageBgStyle}
                >
                  <View
                    style={[
                      styles.cardOverlay,
                      {
                        backgroundColor: isDark
                          ? 'rgba(12, 22, 16, 0.82)'
                          : 'rgba(255, 255, 255, 0.88)',
                      },
                    ]}
                  >
                    <View style={styles.cardTopRow}>
                      <View
                        style={[
                          styles.emojiBadge,
                          {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <AppText style={{ fontSize: 18 }}>{grade.emoji}</AppText>
                      </View>
                      <View
                        style={[
                          styles.gradeTag,
                          {
                            backgroundColor: isDark ? colors.primaryLight : colors.surfaceSecondary,
                            borderColor: colors.border,
                            borderWidth: 1,
                          },
                        ]}
                      >
                        <AppText variant="caption" weight="bold" color={colors.primary}>
                          {grade.label}
                        </AppText>
                      </View>
                    </View>

                    <View style={{ marginVertical: 10 }}>
                      <AppText variant="caption" color={colors.textSecondary} weight="semibold">
                        Available Supply
                      </AppText>
                      <AppText
                        variant="h2"
                        weight="bold"
                        color={colors.primary}
                        style={{ marginTop: 2 }}
                      >
                        {totalStockByCategory(listings, grade.id)}
                      </AppText>
                    </View>

                    <View
                      style={[
                        styles.sampleActionBtn,
                        { backgroundColor: colors.primary, borderColor: colors.primary },
                      ]}
                    >
                      <AppText
                        variant="caption"
                        weight="bold"
                        color={colors.onPrimary}
                        style={{ fontSize: 12 }}
                      >
                        Request Sample
                      </AppText>
                      <ArrowRight size={14} color={colors.onPrimary} style={{ marginLeft: 4 }} />
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Carousel Pagination Dots */}
          <View style={styles.paginationDotsRow}>
            {gradeOptions.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setActiveIndex(i);
                  carouselRef.current?.scrollTo({ x: i * SNAP_INTERVAL, animated: true });
                }}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === activeIndex ? colors.primary : colors.border,
                    width: i === activeIndex ? 18 : 6,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AddSupplyOrInquiry', { userRole: 'buyer' })}
          style={[
            styles.inquiryCta,
            { backgroundColor: colors.primaryLight, borderColor: colors.primary + '30' },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Submit a specific inquiry"
        >
          <Sprout size={22} color={colors.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <AppText variant="body" weight="bold" color={colors.primary}>
              Have a specific requirement?
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Submit an inquiry and matching suppliers will reach out to you
            </AppText>
          </View>
        </TouchableOpacity>
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
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogo: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 1,
  },
  brandTitleText: {
    fontSize: 19,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  sectionContainer: {
    marginBottom: 4,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  carouselContainer: {
    paddingVertical: 4,
    gap: CARD_GAP,
  },
  carouselCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardImageBg: {
    width: '100%',
    borderRadius: 15,
  },
  cardImageBgStyle: {
    borderRadius: 15,
  },
  cardOverlay: {
    padding: 16,
    borderRadius: 15,
    justifyContent: 'space-between',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emojiBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sampleActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  paginationDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  inquiryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
});
