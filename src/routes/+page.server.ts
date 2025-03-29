// src/routes/+page.server.ts
import type { PageServerLoad } from "./$types";

type Article = {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  category_name: string;
  date_published: string;
};

type ProcessedArticle = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
};

function processArticle(article: Article): ProcessedArticle {
  const cleanImageUrl = article.image_url
    ? article.image_url.replace(/^article_images\//, "")
    : null;

  return {
    id: article.id,
    title: article.title?.trim() || "Judul Tidak Tersedia",
    description: article.description?.trim() || "Tidak ada deskripsi",
    image: cleanImageUrl
      ? `http://192.168.1.150:3000/article_images/${encodeURIComponent(
          cleanImageUrl
        )}`
      : "http://192.168.1.150:3000/article_images/default-image.jpg",
    category: article.category_name?.trim() || "Umum",
    date: formatDate(article.date_published),
  };
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Tanggal Tidak Valid";
    }

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    console.error("Kesalahan format tanggal:", error);
    return "Tanggal Tidak Diketahui";
  }
}

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const response = await fetch("http://192.168.1.150:3000/api/articles", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "NewsApp/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Kesalahan HTTP! status: ${response.status}`);
    }

    const data = await response.json();

    if (
      !data.articles ||
      !Array.isArray(data.articles) ||
      data.articles.length === 0
    ) {
      throw new Error("Tidak ada artikel yang ditemukan");
    }

    const processedArticles = data.articles.map(processArticle);

    return {
      headlineNews: processedArticles[0] || null,
      smallNews: processedArticles.slice(1, 5),
      articles: processedArticles,
      error: null,
    };
  } catch (err) {
    console.error("Error fetching articles:", err);

    const defaultHeadline = {
      id: 0,
      title: "Gagal Memuat Berita",
      description:
        "Terjadi masalah saat mengambil berita terkini. Silakan coba lagi nanti.",
      image: "http://192.168.1.150:3000/article_images/default-image.jpg",
      category: "Kesalahan Sistem",
      date: new Date().toLocaleDateString("id-ID"),
    };

    return {
      headlineNews: defaultHeadline,
      smallNews: [],
      articles: [],
      error: err instanceof Error ? err.message : "Kesalahan tidak dikenal",
    };
  }
};
