import { fetchActiveGame } from "@/lib/requests/game";
import GameAuthWrapper from "@/components/game/GameAuthWrapper";

export default async function Game({ params }: { params: { code: string } }) {
  const { code } = await params;
  const game = await fetchActiveGame(code);
  if (!game) {
    return (
      <div>
        <p className="text-2xl font-bold">No active game found</p>
      </div>
    );
  }

  return <GameAuthWrapper initialLobby={game} />;
}
