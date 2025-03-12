<script>
  export let news = {}; // Memberikan nilai default berupa objek kosong
</script>

{#if news && news.title}
  <div class="flex flex-col md:flex-row gap-4">
    <div class="md:w-1/2">
      <h1 class="text-2xl font-bold mb-2">{news.title}</h1>
      <p class="text-red-600 font-medium mb-2">{news.category || ''}</p>
      <p class="text-gray-700">{news.content || ''}</p>
    </div>
    <div class="md:w-1/2">
      {#if news.imageUrl}
        <img src={news.imageUrl} alt={news.title} class="w-full h-auto" />
      {/if}
    </div>
  </div>
{:else}
  <div class="flex justify-center items-center p-4">
    <p>Memuat berita...</p>
  </div>
{/if}