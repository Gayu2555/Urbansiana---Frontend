<script>
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import { authStore } from "$lib/stores/authStore";
  
  // Props
  export let wsUrl = "ws://localhost:8080/ws"; // Default WebSocket URL, should be overridden
  
  // Notification store
  const notifications = writable([]);
  const unreadCount = writable(0);
  
  // WebSocket connection state
  let socket;
  let isConnected = false;
  let reconnectAttempts = 0;
  let maxReconnectAttempts = 5;
  let reconnectTimeout;
  let authToken = null;
  
  // UI state
  let showNotificationPanel = false;
  let showToast = false;
  let currentToast = null;
  let toastTimeout;
  
  onMount(() => {
    // Subscribe to auth store to get token
    const unsubAuth = authStore.subscribe(auth => {
      if (auth && auth.token) {
        authToken = auth.token;
        // Connect or reconnect with new token if needed
        if (!isConnected) {
          connectWebSocket();
        }
      } else {
        // Disconnect if logged out
        if (socket) {
          socket.close();
          isConnected = false;
        }
      }
    });
    
    // Load existing notifications from localStorage
    try {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications);
        notifications.set(parsedNotifications);
        updateUnreadCount(parsedNotifications);
      }
    } catch (error) {
      console.error("Error loading saved notifications:", error);
    }
    
    return () => {
      unsubAuth();
      disconnectWebSocket();
    };
  });
  
  onDestroy(() => {
    disconnectWebSocket();
    clearTimeout(toastTimeout);
    clearTimeout(reconnectTimeout);
  });
  
  function connectWebSocket() {
    if (!authToken) return;
    
    try {
      // Close existing connection if any
      if (socket) {
        socket.close();
      }
      
      // Create new WebSocket connection with auth token
      socket = new WebSocket(`${wsUrl}?token=${authToken}`);
      
      socket.onopen = () => {
        console.log("WebSocket connected");
        isConnected = true;
        reconnectAttempts = 0;
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
      
      socket.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        isConnected = false;
        
        // Attempt to reconnect if not a clean close
        if (event.code !== 1000 && event.code !== 1001) {
          attemptReconnect();
        }
      };
      
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        isConnected = false;
      };
      
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
      isConnected = false;
      attemptReconnect();
    }
  }
  
  function disconnectWebSocket() {
    if (socket) {
      socket.close();
      isConnected = false;
    }
  }
  
  function attemptReconnect() {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.log("Max reconnect attempts reached");
      return;
    }
    
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
    
    clearTimeout(reconnectTimeout);
    reconnectTimeout = setTimeout(() => {
      reconnectAttempts++;
      connectWebSocket();
    }, delay);
  }
  
  function handleWebSocketMessage(data) {
    if (data.type === 'notification') {
      // Add new notification to the store
      const newNotification = {
        id: data.id || `notif-${Date.now()}`,
        title: data.title || 'Notifikasi Baru',
        message: data.message || '',
        link: data.link || null,
        timestamp: data.timestamp || new Date().toISOString(),
        read: false,
        type: data.notificationType || 'info'
      };
      
      notifications.update(items => {
        const updatedNotifications = [newNotification, ...items];
        // Save to localStorage
        try {
          localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        } catch (error) {
          console.error("Error saving notifications:", error);
        }
        return updatedNotifications;
      });
      
      // Update unread count
      unreadCount.update(count => count + 1);
      
      // Show toast notification
      showToastNotification(newNotification);
    }
  }
  
  function showToastNotification(notification) {
    currentToast = notification;
    showToast = true;
    
    // Auto-hide toast after 5 seconds
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      showToast = false;
    }, 5000);
  }
  
  function hideToast() {
    showToast = false;
    clearTimeout(toastTimeout);
  }
  
  function toggleNotificationPanel() {
    showNotificationPanel = !showNotificationPanel;
  }
  
  function markAsRead(id) {
    notifications.update(items => {
      const updatedNotifications = items.map(item => {
        if (item.id === id && !item.read) {
          return { ...item, read: true };
        }
        return item;
      });
      
      // Save to localStorage
      try {
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      } catch (error) {
        console.error("Error saving notifications:", error);
      }
      
      updateUnreadCount(updatedNotifications);
      return updatedNotifications;
    });
  }
  
  function markAllAsRead() {
    notifications.update(items => {
      const updatedNotifications = items.map(item => ({ ...item, read: true }));
      
      // Save to localStorage
      try {
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      } catch (error) {
        console.error("Error saving notifications:", error);
      }
      
      unreadCount.set(0);
      return updatedNotifications;
    });
  }
  
  function deleteNotification(id) {
    notifications.update(items => {
      const updatedNotifications = items.filter(item => item.id !== id);
      
      // Save to localStorage
      try {
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      } catch (error) {
        console.error("Error saving notifications:", error);
      }
      
      updateUnreadCount(updatedNotifications);
      return updatedNotifications;
    });
  }
  
  function clearAllNotifications() {
    notifications.set([]);
    unreadCount.set(0);
    
    // Clear localStorage
    try {
      localStorage.removeItem('notifications');
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  }
  
  function updateUnreadCount(notificationsList) {
    const count = notificationsList.filter(item => !item.read).length;
    unreadCount.set(count);
  }
  
  function getNotificationIcon(type) {
    switch (type) {
      case 'success':
        return `
          <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `;
      case 'error':
        return `
          <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `;
      case 'warning':
        return `
          <svg class="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        `;
      default:
        return `
          <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `;
    }
  }
  
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'Baru saja';
    } else if (diffMin < 60) {
      return `${diffMin} menit yang lalu`;
    } else if (diffHour < 24) {
      return `${diffHour} jam yang lalu`;
    } else if (diffDay < 7) {
      return `${diffDay} hari yang lalu`;
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }
</script>

