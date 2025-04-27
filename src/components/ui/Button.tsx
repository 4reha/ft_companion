import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { theme } from "../../theme/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.radius.md,
      justifyContent: "center",
      alignItems: "center",
    };

    // Size
    switch (size) {
      case "small":
        baseStyle.paddingVertical = theme.spacing.xs;
        baseStyle.paddingHorizontal = theme.spacing.md;
        break;
      case "large":
        baseStyle.paddingVertical = theme.spacing.md;
        baseStyle.paddingHorizontal = theme.spacing.xl;
        break;
      default:
        baseStyle.paddingVertical = theme.spacing.sm;
        baseStyle.paddingHorizontal = theme.spacing.lg;
    }

    // Variant
    switch (variant) {
      case "secondary":
        baseStyle.backgroundColor = theme.colors.secondary;
        break;
      case "danger":
        baseStyle.backgroundColor = theme.colors.error;
        break;
      default:
        baseStyle.backgroundColor = theme.colors.primary;
    }

    // Disabled
    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }

    // Full Width
    if (fullWidth) {
      baseStyle.width = "100%";
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle: TextStyle = {
      color: theme.colors.text.white,
      fontWeight: "600",
    };

    // Size
    switch (size) {
      case "small":
        baseStyle.fontSize = theme.typography.fontSize.sm;
        break;
      case "large":
        baseStyle.fontSize = theme.typography.fontSize.lg;
        break;
      default:
        baseStyle.fontSize = theme.typography.fontSize.md;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.text.white} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
