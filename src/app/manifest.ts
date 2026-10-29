import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LUMIORA — Handcrafted Soap Karachi",
    short_name: "LUMIORA",
    description:
      "Hand-poured cold-process artisan soaps made in Karachi by LUMIORA with pure oils, whole botanicals, and four weeks of curing.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f4ed",
    theme_color: "#a04e2a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/images/lumiora-packaging-showcase.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/images/lumiora-packaging-showcase.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
