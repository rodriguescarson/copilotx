import { NextResponse } from "next/server";

const GIPHY_API = "https://api.giphy.com/v1/gifs/search";

// Curated map of normalized exercise keys to GIPHY IDs. Keys are lowercased,
// hyphen-separated. IDs that 404 fall through to GIPHY search then to the
// inline SVG dumbbell rendered by the client.
const CURATED_GIFS: Record<string, string> = {
  "bench-press": "l0HlGRDhBs6OTeRNK",
  squat: "3o6wrebpXprcpRBSli",
  deadlift: "l0HlPystfePnAI3G8",
  "pull-up": "l0HlMURBbyUFZcyuc",
  "push-up": "l0HlNQ03J5JxX6lva",
  row: "3o6wrebpXprcpRBSli",
  "overhead-press": "l0HlBO7eyXzSZkJri",
  lunge: "l0HlGYU6n1Q6Wm8nu",
  plank: "l0HlIBYuTu3SNi6vu",
  burpee: "3o7TKsrfkKjr01yyTu",
  "mountain-climber": "l0HlOBgLfTaH3UEZ2",
  "jumping-jack": "l0HlMzyrWqVCjjUc0",
  "bicep-curl": "l0HlH1IhJZbF7XxKE",
  "tricep-dip": "l0HlGYU6n1Q6Wm8nu",
  "lateral-raise": "l0HlBO7eyXzSZkJri",
  "leg-press": "3o6wrebpXprcpRBSli",
  "lat-pulldown": "l0HlMURBbyUFZcyuc",
  "calf-raise": "l0HlGYU6n1Q6Wm8nu",
  "russian-twist": "l0HlIBYuTu3SNi6vu",
  default: "l0HlGRDhBs6OTeRNK",
};

/**
 * Clean up an exercise query: strip set/rep notation ("3x10", "4x12"),
 * the words "sets"/"reps", lowercase, collapse whitespace.
 */
export function cleanQuery(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\d+\s*x\s*\d+/g, "")
    .replace(/\b(sets?|reps?)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalize a cleaned query to the curated-map key format. */
function normalizeKey(cleaned: string): string {
  return cleaned.replace(/\s+/g, "-");
}

/** Build a GIPHY media URL from a known gif ID. */
function giphyUrlFromId(id: string): string {
  return `https://media.giphy.com/media/${id}/giphy.gif`;
}

type GifResponse = { url: string | null; fallback?: boolean };

function fallbackResponse(): NextResponse<GifResponse> {
  return NextResponse.json({ url: null, fallback: true });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    if (!q || typeof q !== "string") {
      return NextResponse.json({ error: "Missing query param: q" }, { status: 400 });
    }

    const cleaned = cleanQuery(q);
    const key = normalizeKey(cleaned);

    // 1. Curated map lookup (exact + partial match).
    if (CURATED_GIFS[key]) {
      return NextResponse.json<GifResponse>({ url: giphyUrlFromId(CURATED_GIFS[key]) });
    }
    for (const curatedKey of Object.keys(CURATED_GIFS)) {
      if (curatedKey === "default") continue;
      if (key.includes(curatedKey) || curatedKey.includes(key)) {
        return NextResponse.json<GifResponse>({
          url: giphyUrlFromId(CURATED_GIFS[curatedKey]),
        });
      }
    }

    // 2. GIPHY API search.
    const apiKey = process.env.GIPHY_API_KEY;
    if (!apiKey) {
      return fallbackResponse();
    }
    const search = `${cleaned || q} workout exercise`.slice(0, 50);
    const url = new URL(GIPHY_API);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("q", search);
    url.searchParams.set("limit", "1");
    url.searchParams.set("rating", "g");

    const res = await fetch(url.toString());
    if (!res.ok) {
      return fallbackResponse();
    }
    const data = (await res.json()) as {
      data?: Array<{
        images?: { fixed_height?: { url?: string }; fixed_height_small?: { url?: string } };
      }>;
    };
    const gif = data.data?.[0];
    const urlGif =
      gif?.images?.fixed_height?.url || gif?.images?.fixed_height_small?.url || null;

    if (!urlGif) {
      return fallbackResponse();
    }
    return NextResponse.json<GifResponse>({ url: urlGif });
  } catch (e) {
    console.error("GIPHY fetch error:", e);
    return fallbackResponse();
  }
}
