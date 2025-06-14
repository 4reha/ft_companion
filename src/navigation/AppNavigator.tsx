import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "../screens/LoginScreen";
import LoadingScreen from "../screens/LoadingScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import ProfileDetailScreen from "../screens/ProfileDetailScreen";
import { theme } from "../theme/theme";

// Define the stack navigator param lists
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  ProfileDetail: { login: string };
};

export type MainTabsParamList = {
  Search: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

// Bottom tabs navigator component
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Profile"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.card,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.text.white,
        headerTitleStyle: {
          fontWeight: theme.typography.fontWeight.bold,
        },
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: "Search Students",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "My Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.text.white,
          headerTitleStyle: {
            fontWeight: theme.typography.fontWeight.bold,
          },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="MainTabs"
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProfileDetail"
              component={ProfileDetailScreen}
              options={({ route }) => ({ title: route.params.login })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
