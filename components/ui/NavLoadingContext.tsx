"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface NavLoadingContextType {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const NavLoadingContext = createContext<NavLoadingContextType>({
  loading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export function NavLoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);

  return (
    <NavLoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
    </NavLoadingContext.Provider>
  );
}

export function useNavLoading() {
  return useContext(NavLoadingContext);
}
