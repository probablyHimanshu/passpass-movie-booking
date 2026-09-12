import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const LOCAL_USERS_KEY = 'passpass_registered_users';
const CURRENT_USER_KEY = 'passpass_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load stored user from localStorage
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load user session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper: get local backup users
  const getLocalUsers = () => {
    try {
      const raw = localStorage.getItem(LOCAL_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  };

  // Helper: save local backup user
  const saveLocalUser = (newUser) => {
    try {
      const users = getLocalUsers();
      const normalizedEmail = newUser.email.toLowerCase().trim();
      const existingIdx = users.findIndex(u => u.email.toLowerCase().trim() === normalizedEmail);
      if (existingIdx >= 0) {
        users[existingIdx] = newUser;
      } else {
        users.push(newUser);
      }
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save user to local store:', e);
    }
  };

  // Register user with backend & duplicate protection
  const registerUser = async ({ name, email, password, phone }) => {
    const normalizedEmail = email.toLowerCase().trim();

    // First check local duplicate store
    const localUsers = getLocalUsers();
    const localDuplicate = localUsers.find(u => u.email.toLowerCase().trim() === normalizedEmail);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: normalizedEmail, password, phone }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Cache locally as well
        saveLocalUser({
          id: data.data.id,
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
          password, // stored locally for offline fallback
          role: data.data.role || 'user',
        });
        return { success: true, message: data.message, data: data.data };
      } else {
        return {
          success: false,
          duplicate: data.duplicate || res.status === 409,
          message: data.message || 'Registration failed. Please check your details.',
        };
      }
    } catch (networkErr) {
      console.warn('Backend unavailable, using local register store:', networkErr);
      if (localDuplicate) {
        return {
          success: false,
          duplicate: true,
          message: 'An account with this email address already exists. Please sign in instead.',
        };
      }
      const fakeId = 'usr_' + Date.now();
      const newUser = {
        id: fakeId,
        name: name.trim(),
        email: normalizedEmail,
        password,
        phone: phone ? phone.trim() : '',
        role: 'user',
      };
      saveLocalUser(newUser);
      return {
        success: true,
        message: 'Account created successfully! Please sign in with your credentials.',
        data: { id: fakeId, name: newUser.name, email: newUser.email, phone: newUser.phone, role: 'user' },
      };
    }
  };

  // Login user with backend & credential verification
  const loginUser = async (email, password) => {
    const normalizedEmail = email.toLowerCase().trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        setUser(data.data);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.data));
        return { success: true, message: data.message, data: data.data };
      } else {
        return {
          success: false,
          notFound: data.notFound || res.status === 404,
          message: data.message || 'Invalid credentials.',
        };
      }
    } catch (networkErr) {
      console.warn('Backend unavailable, validating against local store:', networkErr);
      const localUsers = getLocalUsers();
      const found = localUsers.find(u => u.email.toLowerCase().trim() === normalizedEmail);

      if (!found) {
        return {
          success: false,
          notFound: true,
          message: 'Couldn’t find your account. Please check your email or create an account.',
        };
      }

      if (found.password !== password) {
        return {
          success: false,
          message: 'Incorrect password. Please try again.',
        };
      }

      const sessionUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone || '',
        role: found.role || 'user',
      };
      setUser(sessionUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
      return { success: true, message: 'Logged in successfully!', data: sessionUser };
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: (userData) => {
          setUser(userData);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
        },
        logout: logoutUser,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
