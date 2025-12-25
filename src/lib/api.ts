const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

/* ===============================
   INTERNAL RESPONSE HANDLER
================================ */
async function handleResponse<T>(res: Response): Promise<T> {
  let data: any = null;

  try {
    data = await res.json();
  } catch {
    // ignore non-json responses
  }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || "API error");
  }

  return data;
}

/* ===============================
   GET (PUBLIC – NO AUTH)
================================ */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  return handleResponse<T>(res);
}

/* ===============================
   GET (ADMIN – AUTH REQUIRED)
================================ */
export async function apiGetAuth<T>(
  path: string,
  token: string
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<T>(res);
}

/* ===============================
   POST (ADMIN – JSON)
================================ */
export async function apiPost<T>(
  path: string,
  body: any,
  token: string
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res);
}

/* ===============================
   PUT (ADMIN – JSON)
================================ */
export async function apiPut<T>(
  path: string,
  body: any,
  token: string
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res);
}

/* ===============================
   DELETE (ADMIN)
================================ */
export async function apiDelete(
  path: string,
  token: string
): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("API error");
  }
}

/* ===============================
   FILE UPLOAD (ADMIN – FormData)
   ✔ Hero images
   ✔ Event cover
   ✔ Gallery images
================================ */
export async function apiUpload<T>(
  path: string,
  formData: FormData,
  token: string
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ DO NOT set Content-Type manually
    },
    body: formData,
  });

  return handleResponse<T>(res);
}
