import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// ponytail: no incremental cache (R2) — pages are force-dynamic or revalidated.
// Add r2IncrementalCache + NEXT_INC_CACHE_R2_BUCKET when ISR caching matters.
export default defineCloudflareConfig();
