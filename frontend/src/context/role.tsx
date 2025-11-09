import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "user" | "institution" | null;

type RoleContextValue = {
  role: Role;
  setRole: (role: Exclude<Role, null>) => void;
  clearRole: () => void;
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

const STORAGE_KEY = "dokchain:role";

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "user" || stored === "institution") {
      setRoleState(stored);
    }
  }, []);

  useEffect(() => {
    if (role) localStorage.setItem(STORAGE_KEY, role);
    else localStorage.removeItem(STORAGE_KEY);
  }, [role]);

  const value = useMemo<RoleContextValue>(
    () => ({
      role,
      setRole: (r) => setRoleState(r),
      clearRole: () => setRoleState(null),
    }),
    [role]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

// Non-component hook export is fine; Fast refresh warning can be ignored or we can rename file.
export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within a RoleProvider");
  return ctx;
}
