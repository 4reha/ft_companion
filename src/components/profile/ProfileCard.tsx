import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { User, CursusUser, ProjectUser, Skill } from "../../types/api";
import { theme } from "../../theme/theme";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";

interface ProfileCardProps {
  user: User;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  // Get the primary cursus (usually 42 cursus)
  const primaryCursus = user.cursus_users?.[user.cursus_users.length - 1];

  const renderStats = () => (
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
  );

  const renderSkills = () => (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Skills</Text>
      {primaryCursus?.skills.map((skill) => (
        <View key={skill.id} style={styles.skillItem}>
          <Text style={styles.skillName}>{skill.name}</Text>
          <ProgressBar progress={Math.min(skill.level / 20, 1)} />
          <Text style={styles.skillLevel}>{skill.level.toFixed(2)}</Text>
        </View>
      ))}
    </Card>
  );

  const renderProjects = () => (
    <Card style={styles.section}>
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
                          ? theme.colors.success
                          : theme.colors.error
                        : theme.colors.warning,
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
    </Card>
  );

  return (
    <>
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

      {renderStats()}
      {renderSkills()}
      {renderProjects()}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.circle / 2,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  userInfo: {
    marginLeft: theme.spacing.md,
    justifyContent: "center",
    flex: 1,
  },
  username: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  displayName: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  email: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  location: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  statValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  section: {
    marginTop: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  skillItem: {
    marginBottom: theme.spacing.sm,
  },
  skillName: {
    fontSize: theme.typography.fontSize.sm,
    marginBottom: 4,
    color: theme.colors.text.secondary,
  },
  skillLevel: {
    alignSelf: "flex-end",
    fontSize: theme.typography.fontSize.xs,
    marginTop: 2,
    color: theme.colors.text.secondary,
  },
  projectItem: {
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: "#F9F9F9",
    borderRadius: theme.radius.sm,
  },
  projectName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  projectDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  projectStatus: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  projectGrade: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});
