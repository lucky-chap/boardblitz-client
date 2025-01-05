import { API_URL } from "@/lib/config";
import type { User } from "@/lib/types";

export const fetchUserProfile = async (userId: string | number) => {
  try {
    const res = await fetch(`${API_URL}/users/${userId}/profile`, {
      credentials: "include",
    });

    if (res && res.status === 200) {
      const user: User = await res.json();
      return user;
    }
  } catch (err) {
    // do nothing
  }
};
