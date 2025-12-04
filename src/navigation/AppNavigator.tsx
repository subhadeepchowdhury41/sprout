/**
 * Main app navigation setup
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { AddMeasurementScreen } from '../screens/AddMeasurementScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Baby Growth Tracker' }}
        />
        <Stack.Screen
          name="AddMeasurement"
          component={AddMeasurementScreen}
          options={{ title: 'Add Measurement' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Baby Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
