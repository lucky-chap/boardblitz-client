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
  white_name?: string;
  white_id?: number;
  black?: User;
  black_name?: string;
  black_id?: number;
  winner?: "white" | "black" | "draw";
  endReason?:
    | "draw"
    | "checkmate"
    | "stalemate"
    | "repetition"
    | "insufficient"
    | "abandoned";
  end_reason?:
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
  started_at?: string;
  ended_at?: string;
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

export type ClaimAbandonedResponse = {
  success: boolean;
  gameOver?: {
    reason: string;
    winnerName: string;
    winnerSide?: string;
    id: number;
  };
  error?: string;
};
