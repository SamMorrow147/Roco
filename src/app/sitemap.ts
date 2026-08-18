import type { MetadataRoute } from "next";

// Served at /sitemap.xml. Add new routes here as pages are created.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.rocofoam.com";
  return [
    {
      url: `${base}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/spray-foam-benefits`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/concrete-masonry`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/contact`,
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];
}
