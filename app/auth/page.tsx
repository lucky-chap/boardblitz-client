"use client";

import { useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/session";

import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/auth-form";
import Logo from "@/components/logo";

export default function HomePage() {
  const router = useRouter();
  const session = useContext(SessionContext);

  useEffect(() => {
    // retrieve session from local storage
    // and set it to the context
    // if session is not set
    // redirect to auth page
    const localStorageSession = localStorage.getItem("session");
    if (localStorageSession) {
      const parsedSession: {
        user: User;
        isAuthenticated: boolean;
      } = JSON.parse(localStorageSession);
      session?.setUser(parsedSession.user);
      console.log("Local storage session: ", parsedSession);
      if (
        parsedSession.user === null ||
        Object.keys(parsedSession?.user || {}).length > 0 == false
      ) {
        return;
      }
    } else {
      router.push("/play");
    }
  }, []);

  return (
    <>
      <div className="relative grid min-h-svh w-full">
        <div className="gap- flex flex-col p-6 md:p-10 md:pt-0">
          <div className="flex flex-1 items-start justify-center">
            <div className="mx-auto w-full max-w-xs">
              <Link href="/">
                <Logo />
              </Link>
              {/* {session?.user !== null ? (
                <Link href="/play" className="w-full">
                  <Button variant={"brand"} className="mt-4 w-full">
                    Play
                  </Button>
                </Link>
              ) : (
              )} */}
              <AuthForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
