// src/lib/services/websocket.js
import { browser } from "$app/environment";
import { readable, writable } from "svelte/store";
import { authStore } from "../stores/authStore";
import { get } from "svelte/store";
import { encrypt, decrypt } from "../utils/encryption";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000/ws";

export const connectionStatus = writable("disconnected");
export const notifications = writable([]);

let socket;
let clientId = null;
let reconnectTimer;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000; // 3 detik

// Buat WebSocket client yang bisa dibaca oleh komponen Svelte
export const webSocketClient = readable(null, function start(set) {
  if (!browser) return;

  // Function untuk membuat koneksi WebSocket
  function connect() {
    const auth = get(authStore);
    if (!auth || !auth.apiKey) {
      connectionStatus.set("no_auth");
      return;
    }

    try {
      socket = new WebSocket(WS_URL);

      // Tambahkan header API key
      socket.addEventListener("open", () => {
        connectionStatus.set("connected");
        reconnectAttempts = 0;
        console.log("WebSocket terhubung");

        // Kirim ping secara berkala untuk menjaga koneksi tetap hidup
        const pingInterval = setInterval(() => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            const pingMessage = {
              type: "ping",
              timestamp: new Date().toISOString(),
            };
            sendEncryptedMessage(pingMessage);
          } else {
            clearInterval(pingInterval);
          }
        }, 30000); // Ping setiap 30 detik
      });

      socket.addEventListener("message", (event) => {
        handleWebSocketMessage(event.data);
      });

      socket.addEventListener("close", () => {
        connectionStatus.set("disconnected");
        console.log("WebSocket terputus");

        // Coba sambung ulang
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          console.log(
            `Mencoba sambung ulang dalam ${RECONNECT_DELAY / 1000} detik...`
          );

          if (reconnectTimer) clearTimeout(reconnectTimer);
          reconnectTimer = setTimeout(connect, RECONNECT_DELAY);
        } else {
          connectionStatus.set("failed");
          console.error("Gagal tersambung setelah beberapa percobaan");
        }
      });

      socket.addEventListener("error", (error) => {
        connectionStatus.set("error");
        console.error("WebSocket error:", error);
      });

      set(socket);
    } catch (error) {
      connectionStatus.set("error");
      console.error("Error setting up WebSocket:", error);
    }
  }

  connect();

  // Subscribe ke perubahan auth store untuk menangani rekoneksi ketika login/logout
  const unsubscribe = authStore.subscribe((auth) => {
    if (auth && auth.isLoggedIn && auth.apiKey) {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        connect();
      }
    } else if (socket) {
      socket.close();
      connectionStatus.set("no_auth");
    }
  });

  // Cleanup saat komponen dihapus
  return function stop() {
    unsubscribe();
    if (reconnectTimer) clearTimeout(reconnectTimer);
    if (socket) socket.close();
  };
});

// Fungsi untuk mengirim pesan terenkripsi
export function sendEncryptedMessage(message) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error("WebSocket tidak terhubung");
    return false;
  }

  try {
    const encryptedData = encryption.encrypt(JSON.stringify(message));
    socket.send(
      JSON.stringify({
        encrypted: true,
        data: encryptedData,
      })
    );
    return true;
  } catch (error) {
    console.error("Error mengirim pesan terenkripsi:", error);
    return false;
  }
}

// Fungsi untuk menangani pesan yang diterima
function handleWebSocketMessage(rawMessage) {
  try {
    const message = JSON.parse(rawMessage);

    // Handle pesan terenkripsi
    if (message.encrypted && message.data) {
      try {
        const decryptedData = encryption.decrypt(message.data);
        const parsedData = JSON.parse(decryptedData);

        // Simpan client ID jika ini adalah pesan welcome
        if (parsedData.type === "system" && parsedData.action === "connected") {
          clientId = parsedData.clientId;
          console.log("Client ID diterima:", clientId);
        }

        // Handle tipe notifikasi
        if (
          parsedData.type === "system" ||
          parsedData.type === "notification"
        ) {
          notifications.update((n) => {
            const newNotifications = [parsedData, ...n];
            return newNotifications.slice(0, 10); // Batasi jumlah notifikasi
          });
        }

        // Handle pesan pong (respon dari ping)
        if (parsedData.type === "pong") {
          console.debug("Pong diterima:", parsedData.timestamp);
        }
      } catch (decryptErr) {
        console.error("Gagal mendekripsi pesan:", decryptErr);
      }
    } else {
      // Handle pesan tidak terenkripsi
      console.log("Pesan tidak terenkripsi diterima:", message);

      // Handle pesan error
      if (message.type === "error") {
        console.error("Error dari server WebSocket:", message.message);
      }
    }
  } catch (error) {
    console.error("Error menangani pesan WebSocket:", error);
  }
}

// Ekspor client ID getter
export function getClientId() {
  return clientId;
}
