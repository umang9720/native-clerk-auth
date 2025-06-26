import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dashboard from '@/app/component/DashBoard/DashBoard';
import Offer from '@/app/component/Offer/Offer';
import Community from '@/app/component/Community/Community';
import Save from '@/app/component/Save/Save';
import Goal from '@/app/component/Goal/Goal';


const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => {
          let iconName = '';
          let isSave = route.name === 'Save';

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

          const iconColor = focused ? '#FFA500' : '#888';

          if (isSave) {
            return (
              <View style={styles.saveButtonContainer}>
                <View style={styles.saveButtonCircle}>
                  <Icon name={iconName} size={28} color="#fff" />
                </View>
              </View>
            );
          }

          return (
            <View style={focused ? styles.activeIconContainer : styles.iconContainer}>
              <Icon name={iconName} size={24} color={iconColor} />
            </View>
          );
        },
        tabBarLabel: ({ focused }) => {
          const labelColor = focused ? '#FFA500' : '#888';
          const labelStyle = route.name === 'Save' ? { marginTop: -8 } : {};
          return (
            <Text style={{ color: labelColor, fontSize: 12, ...labelStyle }}>
              {route.name}
            </Text>
          );
        },
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
    height: Platform.OS === 'ios' ? 90 : 70,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    paddingBottom: 10,
    paddingTop: 5,
    backgroundColor: '#fff',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonContainer: {
    position: 'absolute',
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonCircle: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomTabNavigator;
