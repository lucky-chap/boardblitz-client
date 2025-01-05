import { createContext, Dispatch, SetStateAction } from "react";

import type { User } from "@/lib/types";

export const SessionContext = createContext<{
  user: User | null | undefined; // undefined = hasn't been checked yet, null = no user
  setUser: Dispatch<SetStateAction<User | null>>;
} | null>(null);
