import { notFound } from "next/navigation";

import { fetchArchivedGame } from "@/lib/requests/game";
import type { Game } from "@/lib/types";
import GameHistoryDetails from "@/components/game-history-details";

type tParams = Promise<{ gameId: number }>;

export default async function Archive(props: { params: tParams }) {
  const { gameId } = await props.params;
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
