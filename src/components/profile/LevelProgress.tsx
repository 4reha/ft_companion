import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CursusUser } from "../../types/api";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { theme } from "../../theme/theme";

interface LevelProgressProps {
  selectedCursus: CursusUser;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  selectedCursus,
}) => {
  const level = Math.floor(selectedCursus.level);
  const progress = selectedCursus.level - level;

  return (
    <Card style={styles.section}>
      <View style={styles.levelContainer}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelLabel}>Level {level}</Text>
          <Text style={styles.levelPercentage}>
            {(progress * 100).toFixed(0)}%
          </Text>
        </View>
        <ProgressBar progress={progress} color={theme.colors.primary} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  levelContainer: {
    width: "100%",
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
  },
  levelLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  levelPercentage: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
