"use client";

import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { SessionContext } from "@/context/session";
import chessKnight from "@/public/images/chess-knight.png";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DotPattern from "@/components/ui/dot-pattern";

export default function Home() {
  const session = useContext(SessionContext);
  console.log("Session: ", session);
  return (
    <section className="relative flex w-full justify-between bg-zinc-100">
      <DotPattern className={cn()} />
      <section className="relative flex h-screen w-full flex-col items-center p-9">
        <div className="group relative mb-10 cursor-pointer">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-teal-600 to-violet-600 opacity-25 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>

          <span className="items-top relative inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            Introducing BoardBlitz
          </span>
        </div>
        <Image src={chessKnight} alt="Chess knight" className="mb-5" />
        <div className="text-center">
          <p className="mt-4 text-zinc-500">
            Play chess online with a friend on BoardBlitz
            <br /> for FREE!
          </p>
          <div className="mt-6 flex items-center justify-between">
            {session?.isAuthenticated ? (
              <Link href={"/play"} className="w-full">
                <Button
                  variant={"outline"}
                  className="w-full rounded-xl text-gray-600"
                >
                  Continue
                </Button>
              </Link>
            ) : (
              <Link href={"/auth"} className="w-full">
                <Button
                  variant={"outline"}
                  className="w-full rounded-xl text-gray-600"
                >
                  Play now
                </Button>
              </Link>
            )}
          </div>
          <div className="absolute bottom-1 left-1/3 right-1/3">
            <a
              href="https://github.com/lucky-chap/boardbltiz-client"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-gray-400 hover:text-gray-800"
            >
              Get the Source Code
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
