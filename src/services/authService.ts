import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import {
  EXPO_PUBLIC_42_CLIENT_ID,
  EXPO_PUBLIC_42_CLIENT_SECRET,
  EXPO_PUBLIC_42_REDIRECT_URI,
} from "@env";

// Token storage keys
const ACCESS_TOKEN_KEY = "42_access_token";
const REFRESH_TOKEN_KEY = "42_refresh_token";
const TOKEN_EXPIRY_KEY = "42_token_expiry";

// Auth session configuration
const discovery = {
  authorizationEndpoint: "https://api.intra.42.fr/oauth/authorize",
  tokenEndpoint: "https://api.intra.42.fr/oauth/token",
};

// Types
interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// Function to initiate OAuth login
export const login = async () => {
  try {
    const request = new AuthSession.AuthRequest({
      clientId: EXPO_PUBLIC_42_CLIENT_ID,
      scopes: ["public"],
      redirectUri: EXPO_PUBLIC_42_REDIRECT_URI,
    });

    const result = await request.promptAsync(discovery);

    if (result.type === "success") {
      const { code } = result.params;
      return await exchangeCodeForToken(code);
    }
    return false;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};

// Exchange authorization code for tokens
const exchangeCodeForToken = async (code: string): Promise<boolean> => {
  try {
    const response = await axios.post<TokenResponse>(
      "https://api.intra.42.fr/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: EXPO_PUBLIC_42_CLIENT_ID,
        client_secret: EXPO_PUBLIC_42_CLIENT_SECRET,
        code,
        redirect_uri: EXPO_PUBLIC_42_REDIRECT_URI,
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;
    const expiryTime = Date.now() + expires_in * 1000;

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access_token);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh_token);
    await SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, expiryTime.toString());

    return true;
  } catch (error) {
    console.log("Token exchange error:", error);
    return false;
  }
};

// Get the current access token (refreshing if needed)
export const getAccessToken = async (): Promise<string | null> => {
  try {
    const expiryTimeStr = await SecureStore.getItemAsync(TOKEN_EXPIRY_KEY);
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

    if (!expiryTimeStr || !accessToken) {
      return null;
    }

    const expiryTime = parseInt(expiryTimeStr);

    // If token is expired or will expire in the next 5 minutes
    if (Date.now() > expiryTime - 5 * 60 * 1000) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        return null;
      }
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    }

    return accessToken;
  } catch (error) {
    console.error("Get token error:", error);
    return null;
  }
};

// Refresh the token when it expires
const refreshToken = async (): Promise<boolean> => {
  try {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      return false;
    }

    const response = await axios.post<TokenResponse>(
      "https://api.intra.42.fr/oauth/token",
      {
        grant_type: "refresh_token",
        client_id: EXPO_PUBLIC_42_CLIENT_ID,
        client_secret: EXPO_PUBLIC_42_CLIENT_SECRET,
        refresh_token: refreshToken,
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;
    const expiryTime = Date.now() + expires_in * 1000;

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access_token);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh_token);
    await SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, expiryTime.toString());

    return true;
  } catch (error) {
    console.error("Token refresh error:", error);
    return false;
  }
};

// Logout by removing stored tokens
export const logout = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// Check if user is logged in
export const isLoggedIn = async (): Promise<boolean> => {
  const token = await getAccessToken();
  return token !== null;
};
