import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../state/auth/AuthContext';
import { AppStackParamList } from './types';
import { BuyerTabNavigator } from './BuyerTabNavigator';
import { SupplierTabNavigator } from './SupplierTabNavigator';
import { AddSupplyOrInquiryScreen } from '../features/marketplace/screens/AddSupplyOrInquiryScreen';
import { RequestSampleScreen } from '../features/marketplace/screens/RequestSampleScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user } = useAuth();
  // Matches the original role -> landing-tab behavior: suppliers land on
  // their dashboard, buyers and "both" accounts land on the marketplace.
  const initialRouteName = user?.role === 'supplier' ? 'SupplierTabs' : 'BuyerTabs';

  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BuyerTabs" component={BuyerTabNavigator} />
      <Stack.Screen name="SupplierTabs" component={SupplierTabNavigator} />
      <Stack.Screen
        name="AddSupplyOrInquiry"
        component={AddSupplyOrInquiryScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="RequestSample"
        component={RequestSampleScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
};
