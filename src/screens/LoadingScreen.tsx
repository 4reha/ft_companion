import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  text: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
});

export default LoadingScreen;
