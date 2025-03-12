<script>
  import Navigation from './Navigation.svelte';
  import { onMount } from 'svelte';
  
  let isMenuOpen = false;
  let scrolled = false;
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 10;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<header class="{scrolled ? 'shadow-md py-2' : 'py-3'} bg-white sticky top-0 z-50 transition-all duration-200">
  <div class="container mx-auto px-4 flex justify-between items-center">
    <div class="flex items-center">
      <a href="/" class="flex items-center">
        <div class="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mr-2">B</div>
        <h1 class="text-2xl font-bold text-primary">BolaNet</h1>
      </a>
    </div>
    
    <Navigation {isMenuOpen} />
    
    <button class="md:hidden focus:outline-none" on:click={toggleMenu} aria-label="Toggle Menu">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</header>