import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Dashboard from './screens/Dashboard';
import Payments from './screens/Payments';
import SwapScreen from './screens/SwapScreen';
import SendReceiveScreen from './screens/SendReceiveScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="Payments" component={Payments} />
        <Stack.Screen name="Swap" component={SwapScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SendReceive" component={SendReceiveScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
