interface RequestOptions extends RequestInit {
  useAuth?: boolean;
  _retry?: boolean;
}

// In Vite development and Production, use relative URLs so Vite proxy / Nginx routes /api correctly
const BASE_URL = '';

// Concurrency lock for refreshing tokens
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { useAuth = true, headers: customHeaders, _retry = false, ...customOptions } = options;

  const headers = new Headers(customHeaders);
  if (!headers.has('Content-Type') && !(customOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (useAuth) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const fullUrl = url.startsWith('http')
    ? url
    : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      ...customOptions,
      headers,
    });
  } catch (networkErr: any) {
    throw new Error(networkErr?.message || 'Network connection failed. Please verify server status.');
  }

  // 401 Unauthorized & Token Refresh Interceptor
  if (
    response.status === 401 &&
    useAuth &&
    !_retry &&
    !url.includes('/api/auth/login') &&
    !url.includes('/api/auth/refresh')
  ) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem('accessToken', data.accessToken);
            if (data.refreshToken) {
              localStorage.setItem('refreshToken', data.refreshToken);
            }
            isRefreshing = false;
            onRefreshed(data.accessToken);

            // Retry original request with newly issued token
            headers.set('Authorization', `Bearer ${data.accessToken}`);
            return request<T>(url, { ...options, _retry: true, headers });
          } else {
            // Refresh failed - session expired
            isRefreshing = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
        } catch (e) {
          isRefreshing = false;
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      } else {
        // Wait for the active refresh promise to resolve
        return new Promise<T>((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            headers.set('Authorization', `Bearer ${newToken}`);
            resolve(request<T>(url, { ...options, _retry: true, headers }));
          });
        });
      }
    }
  }

  // Handle error responses safely
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText || 'Request failed'}`;
    try {
      const text = await response.text();
      if (text) {
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = text;
        }
      }
    } catch {
      // Fallback to default message
    }
    throw new Error(errorMessage);
  }

  // Handle successful responses (including 204 No Content / empty bodies)
  const rawText = await response.text();
  if (!rawText || rawText.trim() === '') {
    return {} as T;
  }

  try {
    return JSON.parse(rawText) as T;
  } catch {
    return rawText as unknown as T;
  }
}

export const apiService = {
  request,

  get<T>(url: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return request<T>(url, { ...options, method: 'GET' });
  },

  post<T>(url: string, body: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return request<T>(url, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  put<T>(url: string, body: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return request<T>(url, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  delete<T>(url: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return request<T>(url, { ...options, method: 'DELETE' });
  },
};
