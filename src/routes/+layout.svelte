<script>
  import '../app.css';
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
</script>

<Header />

<main class="container mx-auto px-4 py-6">
  <slot />
</main>

<Footer />