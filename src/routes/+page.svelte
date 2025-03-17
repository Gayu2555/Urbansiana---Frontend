<script>
  import { onMount } from "svelte";
  
  // Data state
  let featuredArticles = [];
  let latestArticles = [];
  let popularArticles = [];
  let categories = [];
  let isLoading = true;
  let error = null;
  
  onMount(async () => {
    try {
      // Fetch all data in parallel
      const [featuredRes, latestRes, popularRes, categoriesRes] = await Promise.all([
        fetch('/api/articles/featured'),
        fetch('/api/articles/latest'),
        fetch('/api/articles/popular'),
        fetch('/api/categories')
      ]);
      
      // Check if all responses are OK
      if (!featuredRes.ok || !latestRes.ok || !popularRes.ok || !categoriesRes.ok) {
        throw new Error("Gagal memuat data");
      }
      
      // Parse all responses
      [featuredArticles, latestArticles, popularArticles, categories] = await Promise.all([
        featuredRes.json(),
        latestRes.json(),
        popularRes.json(),
        categoriesRes.json()
      ]);
      
    } catch (err) {
      console.error("Error saat memuat data:", err);
      error = "Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.";
    } finally {
      isLoading = false;
    }
  });
  
  // Format date helper
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  }
  
  // Truncate text helper
  function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }
</script>

<svelte:head>
  <title>SitusBerita - Portal Berita Terpercaya</title>
  <meta name="description" content="Portal berita terpercaya dengan informasi terkini dan terlengkap dari berbagai kategori." />
</svelte:head>

