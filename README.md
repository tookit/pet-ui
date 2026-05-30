# Petpallets Storefront (pet-ui)

B2B wholesale storefront for **petpallets.com** — the public-facing website where retailers browse aquarium and pet products, build inquiry lists, and submit quote requests.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind v4** with design tokens from `html/DESIGN.md`
- **Phosphor Icons** for UI icons
- **Cloudflare/OpenNext** for deployment

## Prerequisites

- Node.js 18+
- pnpm

## Quick Start

```bash
pnpm install          # install dependencies
pnpm dev              # start dev server → http://localhost:3003
```

## Commands

```bash
pnpm dev              # next dev — http://localhost:3003
pnpm build            # next build (production)
pnpm lint             # next lint
pnpm deploy           # opennextjs-cloudflare build + deploy
pnpm preview          # opennextjs-cloudflare build + preview
```

## Architecture

- **App Router** with file-system routing under `app/`
- Product pages at `/products/[slug]` (flat namespace — products belong to multiple categories)
- Marketing pages (`/`, `/about`, `/oem`, `/contact`) are static Server Components
- Category/product pages are API-driven, fetching from pet-api via `X-API-Key` header
- Inquiry system: client-side list in localStorage + React Context, fixed bottom InquiryBar
- Fonts: Playfair Display / Inter / Noto Sans SC via `next/font/google`

## Design System

Design tokens (colors, typography, spacing, shadows) are defined in `../html/DESIGN.md` and mapped into Tailwind v4 `@theme` blocks. Do not use arbitrary Tailwind values or hex literals — use the token system.

## API Connection

The storefront connects to [pet-api](../pet-api/) (FastAPI backend on port 8001) using the `X-API-Key` header for unauthenticated reads (products, categories, tags). Authenticated user actions (quotes, account) use JWT.

See `lib/api.ts` for the fetch client.
