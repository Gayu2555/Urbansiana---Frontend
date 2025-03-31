import { error } from "@sveltejs/kit";
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
  } catch (err) {
    console.error("Kesalahan format tanggal:", err);
    return "Tanggal Tidak Diketahui";
  }
}

function processArticle(article: Article): ProcessedArticle {
  const cleanImageUrl = article.image_url
    ? article.image_url.replace(/^article_images\//, "")
    : null;

  // Pastikan slug selalu ada
  const slug = article.slug || `artikel-${article.id}`;

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

export const load: PageServerLoad = async ({ params, fetch }) => {
  try {
    const slug = params.slug as string;

    // Validasi slug sebelum melakukan request
    if (slug === "undefined" || !slug) {
      throw error(404, "Slug artikel tidak valid");
    }

    console.log(`Mencari artikel dengan slug: ${slug}`);

    // Gunakan endpoint API Fastify yang sesuai
    const response = await fetch(
      `http://192.168.1.150:3000/api/articles/slug/${encodeURIComponent(
        slug.trim()
      )}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "NewsApp/1.0",
        },
      }
    );

    // Jika respon tidak berhasil
    if (!response.ok) {
      console.error(`HTTP Error: ${response.status} - ${response.statusText}`);

      // Coba pendekatan dengan ID jika slug berupa angka
      if (/^\d+$/.test(slug)) {
        console.log(`Mencoba cari artikel dengan ID: ${slug}`);

        const idResponse = await fetch(
          `http://192.168.1.150:3000/api/articles/${slug}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "User-Agent": "NewsApp/1.0",
            },
          }
        );

        if (idResponse.ok) {
          const idData = await idResponse.json();
          if (idData.article) {
            const article = processArticle(idData.article);
            console.log(`Berhasil memuat artikel dengan ID ${slug}`);
            return { article };
          }
        }
      }

      // Pendekatan fallback
      throw error(
        response.status,
        `Artikel tidak ditemukan: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.article) {
      console.error("Tidak ada artikel yang ditemukan dalam respons");
      throw error(404, "Artikel tidak ditemukan");
    }

    // Proses artikel yang dikembalikan
    const article = processArticle(data.article);
    console.log(`Berhasil memuat artikel dengan slug "${slug}"`);

    return {
      article,
    };
  } catch (err) {
    console.error("Error saat mengambil artikel:", err);

    if (err instanceof Error && "status" in err) {
      throw err;
    }

    throw error(
      500,
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan saat memuat artikel"
    );
  }
};
