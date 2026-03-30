/**
 * API utility layer.
 * Wraps Axios methods (GET, POST, PUT, PATCH, DELETE) with
 * consistent error handling and toast notifications.
 */
import toast from "react-hot-toast";
import instance from "./apiInstance";

/**
 * Perform a GET request and return typed data, or null on failure.
 * @param url - API endpoint path (e.g. "/jobs")
 */
export async function get<T>(url: string): Promise<T | null> {
  try {
    const response = await instance.get(url);
    return response.data;
  } catch (err: any) {
    const message = err?.response?.data?.message || "Failed to fetch data";
    console.error("GET error:", message);
    toast.error(Array.isArray(message) ? message[0] : message);
    return null;
  }
}

/**
 * Perform a POST request with a request body.
 * @param url - API endpoint path
 * @param body - Request payload
 */
export async function post<T>(url: string, body: unknown): Promise<T | null> {
  try {
    const response = await instance.post(url, body);
    return response.data;
  } catch (err: any) {
    const message = err?.response?.data?.message || "Request failed";
    console.error("POST error:", message);
    toast.error(Array.isArray(message) ? message[0] : message);
    return null;
  }
}

/**
 * Perform a PUT request (full resource replacement).
 * @param url - API endpoint path
 * @param body - Optional request payload
 */
export async function put<T>(url: string, body?: unknown): Promise<T | null> {
  try {
    const response = await instance.put(url, body);
    return response.data;
  } catch (err: any) {
    const message = err?.response?.data?.message || "Update failed";
    console.error("PUT error:", message);
    toast.error(Array.isArray(message) ? message[0] : message);
    return null;
  }
}

/**
 * Perform a PATCH request (partial resource update).
 * @param url - API endpoint path
 * @param body - Optional request payload
 */
export async function patch<T>(
  url: string,
  body?: unknown,
): Promise<T | null> {
  try {
    const response = await instance.patch(url, body);
    return response.data;
  } catch (err: any) {
    const message = err?.response?.data?.message || "Update failed";
    console.error("PATCH error:", message);
    toast.error(Array.isArray(message) ? message[0] : message);
    return null;
  }
}

/**
 * Perform a DELETE request.
 * @param url - API endpoint path
 */
export async function del<T>(url: string): Promise<T | null> {
  try {
    const response = await instance.delete(url);
    return response.data;
  } catch (err: any) {
    const message = err?.response?.data?.message || "Delete failed";
    console.error("DELETE error:", message);
    toast.error(Array.isArray(message) ? message[0] : message);
    return null;
  }
}

/**
 * Safely coerce an API response into an array.
 * Handles both direct arrays and `{ rows: T[] }` shaped responses.
 */
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