<!-- Notification Bell Button -->
<div class="relative">
  <button 
    class="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    on:click={toggleNotificationPanel}
    aria-label="Notifikasi"
  >
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    
    {#if $unreadCount > 0}
      <span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
        {$unreadCount > 99 ? '99+' : $unreadCount}
      </span>
    {/if}
  </button>
  
  <!-- Notification Panel -->
  {#if showNotificationPanel}
    <div 
      class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg overflow-hidden z-50"
      style="max-height: 80vh;"
    >
      <div class="p-3 bg-blue-600 text-white flex justify-between items-center">
        <h3 class="font-medium">Notifikasi</h3>
        <div class="flex space-x-2">
          {#if $notifications.length > 0}
            <button 
              class="text-xs bg-blue-700 hover:bg-blue-800 px-2 py-1 rounded transition-colors"
              on:click={markAllAsRead}
              title="Tandai semua sudah dibaca"
            >
              Tandai Dibaca
            </button>
            <button 
              class="text-xs bg-blue-700 hover:bg-blue-800 px-2 py-1 rounded transition-colors"
              on:click={clearAllNotifications}
              title="Hapus semua notifikasi"
            >
              Hapus Semua
            </button>
          {/if}
        </div>
      </div>
      
      <div class="overflow-y-auto" style="max-height: calc(80vh - 48px);">
        {#if $notifications.length === 0}
          <div class="p-4 text-center text-gray-500">
            <svg class="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p>Tidak ada notifikasi</p>
          </div>
        {:else}
          <div class="divide-y divide-gray-100">
            {#each $notifications as notification}
              <div 
                class="p-4 hover:bg-gray-50 transition-colors {notification.read ? 'bg-white' : 'bg-blue-50'}"
              >
                <div class="flex">
                  <div class="flex-shrink-0 mr-3">
                    {@html getNotificationIcon(notification.type)}
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between items-start">
                      <a 
                        href={notification.link || '#'} 
                        class="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        on:click={() => markAsRead(notification.id)}
                      >
                        {notification.title}
                      </a>
                      <div class="flex items-center space-x-2 ml-2">
                        <span class="text-xs text-gray-500 whitespace-nowrap">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <button 
                          class="text-gray-400 hover:text-gray-600"
                          on:click={() => deleteNotification(notification.id)}
                          title="Hapus notifikasi"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">{notification.message}</p>
                    {#if !notification.read}
                      <button 
                        class="text-xs text-blue-600 hover:text-blue-800 mt-2"
                        on:click={() => markAsRead(notification.id)}
                      >
                        Tandai sudah dibaca
                      </button>
                    {/if}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
      
      {#if !isConnected}
        <div class="p-2 bg-yellow-100 text-yellow-800 text-xs text-center">
          <span>Tidak terhubung ke server notifikasi. </span>
          <button 
            class="underline hover:text-yellow-900"
            on:click={connectWebSocket}
          >
            Coba hubungkan kembali
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<!-- Toast Notification -->
{#if showToast && currentToast}
  <div 
    class="fixed bottom-4 right-4 max-w-md bg-white rounded-lg shadow-lg overflow-hidden z-50 animate-slide-up"
    transition:fade={{ duration: 200 }}
  >
    <div class="p-4">
      <div class="flex">
        <div class="flex-shrink-0 mr-3">
          {@html getNotificationIcon(currentToast.type)}
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-start">
            <h4 class="text-sm font-medium text-gray-900">{currentToast.title}</h4>
            <button 
              class="ml-4 text-gray-400 hover:text-gray-600"
              on:click={hideToast}
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p class="mt-1 text-sm text-gray-500">{currentToast.message}</p>
          {#if currentToast.link}
            <a 
              href={currentToast.link} 
              class="mt-2 inline-block text-xs text-blue-600 hover:text-blue-800"
              on:click={() => markAsRead(currentToast.id)}
            >
              Lihat detail
            </a>
          {/if}
        </div>
      </div>
    </div>
    <!-- Progress bar -->
    <div class="bg-gray-100 h-1">
      <div class="bg-blue-600 h-1 animate-shrink"></div>
    </div>
  </div>
{/if}

<style>
  /* Animation for toast notifications */
  @keyframes slide-up {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes shrink {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
  
  .animate-slide-up {
    animation: slide-up 0.3s ease-out forwards;
  }
  
  .animate-shrink {
    animation: shrink 5s linear forwards;
  }
</style>