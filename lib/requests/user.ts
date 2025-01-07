import { API_URL } from "@/lib/config";
import type { Game, User } from "@/lib/types";

export const fetchUserProfile = async (userId: string | number) => {
  try {
    const res = await fetch(`${API_URL}/users/${userId}/profile`, {
      credentials: "include",
    });

    if (res && res.status === 200) {
      const data: User & { recentGames: Game[] } = await res.json();
      return data;
    }
  } catch (err) {
    // do nothing
  }
};
