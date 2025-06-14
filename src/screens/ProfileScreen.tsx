import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../contexts/AuthContext";
import { useCurrentUser } from "../hooks/useApi";
import { ProfileCard } from "../components/profile/ProfileCard";
import { LoadingView } from "../components/ui/LoadingView";
import { ErrorView } from "../components/ui/ErrorView";
import { Button } from "../components/ui/Button";
import { theme } from "../theme/theme";

type ProfileScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const { logout } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  // Use React Query hook to fetch current user data
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useCurrentUser();

  const handleLogout = async () => {
    await logout();
  };

  // const navigateToSearch = () => {
  //   navigation.navigate("Search");
  // };

  if (isLoading) {
    return <LoadingView message="Loading profile..." />;
  }

  if (isError || !user) {
    return (
      <ErrorView
        message={error?.message || "Failed to load user data"}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <ProfileCard user={user} />

      <View style={styles.buttonsContainer}>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          style={styles.button}
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  buttonsContainer: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  button: {
    marginBottom: theme.spacing.sm,
  },
});

export default ProfileScreen;
