import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useSearchUsers } from "../hooks/useApi";
import { LoadingView } from "../components/ui/LoadingView";
import { Button } from "../components/ui/Button";
import { theme } from "../theme/theme";
import { User } from "../types/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
const RECENT_SEARCHES_KEY = "recent_searches";
const MAX_RECENT_SEARCHES = 10;

const SearchScreen = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searched, setSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { mutate: search, isPending: loading, error } = useSearchUsers();

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const savedSearches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    try {
      const updatedSearches = [
        query,
        ...recentSearches.filter((search) => search !== query),
      ].slice(0, MAX_RECENT_SEARCHES);

      setRecentSearches(updatedSearches);

      await AsyncStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updatedSearches)
      );
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  const clearAllRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  };

  const removeRecentSearch = async (query: string) => {
    try {
      const updatedSearches = recentSearches.filter((item) => item !== query);
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updatedSearches)
      );
    } catch (error) {
      console.error("Error removing recent search:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a search term");
      return;
    }

    saveRecentSearch(searchQuery.trim());

    search(searchQuery, {
      onSuccess: (results) => {
        setSearchResults(results);
        setSearched(true);
      },
      onError: (error) => {
        console.error("Search error:", error);
        Alert.alert("Error", "Failed to search users. Please try again.");
      },
    });
  };

  const handleClearInput = () => {
    setSearchQuery("");
    setSearched(false);
    setSearchResults([]);
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
    search(query, {
      onSuccess: (results) => {
        setSearchResults(results);
        setSearched(true);
        saveRecentSearch(query);
      },
      onError: (error) => {
        console.error("Search error:", error);
        Alert.alert("Error", "Failed to search users. Please try again.");
      },
    });
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

  const renderRecentSearchItem = ({ item }: { item: string }) => (
    <View style={styles.recentSearchItem}>
      <TouchableOpacity
        style={styles.recentSearchTextContainer}
        onPress={() => handleRecentSearchPress(item)}
      >
        <Ionicons
          name="time-outline"
          size={16}
          color={theme.colors.text.secondary}
        />
        <Text style={styles.recentSearchText}>{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removeRecentSearch(item)}>
        <Ionicons name="close" size={16} color={theme.colors.text.secondary} />
      </TouchableOpacity>
    </View>
  );

  const renderRecentSearches = () => {
    if (recentSearches.length === 0) return null;

    return (
      <View style={styles.recentSearchesContainer}>
        <View style={styles.recentSearchesHeader}>
          <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
          <TouchableOpacity onPress={clearAllRecentSearches}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={recentSearches}
          renderItem={renderRecentSearchItem}
          keyExtractor={(item, index) => `${item}-${index}`}
          scrollEnabled={false}
          nestedScrollEnabled={true}
        />
      </View>
    );
  };

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
      <ScrollView style={styles.initialContainer}>
        <Text style={styles.initialText}>
          Search for students by their login name
        </Text>
        {renderRecentSearches()}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by login..."
            autoCapitalize="none"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearInput}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          )}
        </View>
        <Button
          title="Search"
          onPress={handleSearch}
          disabled={loading || searchQuery.trim() === ""}
          loading={loading}
          size="small"
          style={styles.searchButton}
        />
      </View>

      <View style={styles.contentContainer}>{renderContent()}</View>
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
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.card,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
  },
  clearButton: {
    padding: 4,
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
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  initialText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  recentSearchesContainer: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  recentSearchesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  recentSearchesTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  clearAllText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  recentSearchTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  recentSearchText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
});

export default SearchScreen;
