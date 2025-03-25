<script>
  import { page } from '$app/stores';
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { onMount } from 'svelte';

  let categoryMenu;
  let scrollAmount = 300;
  let canScrollLeft = false;
  let canScrollRight = true;

  const categories = [
    { name: 'Berita', slug: 'berita' },
    { name: 'Konichiwa Urbania', slug: 'konichiwa-urbania' },
    { name: 'Bisnis', slug: 'bisnis' },
    { name: 'Nasional', slug: 'nasional' },
    { name: 'Historia Times', slug: 'historia-times' },
    { name: 'Internasional', slug: 'internasional' },
    { name: 'Lifestyle', slug: 'lifestyle' },
    { name: 'Kesehatan', slug: 'kesehatan' },
    { name: 'Otomotif', slug: 'otomotif' },
    { name: 'Tekno', slug: 'tekno' }
  ];

  function scrollLeft() {
    if (categoryMenu) {
      categoryMenu.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
      checkScrollPosition();
    }
  }

  function scrollRight() {
    if (categoryMenu) {
      categoryMenu.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      checkScrollPosition();
    }
  }

  function checkScrollPosition() {
    if (!categoryMenu) return;

    // Cek apakah bisa scroll ke kiri
    canScrollLeft = categoryMenu.scrollLeft > 0;

    // Cek apakah bisa scroll ke kanan
    canScrollRight = 
      categoryMenu.scrollLeft + categoryMenu.clientWidth < categoryMenu.scrollWidth;
  }

  onMount(() => {
    // Tambahkan event listener untuk melacak posisi scroll
    if (categoryMenu) {
      categoryMenu.addEventListener('scroll', checkScrollPosition);
      
      // Periksa posisi scroll awal
      checkScrollPosition();
    }

    // Pembersihan event listener saat komponen dihancurkan
    return () => {
      if (categoryMenu) {
        categoryMenu.removeEventListener('scroll', checkScrollPosition);
      }
    };
  });
</script>

<div class="bg-white shadow-sm border-t border-b border-gray-200">
  <div class="container mx-auto max-w-4xl relative">
    <!-- Left Scroll Button -->
    <button 
      on:click={scrollLeft}
      disabled={!canScrollLeft}
      class="absolute left-0 top-1/2 -translate-y-1/2 
             bg-white bg-opacity-90 hover:bg-gray-50 
             p-2 rounded-r-lg shadow-md z-10 
             transition-all duration-300 ease-in-out 
             group hidden md:block
             {!canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''}"
    >
      <ChevronLeft 
        class="text-blue-600 
               {!canScrollLeft ? 'text-gray-400' : 'group-hover:text-blue-800'} 
               transition-colors duration-300" 
        size={24} 
      />
    </button>

    <!-- Right Scroll Button -->
    <button 
      on:click={scrollRight}
      disabled={!canScrollRight}
      class="absolute right-0 top-1/2 -translate-y-1/2 
             bg-white bg-opacity-90 hover:bg-gray-50 
             p-2 rounded-l-lg shadow-md z-10 
             transition-all duration-300 ease-in-out 
             group hidden md:block
             {!canScrollRight ? 'opacity-50 cursor-not-allowed' : ''}"
    >
      <ChevronRight 
        class="text-blue-600 
               {!canScrollRight ? 'text-gray-400' : 'group-hover:text-blue-800'} 
               transition-colors duration-300" 
        size={24} 
      />
    </button>

    <!-- Category List -->
    <div class="overflow-hidden">
      <ul 
        bind:this={categoryMenu}
        class="flex items-center justify-start gap-6 py-4 px-4 md:px-12 
               overflow-x-auto scrollbar-hide whitespace-nowrap 
               scroll-smooth"
      >
        {#each categories as category, index}
          <li>
            <a 
              href="/category/{category.slug}"
              class="text-sm md:text-base font-semibold transition-all duration-300
                     {$page.params.category === category.slug 
                       ? 'text-blue-700 scale-105' 
                       : 'text-gray-600 hover:text-blue-600'}"
            >
              {category.name}
            </a>
          </li>
          {#if index < categories.length - 1}
            <li class="h-4 border-l border-gray-300"></li>
          {/if}
        {/each}
      </ul>
    </div>
  </div>
</div>

<style>
  /* Hide scrollbar for Chrome, Safari and Opera */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
</style>