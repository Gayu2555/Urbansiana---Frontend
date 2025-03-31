import type { PageServerLoad } from "./$types";

type Article = {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  category_name: string;
  date_published: string;
  content?: string;
  author_name?: string;
  slug?: string;
  category_slug?: string;
};

type ProcessedArticle = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  date_published: string;
  content: string;
  author_name: string;
  slug: string;
  category_slug: string;
};

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Hapus karakter khusus
    .replace(/\s+/g, "-") // Ganti spasi dengan tanda hubung
    .replace(/--+/g, "-") // Hapus tanda hubung berlebih
    .trim(); // Hapus spasi di awal dan akhir
}

function processArticle(article: Article): ProcessedArticle {
  const cleanImageUrl = article.image_url
    ? article.image_url.replace(/^article_images\//, "")
    : null;

  // Pastikan slug selalu ada dengan membuat fallback dari judul atau ID
  let slug = article.slug;
  if (!slug) {
    // Buat slug dari judul jika ada
    if (article.title) {
      slug = createSlug(article.title);
    }

    // Jika masih tidak ada slug, gunakan ID
    if (!slug || slug === "") {
      slug = `artikel-${article.id}`;
    }
  }

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
    date_published: article.date_published,
    content: article.content || "",
    author_name: article.author_name || "",
    slug: slug,
    category_slug: article.category_slug || "",
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

export function formatDateWithTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return date.toLocaleDateString("id-ID", options);
  } catch (error) {
    console.error("Kesalahan format tanggal dan waktu:", error);
    return dateString;
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
      date_published: new Date().toISOString(),
      content: "",
      author_name: "",
      slug: "error",
      category_slug: "",
    };

    return {
      headlineNews: defaultHeadline,
      smallNews: [],
      articles: [],
      error: err instanceof Error ? err.message : "Kesalahan tidak dikenal",
    };
  }
};
