import { API_URL } from "@/lib/config";
import { makeRequest } from "@/lib/requests/utils";
import type { User } from "@/lib/types";

export const fetchSession = async () => {
  return makeRequest<User>("/auth/session");
};

export const setGuestSession = async (name: string) => {
  return makeRequest<User>("/auth/guest", {
    method: "POST",
    body: JSON.stringify({ name }),
    maxAge: 0,
  });
};

export const register = async (
  name: string,
  password: string,
  email?: string
) => {
  return makeRequest<User | string>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, password, email }),
  });
};

export const login = async (name: string, password: string) => {
  return makeRequest<User | string>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ name, password }),
  });
};

export const logout = async () => {
  return makeRequest("/auth/logout", {
    method: "POST",
  });
};

export const updateUser = async (
  name?: string,
  email?: string,
  password?: string
) => {
  if (!name && !email && !password) return;
  return makeRequest<User | string>("/auth", {
    method: "PATCH",
    body: JSON.stringify({ name, email, password }),
  });
};
