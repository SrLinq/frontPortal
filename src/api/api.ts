import instance from "./apiInstance";

export async function get<T>(url: string): Promise<T | null> {
  try {
    const response = await instance.get(url);

    return response.data;
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return null;
  }
}

export async function post<T>(url: string, body: unknown): Promise<T | null> {
  try {
    const response = await instance.post(url, body);

    return response.data;
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return null;
  }
}

export async function put<T>(url: string, body?: unknown): Promise<T | null> {
  try {
    // You only need to provide the endpoint, not the full URL
    const response = await instance.put(url, body);

    // Assuming the array is in response.data.rows
    return response.data;
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return null;
  }
}

export async function del<T>(url: string): Promise<T | null> {
  try {
    // You only need to provide the endpoint, not the full URL
    const response = await instance.delete(url);

    // Assuming the array is in response.data.rows
    return response.data;
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return null;
  }
}

export function ensureArray<T>(
  data: T[] | { rows?: T[] } | null | undefined,
): T[] {
  if (Array.isArray(data)) {
    return data;
  }
  if (data) {
    const rows = (data as { rows?: T[] }).rows;
    if (Array.isArray(rows)) {
      return rows;
    }
  }
  return [];
}
