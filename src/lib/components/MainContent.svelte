<script lang="ts">
	import { onMount } from 'svelte';

	// Tipe data untuk artikel menggunakan type
	type Article = {
		id: number;
		title: string;
		description: string;
		image_url: string | null;
		category_name: string;
		date_published: string;
	};

	// State variables dengan tipe yang jelas
	let mainArticle: Article | null = null;
	let relatedArticles: Article[] = [];
	let latestNews: Article[] = [];
	let isLoading: boolean = true;
	let error: string | null = null;

	// Fungsi utilitas untuk memproses artikel
	function processArticle(article: Article, fallbackImage: string): {
		title: string;
		description: string;
		image: string;
		category: string;
		date: string;
	} {
		return {
			title: article.title || 'Judul Tidak Tersedia',
			description: article.description || 'Tidak ada deskripsi',
			image: article.image_url || fallbackImage,
			category: article.category_name || 'Umum',
			date: new Date(article.date_published).toLocaleDateString('id-ID', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			})
		};
	}

	// Fungsi fetch berita dengan error handling yang komprehensif
	async function fetchNews() {
		try {
			// Logging proses fetch
			console.group('🔍 Proses Pengambilan Berita');
			console.time('waktuFetch');
			console.log(`🕒 Fetch dimulai: ${new Date().toISOString()}`);

			// Konfigurasi fetch dengan timeout
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000);

			const response = await fetch('http://192.168.1.150:3000/api/articles', {
				method: 'GET',
				signal: controller.signal,
				headers: {
					'Accept': 'application/json',
					'User-Agent': 'NewsApp/1.0'
				}
			});

			clearTimeout(timeoutId);

			// Logging detail respons
			console.log('📡 Detail Respons:', {
				status: response.status,
				statusText: response.statusText
			});

			// Validasi respons
			if (!response.ok) {
				throw new Error(`Kesalahan HTTP! status: ${response.status}`);
			}

			// Parse JSON
			const data = await response.json();
			console.log('📊 Data yang Diterima:', data);

			// Validasi struktur data
			if (!data.articles || !Array.isArray(data.articles) || data.articles.length === 0) {
				throw new Error('Tidak ada artikel yang ditemukan');
			}

			// Proses artikel utama
			if (data.articles.length > 0) {
				mainArticle = processArticle(
					data.articles[0], 
					'https://via.placeholder.com/600x400.png?text=Artikel+Utama'
				);
			}

			// Artikel terkait (maks 2)
			relatedArticles = data.articles.slice(1, 3).map(article => 
				processArticle(
					article, 
					'https://via.placeholder.com/300x200.png?text=Artikel+Terkait'
				)
			);

			// Berita terbaru (artikel tersisa)
			latestNews = data.articles.slice(3).map(article => 
				processArticle(
					article, 
					'https://via.placeholder.com/400x300.png?text=Berita+Terbaru'
				)
			);

			// Selesaikan proses
			isLoading = false;

			console.timeEnd('waktuFetch');
			console.log('✅ Fetch berhasil diselesaikan');
			console.groupEnd();

		} catch (err) {
			// Penanganan error terperinci
			console.group('❌ Kesalahan Pengambilan Berita');
			console.error('Detail Kesalahan:', {
				pesan: err.message,
				nama: err.name
			});
			console.groupEnd();

			// Atur state error
			error = err.message;
			isLoading = false;

			// Data cadangan
			mainArticle = {
				title: 'Gagal Memuat Berita',
				description: 'Terjadi masalah saat mengambil berita terkini. Silakan coba lagi nanti.',
				image: 'https://via.placeholder.com/600x400.png?text=Error+Memuat+Berita',
				category: 'Kesalahan Sistem',
				date: new Date().toLocaleDateString('id-ID')
			};

			relatedArticles = [];
			latestNews = [];
		}
	}

	// Jalankan fetch saat komponen dimuat
	onMount(fetchNews);
</script>

<!-- Template untuk menampilkan berita -->
{#if isLoading}
	<div class="flex justify-center items-center h-screen">
		<div class="animate-spin rounded-full h-32 w-32 border-t-2 border-red-500"></div>
	</div>
{:else if error}
	<div class="text-red-500 text-center p-8">
		Terjadi Kesalahan: {error}
	</div>
{:else if mainArticle}
	<div class="container mx-auto px-4">
		<!-- Artikel Utama -->
		<article class="mb-8">
			<div class="grid md:grid-cols-2 gap-6">
				<div class="space-y-4">
					<span class="text-red-600 text-sm font-medium">{mainArticle.category}</span>
					<h1 class="text-2xl font-bold leading-tight hover:text-red-600 cursor-pointer transition-colors duration-300">
						{mainArticle.title}
					</h1>
					<p class="text-gray-700">{mainArticle.description}</p>
					<div class="text-gray-500 text-sm">
						Dipublikasikan: {mainArticle.date}
					</div>
				</div>
				<div class="relative h-[300px] rounded-lg overflow-hidden hover:opacity-90 transition-opacity duration-300 cursor-pointer">
					<img src={mainArticle.image} alt={mainArticle.title} class="w-full h-full object-cover" />
				</div>
			</div>
		</article>

		<!-- Pembatas -->
		<div class="border-t border-gray-200 my-8"></div>

		<!-- Artikel Terkait -->
		<div class="grid md:grid-cols-2 gap-6 mb-8">
			{#each relatedArticles as article}
				<div class="flex gap-4 items-center group cursor-pointer">
					<div class="relative w-32 h-24 flex-shrink-0">
						<img src={article.image} alt={article.title} class="w-full h-full object-cover rounded" />
					</div>
					<div>
						<h2 class="text-lg font-semibold group-hover:text-red-600 transition-colors duration-300">
							{article.title}
						</h2>
						<span class="text-gray-500 text-sm">{article.date}</span>
					</div>
				</div>
			{/each}
		</div>

		<!-- Pembatas -->
		<div class="border-t border-gray-200 my-8"></div>

		<!-- Berita Terbaru -->
		<section class="mt-8">
			<h2 class="text-2xl font-bold mb-6 relative inline-block">
				BERITA TERBARU
				<div class="absolute -bottom-1 left-0 w-full h-1 bg-yellow-200"></div>
			</h2>

			<div class="space-y-6">
				{#each latestNews as newsItem, index}
					<div>
						<div class="flex gap-4 group cursor-pointer">
							<div class="w-48 h-32 flex-shrink-0">
								<img src={newsItem.image} alt={newsItem.title} class="w-full h-full object-cover rounded" />
							</div>
							<div class="flex-1 space-y-2">
								<h3 class="text-xl font-semibold group-hover:text-red-600 transition-colors duration-300">
									{newsItem.title}
								</h3>
								<div class="flex justify-between items-center">
									<span class="text-red-600 text-sm">{newsItem.category}</span>
									<span class="text-gray-500 text-xs">{newsItem.date}</span>
								</div>
							</div>
						</div>
						
						{#if index < latestNews.length - 1}
							<div class="border-t border-gray-200 my-6"></div>
						{/if}
					</div>
				{/each}
			</div>
		</section>
	</div>
{/if}