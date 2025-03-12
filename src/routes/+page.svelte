<!-- src/routes/+page.svelte -->
<script>
  import NewsItem from '$lib/components/NewsItem.svelte';
  import NewsCard from '$lib/components/NewsCard.svelte';
  
  const mainNews = {
    title: "Hasil Liga Champions: Dortmund Lolos ke Perempat Final",
    category: "Olahraga",
    content: "Borussia Dortmund berhasil lolos ke perempat final Liga Champions usai mengalahkan Lille pada Kamis (13/3) dini hari WIB. Dortmund unggul 3-2 dalam agregat.",
    imageUrl: "https://via.placeholder.com/500x300/111/fff?text=Dortmund+Player"
  };
  
  const smallNews = [
    {
      title: "5 Fakta Atletico vs Madrid: Awas Kejutan Los Rojiblancos",
      imageUrl: "https://via.placeholder.com/120x80/111/fff?text=Atletico"
    },
    {
      title: "Van Dijk Ngobrol dengan Bos PSG Usai Liverpool Tersingkir, Ada Apa?",
      imageUrl: "https://via.placeholder.com/120x80/111/fff?text=Van+Dijk"
    }
  ];
</script>

<main class="max-w-4xl mx-auto p-4">
  <div class="border border-gray-200 p-4 mb-4">
    <NewsItem {mainNews} />
    
    <div class="flex flex-col md:flex-row justify-between mt-6 gap-4">
      {#each smallNews as news}
        <NewsCard {news} />
      {/each}
    </div>
  </div>
</main>