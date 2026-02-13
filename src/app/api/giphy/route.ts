import { NextResponse } from "next/server";

const GIPHY_API = "https://api.giphy.com/v1/gifs/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q || typeof q !== "string") {
    return NextResponse.json({ error: "Missing query param: q" }, { status: 400 });
  }
  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GIPHY_API_KEY not configured. Add it to .env" },
      { status: 500 }
    );
  }
  const search = `${q} workout exercise`.slice(0, 50);
  const url = new URL(GIPHY_API);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("q", search);
  url.searchParams.set("limit", "1");
  url.searchParams.set("rating", "g");
  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err || "GIPHY request failed" }, { status: res.status });
    }
    const data = (await res.json()) as {
      data?: Array<{ images?: { fixed_height?: { url?: string }; fixed_height_small?: { url?: string } } }>;
    };
    const gif = data.data?.[0];
    const urlGif = gif?.images?.fixed_height?.url || gif?.images?.fixed_height_small?.url || null;
    return NextResponse.json({ url: urlGif });
  } catch (e) {
    console.error("GIPHY fetch error:", e);
    return NextResponse.json({ error: "Failed to fetch GIF" }, { status: 500 });
  }
}
