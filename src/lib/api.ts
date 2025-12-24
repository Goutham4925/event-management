const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

/* ===============================
   GET (PUBLIC)
================================ */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);

  if (!res.ok) {
    throw new Error("API error");
  }

  return res.json();
}

/* ===============================
   POST (ADMIN)
================================ */
export async function apiPost<T>(
  path: string,
  body: any,
  token?: string
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("API error");
  }

  return res.json();
}

/* ===============================
   PUT (ADMIN)
================================ */
export async function apiPut<T>(
  path: string,
  body: any,
  token?: string
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("API error");
  }

  return res.json();
}

/* ===============================
   DELETE (ADMIN)
================================ */
export async function apiDelete(
  path: string,
  token?: string
): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error("API error");
  }
}
