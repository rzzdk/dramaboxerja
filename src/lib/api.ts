export const API_BASE_URL = "https://dramabox.sansekai.my.id/api";

export async function apiGet<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(path, API_BASE_URL);

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    });
    url.search = searchParams.toString();
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Gagal memuat data (${res.status})`);
  }

  return (await res.json()) as T;
}
