import { notFound } from "next/navigation";

import { fetchArchivedGame } from "@/lib/requests/game";
import type { Game } from "@/lib/types";
import ArchivedGame from "@/components/archive/ArchivedGame";

export async function generateMetadata({ params }: { params: { id: number } }) {
  const game = (await fetchArchivedGame({ id: params.id })) as Game | undefined;
  if (!game) {
    return {
      description: "Game not found",
      robots: {
        index: false,
        follow: false,
        nocache: true,
        noarchive: true,
      },
    };
  }
  return {
    description: `Archived game: ${game.white?.name} vs ${game.black?.name}`,
    openGraph: {
      title: "chessu",
      description: `Archived game: ${game.white?.name} vs ${game.black?.name}`,
      url: `https://ches.su/archive/${game.id}`,
      siteName: "chessu",
      locale: "en_US",
      type: "website",
    },
    robots: {
      index: false,
      follow: false,
      nocache: true,
      noarchive: true,
    },
  };
}

export default async function Archive({ params }: { params: { id: number } }) {
  const game = (await fetchArchivedGame({ id: params.id })) as Game | undefined;
  if (!game) {
    notFound();
  }

  return <ArchivedGame game={game} />;
}
