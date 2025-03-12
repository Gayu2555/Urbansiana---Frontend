import { writable } from "svelte/store";
import { beritaTerbaru, beritaLigaChampions } from "$lib/data/berita.js";
import { dataKlasemen } from "$lib/data/klasemen.js";

export const articlesStore = writable(beritaTerbaru);
export const championsStore = writable(beritaLigaChampions);
export const klasemenStore = writable(dataKlasemen);
