const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

type ApiOptions = {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
};

async function request(url: string, options: ApiOptions = {}) {
  const headers = new Headers();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData && options.body !== undefined) headers.set('Content-Type', 'application/json');

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(url.startsWith('/admin/') ? 'adminToken' : 'token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const body: BodyInit | undefined = isFormData
    ? options.body as FormData
    : options.body === undefined ? undefined : JSON.stringify(options.body);
  const response = await fetch(`${baseURL}${url}`, {
    method: options.method || 'GET',
    headers,
    body,
    credentials: 'include',
    signal: options.signal,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error: any = new Error(data?.message || 'درخواست انجام نشد.');
    error.response = { status: response.status, data };
    throw error;
  }
  return { data, status: response.status };
}

export const api = {
  get: (url: string, options?: Pick<ApiOptions, 'signal'>) => request(url, options),
  post: (url: string, body?: unknown) => request(url, { method: 'POST', body }),
  patch: (url: string, body?: unknown) => request(url, { method: 'PATCH', body }),
};

export const points = (n: number) => new Intl.NumberFormat('fa-IR').format(Math.round(Number(n) || 0)) + ' امتیاز';
export const toman = points;
