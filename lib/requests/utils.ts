import { API_URL } from "@/lib/config";

interface RequestOptions extends RequestInit {
  maxAge?: number; // Cache duration in seconds
}

const defaultCacheOptions: RequestOptions = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  // Default to 5 minutes cache
  maxAge: 300,
};

const dynamicCacheOptions: RequestOptions = {
  ...defaultCacheOptions,
  // No caching for dynamic data
  cache: "no-store",
  maxAge: 0,
};

export const makeRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T | undefined> => {
  const isMutation = options.method && options.method !== "GET";
  const defaultOpts =
    isMutation || options.maxAge === 0
      ? dynamicCacheOptions
      : defaultCacheOptions;

  const fetchOptions: RequestOptions = {
    ...defaultOpts,
    ...options,
    headers: {
      ...defaultOpts.headers,
      ...options.headers,
    },
  };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, fetchOptions);
    const isJson = res.headers
      .get("content-type")
      ?.includes("application/json");

    // Handle specific status codes
    switch (res.status) {
      case 200:
      case 201:
        return isJson ? ((await res.json()) as T) : undefined;
      case 204:
        return true as T;
      case 401:
      case 404:
      case 409:
        return isJson ? ((await res.json()).message as T) : undefined;
      default:
        if (res.ok) {
          return isJson ? ((await res.json()) as T) : undefined;
        }
        throw new Error(`Unexpected status: ${res.status}`);
    }
  } catch (err) {
    console.error(`Request failed for ${endpoint}:`, err);
    return undefined;
  }
};
