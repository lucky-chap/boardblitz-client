import { notFound } from "next/navigation";

import { fetchUserProfile } from "@/lib/requests/user";
import CopyLink from "@/components/user/CopyLink";

export async function generateMetadata({
  params,
}: {
  params: { id: string | number };
}) {
  const data = await fetchUserProfile(params.id);
  if (!data) {
    return {
      description: "User not found",
      robots: {
        index: false,
        follow: false,
        nocache: true,
        noarchive: true,
      },
    };
  }
  return {
    title: `${data.name} | chessu`,
    description: `${data.name}'s profile`,
    openGraph: {
      title: `${data.name} | chessu`,
      description: `${data.name}'s profile on chessu`,
      url: `https://ches.su/user/${data.name}`,
      siteName: "chessu",
      locale: "en_US",
      type: "website",
    },
    robots: {
      index: true,
      follow: false,
      nocache: true,
    },
  };
}

export default async function Profile({
  params,
}: {
  params: { id: number | string };
}) {
  const userId = await params.id;
  const data = await fetchUserProfile(params.id);
  if (!data) {
    notFound();
  }

  return (
    <div className="mt-8 flex w-full flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 md:gap-8">
        <h1 className="text-4xl font-bold">{data.name}</h1>
        <div className="flex gap-6">
          <div className="flex flex-col items-center">
            <span className="text-sm">Wins</span>
            <span className="text-xl font-bold">{data.wins}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm">Draws</span>
            <span className="text-xl font-bold">{data.draws}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm">Losses</span>
            <span className="text-xl font-bold">{data.losses}</span>
          </div>
        </div>
        <CopyLink name={data.name as string} />
      </div>

      <div>
        <h2 className="mb-1 text-lg font-bold">Recent games</h2>
        <ul className="flex h-[60vh] flex-col gap-1 overflow-y-scroll rounded-lg bg-base-300">
          {data.recentGames.map((game) => {
            let endReason = game.endReason as string;
            if (endReason === "repetition") {
              endReason = "threefold repetition";
            } else if (endReason === "insufficient") {
              endReason = "insufficient material";
            }

            return (
              <li
                key={game.id}
                className="flex flex-wrap items-center justify-between gap-8 border-b-2 border-base-100 p-3"
              >
                <div className="flex w-72 justify-between">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1 text-sm">
                      White
                      {game.winner === "white" && (
                        <span className="badge badge-success badge-xs">
                          winner
                        </span>
                      )}
                    </span>
                    <a
                      className={
                        "font-bold" +
                        (typeof game.white?.id === "number"
                          ? " link-hover text-primary"
                          : " cursor-default")
                      }
                      href={
                        typeof game.white?.id === "number" &&
                        game.white?.id !== data.id
                          ? `/user/${game.white?.name}`
                          : undefined
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {game.white?.name}
                    </a>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="flex items-center gap-1 text-sm">
                      {game.winner === "black" && (
                        <span className="badge badge-success badge-xs">
                          winner
                        </span>
                      )}
                      Black
                    </span>
                    <a
                      className={
                        "font-bold" +
                        (typeof game.black?.id === "number"
                          ? " link-hover text-primary"
                          : " cursor-default")
                      }
                      href={
                        typeof game.black?.id === "number" &&
                        game.black?.id !== data.id
                          ? `/user/${game.black?.name}`
                          : undefined
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {game.black?.name}
                    </a>
                  </div>
                </div>

                <div className="flex-grow text-end text-xs">{endReason}</div>

                <div className="flex flex-grow flex-col text-end">
                  <span className="text-xs">
                    Started
                    <span className="font-bold">
                      {" "}
                      {new Date(game.startedAt as number).toLocaleString()}
                    </span>
                  </span>
                  <span className="text-xs">
                    Ended
                    <span className="font-bold">
                      {" "}
                      {new Date(game.endedAt as number).toLocaleString()}
                    </span>
                  </span>
                </div>

                <a
                  className="btn btn-ghost flex-grow"
                  href={`/archive/${game.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Review game
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
