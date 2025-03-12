<script>
  export let news;
</script>

<div class="flex flex-row gap-3 w-full md:w-auto">
  <img src={news.imageUrl} alt={news.title} class="w-24 h-16 object-cover" />
  <h2 class="text-sm font-medium">{news.title}</h2>
</div>
