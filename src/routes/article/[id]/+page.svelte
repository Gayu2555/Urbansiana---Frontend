<script>
  import { onMount } from 'svelte';
  
  export let data;
  
  let { article } = data;
  
  function shareOnWhatsApp() {
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + url)}`, '_blank');
  }
  
  function shareOnFacebook() {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  }
  
  function shareOnTwitter() {
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`, '_blank');
  }
  
  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert('Link berhasil disalin!');
      })
      .catch(err => {
        console.error('Gagal menyalin link: ', err);
      });
  }
  
  let isShareMenuOpen = false;
  
  function toggleShareMenu() {
    isShareMenuOpen = !isShareMenuOpen;
  }
</script>

<svelte:head>
  <title>{article.title} - Portal Berita</title>
</svelte:head>

<main class="container mx-auto px-4 py-4 max-w-4xl">
  <div class="mb-4">
    <!-- Breadcrumb -->
    <nav class="flex text-sm text-gray-600 mb-3">
      <a href="/" class="hover:text-red-600">Nasional</a>
      <span class="mx-2">›</span>
      <a href="/" class="hover:text-red-600">Peristiwa</a>
    </nav>
    
    <!-- Article Title -->
    <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{article.title}</h1>
    
    <!-- Source and Date -->
    <div class="mb-3">
      <span class="text-red-600 font-medium">CNN Indonesia</span>
      <div class="text-gray-400 text-sm mt-1">Minggu, 30 Mar 2025 04:35 WIB</div>
    </div>
    
    <!-- Share Buttons -->
    <div class="flex items-center mb-4">
      <div class="text-sm mr-2">Bagikan:</div>
      <div class="flex space-x-2">
        <button 
          on:click={shareOnWhatsApp}
          class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>
        <button 
          on:click={shareOnFacebook}
          class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
          </svg>
        </button>
        <button 
          on:click={shareOnTwitter}
          class="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
          </svg>
        </button>
        <button 
          on:click={copyLink}
          class="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center hover:bg-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Article Image -->
    <div class="mb-4">
      <div class="relative">
        <img 
          src={article.image || "/placeholder.svg"} 
          alt={article.title}
          class="w-full h-auto object-cover"
        />
        <button 
          class="absolute bottom-4 right-4 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-red-700"
          on:click={toggleShareMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>
        
        {#if isShareMenuOpen}
          <div class="absolute bottom-16 right-4 bg-white shadow-lg rounded-lg p-3 flex flex-col space-y-2">
            <button 
              on:click={shareOnWhatsApp}
              class="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>WhatsApp</span>
            </button>
            <button 
              on:click={shareOnFacebook}
              class="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
              <span>Facebook</span>
            </button>
            <button 
              on:click={shareOnTwitter}
              class="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000000">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
              <span>Twitter</span>
            </button>
            <button 
              on:click={copyLink}
              class="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#718096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <span>Copy Link</span>
            </button>
          </div>
        {/if}
      </div>
      <p class="text-sm text-gray-600 mt-2 italic">
        BPBD Jawa Timur memetakan sejumlah wilayah yang berpotensi rawan bencana hidrometeorologi saat Hari Raya Idulfitri 1446 Hijriah. Ilustrasi. (ANTARA FOTO/Oky Lukmansyah).
      </p>
    </div>
    
    <!-- Article Content -->
    <div class="prose max-w-none text-gray-800">
      <p class="font-bold">Surabaya, CNN Indonesia -- Badan Penanggulangan Bencana Daerah (BPBD) <span class="text-red-600">Jawa Timur</span> memetakan sejumlah wilayah yang berpotensi rawan bencana hidrometeorologi saat Hari Raya <span class="text-red-600">Idulfitri</span> 1446 Hijriah.</p>
      
      <p>Kabid Kedaruratan dan Logistik BPBD Jatim Satriyo Nurseno mengatakan, berdasarkan informasi BMKG, potensi cuaca ekstrem dan bencana hidrometeorologi masih mengintai sejumlah wilayah di Jawa Timur selama musim mudik dan Lebaran.</p>
      
      <p>"Kami telah memetakan wilayah-wilayah yang berpotensi terdampak bencana selama periode mudik dan Lebaran. Ini sebagai langkah antisipasi untuk meminimalisir risiko," kata Satriyo dalam keterangan yang diterima, Minggu (30/3).</p>
      
      <p>Menurutnya, beberapa wilayah yang perlu diwaspadai antara lain jalur Malang-Lumajang, Probolinggo-Lumajang, dan beberapa titik di Jalur Pantura yang rawan banjir dan tanah longsor.</p>
      
      <p>"BPBD Jatim telah berkoordinasi dengan BPBD Kabupaten/Kota untuk memastikan kesiapsiagaan menghadapi potensi bencana selama Lebaran," tambahnya.</p>
      
      <p>Satriyo menambahkan, pihaknya juga telah menyiapkan personel dan logistik yang ditempatkan di titik-titik strategis untuk mengantisipasi kejadian bencana selama periode mudik dan Lebaran.</p>
      
      <p>"Kami menghimbau masyarakat untuk tetap waspada dan mengikuti arahan dari pihak berwenang, terutama saat melewati daerah-daerah rawan bencana," pungkasnya.</p>
    </div>
  </div>
</main>

<style>
  .prose p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
</style>