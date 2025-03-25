<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import CategoryMenu from '$lib/components/CategoryMenu.svelte';
  import MainContent from '$lib/components/MainContent.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<div class="max-w-6xl mx-auto p-4">
  <Navbar />
  <CategoryMenu />
  
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <MainContent />
    <Sidebar />
  </div>
</div>

<Footer />