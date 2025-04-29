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
    <div class="flex items-center justify-between h-16 sm:h-20">
      <!-- Logo -->
      <a 
        href="/" 
        class="flex-shrink-0 flex items-center cursor-pointer"
        aria-label="Beranda"
      >
        <div class="w-11 sm:w-40 md:w-48 h-auto relative">
          <img 
            src={logoPath || "/placeholder.svg"} 
            alt="Logo" 
            class="w-full h-auto object-contain max-h-46"
            loading="eager"
          >
        </div>
      </a>

      <!-- Toggle Pencarian Seluler -->
      <button 
        on:click={togglePencarianSeluler} 
        class="md:hidden text-gray-600 hover:text-primary transition-colors p-2"
        aria-label="Toggle Pencarian Seluler"
      >
        <Search size={22} />
      </button>

      <!-- Pencarian Desktop -->
      <form 
        on:submit={tanganiPencarian}
        class="hidden md:flex items-center justify-center flex-1 mx-4"
      >
        <div class="w-full max-w-md relative group">
          <input 
            type="search" 
            bind:value={$kueriPencarian}
            placeholder="Cari apa pun..."
            class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
          >
          <button 
            type="submit"
            class="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-500 group-focus-within:text-primary"
            aria-label="Kirim Pencarian"
          >
            <Search size={18} />
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
        <div class="p-4 flex flex-col h-full">
          <div class="flex justify-between items-center">
            <!-- Logo di Overlay -->
            <div class="w-32 sm:w-40 h-auto">
              <img 
                src={logoPath || "/placeholder.svg"} 
                alt="Logo" 
                class="w-full h-auto object-contain max-h-10"
              >
            </div>
            
            <!-- Tombol Tutup -->
            <button 
              on:click={tutupPencarianSeluler}
              class="text-gray-600 hover:text-primary p-2"
              aria-label="Tutup Pencarian"
            >
              <X size={24} />
            </button>
          </div>

          <!-- Form Pencarian Seluler -->
          <form 
            on:submit={tanganiPencarian}
            class="mt-8 flex flex-col space-y-4 flex-grow"
          >
            <input 
              type="search" 
              bind:value={$kueriPencarian}
              placeholder="Cari apa pun..."
              class="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
              autofocus
            >
            <button 
              type="submit"
              class="w-full py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors"
            >
              Cari
            </button>
          </form>
        </div>
      </div>
    {/if}
  </div>
</nav>

<style>
  /* Pastikan logo tidak terlalu besar pada layar kecil */
  @media (max-width: 640px) {
    :global(img[alt="Logo"]) {
      max-height: 2.5rem;
    }
  }
</style>