"use client";

import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/session";

import { User } from "@/lib/types";
import Logo from "@/components/logo";
import ProfileDropdown from "@/components/profile-dropdown";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const session = useContext(SessionContext);

  useEffect(() => {
    if (
      session?.user === null ||
      Object.keys(session?.user || {}).length > 0 == false
    ) {
      router.push("/auth");
    } else {
      session?.setUser(session?.user as User);
    }
  }, [session?.user]);

  console.log("Session on play layout: ", session);
  // resave session
  // for some reason the session is not being saved or is lost
  // after auth
  // session?.setUser(session?.user as User);
  // console.log("Resaved Session on play layout: ", session);

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
