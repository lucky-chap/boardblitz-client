"use client";

import { useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/session";

import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/auth-form";
import Logo from "@/components/logo";

export default function HomePage() {
  const router = useRouter();
  const session = useContext(SessionContext);

  useEffect(() => {
    console.log("In effect hook");
    if (session?.isAuthenticated) {
      router.push("/play");
    } else {
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
              {session?.isAuthenticated ? (
                <Link href="/play" className="w-full">
                  <Button variant={"brand"} className="mt-4 w-full">
                    Play
                  </Button>
                </Link>
              ) : (
                <AuthForm />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
