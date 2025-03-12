<script>
  export let isMenuOpen = false;
</script>

<nav class="hidden md:block">
  <ul class="flex space-x-6">
    <li><a href="/" class="font-medium hover:text-primary transition-colors">Beranda</a></li>
    <li><a href="/sepakbola" class="font-medium hover:text-primary transition-colors">Sepakbola</a></li>
    <li><a href="/liga-champions" class="font-medium hover:text-primary transition-colors">Liga Champions</a></li>
    <li><a href="/liga-indonesia" class="font-medium hover:text-primary transition-colors">Liga Indonesia</a></li>
    <li><a href="/transfer" class="font-medium hover:text-primary transition-colors">Transfer</a></li>
  </ul>
</nav>

<!-- Menu Mobile -->
{#if isMenuOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
    <div class="bg-white h-full w-64 p-4 shadow-lg">
      <ul class="space-y-4 mt-8">
        <li><a href="/" class="block font-medium hover:text-primary">Beranda</a></li>
        <li><a href="/sepakbola" class="block font-medium hover:text-primary">Sepakbola</a></li>
        <li><a href="/liga-champions" class="block font-medium hover:text-primary">Liga Champions</a></li>
        <li><a href="/liga-indonesia" class="block font-medium hover:text-primary">Liga Indonesia</a></li>
        <li><a href="/transfer" class="block font-medium hover:text-primary">Transfer</a></li>
      </ul>
    </div>
  </div>
{/if}