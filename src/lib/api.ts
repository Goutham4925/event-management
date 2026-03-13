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
    // ignore non-json
  }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || "API error");
  }

  return data;
}

/* ===============================
   FETCH WITH TIMEOUT
================================ */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 10000
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const res = await fetch(url, {
    ...options,
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  clearTimeout(id);
  return res;
}

/* ===============================
   GET (PUBLIC)
================================ */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetchWithTimeout(`${API_URL}${path}`, {
    cache: "force-cache",
  });

  return handleResponse<T>(res);
}

/* ===============================
   GET (PUBLIC – NO AUTH)
================================ */
export async function apiGetPublic<T>(path: string): Promise<T> {
  const res = await fetchWithTimeout(`${API_URL}${path}`, {
    cache: "force-cache",
  });

  return handleResponse<T>(res);
}

/* ===============================
   GET (ADMIN)
================================ */
export async function apiGetAuth<T>(
  path: string,
  token: string
): Promise<T> {
  const res = await fetchWithTimeout(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<T>(res);
}

/* ===============================
   POST (PUBLIC)
================================ */
export async function apiPostPublic<T>(
  path: string,
  body: any
): Promise<T> {
  const res = await fetchWithTimeout(`${API_URL}${path}`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res);
}

/* ===============================
   POST (ADMIN)
================================ */
export async function apiPost<T>(
  path: string,
  body: any,
  token: string
): Promise<T> {
  const res = await fetchWithTimeout(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res);
}

/* ===============================
   PUT
================================ */
export async function apiPut<T>(
  path: string,
  body: any,
  token: string
): Promise<T> {
  const res = await fetchWithTimeout(`${API_URL}${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res);
}

/* ===============================
   DELETE
================================ */
export async function apiDelete(
  path: string,
  token: string
): Promise<void> {
  const res = await fetchWithTimeout(`${API_URL}${path}`, {
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
   FILE UPLOAD
================================ */
export async function apiUpload<T>(
  path: string,
  formData: FormData,
  token: string
): Promise<T> {
  const res = await fetchWithTimeout(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse<T>(res);
}