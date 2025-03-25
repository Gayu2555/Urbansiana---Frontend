<script>
  import { popularNews } from '$lib/data/newsData';
</script>

<aside class="lg:col-span-1">
  <div class="sticky top-4">
    <h2 class="text-xl font-bold relative inline-block mb-6">
      Berita <span class="text-red-600">Populer</span>
      <div class="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600"></div>
    </h2>

    <div class="space-y-4">
      {#each popularNews as news}
        <a href="#" class="flex gap-4 group">
          <div class="flex-1">
            <h3 class="text-blue-600 font-medium text-sm group-hover:text-red-600 transition-colors duration-300">
              {news.title}
            </h3>
            <span class="text-gray-500 text-xs flex items-center gap-1 mt-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {news.time}
            </span>
          </div>
          <div class="w-20 h-16 flex-shrink-0">
            <img src={news.image} alt="Popular news" class="w-full h-full object-cover rounded" />
          </div>
        </a>
      {/each}
    </div>
  </div>
</aside>