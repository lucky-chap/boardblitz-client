"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { SessionContext } from "@/context/session";
import { Loader2, RotateCw } from "lucide-react";

import { fetchUserProfile } from "@/lib/requests/user";
import { Game } from "@/lib/types";
import { formatTime } from "@/lib/utils";

import { Button } from "./ui/button";

export default function HistoryTable({
  userId,
}: {
  userId?: number | string | undefined;
}) {
  const session = useContext(SessionContext);
  const [recentGames, setRecentGames] = useState<Game[]>();
  const [loading, setLoading] = useState(false);
  const idToSearch = userId ?? session?.user?.id;

  const getRecentGames = async () => {
    setLoading(true);
    const data = await fetchUserProfile(idToSearch as string | number);
    setRecentGames(data?.recentGames);
    setLoading(false);
  };

  useEffect(() => {
    getRecentGames();
  }, [session?.user]);

  console.log("Recent games: ", recentGames);
  return (
    <div className="mx-auto mt-20 w-full px-4 xl:mt-0">
      <div className="sm:flex sm:items-center">
        <div className="flex items-center justify-between sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Game history
          </h1>
          <Button
            type="button"
            variant={"outline"}
            onClick={() => getRecentGames()}
            className="rounded-full px-2 py-0"
          >
            <RotateCw />
          </Button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      White
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Black
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Winner
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      End reason
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Start time
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      End time
                    </th>
                  </tr>
                </thead>
                <tbody className="w-full divide-y divide-gray-200 bg-white">
                  {recentGames &&
                    recentGames.length > 0 &&
                    recentGames.map((game: Game) => (
                      <tr key={game?.id}>
                        {game.white_id ? (
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-blue-500 sm:pl-6">
                            <Link href={`/play/user/${game.white_id}`}>
                              {game?.white_name}
                            </Link>
                          </td>
                        ) : (
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                            {game?.white_name}
                          </td>
                        )}
                        {/* black  */}
                        {game.black_id ? (
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-blue-500 sm:pl-6">
                            <Link href={`/play/user/${game.black_id}`}>
                              {game?.black_name}
                            </Link>
                          </td>
                        ) : (
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                            {game?.black_name}
                          </td>
                        )}

                        <td className="whitespace-nowrap px-3 py-4 text-xs font-medium text-gray-700">
                          <span className="me-2 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                            {game?.winner}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs font-medium text-gray-700">
                          <span className="me-2 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                            {game?.end_reason}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatTime(game?.started_at as string)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatTime(game?.ended_at as string)}
                        </td>

                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            href={`/play/history/${game?.id}`}
                            className="text-blue-600 hover:text-blue-600"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {loading == false && recentGames?.length === 0 && (
                <div className="flex h-20 w-full items-center justify-center">
                  <p>No recent games yet</p>
                </div>
              )}
              {loading && (
                <div className="flex h-20 w-full items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
