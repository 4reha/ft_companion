import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getUserByLogin } from "../services/apiService";
import { User } from "../types/api";
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

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, [login]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await getUserByLogin(login);
      setUser(userData);
      setError(null);
    } catch (err) {
      setError("Failed to load user data");
      console.error(`Error fetching user ${login}:`, err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingView message="Loading profile..." />;
  }

  if (error || !user) {
    return (
      <ErrorView
        message={error || "Failed to load user data"}
        onRetry={fetchUserData}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
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
