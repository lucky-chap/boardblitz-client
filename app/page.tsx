"use client";

import { useContext, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/session";
import chessKnight from "@/public/images/chess-knight.png";
import logo from "@/public/images/logo.png";

import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import FlickeringGrid from "@/components/ui/flickering-grid";
import MorphingText from "@/components/ui/morphing-text";
import { AuthForm } from "@/components/auth-form";
import Logo from "@/components/logo";

const texts = [
  "♟️ Ready to checkmate the world? Play online multiplayer chess now and conquer the board! 🌍",
  "🔥 Your move, your strategy! Challenge friends or global players in the ultimate chess arena! 🧠",
  "💡 Think ahead, play smart. Join the online chess revolution and prove your skills! 🏆",
  "🎮 Chess reimagined! Dive into real-time multiplayer battles and climb the global leaderboard! 🌟",
  "♛ The queen’s gambit awaits you. Play multiplayer chess online and outsmart your rivals! 🤔",
  "⚔️ Every move counts. Can you dominate the board? Join the most exciting chess battles now! 🕒",
  "🎉 It’s not just a game, it’s a battle of wits. Join online multiplayer chess and make your move! 🚀",
  "🧩 Strategy, focus, and fun! Test your chess skills against players from all around the globe. 💻",
  "💬 Challenge a friend or meet new rivals—online chess is where the smartest minds meet. 🧠",
  "🎭 No bluffing here—just pure strategy. Outwit and outplay in the ultimate chess showdown! 🔥",
  "🖤♙ It’s time to make your move. Play online chess and experience strategy like never before! ♛",
  "💪 Every piece has power. Every move has purpose. Show the world what you’re made of in chess! 🏆",
];

export default function HomePage() {
  const router = useRouter();
  const session = useContext(SessionContext);

  // console.log("Current session: ", session);

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
      <div className="relative grid min-h-svh w-full lg:grid-cols-2">
        <div className="gap- flex flex-col p-6 md:p-10 md:pt-0">
          <div className="flex flex-1 items-start justify-center">
            <div className="mx-auto w-full max-w-xs">
              <Logo />
              <AuthForm />
            </div>
          </div>
        </div>
        <div className="relative hidden bg-white dark:bg-zinc-800 lg:block">
          <FlickeringGrid />
          <Image
            src={chessKnight}
            alt="Chess Knight"
            className="absolute top-16 xl:right-56"
            width={500}
            height={500}
          />
          <MorphingText
            texts={texts}
            className="absolute bottom-48 mx-auto max-w-lg text-sm lg:right-2 xl:right-48"
          />
        </div>
      </div>
    </>
  );
}
