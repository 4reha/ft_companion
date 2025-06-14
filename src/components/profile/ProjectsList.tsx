import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ProjectUser } from "../../types/api";
import { Card } from "../ui/Card";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme/theme";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Initialize dayjs plugins
dayjs.extend(relativeTime);

interface ProjectsListProps {
  projects: ProjectUser[];
  selectedCursusId: number;
}

interface DisplayedProject extends ProjectUser {
  children: ProjectUser[];
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  selectedCursusId,
}) => {
  const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null);

  // Filter projects by the selected cursus
  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        project.cursus_ids.includes(selectedCursusId)
      ),
    [projects, selectedCursusId]
  );

  const groupedProjects = useMemo(
    () =>
      filteredProjects.reduce(
        (acc: DisplayedProject[], { project, ...rest }) => {
          const parentId = project.parent_id;

          if (parentId === null) {
            const existingProject = acc.find(
              (p) => p.project.id === project.id
            );
            if (!existingProject) {
              acc.push({ ...rest, project, children: [] });
            }
            return acc;
          }

          // Find the parent project in the accumulator
          const parentProject = acc.find((p) => p.project.id === parentId);
          if (parentProject) {
            // If the parent project is found, add the current project as a child
            parentProject.children.push({
              project,
              ...rest,
            });
          } else {
            // If the parent project is not found, create a new entry for it
            const parentProject = filteredProjects.find(
              (p) => p.project.id === parentId
            );

            if (parentProject) {
              acc.push({
                ...parentProject,
                children: [{ project, ...rest }],
              });
            }
          }
          return acc;
        },
        []
      ),
    [filteredProjects]
  );
  // Sort projects: in_progress first, then by date
  const sortedProjects = useMemo(
    () =>
      [...groupedProjects].sort((a, b) => {
        // In progress projects first
        if (a.status === "finished" && b.status !== "finished") return 1;
        if (a.status !== "finished" && b.status === "finished") return -1;

        // Then by date (newest first)
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }),
    [groupedProjects]
  );

  const toggleGroup = (groupId: number) => {
    setExpandedGroupId((currentId) => (currentId === groupId ? null : groupId));
  };

  // Helper function to render status indicator
  const getStatusInfo = (project: ProjectUser) => {
    let color, text;

    if (project.status === "finished") {
      if (project["validated?"] === true) {
        color = theme.colors.success;
        text = "Passed";
      } else {
        color = theme.colors.error;
        text = "Failed";
      }
    } else {
      color = theme.colors.warning;
      text = "In Progress";
    }

    return { color, text };
  };

  // Format relative time
  const getRelativeTime = (dateString: string) => {
    return dayjs(dateString).fromNow();
  };

  return (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Projects</Text>

      <View style={styles.projectsListContainer}>
        <ScrollView
          style={styles.projectsList}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}
        >
          {sortedProjects.map((project) => {
            const { color, text } = getStatusInfo(project);
            const isExpanded = expandedGroupId === project.project.id;

            return (
              <View
                key={project.project.id}
                style={styles.projectGroupContainer}
              >
                <TouchableOpacity
                  onPress={() =>
                    project.children.length && toggleGroup(project.project.id)
                  }
                  style={[
                    styles.projectItem,
                    project.status === "in_progress" &&
                      styles.projectInProgress,
                  ]}
                >
                  <View style={styles.projectHeader}>
                    <Text style={styles.projectName}>
                      {project.project.name}
                    </Text>

                    {project.children.length > 0 && (
                      <Ionicons
                        name={
                          expandedGroupId === project.project.id
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={20}
                        color={theme.colors.text.secondary}
                      />
                    )}
                  </View>

                  <View style={styles.projectDetails}>
                    <View style={styles.projectStatus}>
                      <View
                        style={[
                          styles.statusIndicator,
                          { backgroundColor: color },
                        ]}
                      />
                      <Text style={styles.statusText}>{text}</Text>
                      {project.final_mark !== null && (
                        <Text style={styles.projectGrade}>
                          {project.final_mark}%
                        </Text>
                      )}
                    </View>
                    <Text style={styles.projectDate}>
                      {getRelativeTime(project.created_at)}
                    </Text>
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.childrenContainer}>
                    {project.children.map((childProject) => {
                      const childStatusInfo = getStatusInfo(childProject);
                      return (
                        <View
                          key={childProject.project.id}
                          style={[
                            styles.childProject,
                            childProject.status === "in_progress" &&
                              styles.childProjectInProgress,
                          ]}
                        >
                          <View style={styles.childProjectHeader}>
                            <Text style={styles.childProjectName}>
                              {childProject.project.name}
                            </Text>
                            <Text style={styles.projectDate}>
                              {getRelativeTime(childProject.created_at)}
                            </Text>
                          </View>

                          <View style={styles.childProjectDetails}>
                            <View style={styles.projectStatus}>
                              <View
                                style={[
                                  styles.statusIndicator,
                                  {
                                    backgroundColor: childStatusInfo.color,
                                  },
                                ]}
                              />
                              <Text style={styles.statusText}>
                                {childStatusInfo.text}
                              </Text>
                              {childProject.final_mark !== null && (
                                <Text style={styles.projectGrade}>
                                  {childProject.final_mark}%
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  projectsListContainer: {
    height: 400, // Fixed height container
  },
  projectsList: {
    flex: 1, // Take up all available space in container
  },
  projectGroupContainer: {
    marginBottom: theme.spacing.md,
  },
  projectItem: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.border,
  },
  projectInProgress: {
    borderLeftColor: theme.colors.warning,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  projectName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    flex: 1,
  },
  projectDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  projectDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  projectStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    marginRight: theme.spacing.xs,
  },
  projectGrade: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  childrenContainer: {
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.lg,
  },
  childProject: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.border,
  },
  childProjectInProgress: {
    borderLeftColor: theme.colors.warning,
  },
  childProjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  childProjectName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    flex: 1,
  },
  childProjectDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
