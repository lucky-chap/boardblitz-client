"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { fetchSession } from "@/lib/requests/auth";
import type { User } from "@/lib/types";

import { SessionContext } from "./session";

export default function ContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newGameCreated, setNewGameCreated] = useState(false);

  async function getSession() {
    const data = await fetchSession();
    setIsAuthenticated(data && data.isAuthenticated ? true : false);
    setUser(data?.user || null);
  }

  useEffect(() => {
    getSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        newGameCreated,
        setNewGameCreated,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
