import axios from "axios";
import { getAccessToken } from "./authService";

// Base API instance
const api = axios.create({
  baseURL: "https://api.intra.42.fr/v2",
});

// Add request interceptor to add auth token
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

// User interface based on 42 API
export interface User {
  id: number;
  login: string;
  email: string;
  phone?: string;
  displayname: string;
  image: {
    link: string;
  };
  staff?: boolean;
  correction_point: number;
  location?: string;
  wallet: number;
  groups: any[];
  cursus_users: {
    level: number;
    skills: {
      id: number;
      name: string;
      level: number;
    }[];
  }[];
  projects_users: {
    id: number;
    final_mark?: number;
    status: string;
    project: {
      id: number;
      name: string;
    };
  }[];
  // Add more fields as needed
}

// Get the current logged-in user's profile
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get("/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

// Search for users by login
export const searchUsers = async (query: string): Promise<User[]> => {
  try {
    const response = await api.get("/users", {
      params: {
        "filter[login]": query,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

// Get a specific user by login
export const getUserByLogin = async (login: string): Promise<User> => {
  try {
    const response = await api.get(`/users/${login}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${login}:`, error);
    throw error;
  }
};

export default api;
