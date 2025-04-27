import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../theme/theme";
import { Button } from "./Button";

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {onRetry && (
        <Button title="Try Again" onPress={onRetry} style={styles.button} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  text: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  button: {
    marginTop: theme.spacing.md,
  },
});
