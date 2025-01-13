"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import type { Square } from "chess.js";
import { Chess } from "chess.js";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  FlipVertical,
  RedoDot,
  UndoDot,
} from "lucide-react";
import { Chessboard } from "react-chessboard";

import { CustomSquares, Game } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function GameHistoryDetails({ game }: { game: Game }) {
  const [boardWidth, setBoardWidth] = useState(480);
  const moveListRef = useRef<HTMLDivElement>(null);
  const [navFen, setNavFen] = useState<string | null>(null);
  const [navIndex, setNavIndex] = useState<number | null>(null);
  const [flipBoard, setFlipBoard] = useState(false);

  const actualGame = new Chess();
  actualGame.loadPgn(game.pgn as string);

  const [customSquares, updateCustomSquares] = useReducer(
    (squares: CustomSquares, action: Partial<CustomSquares>) => {
      return { ...squares, ...action };
    },
    {
      options: {},
      lastMove: {},
      rightClicked: {},
      check: {},
    }
  );

  function handleResize() {
    if (window.innerWidth >= 1920) {
      setBoardWidth(580);
    } else if (window.innerWidth >= 1536) {
      setBoardWidth(540);
    } else if (window.innerWidth >= 768) {
      setBoardWidth(480);
    } else {
      setBoardWidth(350);
    }
  }

  // auto scroll for moves
  useEffect(() => {
    const activeMoveEl = document.getElementById("activeNavMove");
    const moveList = moveListRef.current;
    if (!activeMoveEl || !moveList) return;
    moveList.scrollTop = activeMoveEl.offsetTop;
  });

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function onSquareRightClick(square: Square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    updateCustomSquares({
      rightClicked: {
        ...customSquares.rightClicked,
        [square]:
          customSquares.rightClicked[square] &&
          customSquares.rightClicked[square]?.backgroundColor === colour
            ? undefined
            : { backgroundColor: colour },
      },
    });
  }

  function getGameMoves() {
    const history = actualGame.history({ verbose: true });
    const movePairs = history
      .slice(history.length / 2)
      .map((_, i) => history.slice((i *= 2), i + 2));

    return movePairs.map((moves, i) => {
      return (
        <tr key={i + 1}>
          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
            {i + 1}
          </td>
          <td
            className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6"
            id={
              (history.indexOf(moves[0]) === history.length - 1 &&
                navIndex === null) ||
              navIndex === history.indexOf(moves[0])
                ? "activeNavMove"
                : ""
            }
          >
            <Button
              variant={"ghost"}
              onClick={() => navigateMove(history.indexOf(moves[0]))}
              className={cn(
                (history.indexOf(moves[0]) === history.length - 1 &&
                  navIndex === null) ||
                  navIndex === history.indexOf(moves[0])
                  ? "bg-zinc-200 text-zinc-800"
                  : ""
              )}
            >
              {moves[0].san}
            </Button>
          </td>
          {moves[1] && (
            <td
              className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6"
              id={
                (history.indexOf(moves[1]) === history.length - 1 &&
                  navIndex === null) ||
                navIndex === history.indexOf(moves[1])
                  ? "activeNavMove"
                  : ""
              }
            >
              <Button
                variant={"ghost"}
                onClick={() => navigateMove(history.indexOf(moves[1]))}
                className={cn(
                  (history.indexOf(moves[1]) === history.length - 1 &&
                    navIndex === null) ||
                    navIndex === history.indexOf(moves[1])
                    ? "bg-zinc-200 text-zinc-800"
                    : ""
                )}
              >
                {moves[1].san}
              </Button>
            </td>
          )}
        </tr>
      );
    });
  }

  function navigateMove(index: number | null | "prev") {
    const history = actualGame.history({ verbose: true });

    if (
      index === null ||
      (index !== "prev" && index >= history.length - 1) ||
      !history.length
    ) {
      // last move
      setNavIndex(null);
      setNavFen(null);
      return;
    }

    if (index === "prev") {
      index = history.length - 2;
    } else if (index < 0) {
      index = 0;
    }

    setNavIndex(index);
    setNavFen(history[index].after);
  }

  function getNavMoveSquares() {
    const history = actualGame.history({ verbose: true });

    if (!history.length) return;

    const index = navIndex ?? history.length - 1;

    return {
      [history[index].from]: { background: "rgba(255, 255, 0, 0.4)" },
      [history[index].to]: { background: "rgba(255, 255, 0, 0.4)" },
    };
  }

  return (
    <div className="flex w-full flex-wrap justify-center gap-6 px-4 py-4 lg:gap-10 2xl:gap-16">
      <div className="flex h-min flex-col">
        <div className="mb-5 flex w-full items-center pt-2">
          <Button
            variant={"outline"}
            className="hover:bg-blue-500 hover:text-white"
            onClick={() => setFlipBoard(!flipBoard)}
          >
            <FlipVertical /> Flip board
          </Button>
        </div>
        <Chessboard
          boardWidth={boardWidth}
          customDarkSquareStyle={{ backgroundColor: "#4b7399" }}
          customLightSquareStyle={{ backgroundColor: "#eae9d2" }}
          position={navFen || actualGame.fen()}
          boardOrientation={flipBoard ? "black" : "white"}
          isDraggablePiece={() => false}
          onSquareClick={() => updateCustomSquares({ rightClicked: {} })}
          onSquareRightClick={onSquareRightClick}
          customSquareStyles={{
            ...getNavMoveSquares(),
            ...customSquares.rightClicked,
          }}
        />
      </div>

      <div className="flex max-w-lg flex-1 flex-col items-center justify-center gap-4">
        <div className="mb-auto flex w-full p-2">
          <div className="flex flex-col">
            {/* controls */}
            <div className="mb-5 flex items-center justify-between rounded-lg bg-white p-2 shadow ring-1 ring-black ring-opacity-5">
              <Button
                variant={"outline"}
                size={"sm"}
                className="hover:bg-blue-500 hover:text-white"
                onClick={() => navigateMove(0)}
              >
                <ArrowLeftFromLine />
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                className="hover:bg-blue-500 hover:text-white"
                onClick={() =>
                  navigateMove(navIndex === null ? "prev" : navIndex - 1)
                }
              >
                <UndoDot />
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                className="hover:bg-blue-500 hover:text-white"
                onClick={() =>
                  navigateMove(navIndex === null ? null : navIndex + 1)
                }
              >
                <RedoDot />
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                className="hover:bg-blue-500 hover:text-white"
                onClick={() => navigateMove(null)}
              >
                <ArrowRightFromLine />
              </Button>
            </div>
            {/* custom table */}
            <div className="flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block w-full min-w-full max-w-3xl py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Move history
                          </th>
                        </tr>
                      </thead>
                      <tbody className="w-full divide-y divide-gray-200 bg-white">
                        {getGameMoves()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
