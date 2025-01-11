"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { SessionContext } from "@/context/session";
import { RotateCw } from "lucide-react";

import { fetchPublicGames } from "@/lib/requests/game";
import { Game } from "@/lib/types";

import { Button } from "./ui/button";

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.comd",
    role: "Member",
  },
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.coms",
    role: "Member",
  },
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.comg",
    role: "Member",
  },
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.comz",
    role: "Member",
  },
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.comy",
    role: "Member",
  },
];

export default function GamesTable() {
  const session = useContext(SessionContext);
  const [games, setGames] = useState<any[]>([]);

  async function getGames() {
    const games = await fetchPublicGames();
    setGames(games as Game[]);
  }
  useEffect(() => {
    getGames();
  }, [session?.newGameCreated]);
  console.log("Active games: ", games);
  return (
    <div className="mx-auto mt-20 w-full px-4 xl:mt-0">
      <div className="sm:flex sm:items-center">
        <div className="flex items-center justify-between sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Active games
          </h1>
          <Button
            type="button"
            variant={"outline"}
            onClick={() => getGames()}
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
                      Host
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Game code
                    </th>
                    {/* <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th> */}
                  </tr>
                </thead>
                <tbody className="w-full divide-y divide-gray-200 bg-white">
                  {games &&
                    games.length > 0 &&
                    games.map((game: Game) => (
                      <tr key={game.code}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {game?.host?.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {game?.host?.connected ? (
                            <span className="me-2 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                              Connected
                            </span>
                          ) : (
                            <span className="me-2 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                              Disconnected
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs font-medium text-gray-700">
                          <span className="rounded bg-zinc-100 p-1 px-2">
                            {game?.code}
                          </span>
                        </td>

                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            href={`/play/${game?.code}`}
                            className="text-blue-600 hover:text-blue-600"
                          >
                            Join
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {games.length === 0 && (
                <div className="flex h-20 w-full items-center justify-center">
                  <p>No active games yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
