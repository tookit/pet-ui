import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// GEO decision: AI answer engines (ChatGPT Search, Perplexity, Gemini, AI Overviews)
// are a primary acquisition channel for B2B sourcing queries. They are explicitly
// allowed here — blocking them would remove Petpallets from AI-generated answers.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /api/ only proxies the backend; crawling it creates duplicate content.
        disallow: ["/api/"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
