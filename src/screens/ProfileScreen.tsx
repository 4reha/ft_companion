import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../contexts/AuthContext";
import { getCurrentUser, User } from "../services/apiService";

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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BABC" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || "Failed to load user data"}
        </Text>
        <TouchableOpacity style={styles.button} onPress={fetchUserData}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get the primary cursus (usually 42 cursus)
  const primaryCursus = user.cursus_users[user.cursus_users.length - 1];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.image.link }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user.login}</Text>
          <Text style={styles.displayName}>{user.displayname}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.location && (
            <Text style={styles.location}>Location: {user.location}</Text>
          )}
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Level</Text>
          <Text style={styles.statValue}>
            {primaryCursus?.level.toFixed(2) || "N/A"}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Wallet</Text>
          <Text style={styles.statValue}>{user.wallet} ₳</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Correction Points</Text>
          <Text style={styles.statValue}>{user.correction_point}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        {primaryCursus?.skills.map((skill) => (
          <View key={skill.id} style={styles.skillItem}>
            <Text style={styles.skillName}>{skill.name}</Text>
            <View style={styles.skillBar}>
              <View
                style={[
                  styles.skillProgress,
                  { width: `${Math.min(skill.level * 20, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.skillLevel}>{skill.level.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects</Text>
        {user.projects_users
          .sort((a, b) => {
            // Sort by status first (completed at top)
            if (a.status === "finished" && b.status !== "finished") return -1;
            if (a.status !== "finished" && b.status === "finished") return 1;

            // Then by final mark (higher at top)
            return (b.final_mark || 0) - (a.final_mark || 0);
          })
          .map((project) => (
            <View key={project.id} style={styles.projectItem}>
              <Text style={styles.projectName}>{project.project.name}</Text>
              <View style={styles.projectDetails}>
                <Text
                  style={[
                    styles.projectStatus,
                    {
                      color:
                        project.status === "finished"
                          ? (project.final_mark || 0) >= 50
                            ? "#4CAF50"
                            : "#F44336"
                          : "#FFC107",
                    },
                  ]}
                >
                  {project.status === "finished"
                    ? (project.final_mark || 0) >= 50
                      ? "Passed"
                      : "Failed"
                    : "In Progress"}
                </Text>
                {project.final_mark !== null && (
                  <Text style={styles.projectGrade}>
                    Grade: {project.final_mark}/100
                  </Text>
                )}
              </View>
            </View>
          ))}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={navigateToSearch}>
          <Text style={styles.buttonText}>Search Students</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#00BABC",
  },
  userInfo: {
    marginLeft: 16,
    justifyContent: "center",
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  displayName: {
    fontSize: 16,
    color: "#666",
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  skillItem: {
    marginBottom: 12,
  },
  skillName: {
    fontSize: 14,
    marginBottom: 4,
    color: "#555",
  },
  skillBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  skillProgress: {
    height: "100%",
    backgroundColor: "#00BABC",
  },
  skillLevel: {
    alignSelf: "flex-end",
    fontSize: 12,
    marginTop: 2,
    color: "#666",
  },
  projectItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#F9F9F9",
    borderRadius: 6,
  },
  projectName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  projectDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  projectStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  projectGrade: {
    fontSize: 14,
    color: "#555",
  },
  buttonsContainer: {
    padding: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#00BABC",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ProfileScreen;