<main class="min-h-screen">
  {#if isLoading}
    <div class="container mx-auto px-4 py-12 flex justify-center">
      <div class="text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p class="mt-4 text-gray-600">Memuat konten...</p>
      </div>
    </div>
  {:else if error}
    <div class="container mx-auto px-4 py-12">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button 
          class="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          on:click={() => window.location.reload()}
        >
          Muat Ulang
        </button>
      </div>
    </div>
  {:else}
    <!-- Hero Section with Featured Articles -->
    <section class="bg-blue-600 text-white py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold mb-6">Berita Utama</h1>
        
        {#if featuredArticles.length > 0}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each featuredArticles.slice(0, 3) as article, index}
              <a 
                href="/artikel/{article.slug}" 
                class="group block bg-blue-700 hover:bg-blue-800 rounded-lg overflow-hidden transition-colors {index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}"
              >
                <div class="relative">
                  <img 
                    src={article.image || `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(article.title)}`} 
                    alt={article.title}
                    class="w-full h-48 md:h-56 object-cover {index === 0 ? 'lg:h-80' : ''}"
                  />
                  <div class="absolute top-0 left-0 bg-blue-600 text-white text-xs font-bold px-2 py-1 m-2 rounded">
                    {article.category.name}
                  </div>
                </div>
                <div class="p-4">
                  <h2 class="text-xl font-bold mb-2 group-hover:text-blue-200 transition-colors">
                    {article.title}
                  </h2>
                  <p class="text-blue-200 mb-3">
                    {truncateText(article.excerpt, index === 0 ? 200 : 100)}
                  </p>
                  <div class="flex justify-between items-center text-sm text-blue-300">
                    <span>{article.author.name}</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </a>
            {/each}
          </div>
        {:else}
          <div class="bg-blue-700 p-6 rounded-lg text-center">
            <p>Tidak ada berita utama saat ini.</p>
          </div>
        {/if}
      </div>
    </section>
    
    <!-- Latest News Section -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Berita Terbaru</h2>
        
        {#if latestArticles.length > 0}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each latestArticles.slice(0, 8) as article}
              <a href="/artikel/{article.slug}" class="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={article.image || `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(article.title)}`} 
                  alt={article.title}
                  class="w-full h-48 object-cover"
                />
                <div class="p-4">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {article.category.name}
                    </span>
                    <span class="text-xs text-gray-500">{formatDate(article.publishedAt)}</span>
                  </div>
                  <h3 class="text-lg font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p class="text-gray-600 text-sm mb-3">
                    {truncateText(article.excerpt, 80)}
                  </p>
                  <div class="flex items-center text-sm text-gray-500">
                    <img 
                      src={article.author.avatar || `/placeholder.svg?height=40&width=40&text=${encodeURIComponent(article.author.name.charAt(0))}`} 
                      alt={article.author.name}
                      class="w-6 h-6 rounded-full mr-2"
                    />
                    <span>{article.author.name}</span>
                  </div>
                </div>
              </a>
            {/each}
          </div>
          
          <div class="mt-8 text-center">
            <a 
              href="/berita-terbaru" 
              class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Lihat Semua Berita Terbaru
            </a>
          </div>
        {:else}
          <div class="bg-white p-6 rounded-lg shadow text-center">
            <p class="text-gray-600">Tidak ada berita terbaru saat ini.</p>
          </div>
        {/if}
      </div>
    </section>
    
    <!-- Categories Section -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-8 text-gray-800">Jelajahi Kategori</h2>
        
        {#if categories.length > 0}
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {#each categories as category}
              <a 
                href="/kategori/{category.slug}" 
                class="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-blue-50 transition-all text-center"
              >
                <div class="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mb-3">
                  <!-- You can replace this with actual category icons if available -->
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 class="font-medium text-gray-800">{category.name}</h3>
                <p class="text-xs text-gray-500 mt-1">{category.articleCount || 0} artikel</p>
              </a>
            {/each}
          </div>
        {:else}
          <div class="bg-white p-6 rounded-lg shadow text-center">
            <p class="text-gray-600">Tidak ada kategori saat ini.</p>
          </div>
        {/if}
      </div>
    </section>
    
    <!-- Popular Articles Section -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Artikel Populer</h2>
        
        {#if popularArticles.length > 0}
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              {#if popularArticles[0]}
                <div class="md:flex">
                  <div class="md:w-2/5">
                    <img 
                      src={popularArticles[0].image || `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(popularArticles[0].title)}`} 
                      alt={popularArticles[0].title}
                      class="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div class="p-6 md:w-3/5">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {popularArticles[0].category.name}
                      </span>
                      <span class="text-xs text-gray-500">{formatDate(popularArticles[0].publishedAt)}</span>
                    </div>
                    <a href="/artikel/{popularArticles[0].slug}" class="block">
                      <h3 class="text-xl font-bold mb-3 text-gray-800 hover:text-blue-600 transition-colors">
                        {popularArticles[0].title}
                      </h3>
                    </a>
                    <p class="text-gray-600 mb-4">
                      {truncateText(popularArticles[0].excerpt, 150)}
                    </p>
                    <div class="flex items-center text-sm text-gray-500">
                      <img 
                        src={popularArticles[0].author.avatar || `/placeholder.svg?height=40&width=40&text=${encodeURIComponent(popularArticles[0].author.name.charAt(0))}`} 
                        alt={popularArticles[0].author.name}
                        class="w-6 h-6 rounded-full mr-2"
                      />
                      <span>{popularArticles[0].author.name}</span>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
            
            <div class="space-y-4">
              {#each popularArticles.slice(1, 5) as article}
                <a 
                  href="/artikel/{article.slug}" 
                  class="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div class="w-1/3">
                    <img 
                      src={article.image || `/placeholder.svg?height=150&width=200&text=${encodeURIComponent(article.title)}`} 
                      alt={article.title}
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="w-2/3 p-4">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-xs font-medium text-blue-600">{article.category.name}</span>
                      <span class="text-xs text-gray-500">{formatDate(article.publishedAt)}</span>
                    </div>
                    <h3 class="font-bold text-gray-800 hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p class="text-xs text-gray-500 mt-2">{article.author.name}</p>
                  </div>
                </a>
              {/each}
            </div>
          </div>
          
          <div class="mt-8 text-center">
            <a 
              href="/artikel-populer" 
              class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Lihat Semua Artikel Populer
            </a>
          </div>
        {:else}
          <div class="bg-white p-6 rounded-lg shadow text-center">
            <p class="text-gray-600">Tidak ada artikel populer saat ini.</p>
          </div>
        {/if}
      </div>
    </section>
    
    <!-- Newsletter Section -->
    <section class="py-12 bg-blue-600 text-white">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-2xl md:text-3xl font-bold mb-4">Dapatkan Berita Terbaru</h2>
          <p class="text-blue-200 mb-6">Berlangganan newsletter kami untuk mendapatkan berita terbaru langsung ke email Anda.</p>
          
          <form class="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Email Anda" 
              required
              class="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              class="bg-white text-blue-600 hover:bg-blue-100 font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Berlangganan
            </button>
          </form>
          
          <p class="mt-4 text-sm text-blue-200">Kami tidak akan pernah membagikan email Anda kepada pihak lain.</p>
        </div>
      </div>
    </section>
  {/if}
</main>

<style>
  /* Additional custom styles if needed */
</style>