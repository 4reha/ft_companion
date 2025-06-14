import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CursusUser } from "../../types/api";
import { Card } from "../ui/Card";
import { theme } from "../../theme/theme";

interface StatsGridProps {
  wallet: number;
  correctionPoint: number;
  selectedCursus: CursusUser;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  wallet,
  correctionPoint,
  selectedCursus,
}) => {
  return (
    <Card style={styles.section}>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{wallet}</Text>
          <Text style={styles.statLabel}>Wallet</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{selectedCursus.grade || "N/A"}</Text>
          <Text style={styles.statLabel}>Grade</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {selectedCursus.level.toFixed(2)}
          </Text>
          <Text style={styles.statLabel}>Score</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{correctionPoint}</Text>
          <Text style={styles.statLabel}>Correction Points</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statItem: {
    width: "50%",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    alignItems: "center",
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  statValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
});
