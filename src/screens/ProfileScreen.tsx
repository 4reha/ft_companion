import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../contexts/AuthContext";
import { getCurrentUser } from "../services/apiService";
import { User } from "../types/api";
import { ProfileCard } from "../components/profile/ProfileCard";
import { LoadingView } from "../components/ui/LoadingView";
import { ErrorView } from "../components/ui/ErrorView";
import { Button } from "../components/ui/Button";
import { theme } from "../theme/theme";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const ProfileScreen = () => {
  const { logout } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (err) {
      setError("Failed to load profile data");
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const navigateToSearch = () => {
    navigation.navigate("Search");
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

      <View style={styles.buttonsContainer}>
        <Button
          title="Search Students"
          onPress={navigateToSearch}
          style={styles.button}
          fullWidth
        />
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
