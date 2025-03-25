<script>
  import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-svelte';

  const tahunSekarang = new Date().getFullYear();

  const kategoriBerita = [
    { nama: 'Berita Nasional', slug: 'nasional' },
    { nama: 'Internasional', slug: 'internasional' },
    { nama: 'Bisnis', slug: 'bisnis' },
    { nama: 'Teknologi', slug: 'tekno' },
    { nama: 'Olahraga', slug: 'olahraga' },
    { nama: 'Hiburan', slug: 'hiburan' }
  ];

  const layananPelanggan = [
    { nama: 'Tentang Kami', slug: 'tentang' },
    { nama: 'Hubungi Kami', slug: 'kontak' },
    { nama: 'Kebijakan Privasi', slug: 'privasi' },
    { nama: 'Syarat & Ketentuan', slug: 'syarat' },
    { nama: 'Pengaduan Pembaca', slug: 'pengaduan' }
  ];
</script>

<footer class="bg-gray-900 text-white py-12">
  <div class="container mx-auto max-w-6xl px-4">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Kolom Tentang -->
      <div>
        <h3 class="text-xl font-bold mb-4">Historia Times</h3>
        <p class="text-gray-400 text-sm leading-relaxed">
          Portal berita terkini yang menyajikan informasi akurat, 
          terpercaya, dan mendalam dari berbagai bidang kehidupan.
        </p>
        <div class="flex space-x-4 mt-6">
          <a href="#" class="text-gray-300 hover:text-white transition-colors">
            <Facebook size={24} />
          </a>
          <a href="#" class="text-gray-300 hover:text-white transition-colors">
            <Twitter size={24} />
          </a>
          <a href="#" class="text-gray-300 hover:text-white transition-colors">
            <Instagram size={24} />
          </a>
          <a href="#" class="text-gray-300 hover:text-white transition-colors">
            <Linkedin size={24} />
          </a>
        </div>
      </div>

      <!-- Kategori Berita -->
      <div>
        <h4 class="text-lg font-semibold mb-4">Kategori Berita</h4>
        <ul class="space-y-2">
          {#each kategoriBerita as kategori}
            <li>
              <a 
                href="/category/{kategori.slug}" 
                class="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {kategori.nama}
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Layanan Pelanggan -->
      <div>
        <h4 class="text-lg font-semibold mb-4">Layanan Pelanggan</h4>
        <ul class="space-y-2">
          {#each layananPelanggan as layanan}
            <li>
              <a 
                href="/{layanan.slug}" 
                class="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {layanan.nama}
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Newsletter -->
      <div>
        <h4 class="text-lg font-semibold mb-4">Langganan Newsletter</h4>
        <form class="space-y-3">
          <div class="relative">
            <input 
              type="email" 
              placeholder="Email Anda" 
              class="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <button 
              type="submit" 
              class="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors"
            >
              <Mail size={20} />
            </button>
          </div>
          <p class="text-xs text-gray-500">
            Dapatkan berita terbaru langsung di kotak masuk Anda.
          </p>
        </form>
      </div>
    </div>

    <!-- Garis Pembatas -->
    <div class="border-t border-gray-800 mt-8 pt-6 text-center">
      <p class="text-sm text-gray-500">
        © {tahunSekarang} Urbansiana Media Infotainment. Hak Cipta Dilindungi Undang-Undang.
      </p>
    </div>
  </div>
</footer>