export interface User {
  id?: number | string; // ID for guest players
  name?: string | null;
  email?: string;
  password?: string | null;
  profile_picture?: string;
  banner_picture?: string;
  wins?: number;
  losses?: number;
  draws?: number;

  // player fields (not spectators)
  connected?: boolean;
  disconnectedOn?: number;
}

export interface Game {
  id?: number;
  pgn?: string;
  white?: User;
  black?: User;
  winner?: "white" | "black" | "draw";
  endReason?:
    | "draw"
    | "checkmate"
    | "stalemate"
    | "repetition"
    | "insufficient"
    | "abandoned";
  host?: User;
  code?: string;
  unlisted?: boolean;
  timeout?: number;
  observers?: User[];
  startedAt?: number;
  endedAt?: number;
}

export interface Lobby extends Game {
  actualGame: Chess;
  side: "b" | "w" | "s";
}

export interface CustomSquares {
  options: { [square: string]: { background: string; borderRadius?: string } };
  lastMove: { [square: string]: { background: string } };
  rightClicked: { [square: string]: { backgroundColor: string } | undefined };
  check: { [square: string]: { background: string; borderRadius?: string } };
}

export type Action =
  | {
      type: "updateLobby";
      payload: Partial<Lobby>;
    }
  | {
      type: "setSide";
      payload: Lobby["side"];
    }
  | {
      type: "setGame";
      payload: Chess;
    };

export interface Message {
  author: User;
  message: string;
}
