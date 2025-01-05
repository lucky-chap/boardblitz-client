"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { fetchSession } from "@/lib/requests/auth";
import type { User } from "@/lib/types";

import { SessionContext } from "./session";

export default function ContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({});

  async function getSession() {
    const user = await fetchSession();
    setUser(user || null);
  }

  useEffect(() => {
    getSession();
  }, []);

  return (
    <SessionContext.Provider value={{ user, setUser }}>
      {children}
    </SessionContext.Provider>
  );
}
