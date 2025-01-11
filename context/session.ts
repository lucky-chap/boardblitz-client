import { createContext, Dispatch, SetStateAction } from "react";

import type { Game, User } from "@/lib/types";

export const SessionContext = createContext<{
  user: User | null | undefined; // undefined = hasn't been checked yet, null = no user
  setUser: Dispatch<SetStateAction<User | null>>;
  isAuthenticated: boolean;
  newGameCreated: boolean;
  setNewGameCreated: Dispatch<SetStateAction<boolean>>;
} | null>(null);
