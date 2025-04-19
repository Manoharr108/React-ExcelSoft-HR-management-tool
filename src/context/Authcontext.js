
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser || null;
  });

  const login = (userInfo) => {
    localStorage.setItem("user", JSON.stringify(userInfo)); 
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAdmin = user?.role === "admin";
  const canPublish = user?.role === "publisher";
  const isViewer = user?.role === "viewer";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, canPublish, isViewer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);