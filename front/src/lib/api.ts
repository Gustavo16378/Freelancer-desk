const BASE = import.meta.env.VITE_API_URL as string;
const KEY  = import.meta.env.VITE_API_KEY as string;

export async function apiFetch<T = void>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': KEY,
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
