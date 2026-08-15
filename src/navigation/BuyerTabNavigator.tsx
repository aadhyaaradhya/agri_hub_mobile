import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Store, Sprout, Package, User, Plus } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { BuyerTabParamList, AppStackParamList } from './types';
import { MarketplaceScreen } from '../features/marketplace/screens/MarketplaceScreen';
import { MyRequestsScreen } from '../features/marketplace/screens/MyRequestsScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';

const Tab = createBottomTabNavigator<BuyerTabParamList>();

const DummyCenterScreen = () => null;

export const BuyerTabNavigator: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
        },
      }}
    >
      <Tab.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{
          tabBarLabel: 'Marketplace',
          tabBarIcon: ({ color, size }) => <Store color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="MyInquiries"
        component={MyRequestsScreen}
        initialParams={{ filter: 'inquiries' }}
        options={{
          tabBarLabel: 'My Inquiry',
          tabBarIcon: ({ color, size }) => <Sprout color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="NewInquiryAction"
        component={DummyCenterScreen}
        options={{
          tabBarLabel: () => null,
          tabBarButton: () => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('AddSupplyOrInquiry', { userRole: 'buyer' })}
              style={styles.centerButtonContainer}
              accessibilityRole="button"
              accessibilityLabel="New Inquiry"
            >
              <View
                style={[
                  styles.outerCradle,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={[styles.centerButton, { backgroundColor: colors.primary }]}>
                  <Plus size={26} color={colors.onPrimary} strokeWidth={2.5} />
                </View>
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="MyRequests"
        component={MyRequestsScreen}
        initialParams={{ filter: 'samples' }}
        options={{
          tabBarLabel: 'Requests',
          tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  centerButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  outerCradle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
  },
  centerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
});
