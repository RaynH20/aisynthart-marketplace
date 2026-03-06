import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'synthart_users';
const CURRENT_USER_KEY = 'synthart_current_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): Record<string, { password: string; user: User }> => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  };

  const saveUsers = (users: Record<string, { password: string; user: User }>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    const users = getUsers();

    if (users[email]) {
      return false; // User already exists
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      createdAt: new Date().toISOString()
    };

    users[email] = { password, user: newUser };
    saveUsers(users);

    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const userData = users[email];

    if (!userData || userData.password !== password) {
      return false;
    }

    setUser(userData.user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData.user));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
