<script lang="ts">
	import { onMount } from 'svelte';
	
	// [Tipe data dan fungsi sama seperti sebelumnya]
	type Article = {
		id: number;
		title: string;
		description: string;
		image_url: string | null;
		category_name: string;
		date_published: string;
	};

	type ProcessedArticle = {
		title: string;
		description: string;
		image: string;
		category: string;
		date: string;
	};

	let mainArticle: ProcessedArticle | null = null;
	let latestNews: ProcessedArticle[] = [];
	let isLoading: boolean = true;
	let error: string | null = null;

	function processArticle(article: Article): ProcessedArticle {
		const cleanImageUrl = article.image_url 
			? article.image_url.replace(/^article_images\//, '')
			: null;

		return {
			title: article.title?.trim() || 'Judul Tidak Tersedia',
			description: article.description?.trim() || 'Tidak ada deskripsi',
			image: cleanImageUrl 
				? `http://192.168.1.150:3000/article_images/${encodeURIComponent(cleanImageUrl)}` 
				: 'http://192.168.1.150:3000/article_images/default-image.jpg',
			category: article.category_name?.trim() || 'Umum',
			date: formatDate(article.date_published)
		};
	}

	function formatDate(dateString: string): string {
		try {
			const date = new Date(dateString);
			
			if (isNaN(date.getTime())) {
				return 'Tanggal Tidak Valid';
			}

			return date.toLocaleDateString('id-ID', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			});
		} catch (error) {
			console.error('Kesalahan format tanggal:', error);
			return 'Tanggal Tidak Diketahui';
		}
	}

	async function fetchNews() {
		try {
			const response = await fetch('http://192.168.1.150:3000/api/articles', {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'User-Agent': 'NewsApp/1.0'
				}
			});

			if (!response.ok) {
				throw new Error(`Kesalahan HTTP! status: ${response.status}`);
			}

			const data = await response.json();

			if (!data.articles || !Array.isArray(data.articles) || data.articles.length === 0) {
				throw new Error('Tidak ada artikel yang ditemukan');
			}

			const processedArticles = data.articles.map(processArticle);

			mainArticle = processedArticles[0] || null;
			latestNews = processedArticles.slice(1, 5);

			isLoading = false;

		} catch (err: unknown) {
			error = err instanceof Error ? err.message : 'Kesalahan tidak dikenal';
			isLoading = false;

			mainArticle = {
				title: 'Gagal Memuat Berita',
				description: 'Terjadi masalah saat mengambil berita terkini. Silakan coba lagi nanti.',
				image: 'http://192.168.1.150:3000/article_images/default-image.jpg',
				category: 'Kesalahan Sistem',
				date: new Date().toLocaleDateString('id-ID')
			};

			latestNews = [];
		}
	}

	onMount(fetchNews);
</script>

<div class="container mx-auto px-4 py-8">
    {#if isLoading}
        <div class="text-center py-10">
            <div role="status">
                <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7479 32.2913 88.1032 35.8758C89.658 41.1804 91.315 41.4017 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    {:else if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Kesalahan: </strong>
            <span class="block sm:inline">{error}</span>
        </div>
    {:else if mainArticle}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Artikel Utama -->
            <div class="md:col-span-2">
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <img 
                        src={mainArticle.image} 
                        alt={mainArticle.title} 
                        class="w-full h-96 object-cover"
                    />
                    <div class="p-6">
                        <span class="text-sm text-red-600 font-semibold uppercase tracking-wide">
                            {mainArticle.category}
                        </span>
                        <h2 class="mt-2 text-xl font-bold text-gray-800">
                            {mainArticle.title}
                        </h2>
                        <p class="mt-4 text-gray-600">
                            {mainArticle.description}
                        </p>
                        <div class="mt-4 text-sm text-gray-500">
                            {mainArticle.date}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Berita Terkini -->
            <div>
                <h3 class="text-xl font-bold mb-4 text-gray-800">Berita Terkini</h3>
                {#each latestNews as news}
                    <div class="flex mb-4 pb-4 border-b last:border-b-0">
                        <img 
                            src={news.image} 
                            alt={news.title} 
                            class="w-24 h-20 object-cover rounded mr-4"
                        />
                        <div>
                            <h4 class="text-sm font-semibold text-gray-800 line-clamp-2">
                                {news.title}
                            </h4>
                            <span class="text-xs text-gray-500">
                                {news.date}
                            </span>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>