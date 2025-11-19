import type { ReactNode } from "react";
import { createContext, useState } from "react";
import { authService } from "../services/authService";
import type { LoginRequest, RegisterRequest, User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => authService.getUser());
  const [token, setToken] = useState<string | null>(() =>
    authService.getToken()
  );

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    authService.setToken(response.token);
    authService.setUser(response.user);
    setToken(response.token);
    setUser(response.user);
  };

  const register = async (userData: RegisterRequest) => {
    await authService.register(userData);
    // After registration, automatically log in
    await login({ email: userData.email, password: userData.password });
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
