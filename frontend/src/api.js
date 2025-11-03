export function getToken() {
  return localStorage.getItem('token') || '';
}

export async function api(path, { method='GET', body, headers={} } = {}) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: 'Bearer ' + getToken() } : {}),
      ...headers
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  };
  const res = await fetch(path, opts);
  if (!res.ok) {
    let msg = res.statusText;
    try { const j = await res.json(); msg = j.error || j.message || msg; } catch {}
    throw new Error(`${res.status} ${msg}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}
