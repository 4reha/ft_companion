import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { searchUsers } from "../services/apiService";
import { LoadingView } from "../components/ui/LoadingView";
import { Button } from "../components/ui/Button";
import { theme } from "../theme/theme";
import { User } from "../types/api";

type SearchScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Search"
>;

const SearchScreen = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a search term");
      return;
    }

    try {
      setLoading(true);
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
      setSearched(true);
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Failed to search users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (login: string) => {
    navigation.navigate("ProfileDetail", { login });
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserSelect(item.login)}
    >
      <Image source={{ uri: item.image.link }} style={styles.userImage} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.login}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loading) {
      return <LoadingView message="Searching..." />;
    }

    if (searched) {
      if (searchResults.length > 0) {
        return (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUserItem}
            contentContainerStyle={styles.listContainer}
          />
        );
      } else {
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No users found matching "{searchQuery}"
            </Text>
          </View>
        );
      }
    }

    return (
      <View style={styles.initialContainer}>
        <Text style={styles.initialText}>
          Search for students by their login name
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by login..."
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <Button
          title="Search"
          onPress={handleSearch}
          disabled={loading}
          size="small"
          style={styles.searchButton}
        />
      </View>

      <View style={styles.contentContainer}>{renderContent()}</View>

      <Button
        title="Back to Profile"
        onPress={() => navigation.navigate("Profile")}
        variant="secondary"
        style={styles.backButton}
        fullWidth
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    fontSize: theme.typography.fontSize.md,
  },
  searchButton: {
    marginLeft: theme.spacing.sm,
  },
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 80,
  },
  userItem: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.border,
  },
  userInfo: {
    marginLeft: theme.spacing.sm,
    justifyContent: "center",
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  userEmail: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
  initialContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  initialText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
});

export default SearchScreen;
