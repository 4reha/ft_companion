import React, { ReactNode } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { theme } from "../../theme/theme";

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  elevation?: "none" | "small" | "medium" | "large";
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = "small",
}) => {
  const getShadowStyle = () => {
    switch (elevation) {
      case "none":
        return {};
      case "medium":
        return theme.shadows.medium;
      case "large":
        return theme.shadows.large;
      default:
        return theme.shadows.small;
    }
  };

  return (
    <View style={[styles.container, getShadowStyle(), style]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
});
