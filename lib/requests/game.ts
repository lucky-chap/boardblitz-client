import { Game } from "@/lib/types";

import { makeRequest } from "./utils";

export const createGame = async (side: string, unlisted: boolean) => {
  return makeRequest<Game>("/games", {
    method: "POST",
    body: JSON.stringify({ side, unlisted }),
    maxAge: 0,
  });
};

export const fetchActiveGame = async (code: string) => {
  return makeRequest<Game>(`/games/${code}`, { maxAge: 0 });
};

export const fetchPublicGames = async () => {
  return makeRequest<Game[]>("/games", { maxAge: 0 });
};

export const fetchArchivedGame = async ({
  id,
  userid,
}: {
  id?: number;
  userid?: number;
}) => {
  // Use a revalidation time of 20 seconds for archived games
  if (id) {
    return makeRequest<Game>(`/games?id=${id}`, { maxAge: 20 });
  } else {
    return makeRequest<Game[]>(`/games?userid=${userid}`, { maxAge: 20 });
  }
};
