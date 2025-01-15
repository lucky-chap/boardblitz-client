import { API_URL } from "@/lib/config";
import type { User } from "@/lib/types";

export const fetchSession = async () => {
  try {
    const res = await fetch(`${API_URL}/auth/session`, {
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (res && res.status === 200) {
      const result: User = await res.json();
      console.log("Session found!");
      const data: { user: User; isAuthenticated: boolean } = {
        user: result,
        isAuthenticated: true,
      };
      return data;
    } else {
      const data = await res.json();
      console.log("Session not found! ", data);
      return {
        user: undefined,
        isAuthenticated: false,
      };
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
  email: string,
  password: string
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
    console.log("register res: ", res);
    if (res.status === 201) {
      const user: User = await res.json();
      return user;
    } else if (res.status === 409) {
      const { message } = await res.json();
      return message as string;
    }
  } catch (err) {
    console.error("catch error:", err);
  }
};

export const login = async (email: string, password: string) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    // make sure to display errors to user
    console.log("login res: ", res);
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
  oldEmail?: string,
  password?: string,
  profile_picture?: string,
  banner_picture?: string
) => {
  try {
    console.log("updating user profile: ", profile_picture);
    if (!name && !email && !password) return;
    const res = await fetch(`${API_URL}/auth`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        oldEmail,
        password,
        profile_picture,
        banner_picture,
      }),
    });
    console.log("Reason no update: ", res);
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
