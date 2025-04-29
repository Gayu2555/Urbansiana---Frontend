export function formatDate(dateString: string): string {
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

    return date.toLocaleDateString("id-ID", options) + " WIB";
  } catch (error) {
    console.error("Kesalahan format tanggal dan waktu:", error);
    return dateString;
  }
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Hapus karakter khusus
    .replace(/\s+/g, "-") // Ganti spasi dengan tanda hubung
    .replace(/--+/g, "-") // Hapus tanda hubung berlebih
    .trim(); // Hapus spasi di awal dan akhir
}
