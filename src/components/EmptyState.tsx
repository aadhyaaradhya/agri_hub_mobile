import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { AppText } from './AppText';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.iconBadge, { backgroundColor: colors.surfaceSecondary }]}>
        <Icon size={28} color={colors.textMuted} />
      </View>
      <AppText variant="subtitle" weight="bold" align="center" style={styles.title}>
        {title}
      </AppText>
      {description ? (
        <AppText variant="body" color={colors.textSecondary} align="center">
          {description}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 4,
  },
});
