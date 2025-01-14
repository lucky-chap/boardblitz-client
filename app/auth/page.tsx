"use client";

import { useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/session";

import { AuthForm } from "@/components/auth-form";
import Logo from "@/components/logo";

export default function HomePage() {
  const router = useRouter();
  const session = useContext(SessionContext);

  useEffect(() => {
    console.log("In effect hook");
    if (session?.isAuthenticated) {
      console.log("In if");
      router.push("/play");
    } else {
      console.log("In else");
    }
  }, [session?.isAuthenticated]);

  return (
    <>
      <div className="relative grid min-h-svh w-full">
        <div className="gap- flex flex-col p-6 md:p-10 md:pt-0">
          <div className="flex flex-1 items-start justify-center">
            <div className="mx-auto w-full max-w-xs">
              <Link href="/">
                <Logo />
              </Link>
              <AuthForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
