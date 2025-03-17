// src/lib/utils/encryption.js
import { browser } from "$app/environment";

// Implementasi enkripsi yang kompatibel dengan server
export const encryption = {
  // Enkripsi key akan disimpan di memory
  encryptionKey: "",

  /**
   * Inisialisasi enkripsi key, lebih baik diambil dari server setelah login
   */
  setKey(key) {
    this.encryptionKey = key;
  },

  /**
   * Mengenkrip data
   */
  encrypt(text) {
    if (!browser) return ""; // Tidak berfungsi di server-side rendering

    try {
      // Enkripsi sederhana untuk contoh
      // Implementasi sebenarnya harus menggunakan SubtleCrypto untuk AES-CBC
      // Ini adalah contoh simulasi untuk kompatibilitas dengan server

      // Generate IV
      const iv = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Enkripsi sederhana (ini hanya contoh, bukan enkripsi sebenarnya)
      // Di implementasi nyata, gunakan Web Crypto API
      const simpleEncrypt = (text, key) => {
        let result = "";
        for (let i = 0; i < text.length; i++) {
          const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
          result += String.fromCharCode(charCode);
        }
        return btoa(result); // base64 encode
      };

      const encrypted = simpleEncrypt(text, this.encryptionKey);
      return `${iv}:${encrypted}`;
    } catch (error) {
      console.error("Encryption error:", error);
      return "";
    }
  },

  /**
   * Mendekripsi data
   */
  decrypt(text) {
    if (!browser) return ""; // Tidak berfungsi di server-side rendering

    try {
      const parts = text.split(":");
      const iv = parts[0];
      const encryptedText = parts[1];

      // Dekripsi sederhana (ini hanya contoh, bukan dekripsi sebenarnya)
      // Di implementasi nyata, gunakan Web Crypto API
      const simpleDecrypt = (encryptedText, key) => {
        const decoded = atob(encryptedText); // base64 decode
        let result = "";
        for (let i = 0; i < decoded.length; i++) {
          const charCode =
            decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
          result += String.fromCharCode(charCode);
        }
        return result;
      };

      return simpleDecrypt(encryptedText, this.encryptionKey);
    } catch (error) {
      console.error("Decryption error:", error);
      return "";
    }
  },
};

// Ekspor enkripsi utilities
export default encryption;
