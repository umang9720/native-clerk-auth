import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TabBarBackground from '@/components/ui/TabBarBackground';



export default function TabLayout() {


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'DashBoard',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="house" color={color} />,
        }}
      />
      <Tabs.Screen
        name="goal"
        options={{
          title: 'Goal',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="gps-fixed" color={color} />,
        }}
      />
        <Tabs.Screen
        name="save"
        options={{
          title: 'Save',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="savings" color={color} />,
        }}
      />
        <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="groups" color={color} />,
        }}
      />
        <Tabs.Screen
        name="offer"
        options={{
          title: 'Offer',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="discount" color={color} />,
        }}
      />
    </Tabs>
  );
}
