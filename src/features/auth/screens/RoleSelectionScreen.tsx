import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { Button } from '../../../components/Button';
import { AppText } from '../../../components/AppText';
import { RoleSelectionStep } from '../steps/RoleSelectionStep';
import { UserRole } from '../types';
import { AuthStackParamList } from '../../../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'RoleSelection'>;

const ROLE_LABELS: Record<UserRole, string> = {
  buyer: 'Buyer',
  supplier: 'Supplier',
  both: 'Buyer & Supplier',
};

export const RoleSelectionScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { spacing, colors } = useTheme();
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');

  return (
    <ScreenWrapper padded={false} edges={['bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <RoleSelectionStep selectedRole={selectedRole} onSelectRole={setSelectedRole} />
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingHorizontal: spacing.md, backgroundColor: colors.background },
        ]}
      >
        <Button
          title={`Continue as ${ROLE_LABELS[selectedRole]}`}
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight size={20} color={colors.onPrimary} />}
          onPress={() => navigation.navigate('ProfileForm', { role: selectedRole })}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('SignInPhone')}
          style={styles.linkRow}
        >
          <AppText variant="caption" color={colors.textSecondary}>
            Already have an account?{' '}
          </AppText>
          <AppText variant="caption" weight="bold" color={colors.primary}>
            Sign In
          </AppText>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 4,
  },
  footer: {
    paddingVertical: 12,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 4,
  },
});
