<script>
  import { onMount, onDestroy } from 'svelte';
  import { webSocketClient, connectionStatus, notifications, sendEncryptedMessage } from '../lib/services/websocket';
  import { authStore } from '../lib/stores/authStore';
  
  // Reactive variables
  let status;
  let notificationsList = [];
  let message = '';
  
  // Subscribe to stores
  const unsubStatus = connectionStatus.subscribe(value => {
    status = value;
  });
  
  const unsubNotifications = notifications.subscribe(value => {
    notificationsList = value;
  });
  
  // Function to send a test message
  function sendTestMessage() {
    if (message) {
      const testMessage = {
        type: 'message',
        content: message,
        timestamp: new Date().toISOString()
      };
      
      if (sendEncryptedMessage(testMessage)) {
        message = '';
      }
    }
  }
  
  // Cleanup subscriptions
  onDestroy(() => {
    unsubStatus();
    unsubNotifications();
  });
</script>

<div class="websocket-container">
  <h2>Status Koneksi WebSocket</h2>
  
  <div class="status-indicator {status}">
    {#if status === 'connected'}
      <span class="status-dot connected"></span> Terhubung
    {:else if status === 'disconnected'}
      <span class="status-dot disconnected"></span> Terputus
    {:else if status === 'no_auth'}
      <span class="status-dot no-auth"></span> Belum Login
    {:else if status === 'error' || status === 'failed'}
      <span class="status-dot error"></span> Error
    {/if}
  </div>
  
  {#if status === 'connected'}
    <div class="message-sender">
      <input 
        type="text" 
        bind:value={message} 
        placeholder="Ketik pesan..."
        on:keydown={(e) => e.key === 'Enter' && sendTestMessage()}
      />
      <button on:click={sendTestMessage}>Kirim</button>
    </div>
  {/if}
  
  <div class="notifications">
    <h3>Notifikasi ({notificationsList.length})</h3>
    {#if notificationsList.length === 0}
      <p class="empty-state">Belum ada notifikasi</p>
    {:else}
      <ul class="notification-list">
        {#each notificationsList as notification}
          <li class="notification-item {notification.type}">
            <div class="notification-header">
              <span class="notification-type">{notification.type}</span>
              <span class="notification-time">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div class="notification-content">
              {notification.message || notification.content || 
                (notification.action ? `Action: ${notification.action}` : 'No content')}
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style>
  .websocket-container {
    padding: 1rem;
    border-radius: 8px;
    background-color: #f8f9fa;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;
  }
  
  .status-indicator {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 4px;
  }
  
  .status-indicator.connected {
    background-color: rgba(40, 167, 69, 0.1);
  }
  
  .status-indicator.disconnected {
    background-color: rgba(255, 193, 7, 0.1);
  }
  
  .status-indicator.no-auth {
    background-color: rgba(108, 117, 125, 0.1);
  }
  
  .status-indicator.error, .status-indicator.failed {
    background-color: rgba(220, 53, 69, 0.1);
  }
  
  .status-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
  }
  
  .status-dot.connected {
    background-color: #28a745;
  }
  
  .status-dot.disconnected {
    background-color: #ffc107;
  }
  
  .status-dot.no-auth {
    background-color: #6c757d;
  }
  
  .status-dot.error {
    background-color: #dc3545;
  }
  
  .message-sender {
    display: flex;
    margin-bottom: 1rem;
  }
  
  .message-sender input {
    flex-grow: 1;
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px 0 0 4px;
  }
  
  .message-sender button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
  }
  
  .message-sender button:hover {
    background-color: #0069d9;
  }
  
  .notifications {
    margin-top: 1rem;
  }
  
  .empty-state {
    color: #6c757d;
    font-style: italic;
  }
  
  .notification-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .notification-item {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border-radius: 4px;
    border-left: 4px solid transparent;
  }
  
  .notification-item.system {
    background-color: rgba(23, 162, 184, 0.1);
    border-left-color: #17a2b8;
  }
  
  .notification-item.notification {
    background-color: rgba(0, 123, 255, 0.1);
    border-left-color: #007bff;
  }
  
  .notification-item.message {
    background-color: rgba(40, 167, 69, 0.1);
    border-left-color: #28a745;
  }
  
  .notification-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.25rem;
    font-size: 0.85rem;
  }
  
  .notification-type {
    font-weight: bold;
    text-transform: capitalize;
  }
  
  .notification-time {
    color: #6c757d;
  }
  
  .notification-content {
    word-break: break-word;
  }
</style>