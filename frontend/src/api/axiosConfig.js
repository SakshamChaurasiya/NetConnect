const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = {
  get: async (url, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "GET",
      headers,
      credentials: "include", // 🔥 important
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    return response.json();
  },

  post: async (url, data, token) => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      credentials: "include", // 🔥 important
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    return response.json();
  },

  patch: async (url, data, token) => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
      credentials: "include", // 🔥 important
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    return response.json();
  },

  delete: async (url, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "DELETE",
      headers,
      credentials: "include", // 🔥 important
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    return response.json();
  },
};
