
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '../types';
import { COGNITO_LOGOUT_URL } from '../constants';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  handleAuthentication: (accessToken: string, idToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Renamed for clarity, as it decodes the ID token for user info.
const decodeIdToken = (token: string): User | null => {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;
    const decodedJson = atob(payloadBase64);
    const decodedPayload = JSON.parse(decodedJson);
    return {
      email: decodedPayload.email,
      roles: decodedPayload['cognito:groups'] || [],
    };
  } catch (error) {
    console.error("Failed to decode ID token:", error);
    return null;
  }
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('access_token');
    const storedIdToken = localStorage.getItem('id_token'); // Check for ID token too
    if (storedAccessToken && storedIdToken) {
      const decodedUser = decodeIdToken(storedIdToken);
      if (decodedUser) {
        setToken(storedAccessToken);
        setUser(decodedUser);
      }
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token'); // Also remove id_token
    setToken(null);
    setUser(null);
    window.location.href = COGNITO_LOGOUT_URL;
  }, []);

  const handleAuthentication = useCallback((accessToken: string, idToken: string) => {
    const decodedUser = decodeIdToken(idToken); // Decode the ID token for user info
    if (decodedUser) {
      localStorage.setItem('access_token', accessToken); // Store access token for APIs
      localStorage.setItem('id_token', idToken); // Store ID token for user info/session
      setToken(accessToken);
      setUser(decodedUser);
      // Navigation is now handled by the AuthCallback component to prevent race conditions.
    } else {
      // Handle invalid token
      logout();
    }
  }, [logout]);

  const value = { token, user, isLoading, handleAuthentication, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};