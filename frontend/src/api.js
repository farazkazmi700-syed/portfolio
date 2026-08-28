/** Tiny API client for the sync/CMS backend with JWT handling. */

const API_ORIGIN = (import.meta.env?.VITE_API_URL || "").replace(/\/$/, "");
export const API_BASE = `${API_ORIGIN}/api`;

const TOKEN_KEY = "faraz_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return json;
}

export const api = {
  login: async (username, password) => {
    const r = await request("/auth/login", { method: "POST", body: { username, password } });
    setToken(r.token);
    return r;
  },
  logout: () => setToken(""),
  articles: () => request("/articles"),
  article: (slug) => request(`/articles/${slug}`),
  portfolio: () => request("/portfolio"),
};

/** JWT-authenticated CMS endpoints (admin view only). */
export const adminApi = {
  get: (path) => request(`/admin${path}`, { auth: true }),
  create: (path, body) => request(`/admin${path}`, { method: "POST", body, auth: true }),
  update: (path, body) => request(`/admin${path}`, { method: "PUT", body, auth: true }),
  remove: (path) => request(`/admin${path}`, { method: "DELETE", auth: true }),
};

