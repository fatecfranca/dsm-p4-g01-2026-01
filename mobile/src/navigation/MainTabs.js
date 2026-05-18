import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Tab = createBottomTabNavigator();

function PlaceholderScreen({ title, emoji }) {
  return (
    <View style={phStyles.container}>
      <Text style={phStyles.emoji}>{emoji}</Text>
      <Text style={phStyles.title}>{title}</Text>
      <Text style={phStyles.sub}>Em desenvolvimento</Text>
    </View>
  );
}

function TabIcon({ icon, focused }) {
  return (
    <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
      <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>
        {icon}
      </Text>
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A1120',
          borderTopColor: 'rgba(59,130,246,0.15)',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#23C55E',
        tabBarInactiveTintColor: '#475569',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ focused }) => <TabIcon icon={'\u2302'} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon icon={'\uD83D\uDCCA'} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="About"
        children={() => <PlaceholderScreen title="Sobre" emoji={'\u2139\uFE0F'} />}
        options={{
          tabBarLabel: 'Sobre',
          tabBarIcon: ({ focused }) => <TabIcon icon={'\u2139\uFE0F'} focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const phStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: '#64748B',
  },
});

const tabStyles = StyleSheet.create({
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(35,197,94,0.12)',
  },
  icon: {
    fontSize: 18,
  },
  iconActive: {
    color: '#23C55E',
  },
});
