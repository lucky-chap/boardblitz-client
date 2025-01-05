import type { User } from "@/lib/types";

import { makeRequest } from "./utils";

export const fetchUserProfile = async (email: string) => {
  return makeRequest<User>(`/users/profile/${email}`);
};
