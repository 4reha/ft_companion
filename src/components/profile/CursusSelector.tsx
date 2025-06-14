import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CursusUser } from "../../types/api";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme/theme";

interface CursusSelectorProps {
  cursusUsers: CursusUser[];
  selectedIndex: number;
  onSelectCursus: (index: number) => void;
}

export const CursusSelector: React.FC<CursusSelectorProps> = ({
  cursusUsers,
  selectedIndex,
  onSelectCursus,
}) => {
  const handleCursusChange = () => {
    const nextIndex = (selectedIndex + 1) % cursusUsers.length;
    onSelectCursus(nextIndex);
  };

  return (
    <View style={styles.cursusSelector}>
      <Text style={styles.cursusSelectorLabel}>Cursus:</Text>
      <View style={styles.cursusDropdown}>
        <TouchableOpacity
          style={styles.cursusButton}
          onPress={handleCursusChange}
        >
          <Text style={styles.cursusName}>
            {cursusUsers[selectedIndex].cursus.name}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cursusSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cursusSelectorLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    marginRight: theme.spacing.sm,
  },
  cursusDropdown: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.card,
  },
  cursusButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  cursusName: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
});
