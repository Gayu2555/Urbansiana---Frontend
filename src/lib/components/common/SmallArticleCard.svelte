<script>
  export let title = "";
  export let excerpt = "";
  export let imageSrc = "";
  export let imageAlt = "";
  export let url = "#";
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden flex hover:shadow-lg transition-all duration-300">
  <img src={imageSrc} alt={imageAlt} class="w-1/3 object-cover" />
  <div class="p-4 w-2/3">
    <h4 class="font-bold text-md mb-2">{title}</h4>
    <p class="text-gray-700 text-sm">
      {excerpt}
    </p>
    <a href={url} class="text-primary text-xs font-medium hover:underline mt-2 inline-block">Baca selengkapnya</a>
  </div>
</div>