<script lang="ts">
  import { writable } from 'svelte/store';
  import { fly } from 'svelte/transition';
  import { X, Search } from 'lucide-svelte';
  import logoPath from '$lib/assets/logo.png';

  // Manajemen status untuk visibilitas pencarian dan input
  const pencarianSelulerTerlihat = writable(false);
  const kueriPencarian = writable('');

  // Toggle visibilitas pencarian seluler
  function togglePencarianSeluler() {
    pencarianSelulerTerlihat.update(v => !v);
  }

  // Tutup pencarian seluler
  function tutupPencarianSeluler() {
    pencarianSelulerTerlihat.set(false);
    kueriPencarian.set('');
  }

  // Tangani pengiriman pencarian
  function tanganiPencarian(event: Event) {
    event.preventDefault();
    console.log('Mencari:', $kueriPencarian);
  }
</script>

<nav class="bg-white shadow-lg sticky top-0 z-50">
  <div class="container mx-auto max-w-5xl px-4">
    <div class="flex items-center justify-between h-20">
      <!-- Logo -->
      <a 
        href="/" 
        class="flex-shrink-0 flex items-center cursor-pointer"
        aria-label="Beranda"
      >
        <img 
          src={logoPath} 
          alt="Logo" 
          class="h-50 w-65 md:w-45 object-contain"
        >
      </a>

      <!-- Toggle Pencarian Seluler -->
      <button 
        on:click={togglePencarianSeluler} 
        class="md:hidden text-gray-600 hover:text-primary transition-colors"
        aria-label="Toggle Pencarian Seluler"
      >
        <Search size={24} />
      </button>

      <!-- Pencarian Desktop -->
      <form 
        on:submit={tanganiPencarian}
        class="hidden md:flex items-center justify-center flex-1 mx-4"
      >
        <div class="w-3/5 relative group">
          <input 
            type="search" 
            bind:value={$kueriPencarian}
            placeholder="Cari apa pun..."
            class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
          <button 
            type="submit"
            class="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-500 group-focus-within:text-primary"
            aria-label="Kirim Pencarian"
          >
            <Search size={20} />
          </button>
        </div>
      </form>
    </div>

    <!-- Overlay Pencarian Seluler -->
    {#if $pencarianSelulerTerlihat}
      <div 
        transition:fly="{{ y: 20, duration: 300 }}"
        class="fixed inset-0 bg-white z-50 md:hidden"
      >
        <div class="p-4">
          <!-- Tombol Tutup -->
          <button 
            on:click={tutupPencarianSeluler}
            class="absolute top-4 right-4 text-gray-600 hover:text-primary"
            aria-label="Tutup Pencarian"
          >
            <X size={28} />
          </button>

          <!-- Form Pencarian Seluler -->
          <form 
            on:submit={tanganiPencarian}
            class="mt-16 flex flex-col space-y-4"
          >
            <input 
              type="search" 
              bind:value={$kueriPencarian}
              placeholder="Cari apa pun..."
              class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
              autofocus
            >
            <button 
              type="submit"
              class="w-full py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
            >
              Cari
            </button>
          </form>
        </div>
      </div>
    {/if}
  </div>
</nav>