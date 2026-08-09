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
      subtitle: 'Browse and purchase quality crops, seeds, and farming inputs directly from growers.',
      icon: ShoppingCart,
      badge: 'Purchaser',
    },
    {
      id: 'supplier',
      title: 'Supplier',
      subtitle: 'List your agricultural harvest, tools, and supplies to reach bulk buyers nationwide.',
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
        <AppText variant="h1" weight="bold" style={styles.title}>
          What brings you here?
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
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
                    backgroundColor: isSelected
                      ? isDark
                        ? 'rgba(16, 185, 129, 0.14)'
                        : 'rgba(16, 185, 129, 0.06)'
                      : colors.surface,
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
                    <IconComponent
                      size={22}
                      color={isSelected ? '#FFFFFF' : colors.text}
                    />
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
                            backgroundColor: isSelected
                              ? colors.primary
                              : isDark
                              ? 'rgba(16, 185, 129, 0.15)'
                              : colors.primaryLight,
                          },
                        ]}
                      >
                        <AppText
                          variant="caption"
                          weight="bold"
                          color={isSelected ? '#FFFFFF' : colors.primary}
                          style={{ fontSize: 11, letterSpacing: 0.3 }}
                        >
                          {option.badge}
                        </AppText>
                      </View>
                    </View>
                  </View>

                  {isSelected && (
                    <CheckCircle2
                      size={22}
                      color={colors.primary}
                      style={styles.checkIcon}
                    />
                  )}
                </View>

                <AppText
                  variant="body"
                  color={colors.textSecondary}
                  style={styles.roleDescription}
                >
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  rolesContainer: {
    gap: 14,
    marginBottom: 24,
  },
  roleCard: {
    padding: 16,
    borderRadius: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    fontSize: 16,
  },
  pillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  checkIcon: {
    marginLeft: 8,
  },
  roleDescription: {
    fontSize: 13,
    lineHeight: 19,
  },
});
