"use client";

import { useContext } from "react";
import { SessionContext } from "@/context/session";

import { Game } from "@/lib/types";

import GamePage from "./GamePage";

export default function GameAuthWrapper({
  initialLobby,
}: {
  initialLobby: Game;
}) {
  const session = useContext(SessionContext);

  if (!session?.user || !session.user?.id) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="text-2xl font-bold">Loading</div>
        <div className="text-xl">Checking for session...</div>
        <div className="text-xl">(Please log in if you have not done so)</div>
      </div>
    );
  }

  return <GamePage initialLobby={initialLobby} />;
}
