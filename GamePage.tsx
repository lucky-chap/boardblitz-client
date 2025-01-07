import type {
  FormEvent,
  JSXElementConstructor,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { SessionContext } from "@/context/session";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCopy,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
} from "@tabler/icons-react";
import type { Move, Square } from "chess.js";
import { Chess } from "chess.js";
import type { ClearPremoves } from "react-chessboard";
import { Chessboard } from "react-chessboard";
import { io } from "socket.io-client";

import { API_URL } from "@/lib/config";
import { Game, Message } from "@/lib/types";

import { lobbyReducer, squareReducer } from "./reducers";
import { initSocket } from "./socketEvents";
import { syncPgn, syncSide } from "./utils";

export default function GamePage({ initialLobby }: { initialLobby: Game }) {
  const session = useContext(SessionContext);
  const [socket, setSocket] = useState(() =>
    io(API_URL, {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket"],
    })
  );

  const [lobby, updateLobby] = useReducer(lobbyReducer, {
    ...initialLobby,
    actualGame: new Chess(),
    side: "s",
  });

  // Rest of your component state...

  useEffect(() => {
    if (!session?.user || !session.user?.id) return;

    // Connect socket
    socket.connect();

    // Setup listeners
    const onConnect = () => {
      console.log("Socket connected:", socket.connected);

      // Initialize game state after connection
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
    };

    const onDisconnect = () => {
      console.log("Socket disconnected:", socket.connected);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Handle window resize
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [session?.user]);

  // Rest of your component code...
}
