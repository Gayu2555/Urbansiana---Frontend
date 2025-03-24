import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { authStore } from "../stores/authStore";
import { get } from "svelte/store";

const API_URL =
  import.meta.env.VITE_API_URL || "http://192.168.1.150:3000/api/articles";
let apiKey = "";

// Inisialisasi API key dari localStorage jika tersedia
if (browser) {
  apiKey = localStorage.getItem("api_key") || "";

  // Subscribe ke authStore untuk mendapatkan API key ketika login
  authStore.subscribe((auth) => {
    if (auth && auth.apiKey) {
      apiKey = auth.apiKey;
      localStorage.setItem("api_key", apiKey);
    }
  });
}

/**
 * Fungsi dasar untuk request API
 */
async function fetchAPI(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    // Handle unauthorized error
    if (response.status === 401) {
      authStore.set({ isLoggedIn: false, apiKey: null, user: null });
      if (browser) {
        localStorage.removeItem("api_key");
        localStorage.removeItem("auth");
        goto("/login");
      }
      throw new Error("Sesi telah berakhir. Silakan login kembali.");
    }

    if (!response.ok) {
      throw new Error(data.message || "Terjadi kesalahan pada server");
    }

    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Fungsi untuk mendapatkan semua kategori
 */
export async function getCategories() {
  const response = await fetchAPI("/categories");
  return response.data;
}

/**
 * Fungsi untuk mendapatkan detail kategori berdasarkan slug
 */
export async function getCategoryBySlug(slug) {
  const response = await fetchAPI(`/categories/${slug}`);
  return response.data;
}

/**
 * Fungsi untuk mendapatkan artikel berdasarkan filter
 */
export async function getArticles(filters = {}) {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });

  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : "";
  const response = await fetchAPI(`/articles${queryString}`);
  return response.data;
}

/**
 * Fungsi untuk mendapatkan detail artikel berdasarkan slug
 */
export async function getArticleBySlug(slug) {
  const response = await fetchAPI(`/articles/${slug}`);
  return response.data;
}

/**
 * Fungsi untuk mendapatkan artikel berdasarkan posisi
 */
export async function getArticlesByPosition(position) {
  const response = await fetchAPI(`/positions/${position}`);
  return response.data;
}

/**
 * Fungsi untuk login
 */
export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login gagal");
  }

  return data.data;
}

export default {
  getCategories,
  getCategoryBySlug,
  getArticles,
  getArticleBySlug,
  getArticlesByPosition,
  login,
};
