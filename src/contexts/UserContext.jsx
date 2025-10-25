import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe usarse dentro de UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('unicornio_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user from localStorage", error);
        localStorage.removeItem('unicornio_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('unicornio_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('unicornio_user');
  };

  const updateUser = (updates) => {
    setUser(prevUser => {
      const updatedUser = { ...prevUser, ...updates };
      localStorage.setItem('unicornio_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <UserContext.Provider value={{
      user,
      login,
      logout,
      updateUser,
      loading
    }}>
      {children}
    </UserContext.Provider>
  );
};