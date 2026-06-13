const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

async function request<T>(
  endpoint: string,
  method: string,
  body?: any,
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    if (!text.trim()) {
      return undefined as unknown as T;
    }

    return JSON.parse(text) as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  }
}

export const api = {
  get<T>(endpoint: string, token?: string | null) {
    return request<T>(endpoint, "GET", undefined, token);
  },
  post<T>(endpoint: string, body: any, token?: string | null) {
    return request<T>(endpoint, "POST", body, token);
  },
  patch<T>(endpoint: string, body: any, token?: string | null) {
    return request<T>(endpoint, "PATCH", body, token);
  },
  delete<T>(endpoint: string, token?: string | null) {
    return request<T>(endpoint, "DELETE", undefined, token);
  },
};
