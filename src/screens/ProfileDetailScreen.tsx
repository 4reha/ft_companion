import React from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useUserByLogin } from "../hooks/useApi";
import { ProfileCard } from "../components/profile/ProfileCard";
import { LoadingView } from "../components/ui/LoadingView";
import { ErrorView } from "../components/ui/ErrorView";
import { theme } from "../theme/theme";

type ProfileDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "ProfileDetail"
>;

const ProfileDetailScreen = () => {
  const route = useRoute<ProfileDetailScreenRouteProp>();
  const { login } = route.params;

  // Use React Query hook to fetch user data by login
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useUserByLogin(login);

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export default ProfileDetailScreen;
