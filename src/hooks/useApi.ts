import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  getUserByLogin,
  searchUsers,
} from "../services/apiService";
import { User } from "../types/api";

/**
 * Custom hook to fetch the current user's profile
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
};

/**
 * Custom hook to fetch a user by their login
 */
export const useUserByLogin = (login: string) => {
  return useQuery({
    queryKey: ["user", login],
    queryFn: () => getUserByLogin(login),
    enabled: !!login, // Only run the query if login is provided
  });
};

/**
 * Custom hook to search for users
 * Using a manual trigger pattern since this is a search action
 */
export const useSearchUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (query: string) => searchUsers(query),
    onSuccess: (data, variables) => {
      // Cache the search results
      queryClient.setQueryData(["userSearch", variables], data);
    },
  });
};

/**
 * Custom hook to invalidate user data
 * Useful when you need to refresh user data
 */
export const useInvalidateUserData = () => {
  const queryClient = useQueryClient();

  return {
    invalidateCurrentUser: () =>
      queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
    invalidateUserByLogin: (login: string) =>
      queryClient.invalidateQueries({ queryKey: ["user", login] }),
    invalidateAllUsers: () =>
      queryClient.invalidateQueries({ queryKey: ["user"] }),
  };
};
