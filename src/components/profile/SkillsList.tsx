import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Skill } from "../../types/api";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { theme } from "../../theme/theme";

interface SkillsListProps {
  skills: Skill[];
}

export const SkillsList: React.FC<SkillsListProps> = ({ skills }) => {
  return (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Skills</Text>
      {skills
        .sort((a, b) => b.level - a.level)
        .map((skill) => (
          <SkillItem key={skill.id} skill={skill} />
        ))}
    </Card>
  );
};

interface SkillItemProps {
  skill: Skill;
}

const SkillItem: React.FC<SkillItemProps> = ({ skill }) => (
  <View style={styles.skillItem}>
    <View style={styles.skillHeader}>
      <Text style={styles.skillName}>{skill.name}</Text>
      <Text style={styles.skillLevel}>{skill.level.toFixed(2)}</Text>
    </View>
    <ProgressBar
      progress={Math.min(skill.level / 20, 1)}
      color={theme.colors.primary}
    />
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  skillItem: {
    marginBottom: theme.spacing.md,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  skillName: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  skillLevel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
  },
});
