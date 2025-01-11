import GamesTable from "@/components/games-table";
import StartGame from "@/components/start-game";

export const revalidate = 0;

export default function Home() {
  return (
    <div className="max-w-7x mx-auto grid gap-3 xl:grid-cols-2 xl:py-20">
      <GamesTable />
      <StartGame />
    </div>
  );
}
