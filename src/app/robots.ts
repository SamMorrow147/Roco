import type { MetadataRoute } from "next";

// Served at /robots.txt. Everything is crawlable; the explicit AI-crawler
// entries document that answer engines (ChatGPT, Claude, Perplexity,
// Google's AI features) are welcome — being crawlable by these is what
// makes the site citable in AI answers.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
    ],
    sitemap: "https://www.rocofoam.com/sitemap.xml",
  };
}
