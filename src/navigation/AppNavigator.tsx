import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";

// Import screens (to be created)

import LoginScreen from "../screens/LoginScreen";
import LoadingScreen from "../screens/LoadingScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import ProfileDetailScreen from "../screens/ProfileDetailScreen";

// Define the stack navigator param list
export type RootStackParamList = {
  Login: undefined;
  Profile: undefined;
  Search: undefined;
  ProfileDetail: { login: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
            backgroundColor: "#00BABC",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
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
              name="Profile"
              component={ProfileScreen}
              options={{ title: "My Profile" }}
            />
            <Stack.Screen
              name="Search"
              component={SearchScreen}
              options={{ title: "Search Students" }}
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
