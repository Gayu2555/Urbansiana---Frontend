<!-- src/routes/+layout.svelte -->
<script>
  import "../app.css";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import WebSocketNotification from "$lib/components/WebSocketNotification.svelte";
  import { onMount, onDestroy } from "svelte";
  import { authStore } from "$lib/stores/authStore";
  import { webSocketClient } from "$lib/services/websocket";
  import { notifications } from "$lib/services/websocket";
  import { browser } from "$app/environment";

  let showNotifications = false;
  let isLoading = false;
  let unsubscribe = null;

  onMount(() => {
    if (browser) {
      const savedAuth = localStorage.getItem("auth");
      if (savedAuth) {
        try {
          const authData = JSON.parse(savedAuth);
          authStore.set(authData);
        } catch (e) {
          console.error("Error loading saved auth:", e);
        }
      }

      isLoading = false;
    }

    // Subscribe ke WebSocket
    unsubscribe = webSocketClient.subscribe((client) => {
      console.log("WebSocket client aktif:", client);
    });
  });

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
</script>

{#if isLoading}
  <div class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
    <div class="flex flex-col items-center">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      <p class="mt-4 text-gray-700 font-medium">Memuat...</p>
    </div>
  </div>
{/if}

<div class="min-h-screen flex flex-col bg-gray-50">
  <Header />
  
  <main class="flex-grow container mx-auto px-4 py-8">
    <slot />
  </main>

  <Footer />
  
  <!-- Floating notification button -->
  <button 
    class="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-30"
    on:click={() => showNotifications = !showNotifications}
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    
    {#if $notifications.length > 0}
      <span class="absolute -top-1 -right-1 bg-red-500 text-xs text-white font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {$notifications.length}
      </span>
    {/if}
  </button>
  
  <!-- Notification panel -->
  {#if showNotifications}
    <WebSocketNotification on:close={() => showNotifications = false} />
  {/if}
</div>
