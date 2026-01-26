"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  isOnline: boolean;
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  getUserFullName: () => string;
}

const initialUserData: UserData = {
  firstName: "Rajesh",
  lastName: "Kumar",
  email: "rajesh.kumar@example.com",
  phone: "+91 98765 43210",
  dateOfBirth: "03/15/1958",
  gender: "Male",
  address: "B-12, Sector 18, Noida, Uttar Pradesh 201301",
  isOnline: true,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  // Load from localStorage on mount if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('userData');
      if (stored) {
        try {
          setUserData(JSON.parse(stored));
        } catch (e) {
          // If parsing fails, use initial data
        }
      }
    }
  }, []);

  // Debounced save to localStorage - only after changes settle
  useEffect(() => {
    // Skip the initial mount to avoid double-saving
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (typeof window !== 'undefined') {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Debounce: wait 500ms after last change before saving
      saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem('userData', JSON.stringify(userData));
      }, 500);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [userData]);

  const updateUserData = useCallback((data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  }, []);

  const getUserFullName = useCallback(() => {
    return `${userData.firstName} ${userData.lastName}`.trim();
  }, [userData.firstName, userData.lastName]);

  return (
    <UserContext.Provider value={{ userData, updateUserData, getUserFullName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
