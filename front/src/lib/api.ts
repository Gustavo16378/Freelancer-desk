const BASE = import.meta.env.VITE_API_URL as string;
const KEY  = import.meta.env.VITE_API_KEY as string;

export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': KEY,
      ...options?.headers,
    },
  });
}
