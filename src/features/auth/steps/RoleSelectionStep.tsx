import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components/AppText';
import { Card } from '../../../components/Card';
import { ShoppingCart, Store, Repeat, CheckCircle2 } from 'lucide-react-native';
import { UserRole, RoleOption } from '../types';

interface RoleSelectionStepProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelectionStep: React.FC<RoleSelectionStepProps> = ({
  selectedRole,
  onSelectRole,
}) => {
  const { colors, isDark } = useTheme();

  const roleOptions: RoleOption[] = [
    {
      id: 'buyer',
      title: 'Buyer',
      subtitle:
        'Browse and purchase quality crops, seeds, and farming inputs directly from growers.',
      icon: ShoppingCart,
      badge: 'Purchaser',
    },
    {
      id: 'supplier',
      title: 'Supplier',
      subtitle:
        'List your agricultural harvest, tools, and supplies to reach bulk buyers nationwide.',
      icon: Store,
      badge: 'Seller',
    },
    {
      id: 'both',
      title: 'Both (Buyer & Supplier)',
      subtitle: 'Full access to buy agricultural supplies and sell your own farm produce.',
      icon: Repeat,
      badge: 'Full Access',
    },
  ];

  return (
    <>
      <View style={styles.introSection}>
        <AppText variant="h1" weight="bold" size="xxl" style={styles.title}>
          What brings you here?
        </AppText>
        <AppText variant="body" color={colors.textSecondary} size="sm">
          Choose your primary role to customize your marketplace tools.
        </AppText>
      </View>

      <View style={styles.rolesContainer}>
        {roleOptions.map((option) => {
          const isSelected = selectedRole === option.id;
          const IconComponent = option.icon;

          return (
            <TouchableOpacity
              key={option.id}
              activeOpacity={0.85}
              onPress={() => onSelectRole(option.id)}
            >
              <Card
                variant="outlined"
                style={[
                  styles.roleCard,
                  {
                    backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
              >
                <View style={styles.cardHeaderRow}>
                  <View
                    style={[
                      styles.iconBadge,
                      {
                        backgroundColor: isSelected
                          ? colors.primary
                          : isDark
                            ? 'rgba(255, 255, 255, 0.08)'
                            : colors.surfaceSecondary,
                      },
                    ]}
                  >
                    <IconComponent size={22} color={isSelected ? colors.onPrimary : colors.text} />
                  </View>

                  <View style={styles.headerTextCol}>
                    <View style={styles.titleBadgeRow}>
                      <AppText variant="subtitle" weight="bold" style={styles.roleTitle}>
                        {option.title}
                      </AppText>
                      <View
                        style={[
                          styles.pillBadge,
                          {
                            backgroundColor: isSelected ? colors.primary : colors.primaryLight,
                          },
                        ]}
                      >
                        <AppText
                          variant="caption"
                          weight="bold"
                          color={isSelected ? colors.onPrimary : colors.primary}
                          style={{ fontSize: 11, letterSpacing: 0.3 }}
                        >
                          {option.badge}
                        </AppText>
                      </View>
                    </View>
                  </View>

                  {isSelected && (
                    <CheckCircle2 size={22} color={colors.primary} style={styles.checkIcon} />
                  )}
                </View>

                <AppText variant="body" color={colors.textSecondary} style={styles.roleDescription}>
                  {option.subtitle}
                </AppText>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  introSection: {
    marginBottom: 14,
    marginTop: 4,
  },
  title: {
    marginBottom: 3,
  },
  rolesContainer: {
    gap: 10,
    marginBottom: 12,
  },
  roleCard: {
    padding: 13,
    borderRadius: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTextCol: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleTitle: {
    fontSize: 15,
  },
  pillBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  checkIcon: {
    marginLeft: 8,
  },
  roleDescription: {
    fontSize: 12.5,
    lineHeight: 17,
  },
});
