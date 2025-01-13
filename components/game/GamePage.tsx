"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import Link from "next/link";
import { SessionContext } from "@/context/session";
import type { Move, Square } from "chess.js";
import { Chess } from "chess.js";
import { Loader2 } from "lucide-react";
import type { ClearPremoves } from "react-chessboard";
import { Chessboard } from "react-chessboard";
import { io } from "socket.io-client";

import { SOCKET_URL } from "@/lib/config";
import { ClaimAbandonedResponse, Game, Message } from "@/lib/types";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { lobbyReducer, squareReducer } from "./reducers";
import { initSocket } from "./socketEvents";
import { syncPgn, syncSide } from "./utils";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
});

export default function GamePage({ initialLobby }: { initialLobby: Game }) {
  const session = useContext(SessionContext);
  const [chatText, setChatText] = useState("");
  const [claimingAbandoned, setIsClaimingAbandoned] = useState(false);

  const [lobby, updateLobby] = useReducer(lobbyReducer, {
    ...initialLobby,
    actualGame: new Chess(),
    side: "s",
  });

  const [customSquares, updateCustomSquares] = useReducer(squareReducer, {
    options: {},
    lastMove: {},
    rightClicked: {},
    check: {},
  });

  const [moveFrom, setMoveFrom] = useState<string | Square | null>(null);
  const [boardWidth, setBoardWidth] = useState(480);
  const chessboardRef = useRef<ClearPremoves>(null);

  const [navFen, setNavFen] = useState<string | null>(null);
  const [navIndex, setNavIndex] = useState<number | null>(null);

  const [playBtnLoading, setPlayBtnLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const chatListRef = useRef<HTMLUListElement>(null);
  const moveListRef = useRef<HTMLDivElement>(null);

  const [abandonSeconds, setAbandonSeconds] = useState(60);
  useEffect(() => {
    if (
      lobby.side === "s" ||
      lobby.endReason ||
      lobby.winner ||
      !lobby.pgn ||
      !lobby.white ||
      !lobby.black ||
      (lobby.white.id !== session?.user?.id &&
        lobby.black.id !== session?.user?.id)
    )
      return;

    let interval: number;
    if (!lobby.white?.connected || !lobby.black?.connected) {
      setAbandonSeconds(60);
      interval = Number(
        setInterval(() => {
          if (
            abandonSeconds === 0 ||
            (lobby.white?.connected && lobby.black?.connected)
          ) {
            clearInterval(interval);
            return;
          }
          setAbandonSeconds((s) => s - 1);
        }, 1000)
      );
    }
    return () => clearInterval(interval);
    // eslint-disable-nextLine react-hooks/exhaustive-deps
  }, [
    lobby.black,
    lobby.white,
    lobby.black?.disconnectedOn,
    lobby.white?.disconnectedOn,
  ]);

  // socket events
  useEffect(() => {
    if (!session?.user || !session.user?.id) return;
    socket.connect();

    console.log("first try", socket.connected);
    socket.on("connect", function () {
      console.log("second try", socket.connected);
    });
    console.log("third try", socket.connected);

    socket.on("connect_error", (err) => {
      console.log(err);
      console.log(err.message);
    });

    socket.on("disconnect", (reason, details) => {
      console.log(reason);

      console.log(details);
    });

    window.addEventListener("resize", handleResize);
    handleResize();

    if (lobby.pgn && lobby.actualGame.pgn() !== lobby.pgn) {
      syncPgn(lobby.pgn, lobby, {
        updateCustomSquares,
        setNavFen,
        setNavIndex,
      });
    }

    syncSide(session.user, undefined, lobby, { updateLobby });

    initSocket(session.user, socket, lobby, {
      updateLobby,
      addMessage,
      updateCustomSquares,
      makeMove,
      setNavFen,
      setNavIndex,
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      socket.removeAllListeners();
      socket.disconnect();
    };
    // eslint-disable-nextLine react-hooks/exhaustive-deps
  }, []);

  // auto scroll down when new message is added
  useEffect(() => {
    const chatList = chatListRef.current;
    if (!chatList) return;
    chatList.scrollTop = chatList.scrollHeight;
  }, [chatMessages]);

  // auto scroll for moves
  useEffect(() => {
    const activeMoveEl = document.getElementById("activeNavMove");
    const moveList = moveListRef.current;
    if (!activeMoveEl || !moveList) return;
    moveList.scrollTop = activeMoveEl.offsetTop;
  });

  useEffect(() => {
    updateTurnTitle();
    // eslint-disable-nextLine react-hooks/exhaustive-deps
  }, [lobby]);

  function updateTurnTitle() {
    if (lobby.side === "s" || !lobby.white?.id || !lobby.black?.id) return;

    if (!lobby.endReason && lobby.side === lobby.actualGame.turn()) {
      document.title = "(your turn) chessu";
    } else {
      document.title = "chessu";
    }
  }

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

  function addMessage(message: Message) {
    setChatMessages((prev) => [...prev, message]);
  }

  function sendChat(message: string) {
    if (!session?.user) return;

    socket.emit("chat", message);
    addMessage({ author: session.user, message });
  }

  function chatKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      if (!input.value || input.value.length == 0) return;
      sendChat(input.value);
      input.value = "";
    }
  }

  function chatClickSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const input = target.elements.namedItem("chatInput") as HTMLInputElement;
    if (!input.value || input.value.length == 0) return;
    sendChat(input.value);
    input.value = "";
  }

  function updateChat() {
    if (chatText.length == 0) return;
    sendChat(chatText);
    setChatText("");
  }

  function makeMove(m: { from: string; to: string; promotion?: string }) {
    try {
      const result = lobby.actualGame.move(m);

      if (result) {
        setNavFen(null);
        setNavIndex(null);
        updateLobby({
          type: "updateLobby",
          payload: { pgn: lobby.actualGame.pgn() },
        });
        updateTurnTitle();
        let kingSquare = undefined;
        if (lobby.actualGame.inCheck()) {
          const kingPos = lobby.actualGame
            .board()
            .reduce((acc: any, row: any[], index: number) => {
              const squareIndex = row.findIndex(
                (square: { type: string; color: any }) =>
                  square &&
                  square.type === "k" &&
                  square.color === lobby.actualGame.turn()
              );
              return squareIndex >= 0
                ? `${String.fromCharCode(squareIndex + 97)}${8 - index}`
                : acc;
            }, "");
          kingSquare = {
            [kingPos]: {
              background:
                "radial-gradient(red, rgba(255,0,0,.4), transparent 70%)",
              borderRadius: "50%",
            },
          };
        }
        updateCustomSquares({
          lastMove: {
            [result.from]: { background: "rgba(255, 255, 0, 0.4)" },
            [result.to]: { background: "rgba(255, 255, 0, 0.4)" },
          },
          options: {},
          check: kingSquare,
        });
        return true;
      } else {
        throw new Error("Invalid move");
      }
    } catch (err) {
      updateCustomSquares({
        options: {},
      });
      return false;
    }
  }

  function isDraggablePiece({ piece }: { piece: string }) {
    return piece.startsWith(lobby.side) && !lobby.endReason && !lobby.winner;
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    if (lobby.side === "s" || navFen || lobby.endReason || lobby.winner)
      return false;

    // premove
    if (lobby.side !== lobby.actualGame.turn()) return true;

    const moveDetails = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    };

    const move = makeMove(moveDetails);
    if (!move) return false; // illegal move
    socket.emit("sendMove", moveDetails);
    return true;
  }

  function getMoveOptions(square: Square) {
    const moves = lobby.actualGame.moves({
      square,
      verbose: true,
    }) as Move[];
    if (moves.length === 0) {
      return;
    }

    const newSquares: {
      [square: string]: { background: string; borderRadius?: string };
    } = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          lobby.actualGame.get(move.to as Square) &&
          lobby.actualGame.get(move.to as Square)?.color !==
            lobby.actualGame.get(square)?.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    updateCustomSquares({ options: newSquares });
  }

  function onPieceDragBegin(_piece: string, sourceSquare: Square) {
    if (
      lobby.side !== lobby.actualGame.turn() ||
      navFen ||
      lobby.endReason ||
      lobby.winner
    )
      return;

    getMoveOptions(sourceSquare);
  }

  function onPieceDragEnd() {
    updateCustomSquares({ options: {} });
  }

  function onSquareClick(square: Square) {
    updateCustomSquares({ rightClicked: {} });
    if (
      lobby.side !== lobby.actualGame.turn() ||
      navFen ||
      lobby.endReason ||
      lobby.winner
    )
      return;

    function resetFirstMove(square: Square) {
      setMoveFrom(square);
      getMoveOptions(square);
    }

    // from square
    if (moveFrom === null) {
      resetFirstMove(square);
      return;
    }

    const moveDetails = {
      from: moveFrom,
      to: square,
      promotion: "q",
    };

    const move = makeMove(moveDetails);
    if (!move) {
      resetFirstMove(square);
    } else {
      setMoveFrom(null);
      socket.emit("sendMove", moveDetails);
    }
  }

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

  function clickPlay(e: FormEvent<HTMLButtonElement>) {
    setPlayBtnLoading(true);
    e.preventDefault();
    socket.emit("joinAsPlayer");
  }

  function getNavMoveSquares() {
    if (navIndex === null) return;
    const history = lobby.actualGame.history({ verbose: true });

    if (!history.length) return;

    return {
      [history[navIndex].from]: { background: "rgba(255, 255, 0, 0.4)" },
      [history[navIndex].to]: { background: "rgba(255, 255, 0, 0.4)" },
    };
  }

  function claimAbandoned(type: "win" | "draw") {
    if (
      lobby.side === "s" ||
      lobby.endReason ||
      lobby.winner ||
      !lobby.pgn ||
      abandonSeconds > 0 ||
      (lobby.black?.connected && lobby.white?.connected)
    ) {
      return;
    }
    // socket.emit("claimAbandoned", type);
    return new Promise<ClaimAbandonedResponse>((resolve, reject) => {
      socket.emit(
        "claimAbandoned",
        type,
        (response: ClaimAbandonedResponse) => {
          if (response.success) {
            console.log("Claming response");
            resolve(response);
          } else {
            reject(new Error(response.error || "Failed to claim game"));
            console.log("Claming error");
          }
        }
      );
    });
  }

  const handleClaimAbandoned = async (type: "win" | "draw") => {
    try {
      setIsClaimingAbandoned(true);
      const response: ClaimAbandonedResponse = (await claimAbandoned(
        type
      )) as ClaimAbandonedResponse;

      if (response.success) {
        // Claim was successful
        console.log("Successfully claimed game:", response);
      } else {
        setIsClaimingAbandoned(false);
        // Claim was not successful
        throw new Error(response.error || "Failed to claim game");
      }
    } catch (error) {
      setIsClaimingAbandoned(false);
      console.error("Failed to claim abandoned game:", error);
    } finally {
      setIsClaimingAbandoned(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-3 py-10 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex">
          {typeof lobby.black?.id === "number" ? (
            <Link href={`/play/user/${lobby.black?.id}`}>
              <div className="relative mb-3 mr-2">
                <span
                  className={`${lobby.black.connected ? "bg-green-50 text-green-800 ring-green-600/20" : "bg-red-50 text-red-800 ring-red-600/20"} inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset`}
                >
                  {lobby.black.name} - (Black)
                </span>
              </div>
            </Link>
          ) : (
            <div className="relative mb-3 mr-2">
              <span
                className={`${lobby.black && lobby.black.connected ? "bg-green-50 text-green-800 ring-green-600/20" : "bg-red-50 text-red-800 ring-red-600/20"} inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset`}
              >
                {lobby.black && lobby.black.name ? lobby.black.name : "No one"}{" "}
                - (Black)
              </span>
            </div>
          )}
          <span className="text-sm font-medium">vs</span>

          {typeof lobby.white?.id === "number" ? (
            <Link href={`/play/user/${lobby.white?.id}`}>
              <div className="relative mb-3 ml-2">
                <span
                  className={`${lobby.white.connected ? "bg-green-50 text-green-800 ring-green-600/20" : "bg-red-50 text-red-800 ring-red-600/20"} inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset`}
                >
                  {lobby.white.name} - (White)
                </span>
              </div>
            </Link>
          ) : (
            <div className="relative mb-3 ml-2">
              <span
                className={`${lobby.white && lobby.white.connected ? "bg-green-50 text-green-800 ring-green-600/20" : "bg-red-50 text-red-800 ring-red-600/20"} inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset`}
              >
                {lobby.white && lobby.white.name ? lobby.white.name : "No one"}{" "}
                - (White)
              </span>
            </div>
          )}
        </div>

        {session?.user?.id !== lobby.white?.id &&
          session?.user?.id !== lobby.black?.id && (
            <div className="relative">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-yellow-500 opacity-75"></span>

              <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                Waiting for opponent to join...
              </span>
            </div>
          )}

        {/* show whose turn it is to play */}
        <div className="flex items-center gap-2">
          {lobby.actualGame.turn() === "w" ? (
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-800 ring-1 ring-inset ring-gray-600/20">
              White's turn to play
            </span>
          ) : (
            <span className="inline-flex items-center rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-gray-50 ring-1 ring-inset ring-gray-600/20">
              Black's turn to play
            </span>
          )}
        </div>

        {session?.user?.id !== lobby.white?.id &&
          session?.user?.id !== lobby.black?.id && (
            <Button
              variant={"brand"}
              className="rounded-full"
              onClick={clickPlay}
            >
              Play as {lobby.white?.id ? "black" : "white"}
            </Button>
          )}
      </div>

      <div className="flex w-full flex-wrap justify-between gap-6 py-4">
        <div className="relative flex h-min flex-col">
          {/* overlay */}
          {(!lobby.white?.id || !lobby.black?.id) && (
            <div className="absolute bottom-0 right-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-70">
              <div className="flex w-full items-center justify-center gap-4 bg-base-200 px-2"></div>
            </div>
          )}

          <Chessboard
            boardWidth={boardWidth}
            customDarkSquareStyle={{ backgroundColor: "#4b7399" }}
            customLightSquareStyle={{ backgroundColor: "#eae9d2" }}
            position={navFen || lobby.actualGame.fen()}
            boardOrientation={lobby.side === "b" ? "black" : "white"}
            isDraggablePiece={isDraggablePiece}
            onPieceDragBegin={onPieceDragBegin}
            onPieceDragEnd={onPieceDragEnd}
            onPieceDrop={onDrop}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
            arePremovesAllowed={!navFen}
            customSquareStyles={{
              ...(navIndex === null
                ? customSquares.lastMove
                : getNavMoveSquares()),
              ...(navIndex === null ? customSquares.check : {}),
              ...customSquares.rightClicked,
              ...(navIndex === null ? customSquares.options : {}),
            }}
            ref={chessboardRef}
          />

          {(lobby.endReason ||
            (lobby.pgn &&
              lobby.white &&
              session?.user?.id === lobby.white?.id &&
              lobby.black &&
              !lobby.black?.connected) ||
            (lobby.pgn &&
              lobby.black &&
              session?.user?.id === lobby.black?.id &&
              lobby.white &&
              !lobby.white?.connected)) && (
            <div className="absolute flex h-full w-full items-center justify-center rounded-t-lg bg-zinc-800 bg-opacity-95 p-2 text-center font-medium text-zinc-50">
              {lobby.endReason ? (
                <div>
                  {lobby.endReason === "abandoned"
                    ? lobby.winner === "draw"
                      ? `The game ended in a draw due to abandonment.`
                      : `The game was won by ${lobby.winner} due to abandonment.`
                    : lobby.winner === "draw"
                      ? "The game ended in a draw."
                      : `The game was won by checkmate (${lobby.winner}).`}{" "}
                  <br />
                  You can review the archived game at{" "}
                  <Link className="link" href={`/play/history/${lobby.id}`}>
                    here
                  </Link>
                  .
                </div>
              ) : abandonSeconds > 0 ? (
                `Your opponent has disconnected. You can claim the win or draw in ${abandonSeconds} second${
                  abandonSeconds > 1 ? "s" : ""
                }.`
              ) : (
                <div className="flex flex-col flex-wrap items-center justify-center gap-2">
                  <span>Your opponent has disconnected.</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant={"brand"}
                      // onClick={() => claimAbandoned("win")}
                      onClick={() => handleClaimAbandoned("win")}
                      disabled={claimingAbandoned}
                      size={"sm"}
                      className="rounded-full"
                    >
                      {claimingAbandoned && (
                        <Loader2 className="w-5 animate-spin" />
                      )}
                      Claim win
                    </Button>
                    <Button
                      // onClick={() => claimAbandoned("draw")}
                      onClick={() => handleClaimAbandoned("draw")}
                      disabled={claimingAbandoned}
                      variant={"outline"}
                      size={"sm"}
                      className="rounded-full text-zinc-800"
                    >
                      {claimingAbandoned && (
                        <Loader2 className="w-5 animate-spin" />
                      )}
                      Draw
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* chat field */}
        <div className="flex max-w-lg flex-1 flex-col items-center justify-center gap-4"></div>
        {/* other chat field */}
        <div className="sm:mx-aut relative bg-white px-6 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-lg">
          <div className="mx-auto w-full max-w-2xl">
            <div className="divide relative flex flex-col justify-between">
              <div className="space-y-6 py-8 text-base leading-7 text-gray-600">
                <ul
                  className="mb-4 flex h-[30rem] max-h-[40rem] flex-col gap-1 overflow-y-scroll break-words"
                  ref={chatListRef}
                >
                  {chatMessages.map((m, i) => (
                    <li
                      className={
                        "max-w-[50rem] " +
                        (!m.author.id && m.author.name === "server"
                          ? " rounded-full bg-blue-500 p-2 pl-3 text-base-300"
                          : "")
                      }
                      key={i}
                    >
                      <span>
                        {m.author.id && (
                          <span>
                            <a
                              className={
                                "font-bold" +
                                (typeof m.author.id === "number"
                                  ? " link-hover text-sm text-blue-400"
                                  : " cursor-default")
                              }
                              href={
                                typeof m.author.id === "number"
                                  ? `/play/user/${m.author.id}`
                                  : undefined
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {m.author.name}
                            </a>
                            :{" "}
                          </span>
                        )}
                        <span className="text-sm">{m.message}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <form
                onSubmit={chatClickSend}
                className="bottom-0 flex w-full items-center justify-between pt-8 text-base font-semibold leading-7"
              >
                <div className="w-full">
                  <Input
                    name="chatInput"
                    id="chatInput"
                    type="text"
                    placeholder="Chat"
                    className="w-full rounded-full placeholder:text-zinc-400"
                    onKeyUp={chatKeyUp}
                  />
                </div>
                <Button
                  type="submit"
                  variant={"brand"}
                  className="ml-2 rounded-full"
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
