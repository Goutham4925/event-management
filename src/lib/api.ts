const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const PUBLIC_CACHE_TTL_MS = 60 * 1000;
const publicResponseCache = new Map<string, { expiresAt: number; data: unknown }>();
const publicInFlightRequests = new Map<string, Promise<unknown>>();

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

function getCacheKey(path: string) {
  return `${API_URL}${path}`;
}

async function cachedPublicGet<T>(path: string): Promise<T> {
  const cacheKey = getCacheKey(path);
  const now = Date.now();
  const cached = publicResponseCache.get(cacheKey);

  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  const inFlight = publicInFlightRequests.get(cacheKey);
  if (inFlight) {
    return inFlight as Promise<T>;
  }

  const request = fetch(cacheKey)
    .then(handleResponse<T>)
    .then((data) => {
      publicResponseCache.set(cacheKey, {
        expiresAt: now + PUBLIC_CACHE_TTL_MS,
        data,
      });

      return data;
    })
    .finally(() => {
      publicInFlightRequests.delete(cacheKey);
    });

  publicInFlightRequests.set(cacheKey, request);
  return request;
}

export function invalidateApiCache(path?: string) {
  if (!path) {
    publicResponseCache.clear();
    publicInFlightRequests.clear();
    return;
  }

  const cacheKey = getCacheKey(path);
  publicResponseCache.delete(cacheKey);
  publicInFlightRequests.delete(cacheKey);
}

/* ===============================
   GET (PUBLIC – NO AUTH)
================================ */
export async function apiGet<T>(path: string): Promise<T> {
  return cachedPublicGet<T>(path);
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
   POST (PUBLIC – JSON)
   ✔ Contact form
   ✔ Newsletter
================================ */
export async function apiPostPublic<T>(
  path: string,
  body: any
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await handleResponse<T>(res);
  invalidateApiCache();
  return data;
}



/* ===============================
   GET (PUBLIC – NO AUTH)
   ✔ Pages
   ✔ Public content
================================ */
export async function apiGetPublic<T>(path: string): Promise<T> {
  return cachedPublicGet<T>(path);
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

  const data = await handleResponse<T>(res);
  invalidateApiCache();
  return data;
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

  const data = await handleResponse<T>(res);
  invalidateApiCache();
  return data;
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

  invalidateApiCache();
}

/* ===============================
   FILE UPLOAD (ADMIN – FormData)
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

  const data = await handleResponse<T>(res);
  invalidateApiCache();
  return data;
}
