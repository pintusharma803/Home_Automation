import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { setAccessToken } from '../api/axios';
import { useLinkClickHandler } from 'react-router-dom';
import { socket, connectSocket } from "../socket/socket";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};


// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking existing session
  const [error, setError] = useState(null);

  // On app load, try to silently refresh using the httpOnly cookie
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.accessToken);
        setUser(data.user);
        if (data.user) connectSocket();
      } catch (err) {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "logout" && event.newValue) {
        setUser(null);
        navigate("/login");
      }
    };
    window.addEventListener("storage", syncLogout);
    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, []);

  useEffect(() => {
        if (!socket) return;
        const handleForceLogout = (data) => {
            console.log("Force logout:", data);
            // Access token remove
            setAccessToken(null);
            // User ko logout
            setUser(null);
            // Login page par bhejo
            navigate("/login");
        };
        socket.on("forceLogout", handleForceLogout);
        return () => {
            socket.off("forceLogout", handleForceLogout);
        };
    }, [socket]);


  // Register
  const register = useCallback(async (name, email, password) => {
    setError(null);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setAccessToken(data.accessToken);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  }, []);


  // Login 
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAccessToken(data.accessToken);
      setUser(data.user);
      if (data.user) connectSocket(); // connect to socket server after successful login
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.setItem("logout", Date.now());
      socket.disconnect(); // disconnect from socket server on logout

    }
  }, []);

  const profileData = useCallback(async () => {
    try {
      const data = await api.get('/auth/profileData');
      //  console.log(data.data.user);
      return data.data.user;

    } catch (error) {
      console.log(error);
    }
  }, []
  );

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    profileData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
