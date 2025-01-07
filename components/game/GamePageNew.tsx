// import type {
//   FormEvent,
//   JSXElementConstructor,
//   KeyboardEvent,
//   ReactElement,
//   ReactNode,
//   ReactPortal,
// } from "react";
// import { useContext, useEffect, useReducer, useRef, useState } from "react";
// import { SessionContext } from "@/context/session";
// import {
//   IconChevronLeft,
//   IconChevronRight,
//   IconCopy,
//   IconPlayerSkipBack,
//   IconPlayerSkipForward,
// } from "@tabler/icons-react";
// import type { Move, Square } from "chess.js";
// import { Chess } from "chess.js";
// import type { ClearPremoves } from "react-chessboard";
// import { Chessboard } from "react-chessboard";
// import { io } from "socket.io-client";

// import { API_URL } from "@/lib/config";
// import { Game, Message } from "@/lib/types";

// import { lobbyReducer, squareReducer } from "./reducers";
// import { initSocket } from "./socketEvents";
// import { syncPgn, syncSide } from "./utils";

// // Initialize socket outside component to prevent recreation
// const socketIO = io(API_URL, {
//   withCredentials: true,
//   autoConnect: false,
//   transports: ["websocket"],
// });

// export default function GamePage({ initialLobby }: { initialLobby: Game }) {
//   const session = useContext(SessionContext);
//   const socketRef = useRef(socketIO);

//   const [lobby, updateLobby] = useReducer(lobbyReducer, {
//     ...initialLobby,
//     actualGame: new Chess(),
//     side: "s",
//   });

//   const [customSquares, updateCustomSquares] = useReducer(squareReducer, {
//     options: {},
//     lastMove: {},
//     rightClicked: {},
//     check: {},
//   });

//   // Rest of your state declarations...

//   // Socket connection management
//   useEffect(() => {
//     if (!session?.user || !session.user?.id) return;

//     const socket = socketRef.current;

//     // Setup listeners before connecting
//     const onConnect = () => {
//       console.log("Socket connected:", socket.connected);

//       if (lobby.pgn && lobby.actualGame.pgn() !== lobby.pgn) {
//         syncPgn(lobby.pgn, lobby, {
//           updateCustomSquares,
//           setNavFen,
//           setNavIndex,
//         });
//       }

//       syncSide(session.user, undefined, lobby, { updateLobby });

//       initSocket(session.user, socket, lobby, {
//         updateLobby,
//         addMessage,
//         updateCustomSquares,
//         makeMove,
//         setNavFen,
//         setNavIndex,
//       });
//     };

//     const onDisconnect = () => {
//       console.log("Socket disconnected");
//     };

//     // Clean up any existing listeners
//     socket.removeAllListeners();

//     // Set up new listeners
//     socket.on("connect", onConnect);
//     socket.on("disconnect", onDisconnect);

//     // Connect if not already connected
//     if (!socket.connected) {
//       socket.connect();
//     }

//     return () => {
//       socket.off("connect", onConnect);
//       socket.off("disconnect", onDisconnect);
//       socket.removeAllListeners();
//       if (socket.connected) {
//         socket.disconnect();
//       }
//     };
//   }, [session?.user, lobby]);

//   // Your existing functions but updated to use socketRef
//   function sendChat(message: string) {
//     if (!session?.user) return;
//     socketRef.current.emit("chat", message);
//     addMessage({ author: session.user, message });
//   }

//   function onDrop(sourceSquare: Square, targetSquare: Square) {
//     if (lobby.side === "s" || navFen || lobby.endReason || lobby.winner)
//       return false;

//     // premove
//     if (lobby.side !== lobby.actualGame.turn()) return true;

//     const moveDetails = {
//       from: sourceSquare,
//       to: targetSquare,
//       promotion: "q",
//     };

//     const move = makeMove(moveDetails);
//     if (!move) return false; // illegal move
//     socketRef.current.emit("sendMove", moveDetails);
//     return true;
//   }

//   function onSquareClick(square: Square) {
//     // ... rest of function implementation
//     if (move) {
//       setMoveFrom(null);
//       socketRef.current.emit("sendMove", moveDetails);
//     }
//   }

//   function clickPlay(e: FormEvent<HTMLButtonElement>) {
//     setPlayBtnLoading(true);
//     e.preventDefault();
//     socketRef.current.emit("joinAsPlayer");
//   }

//   function claimAbandoned(type: "win" | "draw") {
//     if (
//       lobby.side === "s" ||
//       lobby.endReason ||
//       lobby.winner ||
//       !lobby.pgn ||
//       abandonSeconds > 0 ||
//       (lobby.black?.connected && lobby.white?.connected)
//     ) {
//       return;
//     }
//     socketRef.current.emit("claimAbandoned", type);
//   }

//   // Rest of your component implementation...

//   return (
//     // Your existing JSX
//   );
// }
