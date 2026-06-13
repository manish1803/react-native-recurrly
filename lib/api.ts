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

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
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
