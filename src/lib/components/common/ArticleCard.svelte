<script>
  export let title = "";
  export let excerpt = "";
  export let imageSrc = "";
  export let imageAlt = "";
  export let url = "#";
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
  <img src={imageSrc} alt={imageAlt} class="w-full h-48 object-cover" />
  <div class="p-4">
    <h4 class="font-bold text-lg mb-2">{title}</h4>
    <p class="text-gray-700 text-sm mb-3">
      {excerpt}
    </p>
    <a href={url} class="text-primary text-sm font-medium hover:underline transition-colors">Baca selengkapnya</a>
  </div>
</div>