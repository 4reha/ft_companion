import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const theme = {
  colors: {
    primary: "#00BABC",
    secondary: "#333333",
    background: "#F5F5F5",
    card: "#FFFFFF",
    text: {
      primary: "#333333",
      secondary: "#666666",
      light: "#999999",
      white: "#FFFFFF",
    },
    border: "#E0E0E0",
    success: "#4CAF50",
    error: "#F44336",
    warning: "#FFC107",
    shadow: "#000000",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    circle: 9999,
  },
  typography: {
    fontFamily: {
      regular: "System",
      bold: "System",
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 28,
    },
    fontWeight: {
      regular: "400",
      medium: "500" as const,
      semibold: "600" as const,
      bold: "700" as const,
    },
  },
  shadows: {
    small: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 3,
    },
    large: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
  },
  metrics: {
    screenWidth: width,
    screenHeight: height,
  },
};

export type Theme = typeof theme;
