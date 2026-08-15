import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { ThemeToggleButton } from '../components/ThemeToggleButton';
import { AppText } from '../components/AppText';
import { AuthStackParamList } from './types';
import { RoleSelectionScreen } from '../features/auth/screens/RoleSelectionScreen';
import { ProfileFormScreen } from '../features/auth/screens/ProfileFormScreen';
import { SignInPhoneScreen } from '../features/auth/screens/SignInPhoneScreen';
import { SignInOtpScreen } from '../features/auth/screens/SignInOtpScreen';
import { SignInPasswordScreen } from '../features/auth/screens/SignInPasswordScreen';
import { ForgotPasswordScreen } from '../features/auth/screens/ForgotPasswordScreen';
import { AuthSuccessScreen } from '../features/auth/screens/AuthSuccessScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const BrandHeaderTitle: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.brandTitleRow}>
      <Image
        source={require('../../assets/icon.png')}
        style={[styles.brandLogo, { borderColor: colors.border }]}
        resizeMode="cover"
      />
      <AppText variant="h2" weight="bold" color={colors.text} style={styles.brandTitleText}>
        Agri Hub
      </AppText>
    </View>
  );
};

export const AuthNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="RoleSelection"
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        headerRight: () => <ThemeToggleButton />,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="RoleSelection"
        component={RoleSelectionScreen}
        options={{
          headerTitle: () => <BrandHeaderTitle />,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="ProfileForm"
        component={ProfileFormScreen}
        options={{ title: 'Complete Profile' }}
      />
      <Stack.Screen
        name="SignInPhone"
        component={SignInPhoneScreen}
        options={{ title: 'Sign In' }}
      />
      <Stack.Screen
        name="SignInOtp"
        component={SignInOtpScreen}
        options={{ title: 'Verify OTP' }}
      />
      <Stack.Screen
        name="SignInPassword"
        component={SignInPasswordScreen}
        options={{ title: 'Sign In' }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
      <Stack.Screen
        name="AuthSuccess"
        component={AuthSuccessScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
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
});
