<script>
  import { mainArticle, relatedArticles, latestNews } from '$lib/data/newsData';
</script>

<div class="lg:col-span-2">
  <!-- Main Article -->
  <article class="mb-8">
    <div class="grid md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <span class="text-red-600 text-sm font-medium">{mainArticle.category}</span>
        <h1 class="text-2xl font-bold leading-tight hover:text-red-600 cursor-pointer transition-colors duration-300">
          {mainArticle.title}
        </h1>
        <p class="text-gray-700">{mainArticle.description}</p>
      </div>
      <div class="relative h-[300px] rounded-lg overflow-hidden hover:opacity-90 transition-opacity duration-300 cursor-pointer">
        <img src={mainArticle.image} alt="Scene of the incident" class="w-full h-full object-cover" />
      </div>
    </div>
  </article>

  <!-- Divider -->
  <div class="border-t border-gray-200 my-8"></div>

  <!-- Related Articles -->
  <div class="grid md:grid-cols-2 gap-6 mb-8">
    {#each relatedArticles as article}
      <div class="flex gap-4 items-center group cursor-pointer">
        <div class="relative w-32 h-24 flex-shrink-0">
          <img src={article.image} alt="Related article" class="w-full h-full object-cover rounded" />
        </div>
        <h2 class="text-lg font-semibold group-hover:text-red-600 transition-colors duration-300">
          {article.title}
        </h2>
      </div>
    {/each}
  </div>

  <!-- Divider -->
  <div class="border-t border-gray-200 my-8"></div>

  <!-- Latest News Section -->
  <div class="mt-8">
    <h2 class="text-2xl font-bold mb-6 relative inline-block">
      TERBARU
      <div class="absolute -bottom-1 left-0 w-full h-1 bg-yellow-200"></div>
    </h2>

    <div class="space-y-6">
      {#each latestNews as newsItem, index}
        <div>
          <div class="flex gap-4 group cursor-pointer">
            <div class="w-48 h-32 flex-shrink-0">
              <img src={newsItem.image} alt="News" class="w-full h-full object-cover rounded" />
            </div>
            <div class="flex-1 space-y-2">
              <h3 class="text-xl font-semibold group-hover:text-red-600 transition-colors duration-300">
                {newsItem.title}
              </h3>
              <span class="text-red-600 text-sm">{newsItem.category}</span>
            </div>
          </div>
          
          <!-- Tambahkan divider di antara item berita, kecuali item terakhir -->
          {#if index < latestNews.length - 1}
            <div class="border-t border-gray-200 my-6"></div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>