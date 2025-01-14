"use client";

import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/session";

import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import Logo from "@/components/logo";
import ProfileDropdown from "@/components/profile-dropdown";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const session = useContext(SessionContext);
  const isAuthenticated = useRequireAuth();

  useEffect(() => {
    // wait one second to check for session first
    console.log("Authenticated: ", session?.isAuthenticated);
    if (!session?.isAuthenticated) {
      router.push("/auth");
    }
  }, [session?.isAuthenticated]);
  return (
    <main className="w-full bg-zinc-50">
      <div className="w-full border-b border-zinc-200">
        <nav className="flex h-14 w-full bg-white px-2">
          <ul className="mx-auto flex w-full max-w-[100rem] items-center justify-between">
            <li className="text-sm font-medium text-zinc-500">
              <Link href={"/play"}>
                <Logo width={100} height={50} className="hidden md:block" />
                <h1 className="font-bold text-zinc-700 md:hidden">
                  BoardBlitz
                </h1>
              </Link>
            </li>
            <li>
              <ProfileDropdown />
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-[100rem]">{children}</div>
    </main>
  );
}
