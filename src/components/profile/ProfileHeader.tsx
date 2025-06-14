import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { User } from "../../types/api";
import { Card } from "../ui/Card";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme/theme";

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const renderCoalition = () => {
    if (!user.coalition) return null;

    return (
      <View
        style={[
          styles.coalitionBadge,
          { backgroundColor: user.coalition.color || theme.colors.primary },
        ]}
      >
        <Text style={styles.coalitionName}>{user.coalition.name}</Text>
      </View>
    );
  };

  const renderLocation = () => {
    if (!user.location) return null;

    return (
      <View style={styles.locationContainer}>
        <Ionicons name="location" size={14} color={theme.colors.primary} />
        <Text style={styles.locationText}>{user.location}</Text>
      </View>
    );
  };

  return (
    <Card style={styles.headerCard}>
      <View style={styles.headerTop}>
        {renderCoalition()}
        {renderLocation()}
      </View>

      <View style={styles.profileSection}>
        <Image source={{ uri: user.image.link }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.displayName}>{user.displayname}</Text>
          <Text style={styles.username}>
            {user.titles
              .find(
                (title) =>
                  title.id ===
                  user.titles_users.find((tu) => tu.selected)?.title_id
              )
              ?.name.replace("%login", user.login) || user.login}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    marginBottom: theme.spacing.md,
    padding: 0,
    overflow: "hidden",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.spacing.sm,
    paddingBottom: 0,
  },
  coalitionBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    alignSelf: "flex-start",
  },
  coalitionName: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginLeft: 2,
  },
  profileSection: {
    flexDirection: "row",
    padding: theme.spacing.md,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.circle,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  userInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
    justifyContent: "center",
  },
  displayName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  username: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    marginBottom: 2,
  },
  email: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  title: {
    fontSize: theme.typography.fontSize.sm,
    fontStyle: "italic",
    marginTop: theme.spacing.xs,
    color: theme.colors.text.secondary,
  },
});
