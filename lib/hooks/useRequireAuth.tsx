"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/session";

import { Button } from "@/components/ui/button";

import { fetchSession } from "../requests/auth";

export function useRequireAuth() {
  const session = useContext(SessionContext);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkForSession() {
      const user = await fetchSession();
      if (!user) {
        // router.push("/");
        setIsAuthenticated(false);
      }
      setIsAuthenticated(true);
    }

    checkForSession();
  }, [session?.user]);

  if (isAuthenticated === false || session?.user === null) {
    return false;
  }

  return true;
}
