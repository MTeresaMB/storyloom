export async function apiGet<T>(
  url: string,
  opts?: { headers?: Record<string, string>; signal?: AbortSignal }
): Promise<T> {
  const res = await fetch(url, { headers: opts?.headers, signal: opts?.signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function apiPost<T>(
  url: string,
  body: any,
  opts?: { headers?: Record<string, string> }
): Promise<T> {
  const res = await fetch(url, { method: 'POST', headers: opts?.headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function apiPut<T>(
  url: string,
  body: any,
  opts?: { headers?: Record<string, string> }): Promise<T> {
  const res = await fetch(url, { method: 'PUT', headers: opts?.headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function apiDelete<T>(
  url: string,
  opts?: { headers?: Record<string, string> }): Promise<T> {
  const res = await fetch(url, { method: 'DELETE', headers: opts?.headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}