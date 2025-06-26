// BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Dummy Screens
const Dashboard = () => <View style={styles.screen}><Text>Dashboard</Text></View>;
const Goal = () => <View style={styles.screen}><Text>Goal</Text></View>;
const Save = () => <View style={styles.screen}><Text>Save</Text></View>;
const Community = () => <View style={styles.screen}><Text>Community</Text></View>;
const Offer = () => <View style={styles.screen}><Text>Offer</Text></View>;

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          switch (route.name) {
            case 'Dashboard':
              iconName = 'home-outline';
              break;
            case 'Goal':
              iconName = 'target';
              break;
            case 'Save':
              iconName = 'piggy-bank';
              break;
            case 'Community':
              iconName = 'account-group-outline';
              break;
            case 'Offer':
              iconName = 'tag-outline';
              break;
          }

          return (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Icon name={iconName} size={24} color={focused ? '#fff' : '#888'} />
            </View>
          );
        },
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? '#FFA500' : '#888', fontSize: 12 }}>{route.name}</Text>
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Goal" component={Goal} />
      <Tab.Screen name="Save" component={Save} />
      <Tab.Screen name="Community" component={Community} />
      <Tab.Screen name="Offer" component={Offer} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    paddingBottom: 10,
    paddingTop: 10,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 25,
  },
  activeIconContainer: {
    backgroundColor: '#FFA500', // Orange
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomTabNavigator;
