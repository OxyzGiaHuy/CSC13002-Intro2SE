import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '';

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from localStorage for authenticated requests
instance.interceptors.request.use((config: any) => {
  try {
    const token = localStorage.getItem('trails_explorer_token');
    if (token && config.headers) {
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// Global response handler: on 401 clear auth and redirect to login page
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem('trails_explorer_token');
        localStorage.removeItem('trails_explorer_user');
      } catch (e) {}
      try { window.location.href = '/'; } catch (e) {}
    }
    return Promise.reject(err);
  }
);

export async function apiCall(method: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE'|'HEAD', endpoint: string, data?: any, config?: AxiosRequestConfig) {
  const opts: AxiosRequestConfig = { method: method.toLowerCase() as any, url: endpoint, ...config };
  if (data !== undefined) opts.data = data;
  const res = await instance.request(opts);
  return res.data;
}

export default instance;
