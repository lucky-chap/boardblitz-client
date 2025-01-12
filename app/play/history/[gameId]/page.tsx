import { notFound } from "next/navigation";

import { fetchArchivedGame } from "@/lib/requests/game";
import type { Game } from "@/lib/types";
import GameHistoryDetails from "@/components/game-history-details";

export default async function Archive({
  params,
}: {
  params: { gameId: number };
}) {
  const p = await params;
  const gameId = p.gameId;
  const game = (await fetchArchivedGame({ id: gameId })) as Game | undefined;
  if (!game) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl xl:py-20">
      <GameHistoryDetails game={game} />
    </div>
  );
}
