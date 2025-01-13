import { fetchActiveGame } from "@/lib/requests/game";
import GameAuthWrapper from "@/components/game/GameAuthWrapper";

type tParams = Promise<{ code: string }>;

export default async function Game(props: { params: tParams }) {
  const { code } = await props.params;
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
