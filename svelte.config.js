import adapter from "@sveltejs/adapter-auto";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    prerender: {
      entries: ["*"], // Prerender semua halaman secara otomatis
    },
  },
};

export default config;
