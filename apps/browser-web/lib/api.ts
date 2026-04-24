export async function cloudFetch(input: RequestInfo | URL, init?: RequestInit) {
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('auth_token');
  }

  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type') && !(init?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const defaultBaseUrl = process.env.NEXT_PUBLIC_CLOUD_API_URL || "http://localhost:4005";
  
  let finalUrl = input;
  if (typeof input === 'string' && input.startsWith('/api')) {
    finalUrl = `${defaultBaseUrl}${input}`;
  }

  try {
    const res = await fetch(finalUrl, { ...init, headers });
    if (res.status === 401 || res.status === 403) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth_unauthorized'));
      }
    }
    return res;
  } catch (error) {
    console.error("Cloud Fetch Error:", error);
    throw error;
  }
}
