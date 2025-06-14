import axios from "axios";
import { getAccessToken } from "./authService";
import { User } from "../types/api";

const api = axios.create({
  baseURL: "https://api.intra.42.fr/v2",
});

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `API Error: ${error.response.status} - ${JSON.stringify(
          error.response.data
        )}`
      );

      switch (error.response.status) {
        case 401:
          break;
        case 404:
          error.message = "Resource not found";
          break;
        case 429:
          error.message = "API rate limit exceeded. Please try again later.";
          break;
        case 500:
          error.message = "Server error. Please try again later.";
          break;
        default:
          error.message = error.response.data.message || "An error occurred";
      }
    } else if (error.request) {
      console.error("API Request Error:", error.request);
      error.message = "Network error. Please check your connection.";
    } else {
      console.error("API Error:", error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Get the current logged-in user's profile
 * @returns User profile data
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>("/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

/**
 * Search for users by login
 * @param query - Login query string to search for
 * @returns Array of user results
 */
export const searchUsers = async (query: string): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/users", {
      params: {
        "filter[login]": query,
        sort: "login",
        "page[size]": 20,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

/**
 * Get a specific user by login
 * @param login - User login to fetch
 * @returns User profile data
 */
export const getUserByLogin = async (login: string): Promise<User> => {
  try {
    const response = await api.get<User>(`/users/${login}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${login}:`, error);
    throw error;
  }
};

export default api;
