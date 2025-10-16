// API helper using fetch
const Api = (() => {
  const BASE = 'http://localhost:8000/api';

  function getAuthToken() {
    try { return localStorage.getItem('unipeer:token') || ''; } catch { return ''; }
  }

  async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    const token = getAuthToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const res = await fetch(`${BASE}${path}`, { ...options, headers, credentials: 'include' });
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body = isJson ? await res.json().catch(() => ({})) : await res.text();

    if (!res.ok) {
      const error = new Error(body?.detail || 'Request failed');
      error.status = res.status;
      error.data = body;
      throw error;
    }
    return body;
  }

  return {
    get: (path) => request(path, { method: 'GET' }),
    post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) }),
    patch: (path, data) => request(path, { method: 'PATCH', body: JSON.stringify(data) }),
  };
})();
