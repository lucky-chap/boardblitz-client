import { API_URL } from "@/lib/config";
import type { User } from "@/lib/types";

export const fetchSession = async () => {
  try {
    const res = await fetch(`${API_URL}/auth/session`, {
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

export const setGuestSession = async (name: string) => {
  try {
    const res = await fetch(`${API_URL}/auth/guest`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (res.status === 201) {
      const user: User = await res.json();
      return user;
    }
  } catch (err) {
    console.error(err);
  }
};

export const register = async (
  name: string,
  password: string,
  email?: string
) => {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password, email }),
    });
    if (res.status === 201) {
      const user: User = await res.json();
      return user;
    } else if (res.status === 409) {
      const { message } = await res.json();
      return message as string;
    }
  } catch (err) {
    console.error(err);
  }
};

export const login = async (name: string, password: string) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    });
    if (res.status === 200) {
      const user: User = await res.json();
      return user;
    } else if (res.status === 404 || res.status === 401) {
      const { message } = await res.json();
      return message as string;
    }
  } catch (err) {
    console.error(err);
  }
};

export const logout = async () => {
  try {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (res.status === 204) {
      return true;
    }
  } catch (err) {
    console.error(err);
  }
};

export const updateUser = async (
  name?: string,
  email?: string,
  password?: string
) => {
  try {
    if (!name && !email && !password) return;
    const res = await fetch(`${API_URL}/auth`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.status === 200) {
      const user: User = await res.json();
      return user;
    } else if (res.status === 409) {
      const { message } = await res.json();
      return message as string;
    }
  } catch (err) {
    console.error(err);
  }
};
