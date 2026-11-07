import { NextRequest, NextResponse } from "next/server";
import {
  fetchActiveProducts,
  fetchFeaturedProducts,
  fetchProductsBySearch,
} from "@/lib/api";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  try {
    if (!q) {
      // ponytail: no rating column in API; featured products stand in for "top rated".
      const featured = await fetchFeaturedProducts(6);
      const products = featured.length
        ? featured
        : (await fetchActiveProducts(1, 6)).result;
      return NextResponse.json(products);
    }

    const res = await fetchProductsBySearch(q, 1, 6);
    return NextResponse.json(res.result);
  } catch {
    return NextResponse.json([]);
  }
}
